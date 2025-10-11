"use client";

import React, { useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Subscription = () => {
  const [email, setEmail] = useState("");
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const brands = [
    { name: "Google", logo: "/images/brands/google.svg" },
    { name: "Amazon", logo: "/images/brands/amazon.svg" },
    { name: "Philips", logo: "/images/brands/philips.svg" },
    { name: "Toshiba", logo: "/images/brands/toshiba.svg" },
    { name: "Samsung", logo: "/images/brands/samsung.svg" },
    { name: "Sony", logo: "/images/brands/sony.svg" },
    { name: "LG", logo: "/images/brands/lg.svg" },
  ];

  return (
    <section className="bg-[#007bff] py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-blue-100 mb-8 text-lg leading-relaxed">
            Praesent fringilla erat a lacinia egestas. Donec vehicula tempor
            libero et cursus. Donec non quam urna. Quisque vitae porta ipsum.
          </p>

          {/* Input + Button */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex relative bg-white rounded-lg overflow-hidden shadow-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
              required
            />
            <Button
              type="submit"
              className="absolute right-5 transform -translate-y-1/2 top-1/2 rounded-3xl  bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-none font-medium flex items-center justify-center"
            >
              SUBSCRIBE
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Brand Carousel */}
        <div className="max-w-4xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {brands.map((brand, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/3 sm:basis-1/4 md:basis-1/6 flex items-center justify-center"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
