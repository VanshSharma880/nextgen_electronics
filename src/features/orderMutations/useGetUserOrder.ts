import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "@/services/orderAPI";

const useGetUserOrder = (userId: string | null) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: getUserOrders,
    enabled: !!userId, // Only fetch if userId exists
  });

  return {
    userOrders: data,
    getUserOrdersLoading: isLoading,
    getUserOrdersError: error,
  };
};

export default useGetUserOrder;
