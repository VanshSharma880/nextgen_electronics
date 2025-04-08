import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toINR } from "@/helpers/convertToINR";
import useVerifyVoucher from "@/features/voucherMutations/useVerifyVoucher";
import useCreateOrder from "@/features/orderMutations/useCreateOrder";
import { useRouter } from "next/navigation";
import AddressModel from "./AddressModel";
import VoucherSection from "./VoucherSection";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface CartCheckoutProps {
  cartItems: any[];
  cartQuantities: { [key: string]: number };
}

interface Voucher {
  name: string;
  amount: number;
  _id: string;
}

export interface Address {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  zipCode: string;
}

const CartCheckout = ({ cartItems, cartQuantities }: CartCheckoutProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { verifyVoucher, verifyVoucherPending, verifyVoucherError } =
    useVerifyVoucher();
  const totalItems = cartItems.length;
  const subtotal = cartItems.reduce((acc, item) => {
    const quantity = cartQuantities[item.product._id] || item.quantity;
    return acc + item.product.price * quantity;
  }, 0);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const totalCost = subtotal - (voucher?.amount || 0);

  // State for address popup
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const { createOrder, isCreatingOrder } = useCreateOrder();

  const handleVerifyVoucher = (code: string) => {
    setVoucherCode(code);
    verifyVoucher(
      { code, subTotal: totalCost },
      {
        onSuccess: ({ voucher }: { voucher: Voucher }) => setVoucher(voucher),
        onError: () => setVoucherCode(""),
      }
    );
  };
  // Handle removing the voucher
  const handleRemoveVoucher = () => {
    setVoucher(null);
    setVoucherCode("");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleCheckout = () => {
    setShowAddressPopup(true);
  };

  const openRazorpay = async (
    orderId: string,
    amount: number,
    currency: string
  ) => {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error("Razorpay Key ID not found. Please contact support.");
      return;
    }
    const userName = session?.user?.name;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "NextGen Electronics",
      description: "Order Payment",
      order_id: orderId,
      handler: async (response: any) => {
        try {
          console.log("Razorpay payment response:", response);
          toast.success("🎉 Payment successful");
          router.push("/orders");
        } catch (error) {
          console.error("Payment handling error:", error);
          toast.error(
            "Error processing payment response. Please check your order status."
          );
        }
      },
      prefill: {
        name: userName,
        email: session?.user?.email,
      },
      theme: {
        color: "#6366F1",
      },
      modal: {
        ondismiss: () => {
          console.log("Payment popup closed");
        },
      },
    };

    const razorpayInstance = new (window as any).Razorpay(options);

    razorpayInstance.on("payment.failed", (response: any) => {
      console.error("Payment failed:", response.error);
      toast.error("Payment failed. Please try again.");
    });
    razorpayInstance.open();
  };

  return (
    <div className="w-full lg:w-1/3">
      <Card className="shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden sticky top-[70px]">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm uppercase text-gray-700 dark:text-gray-300">
              {totalItems} Item{totalItems !== 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {toINR(subtotal)}
            </span>
          </div>
          <div className="space-y-2">
            <Label className="font-medium text-sm uppercase text-gray-700 dark:text-gray-300">
              Shipping
            </Label>
            <Select defaultValue="standard">
              <SelectTrigger className="w-full h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select shipping" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <SelectItem value="standard">
                  Standard Shipping - free
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voucher Section */}
          <VoucherSection
            voucher={voucher}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            handleVerifyVoucher={handleVerifyVoucher}
            handleRemoveVoucher={handleRemoveVoucher}
            verifyVoucherPending={verifyVoucherPending}
          />
          <div className="flex justify-between items-center font-semibold text-sm uppercase text-gray-800 dark:text-white">
            <span>Total Cost</span>
            <span>{toINR(totalCost)}</span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full mt-4 uppercase font-semibold text-sm"
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? "Processing..." : "Checkout"}
          </Button>
        </CardContent>
      </Card>

      <AddressModel
        showAddressPopup={showAddressPopup}
        setShowAddressPopup={setShowAddressPopup}
        cartItems={cartItems}
        cartQuantities={cartQuantities}
        totalCost={totalCost}
        voucher={voucher}
        createOrder={createOrder}
        openRazorpay={openRazorpay}
      />
    </div>
  );
};

export default CartCheckout;
