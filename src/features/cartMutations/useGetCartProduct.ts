import { getAllCartProductApi } from "@/services/cartAPI";
import { useQuery } from "@tanstack/react-query";

const useGetCartProduct = (userId: string | null) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getAllCartProductApi(userId as string),
    enabled: !!userId,
  });
  return {
    getAllCartProduct: data,
    getCartLoading: isLoading,
    getCartError: error,
  };
};

export default useGetCartProduct;
