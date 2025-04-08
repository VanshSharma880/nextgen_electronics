import { getVoucherApi } from "@/services/voucherAPI";
import { useQuery } from "@tanstack/react-query";

const useGetVoucher = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["voucher"],
    queryFn: () => getVoucherApi(),
  });
  return {
    getVoucher: data,
    getVoucherError: error,
    isGettingVoucher: isLoading,
  };
};

export default useGetVoucher;
