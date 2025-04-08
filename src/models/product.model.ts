import { model, Schema, models } from "mongoose";
import { IProduct } from "@/types/product.types";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: [
        "Mobile & Accessories",
        "Gaming & Entertainment",
        "Cameras & Accessories",
        "Computers & Laptops",
        "Home Appliances",
      ],
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }, // cloudinary public ID
      },
    ],
    stock: { type: Number, required: true, default: 0, min: 0 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

const Product = models?.Product || model<IProduct>("Product", productSchema);

export default Product;
