import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-10 bg-accent-500 "></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
          </div>

          <Button
            variant="outline"
            className="flex items-center capitalize text-amber-300"
          >
            Browse All Product
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Discount Banner */}
          <div className="lg:col-span-1">
            <div className="bg-[#E7F1FF] rounded-2xl p-8 text-white h-full flex flex-col justify-between">
              <div className="text-center">
                <h5 className="text-[#F36E16]">COMPUTER & ACCESSORIES</h5>
                <h3 className="text-4xl font-bold text-black py-2">
                  40% Discount
                </h3>
                <p className="text-lg mb-4 font-normal text-black">
                  For all ellectronics products
                </p>
                <div>
                  <p className="text-lg font-normal text-black">
                    Offers ends in:
                  </p>
                  <Button className="bg-[#FEF1E8] inline text-black">
                    ENDS OF WINTER
                  </Button>
                </div>

                <Button className="bg-accent-500  text-white hover:bg-gray-100 px-10 py-5 mt-10">
                  Shop Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div>
                <img
                  src="/assets/home/product7.png"
                  alt="Desktop Computer"
                  className="w-full h-[100%] object-contain mb-4"
                />
              </div>
            </div>
          </div>

          {/* Featured Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashSaleProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
