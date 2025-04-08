import cloudinary from "./cloudinary";

export type CloudinaryUploadResult = {
  url: string;
  public_id: string;
};

const uploadCloudinary = async (
  buffers: Buffer[],
  folder: string
): Promise<CloudinaryUploadResult[]> => {
  if (!buffers || buffers.length === 0) {
    throw new Error("No images provided for upload.");
  }

  try {
    const uploadPromises = buffers.map(
      (buffer, index) =>
        new Promise<CloudinaryUploadResult>((resolve, reject) => {
          console.log(`Uploading image ${index + 1} to Cloudinary...`);
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder },
            (error, result) => {
              if (error || !result) {
                console.error(
                  `Cloudinary upload error (image ${index + 1}):`,
                  error
                );
                return reject(
                  new Error("Error while uploading image to Cloudinary")
                );
              }
              console.log(`Image ${index + 1} uploaded:`, result.secure_url);
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          );
          uploadStream.end(buffer);
        })
    );

    return await Promise.all(uploadPromises);
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadCloudinary;
