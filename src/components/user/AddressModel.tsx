import { X } from "lucide-react";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

export interface Address {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  zipCode: string;
}

interface AddressModelProps {
  showAddressPopup: boolean;
  setShowAddressPopup: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: any[];
  cartQuantities: { [key: string]: number };
  totalCost: number;
  voucher: { name: string; amount: number; _id: string } | null;
  createOrder: any;
  openRazorpay: (
    orderId: string,
    amount: number,
    currency: string,
    dbOrderId: string
  ) => Promise<void>;
}

const AddressModel = ({
  showAddressPopup,
  setShowAddressPopup,
  cartItems,
  cartQuantities,
  totalCost,
  voucher,
  createOrder,
  openRazorpay,
}: AddressModelProps) => {
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    zipCode: "",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.name ||
      !address.phone ||
      !address.addressLine ||
      !address.city ||
      !address.zipCode
    ) {
      toast.error("Please fill in all address fields");
      return;
    }
    setShowAddressPopup(false);

    const formattedItems = cartItems.map((item) => ({
      product: item.product._id,
      quantity: cartQuantities[item.product._id] || item.quantity,
    }));

    createOrder(
      {
        items: formattedItems,
        totalAmount: totalCost,
        address,
        voucherAmount: voucher?.amount,
        voucherId: voucher?._id,
      },
      {
        onSuccess: async (data: any) => {
          if (data?.orderId && data?.amount && data?.currency) {
            await openRazorpay(
              data.orderId,
              data.amount,
              data.currency,
              data.dbOrderId
            );
          } else {
            toast.error("Failed to get Razorpay order details.");
          }
        },
        onError: () => {
          toast.error("Failed to create order. Please try again.");
        },
      }
    );
  };

  return (
    <>
      {showAddressPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowAddressPopup(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Shipping Address
            </h3>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <Input
                  name="name"
                  type="text"
                  value={address.name}
                  onChange={handleAddressChange}
                  placeholder="Enter your full name"
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </Label>
                <Input
                  name="phone"
                  type="text"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="Enter your phone number"
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address Line
                </Label>
                <Input
                  name="addressLine"
                  type="text"
                  value={address.addressLine}
                  onChange={handleAddressChange}
                  placeholder="Enter your full address"
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </Label>
                <Input
                  name="city"
                  type="text"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Enter your city"
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zip Code
                </Label>
                <Input
                  name="zipCode"
                  type="text"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  placeholder="Enter your zip code"
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4 uppercase font-semibold text-sm"
              >
                Save & Proceed
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressModel;
