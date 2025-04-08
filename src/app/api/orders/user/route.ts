import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/order.model";
import mongoose from "mongoose"; // Import mongoose to handle ObjectId

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    console.log("User ID for Query:", userId);

    const userOrders = await Order.aggregate([
      {
        $match: { user: userId },
      },
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

    if (!userOrders.length) {
      return NextResponse.json(
        { message: "No orders found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, orders: userOrders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
