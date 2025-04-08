import { addVoucherApi } from "@/services/voucherAPI";
import { IVoucher } from "@/types/voucher.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useAddVoucher = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: IVoucher) => addVoucherApi(data),
    onSuccess: () => {
      toast.success("Voucher added successfully");
      queryClient.invalidateQueries({
        queryKey: ["voucher"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to add voucher");
    },
  });
  return {
    addVoucher: mutate,
    isAddingVoucher: isPending,
    isVoucherError: error,
  };
};

export default useAddVoucher;
