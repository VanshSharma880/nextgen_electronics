import cloudinary from "./cloudinary";

const deleteCloudinary = async (publicIds: string | string[]) => {
  try {
    if (!publicIds || (Array.isArray(publicIds) && publicIds.length === 0)) {
      throw new Error("No public IDs provided for deletion");
    }

    // convert single string to an array
    const idsToDelete = Array.isArray(publicIds) ? publicIds : [publicIds];

    // perform deletion
    const deleteResponses = await Promise.all(
      idsToDelete.map(async (publicId) => {
        console.log(`Attempting to delete image: ${publicId}`);
        const response = await cloudinary.uploader.destroy(publicId);

        console.log(`Cloudinary delete response for ${publicId}:`, response);

        if (response.result !== "ok") {
          throw new Error(`Failed to delete ${publicId}: ${response.result}`);
        }
        return response;
      })
    );

    console.log("All images deleted successfully.");
    return deleteResponses;
  } catch (error) {
    console.error("Error in deleteCloudinary:", error);
    throw new Error(
      `Error in deleting the image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export default deleteCloudinary;
