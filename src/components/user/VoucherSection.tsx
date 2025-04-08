import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Spinner from "../Spinner";
import { AnimatePresence, motion } from "framer-motion";
import { toINR } from "@/helpers/convertToINR";

interface VoucherSectionProps {
  voucher: { name: string; amount: number; _id: string } | null;
  voucherCode: string;
  setVoucherCode: React.Dispatch<React.SetStateAction<string>>;
  handleVerifyVoucher: (code: string) => void;
  handleRemoveVoucher: () => void;
  verifyVoucherPending: boolean;
}

const VoucherSection = ({
  voucher,
  voucherCode,
  setVoucherCode,
  handleVerifyVoucher,
  handleRemoveVoucher,
  verifyVoucherPending,
}: VoucherSectionProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Label className="font-semibold text-sm uppercase text-gray-700 dark:text-gray-300">
          Promo Code
        </Label>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const code = formData.get("voucher") as string;
            handleVerifyVoucher(code);
          }}
          className="relative"
        >
          <div className="relative">
            <input
              name="voucher"
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder={voucher ? "" : "Enter your code"}
              className="w-full mb-2 p-2 pr-10 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={voucher !== null}
            />
            {voucher && (
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {!voucher && (
            <Button
              disabled={verifyVoucherPending}
              variant="destructive"
              className="w-full uppercase text-sm font-semibold"
            >
              {verifyVoucherPending ? <Spinner /> : "Apply Code"}
            </Button>
          )}
        </form>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {/* Voucher Discount Display */}
        <AnimatePresence>
          {voucher && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center mb-2"
            >
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Discount ({voucher.name})
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                - {toINR(voucher.amount)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoucherSection;
