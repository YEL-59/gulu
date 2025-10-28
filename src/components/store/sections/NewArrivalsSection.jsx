import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function NewArrivalsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-2 h-10 bg-accent-500"></div>
          <h2 className="text-2xl font-bold text-gray-900">New Arrival</h2>
        </div>

        {/* Grid Layout - responsive for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:h-[600px]">
          {/* Left Side - Electronics (Large) */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="md:absolute md:inset-0 p-6 md:p-8 flex flex-col justify-between">
              <div className="text-white z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Electronics
                </h3>
                <p className="text-gray-300 mb-6 max-w-xs">
                  Black and White version of the PS5 coming out on sale.
                </p>
                <Button
                  className="bg-transparent border-b border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-0 pb-1"
                  variant="ghost"
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* PS5 Image positioned at bottom right */}
              <div className="relative md:absolute md:bottom-0 md:right-0 md:w-2/3 md:h-2/3 w-full h-40 sm:h-52 mt-4 md:mt-0">
                <Image
                  src="/assets/home/product8.png"
                  alt="PlayStation 5"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Side - 3 sections */}
          <div className="grid md:grid-rows-2 gap-4 md:gap-6">
            {/* Top Right - Fashion Collections */}
            <div className="relative bg-black rounded-lg overflow-hidden p-4 md:p-6 flex flex-col md:flex-row items-center md:items-end justify-between">
              <div className="text-white flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Fashion Collections
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Featured Fashion collections that give you another vibe
                </p>
                <Button
                  className="bg-transparent border-b border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-0 pb-1 text-sm w-fit"
                  variant="ghost"
                >
                  Shop Now
                </Button>
              </div>

              <div className="flex items-end justify-end mt-4 md:mt-0">
                <Image
                  src="/assets/home/girl.png"
                  alt="Fashion Model"
                  width={160}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom Right - Two smaller sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Furniture */}
              <div className="relative bg-black rounded-lg overflow-hidden p-4 flex flex-col md:flex-row items-center md:items-end justify-between">
                <div className="text-white flex flex-col justify-end">
                  <h3 className="text-base md:text-lg font-bold mb-1">
                    Furniture
                  </h3>
                  <p className="text-gray-300 mb-3 text-xs">
                    Amazing furniture for home
                  </p>
                  <Button
                    className="bg-transparent border-b border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-0 pb-1 text-xs w-fit"
                    variant="ghost"
                  >
                    Shop Now
                  </Button>
                </div>

                <div className="flex items-end justify-end mt-3 md:mt-0">
                  <Image
                    src="/assets/home/product9.png"
                    alt="Chair"
                    width={100}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Beauty */}
              <div className="relative bg-black rounded-lg overflow-hidden p-4 flex flex-col md:flex-row items-center md:items-end justify-between">
                <div className="text-white flex flex-col justify-end">
                  <h3 className="text-base md:text-lg font-bold mb-1">
                    Beauty
                  </h3>
                  <p className="text-gray-300 mb-3 text-xs">
                    Amazing cosmetics for makeup
                  </p>
                  <Button
                    className="bg-transparent border-b border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-0 pb-1 text-xs w-fit"
                    variant="ghost"
                  >
                    Shop Now
                  </Button>
                </div>

                <div className="flex items-end justify-end mt-3 md:mt-0">
                  <Image
                    src="/assets/home/product10.png"
                    alt="Beauty Products"
                    width={100}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
