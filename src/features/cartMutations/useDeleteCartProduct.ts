import { deleteCartProductApi } from "@/services/cartAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useDeleteCartProduct = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async (productId: string) => deleteCartProductApi(productId),
    onSuccess: () => {
      toast.success("Product removed from cart");

      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
        exact: true,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || "Failed to remove product from cart"
      );
    },
  });
  return {
    deleteCartProduct: mutate,
    deleteCartProductPending: isPending,
    deleteCartProductError: isError,
  };
};

export default useDeleteCartProduct;
