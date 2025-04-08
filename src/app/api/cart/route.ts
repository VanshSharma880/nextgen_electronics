import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/cart.model";
import Product from "@/models/product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET: fetch user's cart
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 401 });
  }
  await dbConnect();

  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      select: "name price stock images",
    })
    .lean();

  return NextResponse.json(Array.isArray(cart) ? cart : cart?.items || []);
}

// POST: add products to cart
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 401 });
  }
  const data = await req.json();
  console.log("carData", data);
  const { productId, quantity } = data;
  console.log(productId, quantity);
  if (!productId || !quantity) {
    return NextResponse.json(
      { error: "Product ID and Quantity required " },
      { status: 400 }
    );
  }

  await dbConnect();
  const product = await Product.findById(productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.stock < quantity) {
    return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
  }
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  const existingItem = cart.items.find(
    (item: any) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity = Math.min(
      existingItem.quantity + quantity,
      product.stock
    );
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name price stock images",
  });

  return NextResponse.json(cart.items);
}

// DELETE: Remove item from cart
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  console.log("userId", userId);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }
  //taking productId search params
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  console.log("productId", productId);
  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  await dbConnect();
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  cart.items = cart.items.filter(
    (item: any) => item.product.toString() !== productId
  );
  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name price stock images",
  });

  return NextResponse.json(cart.items);
}

// PUT: Update item quantity
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { productId, quantity } = await req.json();

  if (!productId || quantity === undefined) {
    return NextResponse.json(
      { error: "Product ID, and quantity required" },
      { status: 400 }
    );
  }

  await dbConnect();
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const item = cart.items.find((i: any) => i.product.toString() === productId);
  if (item) {
    item.quantity = Math.min(Math.max(1, quantity), product.stock);
    await cart.save();
    await cart.populate({
      path: "items.product",
      select: "name price stock images",
    });
    return NextResponse.json(cart.items);
  }

  return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
}
