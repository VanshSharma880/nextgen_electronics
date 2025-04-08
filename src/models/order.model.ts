import { IOrder } from "@/types/order.types";
import { model, models, Schema } from "mongoose";

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", orderSchema);
