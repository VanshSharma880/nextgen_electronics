import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "e7.pngegg.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      { hostname: "images.unsplash.com" },
      { hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
