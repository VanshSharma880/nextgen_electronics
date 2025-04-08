"use client";
import useGetAllOrder from "@/features/orderMutations/useGetAllOrder";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import useUpdateOrder from "@/features/orderMutations/useUpdateOrder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Truck } from "lucide-react";
import { DeliveryStatus, IOrder } from "@/types/order.types";

const AllOrders = () => {
  const { allOrders, getOrdersLoading } = useGetAllOrder();
  const { updateOrder, updateOrderLoading } = useUpdateOrder();

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrder({
      orderId,
      deliveryStatus: status as DeliveryStatus,
    });
  };
  if (getOrdersLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center flex flex-col items-center h-screen">
        <Truck className="h-10 w-20 mt-4" />
        <span className="flex items-center">Loading orders...</span>
      </div>
    );
  }
  // sort allOrders by createdAt in descending order (latest first)

  const sortedOrders = allOrders
    ? [...allOrders].sort((a: IOrder, b: IOrder) => {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();
        return dateB - dateA;
      })
    : [];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        All Orders
      </h1>

      {!allOrders || allOrders.length === 0 ? (
        <Card className="shadow-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
            No orders found. Start shopping now!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedOrders.map((order: any) => (
            <Card
              key={order._id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden dark:bg-gray-900"
            >
              <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Order #{order._id.slice(-6)}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on -{" "}
                      {new Date(order.createdAt).toLocaleDateString()} | Placed
                      by - {order.userName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="sm:text-sm py-1 "> Payment status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span className="sm:text-sm py-1 "> Delivery status:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          disabled={updateOrderLoading}
                        >
                          {order.deliveryStatus}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order._id, "processing")
                          }
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order._id, "shipped")
                          }
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Shipped
                        </DropdownMenuItem>
                        {/* Add more status options as needed */}
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order._id, "delivered")
                          }
                          className="dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Delivered
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Order Items in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {order.items.map((item: any) => (
                    <Link
                      href={`/products/${item.productId}`}
                      key={item.productId}
                    >
                      <div className="flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="w-24 h-24 mb-2">
                          <Image
                            src={
                              item.productImage[0] ||
                              "https://via.placeholder.com/150"
                            }
                            width={96}
                            height={96}
                            alt={item.productName}
                            className="object-cover rounded-md hover:scale-105 transition-transform duration-200 w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-md font-medium text-gray-800 dark:text-gray-100 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Price: ₹{item.price.toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-1">
                            Subtotal: ₹
                            {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      Name : {order.address.name} | Contact :{" "}
                      {order.address.phone}
                    </p>
                    <p>
                      {order.address.addressLine} {order.address.city},{" "}
                      {order.address.zipCode}
                    </p>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Amount:
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
