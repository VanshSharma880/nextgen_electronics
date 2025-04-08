import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_CLOUD_KEY ||
  !process.env.CLOUDINARY_CLOUD_SECRET
) {
  console.error(
    "Cloudinary configuration error: Missing environment variables."
  );
  throw new Error("Cloudinary is not configured properly.");
}

export default cloudinary;
