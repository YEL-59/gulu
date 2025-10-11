"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";
import { ArrowRight } from "lucide-react";

export default function FlashSalesSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 50,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = [
    {
      id: 1,
      name: "HP OMEN 17t Laptop",
      price: 1299,
      originalPrice: 1599,
      rating: 4.6,
      reviewCount: 543,
      image: "/assets/home/product1.png",
      badge: "-40%",
      inStock: true,
    },
    {
      id: 2,
      name: "JBL Tune 510BT",
      price: 49,
      originalPrice: 79,
      rating: 4.5,
      reviewCount: 1234,
      image: "/assets/home/product2.png",
      badge: "Sale",
      inStock: true,
    },
    {
      id: 3,
      name: "Apple Watch Series 8",
      price: 399,
      originalPrice: 429,
      rating: 4.8,
      reviewCount: 1876,
      image: "/assets/home/product3.png",
      badge: "-30%",
      inStock: true,
    },
    {
      id: 4,
      name: "Xbox Wireless Controller",
      price: 59,
      originalPrice: 69,
      rating: 4.7,
      reviewCount: 892,
      image: "/assets/home/product4.png",
      badge: "Sale",
      inStock: true,
    },
    {
      id: 5,
      name: "HP OMEN 17t Laptop",
      price: 1299,
      originalPrice: 1599,
      rating: 4.6,
      reviewCount: 543,
      image: "/assets/home/product1.png",
      badge: "-40%",
      inStock: true,
    },
    {
      id: 6,
      name: "JBL Tune 510BT",
      price: 49,
      originalPrice: 79,
      rating: 4.5,
      reviewCount: 1234,
      image: "/assets/home/product2.png",
      badge: "Sale",
      inStock: true,
    },
    {
      id: 7,
      name: "Apple Watch Series 8",
      price: 399,
      originalPrice: 429,
      rating: 4.8,
      reviewCount: 1876,
      image: "/assets/home/product3.png",
      badge: "-30%",
      inStock: true,
    },
    {
      id: 8,
      name: "Xbox Wireless Controller",
      price: 59,
      originalPrice: 69,
      rating: 4.7,
      reviewCount: 892,
      image: "/assets/home/product4.png",
      badge: "Sale",
      inStock: true,
    },
  ];

  return (
    <section className="py-12 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-10 bg-accent-500 "></div>
              <h2 className="text-2xl font-bold text-gray-900">Flash Sales</h2>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Days</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.days}
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-500">:</div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Hours</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-500">:</div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Minutes</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-500">:</div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Seconds</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex items-center capitalize bg-accent-500 hover:bg-accent-600 text-white"
          >
            BROWSE ALL PRODUCTS
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center mt-8 space-x-2">
          <Button variant="outline" size="sm">
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button variant="outline" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}


