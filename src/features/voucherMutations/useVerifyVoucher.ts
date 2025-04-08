import { verifyVoucherApi } from "@/services/voucherAPI";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useVerifyVoucher = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({
      code,
      subTotal,
    }: {
      code: FormDataEntryValue | null;
      subTotal: number;
    }) => verifyVoucherApi(code, subTotal),

    onSuccess: () => toast.success("Voucher is verified"),
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Failed to verify voucher");
    },
  });

  return {
    verifyVoucher: mutate,
    verifyVoucherPending: isPending,
    verifyVoucherError: isError,
  };
};

export default useVerifyVoucher;
