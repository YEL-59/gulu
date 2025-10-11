"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function ShopByCategories() {
  const categories = [
    {
      name: "Headphones",
      icon: "/assets/home/category1.png",
      link: "/store/category/headphones",
    },
    {
      name: "Chairs",
      icon: "/assets/home/category2.png",
      link: "/store/category/chairs",
    },
    {
      name: "Bags",
      icon: "/assets/home/category3.png",
      link: "/store/category/bags",
    },
    {
      name: "Backpacks",
      icon: "/assets/home/category4.png",
      link: "/store/category/backpacks",
    },
    {
      name: "Cameras",
      icon: "/assets/home/category5.png",
      link: "/store/category/cameras",
    },
    {
      name: "Watches",
      icon: "/assets/home/category6.png",
      link: "/store/category/watches",
    },
    {
      name: "Jewelry",
      icon: "/assets/home/category4.png",
      link: "/store/category/jewelry",
    },
    {
      name: "Shoes",
      icon: "/assets/home/category3.png",
      link: "/store/category/shoes",
    },
    {
      name: "Laptops",
      icon: "/assets/home/category1.png",
      link: "/store/category/laptops",
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-2 h-10 bg-accent-500 "></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Shop by Categories
          </h2>
        </div>

        {/* Categories Carousel */}
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="relative"
        >
          {/* Controls — now INSIDE the Carousel */}
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 border border-gray-300 bg-accent-500 text-white shadow hover:bg-accent-600 z-10" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 border border-gray-300 bg-accent-500 text-white shadow hover:bg-accent-600 z-10" />

          <CarouselContent>
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Link
                  href={category.link}
                  className="group text-center block hover:scale-105 transition-transform duration-300 border border-gray-300 rounded p-5 "
                >
                  <div className=" bg-gray-100  rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
