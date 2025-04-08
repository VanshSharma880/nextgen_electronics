import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category:
    | "Mobile & Accessories"
    | "Gaming & Entertainment"
    | "Cameras & Accessories"
    | "Computers & Laptops"
    | "Home Appliances";
  images: { url: string; public_id: string }[];
  stock: number;
  ratings: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  ratings: number;
  images: { url: string; public_id: string }[];
}
