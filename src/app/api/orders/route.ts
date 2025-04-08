import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { razorInstance } from "@/lib/razorInstance";
import Cart from "@/models/cart.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import Voucher from "@/models/voucher.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const { items, address, totalAmount, voucherId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }
    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create Razorpay order
    const razorpayOrder = await razorInstance.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
      notes: {
        userId: session.user.id.toString(),
      },
    });

    // Create new order in the database
    const newOrder = await Order.create({
      user: session.user.id,
      items: items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      address: {
        name: address.name,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        zipCode: address.zipCode,
      },
      totalAmount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
      deliveryStatus: "processing",
    });

    if (voucherId) {
      await Voucher.findOneAndUpdate(
        { _id: voucherId },
        { $inc: { voucherCount: -1 } }
      );
    }
    for (const item of items) {
      await Product.findOneAndUpdate(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }

    await Cart.updateOne({ user: session.user.id }, { $set: { items: [] } });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
