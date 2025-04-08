import axios from "axios";
import { DeliveryStatus, IOrder, OrderResponse } from "@/types/order.types";

// create orders
export const createOrder = async (payload: IOrder): Promise<OrderResponse> => {
  const response = await axios.post<OrderResponse>("/api/orders", payload);
  return response.data;
};

// ✅ Fetch all orders (Admin)
export const getAllOrders = async (): Promise<IOrder[]> => {
  const response = await axios.get<{ success: boolean; orders: IOrder[] }>(
    "/api/orders/admin"
  );
  return response.data.orders;
};

// ✅ Fetch orders for the logged-in user
export const getUserOrders = async (): Promise<IOrder[]> => {
  const response = await axios.get<{ success: boolean; orders: IOrder[] }>(
    "/api/orders/user"
  );
  return response.data.orders;
};

export const updateOrderById = async (
  orderId: string,
  deliveryStatus: DeliveryStatus
): Promise<IOrder> => {
  const response = await axios.patch<IOrder>(`/api/orders/admin`, {
    id: orderId,
    deliveryStatus,
  });
  return response.data;
};
