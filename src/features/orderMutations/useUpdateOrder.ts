import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderById } from "@/services/orderAPI";
import { DeliveryStatus, IOrder } from "@/types/order.types";
import toast from "react-hot-toast";

const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({
      orderId,
      deliveryStatus,
    }: {
      orderId: string;
      deliveryStatus: DeliveryStatus;
    }) => {
      return updateOrderById(orderId, deliveryStatus);
    },
    onSuccess: () => {
      toast.success("Delivery status changed successfully");
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || "Failed to change delivery status"
      );
    },
  });

  return {
    updateOrder: mutate,
    updateOrderLoading: isPending,
    updateOrderError: error,
  };
};

export default useUpdateOrder;
