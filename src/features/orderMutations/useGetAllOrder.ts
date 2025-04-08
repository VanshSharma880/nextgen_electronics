import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/services/orderAPI";

const useGetAllOrder = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["allOrders"],
    queryFn: getAllOrders,
  });

  return {
    allOrders: data,
    getOrdersLoading: isLoading,
    getOrdersError: error,
  };
};

export default useGetAllOrder;
