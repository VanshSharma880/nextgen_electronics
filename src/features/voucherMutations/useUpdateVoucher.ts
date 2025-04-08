import { updateVoucherApi } from "@/services/voucherAPI";
import { IVoucher } from "@/types/voucher.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: IVoucher) => updateVoucherApi(data),

    onSuccess: () => {
      toast.success("Voucher updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["voucher"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to update voucher");
    },
  });
  return {
    updateVoucher: mutate,
    isUpdatingVoucher: isPending,
    isUpdateError: isError,
  };
};

export default useUpdateVoucher;
