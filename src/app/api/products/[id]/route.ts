import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product.model";
import uploadCloudinary from "@/helpers/uploadCloudinary";
import deleteCloudinary from "@/helpers/deleteCloudinary";

// Utility to extract ID from dynamic route
const getIdFromRequest = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const segments = path.split("/");
  return segments[segments.length - 1];
};

// GET /api/products/[id]
export async function GET(req: NextRequest) {
  try {
    const id = getIdFromRequest(req);
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = getIdFromRequest(req);
    await dbConnect();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined;
    const category = formData.get("category") as string;
    const stock = formData.get("stock") ? parseInt(formData.get("stock") as string) : undefined;
    const ratings = formData.get("ratings") ? parseFloat(formData.get("ratings") as string) : undefined;
    const imagesFiles = formData.getAll("images") as File[];

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    let uploadedImages = [] as any;

    if (imagesFiles.length > 0) {
      const oldPublicIds = product.images.map((img: any) => img.public_id);
      await deleteCloudinary(oldPublicIds);
      const imageBuffers = await Promise.all(
        imagesFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return Buffer.from(arrayBuffer);
        })
      );
      uploadedImages = await uploadCloudinary(imageBuffers, "products");
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(stock !== undefined && { stock }),
        ...(ratings !== undefined && { ratings }),
        ...(uploadedImages.length > 0 && { images: uploadedImages }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = getIdFromRequest(req);
    await dbConnect();

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.images?.length > 0) {
      const publicIds = product.images.map((img: any) => img.public_id);
      await deleteCloudinary(publicIds);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
