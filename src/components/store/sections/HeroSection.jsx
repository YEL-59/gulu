"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderData = [
    {
      id: 1,
      tagline: "THE BEST PLACE TO PLAY",
      title: "DJI Mavic 3 Pro",
      description: [
        "Save up to 50% on any drone. Get 3",
        "months of Premium membership",
        "for $2 USD.",
      ],
      image: "/assets/home/drone.png",
      price: "$299",
      buttonText: "SHOP NOW",
      buttonLink: "/store/product/dji-mavic-3-pro",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      tagline: "NEW ARRIVALS",
      title: "iPhone 15 Pro",
      description: [
        "Experience the power of titanium.",
        "Get 2 months of Apple Music",
        "for free with purchase.",
      ],
      image: "/assets/home/drone.png",
      price: "$999",
      buttonText: "SHOP NOW",
      buttonLink: "/store/product/iphone-15-pro",
      bgColor: "bg-gray-50",
    },
    {
      id: 3,
      tagline: "INNOVATION AWAITS",
      title: "Apple Vision Pro",
      description: [
        "Step into the future of computing.",
        "Get 3 months of Apple TV+",
        "included with your purchase.",
      ],
      image: "/assets/home/drone.png",
      price: "$3499",
      buttonText: "SHOP NOW",
      buttonLink: "/store/product/apple-vision-pro",
      bgColor: "bg-purple-50",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [sliderData.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = sliderData[currentSlide];

  const sideBanners = [
    {
      title: "iPhone 15 Pro",
      image: "/assets/home/herophone.png",
      buttonText: "Shop Now",
      buttonLink: "/store/product/iphone-15-pro",
      bgColor: "bg-black",
    },
    {
      title: "Apple Vision Pro",
      image: "/assets/home/herodron.png",
      buttonText: "Shop Now",
      buttonLink: "/store/product/apple-vision-pro",
      bgColor: "bg-[#FEF1E8]",
    },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch ">
          {/* Main Slider */}
          <div className="lg:col-span-2">
            <div className="relative ">
              <div
                className={`relative rounded-lg overflow-hidden shadow ${currentSlideData.bgColor} transition-all duration-500`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
                  {/* Left Content */}
                  <div className="flex flex-col justify-center space-y-6">
                    {/* Tagline */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-0.5 bg-blue-400"></div>
                      <span className="text-blue-600 text-sm font-medium uppercase tracking-wide">
                        {currentSlideData.tagline}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      {currentSlideData.title}
                    </h1>

                    {/* Description */}
                    <div className="space-y-1 ">
                      {currentSlideData.description.map((line, index) => (
                        <p key={index} className="text-gray-700 text-lg">
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Button
                        size="lg"
                        className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <span>{currentSlideData.buttonText}</span>
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Navigation Dots - Inside Content */}
                    <div className="flex justify-start mt-6 space-x-3">
                      {sliderData.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentSlide
                              ? "bg-gray-800 scale-110"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="flex items-center justify-center relative">
                    <img
                      src={currentSlideData.image}
                      alt={currentSlideData.title}
                      className="w-full h-96 lg:h-[500px] object-contain"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                        <span className="font-bold text-lg">
                          {currentSlideData.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              {/* <button
                onClick={prevSlide}
                className=" absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button> */}
            </div>
          </div>

          {/* Side Banners*/}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
            {[
              {
                title: "iPhone 16 Pro Max",
                image: "/assets/home/herophone.png",
                badge: "29% OFF",
                bg: "bg-black",
              },
              {
                title: "Apple VR Pro",
                image: "/assets/home/herodron.png",
                badge: "$299 USD",
                bg: "bg-[#FEF1E8]",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} relative rounded-xl overflow-hidden flex flex-col justify-between shadow-md p-6 flex-1`}
              >
                {/* Left Content */}
                <div>
                  <p
                    className={`text-sm font-medium uppercase ${
                      i === 0 ? "text-yellow-400" : "text-orange-500"
                    }`}
                  >
                    {i === 0 ? "Summer Sales" : "Exclusive Offer"}
                  </p>
                  <h3
                    className={`text-2xl font-bold mt-2 max-w-[30%] ${
                      i === 0 ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <Button
                  className={`mt-4 w-fit ${
                    i === 0
                      ? "bg-accent-500 hover:bg-accent-600 text-white"
                      : "bg-accent-500 hover:bg-accent-600 text-white"
                  }`}
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Product Image */}
                <div className="absolute bottom-0 right-0 w-[55%] h-[85%]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain object-bottom-right"
                  />
                </div>

                {/* Badge */}
                <div
                  className={`absolute top-4 right-4 ${
                    i === 0
                      ? "bg-[#EFD33D] text-black"
                      : "bg-white text-orange-600"
                  } text-sm font-semibold px-3 py-1 rounded`}
                >
                  {item.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
