import HeroSection from "@/components/store/sections/HeroSection";
import FeatureHighlights from "@/components/store/sections/FeatureHighlights";
import FlashSalesSection from "@/components/store/sections/FlashSalesSection";
import MidPageBanners from "@/components/store/sections/MidPageBanners";
import ShopByCategories from "@/components/store/sections/ShopByCategories";
import FeaturedProducts from "@/components/store/sections/FeaturedProducts";
import NewArrivalsSection from "@/components/store/sections/NewArrivalsSection";
import ProductListingsSection from "@/components/store/sections/ProductListingsSection";
import Subscription from "@/components/store/sections/Subscription";

export default function StoreHomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section with main banner and side banners */}
      <HeroSection />

      {/* Feature Highlights - Free Shipping, Money Back, etc. */}
      <FeatureHighlights />

      {/* Flash Sales with countdown timer */}
      <FlashSalesSection />

      {/* Mid-page promotional banners */}
      <MidPageBanners />

      {/* Shop by Categories */}
      <ShopByCategories />

      {/* Featured Products with discount banner */}
      <FeaturedProducts />

      {/* New Arrivals - Electronics, Fashion, Furniture, Beauty */}
      <NewArrivalsSection />

      {/* Product Listings - Best Seller, New Arrival, Trending, Top Rated */}
      <ProductListingsSection />

      {/* Newsletter Subscription */}
      <Subscription />
    </div>
  );
}
