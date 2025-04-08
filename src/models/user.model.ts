import { model, Schema, models } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/user.types";

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      // required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    authProviderId: {
      type: String,
      unique: true,
      sparse: true, // allows null values for non-google users
    },
    authProviderName: {
      type: String,
      enum: ["google", "github", "credentials"],
      default: "credentials",
    },
  },
  { timestamps: true }
);

// hashing the password if it changes
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
