export interface IVoucher {
  name: string;
  code: string;
  amount: number;
  voucherCount: number;
  isActive: boolean;
  _id?: string;
  createdAt?: Date;
  updateAt?: Date;
}
