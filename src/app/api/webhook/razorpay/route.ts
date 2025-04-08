import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { failedEmailTemplate, successEmailTemplate } from "@/mail/templates";
import sendMail from "@/mail";

export async function POST(req: NextRequest) {
  try {
    // Validate Razorpay webhook secret
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET is not set");
    }

    // Get raw text body
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // Parse the body
    let event;
    try {
      event = JSON.parse(body);
    } catch (parseError) {
      console.error("Error parsing webhook body:", parseError);
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }
    await dbConnect();

    const payment = event.payload.payment.entity;

    // Common function to fetch detailed order info
    async function getDetailedOrder(orderId: string) {
      const orderDetails = await Order.aggregate([
        { $match: { razorpayOrderId: orderId } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            _id: 1,
            userEmail: "$userDetails.email",
            totalAmount: 1,
            paymentStatus: 1,
            address: 1,
            deliveryStatus: 1,
            createdAt: 1,
            items: {
              $map: {
                input: "$items",
                as: "item",
                in: {
                  productId: "$$item.product",
                  quantity: "$$item.quantity",
                  productName: {
                    $arrayElemAt: [
                      "$productDetails.name",
                      {
                        $indexOfArray: [
                          "$productDetails._id",
                          "$$item.product",
                        ],
                      },
                    ],
                  },
                  productImage: {
                    $arrayElemAt: [
                      "$productDetails.images.url",
                      {
                        $indexOfArray: [
                          "$productDetails._id",
                          "$$item.product",
                        ],
                      },
                    ],
                  },
                  price: {
                    $arrayElemAt: [
                      "$productDetails.price",
                      {
                        $indexOfArray: [
                          "$productDetails._id",
                          "$$item.product",
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      ]);
      return orderDetails.length ? orderDetails[0] : null;
    }

    // Handle payment captured
    if (event.event === "payment.captured") {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { paymentStatus: "completed" },
        { new: true }
      );

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const detailedOrder = await getDetailedOrder(payment.order_id);
      if (!detailedOrder) {
        return NextResponse.json(
          { error: "Order details not found" },
          { status: 404 }
        );
      }

      // Send success email
      try {
        await sendMail({
          to: detailedOrder.userEmail,
          subject: "Your Payment Was Successful! 🎉",
          html: successEmailTemplate(detailedOrder),
        });
      } catch (emailError) {
        console.error("Failed to send success email:", emailError);
      }
    }

    // Handle payment failed
    if (event.event === "payment.failed") {
      console.log("Payment failed:", payment);

      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { paymentStatus: "failed" },
        { new: true }
      );

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const detailedOrder = await getDetailedOrder(payment.order_id);

      if (!detailedOrder) {
        return NextResponse.json(
          { error: "Order details not found" },
          { status: 404 }
        );
      }

      // Send failure email
      try {
        await sendMail({
          to: detailedOrder.userEmail,
          subject: "Your Payment Failed! 😢",
          html: failedEmailTemplate(detailedOrder),
        });
      } catch (emailError) {
        console.error("Failed to send failure email:", emailError);
      }
    }

    // Return success response
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
