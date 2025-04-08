import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Voucher from "@/models/voucher.model";

// POST: Add new Voucher
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const { name, code, amount, voucherCount, isActive } = body;

    if (
      !name ||
      !code ||
      amount == null ||
      voucherCount == null ||
      isActive == null
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const voucherNameAlreadyExist = await Voucher.findOne({ code });
    if (voucherNameAlreadyExist)
      return NextResponse.json(
        { error: "voucher with this code already exist" },
        { status: 500 }
      );

    const newVoucher = new Voucher({
      name,
      code,
      amount,
      voucherCount,
      isActive,
    });

    await newVoucher.save();

    return NextResponse.json(
      { message: "Voucher added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all Voucher
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }
    await dbConnect();
    const vouchers = await Voucher.find().lean(); // Fetch all vouchers
    if (!vouchers)
      return NextResponse.json({ error: "no vouchers found" }, { status: 400 });

    return NextResponse.json(vouchers, { status: 200 });
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//PATCH: Update an Existing voucher by id
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        {
          status: 401,
        }
      );
    }
    await dbConnect();
    const body = await req.json();
    const { id, name, code, amount, voucherCount, isActive } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Voucher ID is Required" },
        {
          status: 400,
        }
      );
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { name, code, amount, voucherCount, isActive },
      { new: true, runValidators: true }
    );
    if (!updatedVoucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Voucher updated successfully", voucher: updatedVoucher },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating voucher:", error);
    return NextResponse.json(
      {
        error: "Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE: delete voucher by id
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Voucher ID is required" },
        { status: 400 }
      );
    }

    const deletedVoucher = await Voucher.findByIdAndDelete(id);

    if (!deletedVoucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Voucher deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
