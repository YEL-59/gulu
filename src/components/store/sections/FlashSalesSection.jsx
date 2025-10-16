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
      id: "p-001",
      name: "Wireless Headphones Pro",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviewCount: 214,
      image: "/assets/home/product1.png",
      badge: "Best Seller",
      inStock: true,
      brand: "Philips",
      tags: ["audio", "wireless", "music"],
      category: "electronics",
    },
    {
      id: "p-002",
      name: "Smartwatch Active 2",
      price: 149.0,
      originalPrice: 199.0,
      rating: 4.4,
      reviewCount: 168,
      image: "/assets/home/product2.png",
      badge: "Hot",
      inStock: true,
      brand: "Samsung",
      tags: ["wearables", "fitness", "notifications"],
      category: "wearables",
    },
    {
      id: "p-003",
      name: "Bluetooth Speaker Mini",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.3,
      reviewCount: 92,
      image: "/assets/home/product3.png",
      badge: "New",
      inStock: true,
      brand: "Toshiba",
      tags: ["audio", "portable", "bluetooth"],
      category: "audio",
    },
    {
      id: "p-004",
      name: "Gaming Mouse RGB",
      price: 29.5,
      originalPrice: 49.5,
      rating: 4.2,
      reviewCount: 77,
      image: "/assets/home/product4.png",
      badge: "Sale",
      inStock: true,
      brand: "Logitech",
      tags: ["gaming", "rgb", "mouse"],
      category: "computers",
    },
    {
      id: "p-005",
      name: "Mechanical Keyboard Blue Switch",
      price: 69.0,
      originalPrice: 99.0,
      rating: 4.7,
      reviewCount: 305,
      image: "/assets/home/product5.png",
      badge: "Best Seller",
      inStock: true,
      brand: "Razer",
      tags: ["gaming", "keyboard", "mechanical"],
      category: "computers",
    },
    {
      id: "p-006",
      name: "4K Action Camera",
      price: 179.99,
      originalPrice: 229.99,
      rating: 4.5,
      reviewCount: 146,
      image: "/assets/home/product6.png",
      badge: "Featured",
      inStock: true,
      brand: "GoPro",
      tags: ["camera", "outdoor", "4k"],
      category: "electronics",
    },
    {
      id: "p-007",
      name: "USB-C Fast Charger 30W",
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.1,
      reviewCount: 58,
      image: "/assets/home/product7.png",
      badge: "Deal",
      inStock: true,
      brand: "Anker",
      tags: ["charger", "usb-c", "power"],
      category: "accessories",
    },
    {
      id: "p-008",
      name: "Noise Cancelling Earbuds",
      price: 99.99,
      originalPrice: 129.99,
      rating: 4.4,
      reviewCount: 184,
      image: "/assets/home/product8.png",
      badge: "Limited",
      inStock: true,
      brand: "Sony",
      tags: ["audio", "earbuds", "noise-cancelling"],
      category: "audio",
    },
    {
      id: "p-009",
      name: "Portable SSD 1TB",
      price: 119.0,
      originalPrice: 159.0,
      rating: 4.8,
      reviewCount: 512,
      image: "/assets/home/product9.png",
      badge: "Top Rated",
      inStock: true,
      brand: "Samsung",
      tags: ["storage", "ssd", "portable"],
      category: "computers",
    },
    {
      id: "p-010",
      name: "Smart Home Hub",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.0,
      reviewCount: 64,
      image: "/assets/home/product10.png",
      badge: "New",
      inStock: true,
      brand: "Amazon",
      tags: ["smart-home", "hub", "voice"],
      category: "electronics",
    },
    {
      id: "p-011",
      name: "Wireless Keyboard Compact",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.2,
      reviewCount: 93,
      image: "/assets/home/product1.png",
      badge: "Deal",
      inStock: true,
      brand: "Logitech",
      tags: ["keyboard", "wireless", "compact"],
      category: "computers",
    },
    {
      id: "p-012",
      name: "Gaming Headset 7.1",
      price: 59.99,
      originalPrice: 89.99,
      rating: 4.3,
      reviewCount: 128,
      image: "/assets/home/product2.png",
      badge: "Hot",
      inStock: true,
      brand: "HyperX",
      tags: ["gaming", "audio", "headset"],
      category: "gaming",
    },
    {
      id: "p-013",
      name: "Fitness Tracker",
      price: 69.99,
      originalPrice: 99.99,
      rating: 4.1,
      reviewCount: 77,
      image: "/assets/home/product3.png",
      badge: "Trending",
      inStock: true,
      brand: "Fitbit",
      tags: ["fitness", "wearables", "health"],
      category: "wearables",
    },
    {
      id: "p-014",
      name: "USB-C Hub 6-in-1",
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.0,
      reviewCount: 63,
      image: "/assets/home/product4.png",
      badge: "Deal",
      inStock: true,
      brand: "UGREEN",
      tags: ["hub", "usb-c", "adapter"],
      category: "accessories",
    },
    {
      id: "p-015",
      name: "1080p Web Camera",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.2,
      reviewCount: 142,
      image: "/assets/home/product5.png",
      badge: "New",
      inStock: true,
      brand: "Logitech",
      tags: ["camera", "webcam", "stream"],
      category: "computers",
    },
    {
      id: "p-016",
      name: "Phone Stand Aluminum",
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.5,
      reviewCount: 245,
      image: "/assets/home/product6.png",
      badge: "Top Rated",
      inStock: true,
      brand: "Lamicall",
      tags: ["stand", "phone", "desk"],
      category: "accessories",
    },
    {
      id: "p-017",
      name: "Wireless Charger Pad",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.3,
      reviewCount: 119,
      image: "/assets/home/product7.png",
      badge: "Hot",
      inStock: true,
      brand: "Belkin",
      tags: ["charger", "wireless", "qi"],
      category: "accessories",
    },
    {
      id: "p-018",
      name: "Portable Projector HD",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.0,
      reviewCount: 84,
      image: "/assets/home/product8.png",
      badge: "Deal",
      inStock: true,
      brand: "Anker",
      tags: ["projector", "portable", "hd"],
      category: "electronics",
    },
    {
      id: "p-019",
      name: "Gaming Controller Wireless",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.4,
      reviewCount: 156,
      image: "/assets/home/product9.png",
      badge: "Trending",
      inStock: true,
      brand: "Xbox",
      tags: ["gaming", "controller", "wireless"],
      category: "gaming",
    },
    {
      id: "p-020",
      name: "Smart LED Bulb",
      price: 14.99,
      originalPrice: 24.99,
      rating: 4.2,
      reviewCount: 201,
      image: "/assets/home/product10.png",
      badge: "New",
      inStock: true,
      brand: "Philips",
      tags: ["smart-home", "lighting", "app"],
      category: "electronics",
    },
    {
      id: "p-021",
      name: "Laptop Cooling Pad",
      price: 25.99,
      originalPrice: 39.99,
      rating: 4.0,
      reviewCount: 72,
      image: "/assets/home/product1.png",
      badge: "Deal",
      inStock: true,
      brand: "CoolerMaster",
      tags: ["laptop", "cooling", "fans"],
      category: "computers",
    },
    {
      id: "p-022",
      name: "Noise Meter Pro",
      price: 59.99,
      originalPrice: 89.99,
      rating: 4.1,
      reviewCount: 39,
      image: "/assets/home/product2.png",
      badge: "New",
      inStock: true,
      brand: "UNI-T",
      tags: ["tools", "audio", "meter"],
      category: "electronics",
    },
    {
      id: "p-023",
      name: "Portable Power Bank 20k",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.6,
      reviewCount: 423,
      image: "/assets/home/product3.png",
      badge: "Best Seller",
      inStock: true,
      brand: "Anker",
      tags: ["power", "battery", "portable"],
      category: "accessories",
    },
    {
      id: "p-024",
      name: "Wireless Presenter",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.2,
      reviewCount: 66,
      image: "/assets/home/product4.png",
      badge: "Hot",
      inStock: true,
      brand: "Logitech",
      tags: ["presenter", "wireless", "laser"],
      category: "accessories",
    },
    {
      id: "p-025",
      name: "Streaming Microphone USB",
      price: 79.99,
      originalPrice: 109.99,
      rating: 4.5,
      reviewCount: 188,
      image: "/assets/home/product5.png",
      badge: "Featured",
      inStock: true,
      brand: "Blue",
      tags: ["audio", "microphone", "usb"],
      category: "audio",
    },
    {
      id: "p-026",
      name: "VR Headset Starter",
      price: 299.0,
      originalPrice: 349.0,
      rating: 4.3,
      reviewCount: 122,
      image: "/assets/home/product6.png",
      badge: "Trending",
      inStock: true,
      brand: "Meta",
      tags: ["vr", "gaming", "headset"],
      category: "gaming",
    },
    {
      id: "p-027",
      name: "Mechanical NumPad",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.0,
      reviewCount: 33,
      image: "/assets/home/product7.png",
      badge: "New",
      inStock: true,
      brand: "Keychron",
      tags: ["keyboard", "numpad", "mechanical"],
      category: "computers",
    },
    {
      id: "p-028",
      name: "Desk Lamp LED",
      price: 22.99,
      originalPrice: 34.99,
      rating: 4.2,
      reviewCount: 97,
      image: "/assets/home/product8.png",
      badge: "Deal",
      inStock: true,
      brand: "Xiaomi",
      tags: ["lamp", "desk", "led"],
      category: "accessories",
    },
    {
      id: "p-029",
      name: "Smart Doorbell",
      price: 129.0,
      originalPrice: 169.0,
      rating: 4.1,
      reviewCount: 88,
      image: "/assets/home/product9.png",
      badge: "Hot",
      inStock: true,
      brand: "Ring",
      tags: ["smart-home", "security", "camera"],
      category: "electronics",
    },
    {
      id: "p-030",
      name: "Compact Drone",
      price: 299.0,
      originalPrice: 399.0,
      rating: 4.3,
      reviewCount: 167,
      image: "/assets/home/drone.png",
      badge: "Featured",
      inStock: true,
      brand: "DJI",
      tags: ["drone", "camera", "aerial"],
      category: "electronics",
    },
    {
      id: "p-031",
      name: "Wireless Ergonomic Mouse",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.4,
      reviewCount: 130,
      image: "/assets/home/product1.png",
      badge: "Top Rated",
      inStock: true,
      brand: "Logitech",
      tags: ["mouse", "ergonomic", "wireless"],
      category: "computers",
    },
    {
      id: "p-032",
      name: "Smart Plug 2-Pack",
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.3,
      reviewCount: 210,
      image: "/assets/home/product2.png",
      badge: "Deal",
      inStock: true,
      brand: "TP-Link",
      tags: ["smart-home", "plug", "wifi"],
      category: "electronics",
    },
    {
      id: "p-033",
      name: "Noise Cancelling Headphones Lite",
      price: 79.99,
      originalPrice: 109.99,
      rating: 4.2,
      reviewCount: 156,
      image: "/assets/home/product3.png",
      badge: "Sale",
      inStock: true,
      brand: "JBL",
      tags: ["audio", "headphones", "noise-cancelling"],
      category: "audio",
    },
    {
      id: "p-034",
      name: "Portable Bluetooth Keyboard",
      price: 29.99,
      originalPrice: 49.99,
      rating: 4.0,
      reviewCount: 61,
      image: "/assets/home/product4.png",
      badge: "New",
      inStock: true,
      brand: "Arteck",
      tags: ["keyboard", "portable", "bluetooth"],
      category: "computers",
    },
    {
      id: "p-035",
      name: "USB Microphone Podcast",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviewCount: 142,
      image: "/assets/home/product5.png",
      badge: "Featured",
      inStock: true,
      brand: "FIFINE",
      tags: ["audio", "microphone", "podcast"],
      category: "audio",
    },
    {
      id: "p-036",
      name: "LED Light Strip Smart",
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.1,
      reviewCount: 98,
      image: "/assets/home/product6.png",
      badge: "Trending",
      inStock: true,
      brand: "Govee",
      tags: ["lighting", "smart-home", "led"],
      category: "electronics",
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
          {flashSaleProducts.slice(0, 8).map((product) => (
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
