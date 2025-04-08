import mongoose from "mongoose";
const uri = process.env.DATABASE_URL!;

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};
const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(uri, {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database Connection failed", error);
  }
};

export default dbConnect;
