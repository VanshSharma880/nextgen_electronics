import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import orderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await dbConnect();

    const orders = await orderModel.aggregate([
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
          userName: "$userDetails.userName",
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
                      $indexOfArray: ["$productDetails._id", "$$item.product"],
                    },
                  ],
                },
                productImage: {
                  $arrayElemAt: [
                    "$productDetails.images.url",
                    {
                      $indexOfArray: ["$productDetails._id", "$$item.product"],
                    },
                  ],
                },
                price: {
                  $arrayElemAt: [
                    "$productDetails.price",
                    {
                      $indexOfArray: ["$productDetails._id", "$$item.product"],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Ensure user is authenticated and an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { id, deliveryStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Update order details
    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        error: "Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
