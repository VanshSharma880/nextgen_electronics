import deleteCloudinary from "@/helpers/deleteCloudinary";
import uploadCloudinary from "@/helpers/uploadCloudinary";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch single product by id
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: update product by id
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = context.params;
    const formData = await req.formData();

    // extracting form fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : undefined;
    const category = formData.get("category") as string;
    const stock = formData.get("stock")
      ? parseInt(formData.get("stock") as string)
      : undefined;
    const ratings = formData.get("ratings")
      ? parseFloat(formData.get("ratings") as string)
      : undefined;

    // get images from formData
    const imagesFiles = formData.getAll("images") as File[];
    let uploadedImages = [] as any;

    // find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (imagesFiles.length) {
      // delete old images from cloudinary
      if (existingProduct.images?.length) {
        const oldImagePublicIds = existingProduct.images.map(
          (img: any) => img.public_id
        );
        await deleteCloudinary(oldImagePublicIds); // Now passing an array correctly
      }

      // convert files to buffers and upload new images
      const imageBuffers = await Promise.all(
        imagesFiles.map(async (file, index) => {
          console.log(
            `Processing image ${index + 1}: ${file.name}, size: ${file.size}`
          );
          const arrayBuffer = await file.arrayBuffer();
          return Buffer.from(arrayBuffer);
        })
      );

      uploadedImages = await uploadCloudinary(imageBuffers, "products");
      console.log("Uploaded images:", uploadedImages);
    }

    // find the product and update fields
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(stock !== undefined && { stock }),
        ...(ratings !== undefined && { ratings }),
        ...(uploadedImages.length > 0 && { images: uploadedImages }), // Update images only if new ones are uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: remove a product by id
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    const { id } = context.params;
    // connect to DB
    await dbConnect();

    // find product
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // delete all images associated with this product Cloudinary
    if (product.images?.length > 0) {
      const oldImagePublicIds = product.images.map((img: any) => img.public_id);
      await deleteCloudinary(oldImagePublicIds); // Pass array of `public_id`s
      console.log("All images deleted successfully from Cloudinary.");
    }

    // delete product from DB
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Product and associated images deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/products:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
