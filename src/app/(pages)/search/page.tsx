"use client";
import ProductCard from "@/components/ProductCard";
import useGetAllProducts from "@/features/productMutations/useGetAllProducts";
import { IProduct } from "@/types/product.types";
import React, { useEffect, useState } from "react";

const SearchProduct = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [searchedProducts, setSearchedProducts] = useState<IProduct[]>([]);
  const { getAllProducts } = useGetAllProducts();

  useEffect(() => {
    if (searchProduct.trim() === "") {
      setSearchedProducts([]);
      return;
    }

    const filteredProducts = getAllProducts.filter((item: IProduct) =>
      item.name.toLowerCase().includes(searchProduct.toLowerCase())
    );
    setSearchedProducts(filteredProducts);
  }, [searchProduct, getAllProducts]);

  return (
    <div className="p-4">
      <form className="mt-10 mx-auto max-w-xl py-2 px-6 rounded-full bg-gray-50 border flex focus-within:border-gray-300 text-black">
        <input
          type="text"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="Search Products..."
          className="bg-transparent w-full focus:outline-none pr-4 font-semibold border-0 focus:ring-0 px-0 py-0"
          name="topic"
        />
        <button className="flex flex-row items-center justify-center min-w-[130px] px-4 rounded-full  border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-black text-white font-medium tracking-wide border-transparent py-1.5 h-[38px] -mr-3">
          Search
        </button>
      </form>
      <div className="flex justify-center items-center p-4 min-h-screen">
        {searchedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
            {searchedProducts?.map((product: IProduct, index: number) => (
              <ProductCard key={product?.id || index} product={product} />
            ))}
          </div>
        ) : (
          searchProduct && <p className="text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
