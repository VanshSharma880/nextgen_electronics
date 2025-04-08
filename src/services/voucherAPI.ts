import { IVoucher } from "@/types/voucher.types";
import axios from "axios";

export const verifyVoucherApi = async (
  code: FormDataEntryValue | null,
  subTotal: number
) => {
  const response = await axios.post("/api/voucher/verify", {
    code,
    subTotal,
  });
  return response.data;
};

export const addVoucherApi = async (data: IVoucher) => {
  const response = await axios.post("/api/voucher", data);
  return response.data;
};

export const getVoucherApi = async () => {
  const response = await axios.get("/api/voucher");
  return response.data;
};

export const updateVoucherApi = async (data: IVoucher) => {
  const response = await axios.patch("/api/voucher", { ...data, id: data._id });
  return response.data;
};

export const deleteVoucherApi = async (voucherId: string) => {
  const response = await axios.delete(`/api/voucher?id=${voucherId}`);
  return response.data;
};
