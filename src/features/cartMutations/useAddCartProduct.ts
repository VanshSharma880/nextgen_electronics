import { addCartProductApi } from "@/services/cartAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useAddCartProduct = (userId: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: any) => addCartProductApi({ userId, data }),
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || "Failed to add product to cart"
      );
    },
  });
  return {
    addCartProduct: mutate,
    isAddingCart: isPending,
    isAddCartError: error,
  };
};

export default useAddCartProduct;
