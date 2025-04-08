import { updateCartProductApi } from "@/services/cartAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateCartProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async ({
      userId,
      productId,
      quantity,
    }: {
      userId: string;
      productId: string;
      quantity: number;
    }) => updateCartProductApi({ userId, productId, quantity }),

    onSuccess: ({ userId }) => {
      toast.success("Cart item updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update cart item");
    },
  });

  return {
    updateCartProduct: mutate,
    isPendingUpdateCart: isPending,
    isUpdateCartError: isError,
  };
};

export default useUpdateCartProduct;
