import { addProductAPI } from "@/services/productsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useAddProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (value: any) => addProductAPI(value),
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to add product");
    },
  });

  return {
    addProduct: mutate,
    isAdding: isPending,
    isError: error,
  };
};

export default useAddProduct;
