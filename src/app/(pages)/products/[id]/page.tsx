"use client";
import React, { useState, useEffect } from "react";
import useGetProductById from "@/features/productMutations/useGetProductById";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useAddCartProduct from "@/features/cartMutations/useAddCartProduct";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/Spinner";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { toINR } from "@/helpers/convertToINR";
import { useRouter } from "next/navigation";
const ProductDetails = () => {
  const { id } = useParams();
  const productId = id as string;
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { getProductDetail, getProductDetailsLoading } =
    useGetProductById(productId);
  const [quantity, setQuantity] = useState(1);
  const { addCartProduct, isAddingCart } = useAddCartProduct(userId || "");
  const [mainImage, setMainImage] = useState<string | null>(null);

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value);
    if (newQuantity >= 1 && newQuantity <= getProductDetail.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = (productId: string) => {
    if (!session?.user) {
      router.push("/sign-in");
    } else {
      const data = { productId, quantity };
      addCartProduct(data);
    }
  };

  useEffect(() => {
    if (getProductDetail?.images?.length > 0) {
      setMainImage(getProductDetail.images[0].url);
    }
  }, [getProductDetail]);

  if (getProductDetailsLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-wrap items-start -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <Skeleton className="w-full max-w-[400px] h-72 mx-auto rounded-xl shadow-md" />
            <div className="flex gap-4 py-4 justify-center">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="size-20 rounded-md" />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <Skeleton className="h-10 w-3/4 mb-4 rounded-full" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-6" />
            <Skeleton className="h-24 w-full mb-6 rounded-lg" />
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-36 rounded-full" />
              <Skeleton className="h-12 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!getProductDetail) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 text-xl font-medium py-16">
        No product found
      </p>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-200">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <Card className="shadow-xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden max-w-[400px] mx-auto bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <CardContent className="p-4">
              <div className="relative w-full max-h-[400px] aspect-auto">
                <Image
                  src={mainImage || "https://via.placeholder.com/400"}
                  alt={getProductDetail.name}
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-4 py-4 justify-center overflow-x-auto">
            {getProductDetail.images.map((image: any, index: number) => (
              <div
                key={index}
                className="relative size-16 sm:size-20 rounded-md overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition duration-300 border-2 border-transparent hover:border-primary dark:hover:border-indigo-400 shadow-md"
                onClick={() => setMainImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-1/2">
          <Card className="shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
                {getProductDetail.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Rating */}
              // Replace the Rating section in your CardContent with this:
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = getProductDetail.ratings;
                    const starPercentage = Math.min(
                      Math.max((ratingValue - i) * 100, 0),
                      100
                    );

                    return (
                      <div key={i} className="relative h-5 w-5">
                        {/* Empty Star */}
                        <Star className="h-5 w-5 text-gray-300 dark:text-gray-600 absolute" />
                        {/* Filled Star with clip-path */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            clipPath: `inset(0 ${100 - starPercentage}% 0 0)`,
                          }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    );
                  })}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({getProductDetail.ratings} / 5)
                </span>
              </div>
              {/* Price */}
              <div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {toINR(getProductDetail.price)}
                </span>
              </div>
              {/* Availability */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Availability:
                </span>
                <Badge
                  variant="default"
                  className={`${
                    getProductDetail.stock > 10
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  {getProductDetail.stock > 10
                    ? `${getProductDetail.stock} left`
                    : `${getProductDetail.stock} left only`}
                </Badge>
              </div>
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {getProductDetail.description}
              </p>
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Quantity:
                </span>
                <Select
                  value={quantity.toString()}
                  onValueChange={handleQuantityChange}
                >
                  <SelectTrigger className="w-20 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {Array.from(
                      { length: Math.min(getProductDetail.stock) },
                      (_, i) => i + 1
                    ).map((qty) => (
                      <SelectItem
                        key={qty}
                        value={qty.toString()}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {qty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleSubmit(productId)}
                  className="w-full sm:w-48 rounded-full py-2 "
                  disabled={isAddingCart}
                >
                  {isAddingCart ? (
                    <Spinner />
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
