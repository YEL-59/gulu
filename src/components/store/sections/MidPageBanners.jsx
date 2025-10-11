import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function MidPageBanners() {
  const banners = [
    {
      title: "New Apple Homepod mini",
      description: "Experience premium sound quality",
      image: "/assets/home/product5.png",
      buttonText: "Shop Now",
      buttonLink: "/store/product/apple-homepod-mini",
      bgColor: "bg-[#F2F4F5]",
      badgeText: "INTRODUCING",
    },
    {
      title: "Xiaomi Mi 11 Ultra 12GB + 256GB",
      description: "Flagship smartphone with advanced camera",
      image: "/assets/home/product6.png",
      buttonText: "Shop Now",
      buttonLink: "/store/product/xiaomi-mi-11-ultra",
      bgColor: "bg-black",
      badgeText: "INTRODUCING",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden ${
                banner.bgColor
              } ${banner.bgColor === "bg-black" ? "text-white" : "text-black"}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div className="flex flex-col justify-center">
                  <Button className="w-fit bg-primary-500 hover:bg-orange-600 text-white rounded-sm">
                    {banner.badgeText}
                  </Button>
                  <h3 className="text-2xl font-bold  mb-2 max-w-sm">
                    {banner.title}
                  </h3>
                  <p className=" mb-4">{banner.description}</p>
                  {/* here i want ilike the arrow are rotated then hover the arrow are straight */}
                  <Button className="w-fit bg-orange-500 hover:bg-orange-600 text-white transition-transform duration-300 ease-in-out">
                    {banner.buttonText}
                    <ArrowRightIcon className="w-4 h-4 ml-2 transform transition-transform duration-300 ease-in-out rotate-x-90 hover:rotate-0" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-48 object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
