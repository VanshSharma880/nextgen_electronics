import { ICart, ICartItem } from "@/types/cart.types";
import mongoose, { models, Schema } from "mongoose";

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = models.Cart || mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
