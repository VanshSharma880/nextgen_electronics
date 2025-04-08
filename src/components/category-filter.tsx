"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  image: string;
  label: string;
};

const categories: Category[] = [
  {
    id: "Mobile & Accessories",
    name: "Mobile & Accessories",
    image: "/images/MobileAccessories.jpeg",
    label: "Mobile & Accessories",
  },
  {
    id: "Gaming & Entertainment",
    name: "Gaming & Entertainment",
    image: "/images/GamingEntertainment.jpeg",
    label: "Gaming & Entertainment",
  },
  {
    id: "Cameras & Accessories",
    name: "Cameras & Accessories",
    image: "/images/CamerasAccessories.jpeg",
    label: "Cameras & Accessories",
  },
  {
    id: "Computers & Laptops",
    name: "Computers & Laptops",
    image: "/images/ComputersLaptops.jpeg",
    label: "Computers & Laptops",
  },
  {
    id: "Home Appliances",
    name: "Home Appliances",
    image: "/images/HomeAppliances.jpeg",
    label: "Home Appliances",
  },
];

interface CategoryFilterProps {
  onCategorySelect?: (category: string) => void;
}

export function CategoryFilter({ onCategorySelect }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    const newSelected = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newSelected);
    if (onCategorySelect) {
      onCategorySelect(newSelected || "");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-4">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer w-[80px] sm:w-[100px] md:w-[180px]"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div
              className={cn(
                "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full flex items-center justify-center overflow-hidden",
                "bg-gradient-to-br from-purple-600 to-blue-400",
                "transition-transform hover:scale-105",
                selectedCategory === category.id
                  ? "ring-2 sm:ring-3 md:ring-4 dark:ring-white ring-black"
                  : ""
              )}
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={144}
                height={144}
                className="rounded-full object-cover w-full h-full"
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 144px"
              />
            </div>
            <p className="mt-2 sm:mt-3 text-center  text-gray-800 dark:text-gray-200">
              {category.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
