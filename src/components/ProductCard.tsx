"use client";
import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useDeleteProductById from "@/features/productMutations/useDeleteProductById";
import EditProduct from "./admin/EditProduct";
import useAddCartProduct from "@/features/cartMutations/useAddCartProduct";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Spinner from "./Spinner";
import { toINR } from "@/helpers/convertToINR";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: any }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const userId = session?.user?.id;
  const [quantity, setQuantity] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { addCartProduct, isAddingCart } = useAddCartProduct(userId || "");
  const { deleteProduct, isDeletePending } = useDeleteProductById();
  const router = useRouter();

  const handleSubmit = (productId: string) => {
    if (!session?.user) {
      router.push("/sign-in");
    } else {
      const data = { productId, quantity };
      addCartProduct(data);
    }
  };

  const handleDeleteConfirm = () => {
    deleteProduct(product._id);
    setIsDeleteDialogOpen(false);
  };

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value);
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const starPercentage = Math.min(Math.max((rating - i) * 100, 0), 100);

          return (
            <div key={i} className="relative h-4 w-4">
              {/* Empty Star */}
              <svg
                className="h-4 w-4 text-gray-300 dark:text-gray-600 absolute"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {/* Filled Star with clip-path */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - starPercentage}% 0 0)` }}
              >
                <svg
                  className="h-4 w-4 text-yellow-400 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full h-full bg-white text-gray-900 dark:text-white dark:border-[1px] overflow-hidden flex flex-col shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl">
      <div className="relative h-52 flex-shrink-0">
        <Image
          width={500}
          height={300}
          src={product.images[0]?.url || "/placeholder-image.jpg"} // Added fallback
          alt={product.name}
          className="w-full h-full" // Added object-cover for better image display
        />
      </div>

      <CardContent className="p-4 space-y-2 flex-grow">
        <h2 className="text-lg font-semibold line-clamp-1">{product.name}</h2>
        <div className="flex items-center gap-2">
          {renderStars(product.ratings)}
          <span className="text-gray-500 dark:text-zinc-500 ml-1">
            ({product.ratings})
          </span>
        </div>
        <p className="text-gray-600 dark:text-zinc-400 text-sm line-clamp-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl">{toINR(product.price)}</span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold ${
              product.stock >= 10 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock} Left
          </span>
        </div>
      </CardContent>

      {isAdmin ? (
        <EditProduct product={product} />
      ) : (
        <div className="px-4 pb-4 flex gap-4 flex-shrink-0">
          <Select
            value={quantity.toString()}
            onValueChange={handleQuantityChange}
          >
            <SelectTrigger className="w-16 h-9 border-2 bg-transparent focus:ring-0 text-gray-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-white dark:border-black rounded-lg">
              {Array.from(
                { length: Math.min(product.stock, 10) }, // Added max limit of 10
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
          <Button
            onClick={() => handleSubmit(product._id)}
            className="flex-1"
            disabled={isAddingCart || product.stock === 0} // Added stock check
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
      )}

      {isAdmin ? (
        <CardFooter className="p-0 flex-shrink-0">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full hover:underline hover:text-red-700 text-red-700 hover:bg-gray-100 dark:hover:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 rounded-none h-10"
                disabled={isDeletePending}
              >
                {isDeletePending ? (
                  <Spinner />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeletePending}
                >
                  {isDeletePending ? <Spinner /> : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      ) : (
        <Link href={`/products/${product._id}`}>
          <CardFooter className="p-0 flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full hover:underline text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 rounded-none h-10"
            >
              View Details
            </Button>
          </CardFooter>
        </Link>
      )}
    </Card>
  );
};

export default ProductCard;
