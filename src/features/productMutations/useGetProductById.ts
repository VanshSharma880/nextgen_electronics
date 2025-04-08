import { getProductByIdAPI } from "@/services/productsAPI";
import { useQuery } from "@tanstack/react-query";

const useGetProductById = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductByIdAPI(id),
  });

  return {
    getProductDetail: data,
    getProductDetailError: isError,
    getProductDetailsLoading: isLoading,
  };
};

export default useGetProductById;
