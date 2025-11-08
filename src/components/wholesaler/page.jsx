import Link from "next/link";
import { Button } from "@/components/ui/button";

import NewArrivalsSection from "../store/sections/NewArrivalsSection";
import ProductListingsSection from "../store/sections/ProductListingsSection";
import Subscription from "../store/sections/Subscription";

const WholesellerHomePage = () => {
  return (
    <div className="bg-white ">
      <WholesellerHero />

      <WholesellerChooseUs />

      <section className="bg-[#EAF3FF] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Start Selling as wholesaler, supplier, or manufacturer
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Are you a wholesaler, supplier, or manufacturer who wants to sell in
            bulk? Contact us to become a verified wholesaler on our platform.
          </p>
          <div className="mt-6">
            <Link href="/reseller/terms">
              <Button className="bg-[#F36E16] hover:bg-[#e06212]">
                BECOME A RESELLER
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals - Electronics, Fashion, Furniture, Beauty */}
      <NewArrivalsSection />

      {/* Product Listings - Best Seller, New Arrival, Trending, Top Rated */}
      <ProductListingsSection />

      {/* Newsletter Subscription */}
      <Subscription />
    </div>
  );
};

export default WholesellerHomePage;
