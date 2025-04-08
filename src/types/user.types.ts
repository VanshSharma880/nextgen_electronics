import mongoose from "mongoose";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  authProviderId: string;
  authProviderName: "google" | "github" | "credentials";
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegisterUser {
  userName: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}
