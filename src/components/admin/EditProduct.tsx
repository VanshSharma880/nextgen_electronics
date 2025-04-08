"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { AspectRatio } from "../ui/aspect-ratio";
import { Upload, X } from "lucide-react";
import { Product } from "@/types/product.types";
import useUpdateProduct from "@/features/productMutations/useUpdateProduct";
import Spinner from "../Spinner";
import Image from "next/image";

const categories = [
  "Mobile & Accessories",
  "Gaming & Entertainment",
  "Cameras & Accessories",
  "Computers & Laptops",
  "Home Appliances",
];

const EditProduct = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { updateProduct, isPendingUpdate } = useUpdateProduct();
  const handleUpdateClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setImagePreviews(product.images?.map((img) => img.url) || []);
    setOpen(true);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    if (files.length) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setNewImages((prev) => [...prev, ...files]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < (selectedProduct?.images.length || 0);
    if (isExistingImage) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index),
      }));
    } else {
      const newImageIndex = index - (selectedProduct?.images.length || 0);
      setNewImages((prev) => prev.filter((_, i) => i !== newImageIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const updatedFormData = new FormData();
    updatedFormData.append("name", formData.name || "");
    updatedFormData.append("description", formData.description || "");
    updatedFormData.append("price", String(formData.price || 0));
    updatedFormData.append("stock", String(formData.stock || 0));
    updatedFormData.append("category", formData.category || "");
    updatedFormData.append("ratings", String(formData.ratings || 0));

    newImages.forEach((file) => updatedFormData.append("images", file));
    const existingImageIds = formData.images?.map((img) => img.public_id) || [];
    updatedFormData.append(
      "existingImageIds",
      JSON.stringify(existingImageIds)
    );

    updateProduct(
      { id: selectedProduct._id, data: updatedFormData },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full dark:border-gray-700 dark:text-white text-black rounded-none dark:bg-gray-900 bg-white"
          onClick={() => handleUpdateClick(product)}
        >
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] bg-white dark:bg-gray-900 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Update Product
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-6">
          <form onSubmit={handleUpdateProduct} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value),
                    }))
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: parseInt(e.target.value),
                    }))
                  }
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ratings">Ratings</Label>
                <Input
                  id="ratings"
                  type="number"
                  value={formData.ratings || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ratings: parseFloat(e.target.value),
                    }))
                  }
                  min="0"
                  max="5"
                  step="0.1"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Product Images</Label>
              <div className="grid grid-cols-2 gap-4 mt-2 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        width={120}
                        height={120}
                        src={img}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </AspectRatio>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="w-full flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Images up to 10MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPendingUpdate}>
                {isPendingUpdate ? <Spinner /> : "Update Product"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
