import { deleteProductByIdAPI } from "@/services/productsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useDeleteProductById = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async (id: string) => deleteProductByIdAPI(id),

    onSuccess: () => {
      toast.success("Product deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: true,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to delete product");
    },
  });
  return {
    deleteProduct: mutate,
    isDeletingError: isError,
    isDeletePending: isPending,
  };
};

export default useDeleteProductById;
