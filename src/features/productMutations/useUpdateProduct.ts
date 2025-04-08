import { updateProductApi } from "@/services/productsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      updateProductApi({ id, data }),

    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update product");
    },
  });

  return {
    updateProduct: mutate,
    isPendingUpdate: isPending,
    isUpdateError: isError,
  };
};

export default useUpdateProduct;
