"use client";
import { Card } from "@/components/ui/card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Modal } from "@/components/ui/modal";
import { Bot, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { CategoryFilter } from "@/components/category-filter";
import Products from "./products/page";
import AIModel from "@/components/user/AIModel";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [AIModal, setAIModal] = useState<boolean>(false);
  const [showAllProducts, setShowAllProducts] = useState(false); // State to toggle products

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        <div className="flex h-full relative">
          {/* Left content */}
          <div className="flex-1 p-8 z-10 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Next-Gen Electronics
            </h1>
            <p className="mt-4 text-neutral-300 max-w-lg">
              Discover the latest in technology with our curated selection of
              premium electronic devices and accessories
            </p>

            {session?.user && (
              <div className="pt-4">
                <HoverBorderGradient
                  onClick={() => setAIModal(!AIModal)}
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                >
                  <Bot size={20} />
                  <span>Ask AI Assistant</span>
                </HoverBorderGradient>
              </div>
            )}
          </div>

          {/* Right content */}
          <div className="flex-1 relative">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center z-20">
            <button
              className="text-white flex flex-col items-center gap-2 mx-auto hover:transform hover:translate-y-1 transition-transform duration-300 bg-transparent border-none cursor-pointer"
              onClick={() =>
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                })
              }
            >
              <span className="text-lg font-medium">Browse Products</span>
              <ChevronDown size={24} className="animate-bounce" />
            </button>
          </div>
        </div>
      </Card>

      {/* Products Section */}
      <div className="py-20 px-6 rounded-t-3xl relative z-10 shadow-lg bg-white text-gray-900 dark:bg-black dark:text-white">
        <CategoryFilter
          onCategorySelect={(category) => {
            setSelectedCategory(category);
          }}
        />
        {/* Pass limit prop to Products component */}
        <Products
          selectedCategory={selectedCategory}
          limit={showAllProducts ? undefined : 4} // Show 3 products (1 row) by default
        />
        {/* Show More Button */}
        {!showAllProducts && (
          <div className="text-center">
            <button
              onClick={() => setShowAllProducts(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:scale-105 transition-transform duration-300"
            >
              View More
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      <Modal
        open={AIModal}
        onCancel={() => setAIModal(false)}
        className="bg-black text-white"
      >
        <div className="space-y-4">
          <AIModel />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
