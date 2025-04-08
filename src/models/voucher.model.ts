import { IVoucher } from "@/types/voucher.types";
import { model, models, Schema } from "mongoose";

const voucherSchema = new Schema<IVoucher>(
  {
    name: {
      type: String,
      required: true,
    },
    voucherCount: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Voucher = models?.Voucher || model<IVoucher>("Voucher", voucherSchema);
export default Voucher;
