import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }
    await dbConnect();

    const users = await User.find({ role: "user" }).select("-password"); // exclude password

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.log("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
