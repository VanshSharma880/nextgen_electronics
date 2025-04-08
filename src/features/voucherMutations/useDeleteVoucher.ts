import { deleteVoucherApi } from "@/services/voucherAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => deleteVoucherApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher"] });
      toast.success("Voucher deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to delete voucher");
    },
  });
  return {
    deleteVoucher: mutate,
    deleteVoucherPending: isPending,
    deleteVoucherError: isError,
  };
};

export default useDeleteVoucher;
