import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/orderAPI";
import { IOrder, OrderResponse } from "@/types/order.types";
import toast from "react-hot-toast";

const useCreateOrder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    OrderResponse,
    Error,
    IOrder
  >({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("🎉 Order Placed successfully");
      queryClient.invalidateQueries({
        queryKey: ["allOrders"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to create order");
    },
  });

  return {
    createOrder: mutate,
    isCreatingOrder: isPending,
    orderError: error,
    isOrderError: !!error,
  };
};

export default useCreateOrder;
