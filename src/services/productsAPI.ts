import { Product } from "@arcjet/next";
import axios from "axios";

// get all products
export const getAllProductsApi = async () => {
  const response = await axios.get("/api/products");
  return response.data;
};

//get product by id (product details page [id])
export const getProductByIdAPI = async (id: string) => {
  const response = await axios.get(`/api/products/${id}`);
  return response.data;
};

// delete product by id (admin section)
export const deleteProductByIdAPI = async (id: string) => {
  const response = await axios.delete(`/api/products/${id}`);
  return response.data;
};

// add product (admin section)
export const addProductAPI = async (productData: Product) => {
  const response = await axios.post("/api/products", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//update product (admin section)
export const updateProductApi = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  const response = await axios.put(`/api/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
