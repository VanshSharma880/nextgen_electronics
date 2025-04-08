import { getAllProductsApi } from "../../services/productsAPI";
import { useQuery } from "@tanstack/react-query";
const useGetAllProducts = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsApi,
  });
  return {
    getAllProducts: data,
    getAllProductsError: error,
    getAllProductsLoading: isLoading,
  };
};

export default useGetAllProducts;
