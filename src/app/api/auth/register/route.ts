import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { email, password, userName } = await req.json();
    await dbConnect();

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );

    await User.create({ email, password, userName });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Registration error", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
