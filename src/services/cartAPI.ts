import axios from "axios";

// add products to cart
export const addCartProductApi = async ({
  userId,
  data,
}: {
  userId: string;
  data: string;
}) => {
  const response = await axios.post(`/api/cart?userId=${userId}`, data);
  return response.data;
};

// get all cart product
export const getAllCartProductApi = async (userId: string) => {
  const response = await axios.get(`/api/cart?userId=${userId}`);
  return response.data;
};

// delete product from cart by  productId
export const deleteCartProductApi = async (productId: string) => {
  const response = await axios.delete(`/api/cart?productId=${productId}`);
  return response.data;
};

// update product from cart by user id and productId
export const updateCartProductApi = async ({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  const response = await axios.put(`/api/cart/?userId=${userId}`, {
    productId,
    quantity,
  });
  return response.data;
};
