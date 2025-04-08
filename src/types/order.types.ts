import { Document, Types, Schema } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  address: Address;
  totalAmount: number;
  razorpayOrderId: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface Address {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  zipCode: string;
}

export type PaymentStatus = "pending" | "completed" | "failed";
export type DeliveryStatus = "processing" | "shipped" | "delivered";

export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  dbOrderId: string;
}
