"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import useAddProduct from "@/features/productMutations/useAddProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Spinner from "../Spinner";
import Image from "next/image";

interface ImageData {
  file: File;
  preview: string;
  public_id: string;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: ImageData[];
  stock: number;
  ratings: number;
}

const CATEGORIES = [
  "Mobile & Accessories",
  "Gaming & Entertainment",
  "Cameras & Accessories",
  "Computers & Laptops",
  "Home Appliances",
] as const;

const AddProduct = () => {
  const { addProduct, isAdding, isError } = useAddProduct();

  const [product, setProduct] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    category: CATEGORIES[0],
    images: [],
    stock: 0,
    ratings: 0,
  });

  const [imageInputs, setImageInputs] = useState<ImageData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      imageInputs.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [imageInputs]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "ratings"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.size <= 10 * 1024 * 1024
      );
      if (validFiles.length < files.length) {
        alert("Some files are too large. Max size is 10MB.");
      }
      const newImages: ImageData[] = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        public_id: `${Date.now()}_${file.name}`,
      }));
      setImageInputs((prev) => [...prev, ...newImages]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImageInputs((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productWithImages = { ...product, images: imageInputs };
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());
    formData.append("category", product.category);
    formData.append("stock", product.stock.toString());
    formData.append("ratings", product.ratings.toString());

    imageInputs.forEach((image) => {
      formData.append(`images`, image.file);
      formData.append(`public_ids`, image.public_id);
    });

    addProduct(formData, {
      onSuccess: () => {
        setProduct({
          name: "",
          description: "",
          price: 0,
          category: CATEGORIES[0],
          images: [],
          stock: 0,
          ratings: 0,
        });
        setImageInputs([]);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Add New Product
          </h1>
          {isError && (
            <p className="text-red-500 text-sm mb-4">
              Failed to add product. Try again.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 dark:bg-gray-800"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="mt-1 dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={product.category}
                    onValueChange={(value) =>
                      setProduct((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="mt-1 dark:bg-gray-800">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="mt-1 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <Label htmlFor="ratings">Ratings</Label>
                  <Input
                    id="ratings"
                    name="ratings"
                    type="number"
                    value={product.ratings}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    className="mt-1 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <Label>Product Images</Label>
                <div className="space-y-4 mt-2">
                  {imageInputs.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imageInputs.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            width={120}
                            height={120}
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Images up to 10MB
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isAdding} className="w-full mt-4">
              {isAdding ? <Spinner /> : "Add Product"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
