"use client";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllProducts from "@/features/productMutations/useGetAllProducts";
import { IProduct } from "@/types/product.types";
import React from "react";

interface ProductProps {
  selectedCategory: string | null;
  limit?: number;
}

const ProductList = ({ selectedCategory, limit }: ProductProps) => {
  const { getAllProducts, getAllProductsLoading } = useGetAllProducts();

  const filteredProducts = selectedCategory
    ? getAllProducts?.filter(
        (product: IProduct) => product.category === selectedCategory
      ) || []
    : getAllProducts || [];

  const displayedProducts =
    limit !== undefined ? filteredProducts.slice(0, limit) : filteredProducts;

  if (getAllProductsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {[...Array(8)].map((_, index) => (
          <Skeleton key={index} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-4 px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Products List
      </h1>
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product: IProduct, index: number) => (
              <ProductCard key={product?.id || index} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No products found
                {selectedCategory ? ` in ${selectedCategory} category` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
