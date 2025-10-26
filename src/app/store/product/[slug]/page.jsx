"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Share2,
  Star,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import productsData from "@/lib/data/products.json";
import sellers from "@/lib/data/sellers.json";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductListingsSection from "@/components/store/sections/ProductListingsSection";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);

  const product = useMemo(() => {
    const idOrSlug = params?.slug?.toString() || "";
    const found =
      productsData.find((p) => p.id === idOrSlug) ||
      productsData.find((p) => slugify(p.name) === idOrSlug);
    if (!found) return null;
    const tierBase = found.price;
    const tiers = [
      { label: "1 - 49 Pieces", price: tierBase },
      {
        label: "50 - 99 Pieces",
        price: Math.round(tierBase * 0.75 * 100) / 100,
      },
      { label: "100+ Pieces", price: Math.round(tierBase * 0.65 * 100) / 100 },
    ];
    return {
      ...found,
      images: [
        found.image,
        found.image,
        found.image,
        found.image,
        found.image,
        found.image,
      ],
      description: `${found.name} by ${found.brand}. High-quality ${found.category} product with excellent reviews.`,
      features: (found.tags || []).map(
        (t) => t.charAt(0).toUpperCase() + t.slice(1)
      ),
      sizes: ["Standard"],
      colors: ["#2D2D2D", "#E5E5E5", "#FFFFFF", "#D1D1D1", "#A8A8A8"],
      stockCount: found.inStock ? 99 : 0,
      tierPrices: tiers,
      samplePrice: Math.round(tierBase * 0.85 * 100) / 100,
    };
  }, [params]);

  // Compute seller route based on sellerId or brand -> sellers.json entry
  const sellerEntry = useMemo(() => {
    if (!product) return null;
    // Prefer sellerId mapping
    if (product.sellerId) {
      const byId = sellers.find((s) => s.id === product.sellerId);
      if (byId) return byId;
    }
    // Fallback to brand-name mapping
    const brand = (product.brand || "").toLowerCase();
    return sellers.find((s) => s.name.toLowerCase() === brand) || null;
  }, [product]);

  const supplierHref = sellerEntry
    ? `/${sellerEntry.type}/${sellerEntry.slug}`
    : `/seller/${slugify(product?.brand || "unknown-seller")}`;
  const addToCart = () => {
    console.log("Added to cart:", {
      product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const addToWishlist = () => {
    console.log("Added to wishlist:", product);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Product not found</h1>
          <p className="text-gray-600">
            We couldn't find the product you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative bg-gray-50 flex items-center justify-center h-[400px] w-full shadow-lg border border-gray-200">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                disabled={selectedImage === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 overflow-hidden">
                {product.images.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                      selectedImage === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </button>
                ))}
              </div>

              <button
                className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                onClick={() =>
                  setSelectedImage(
                    Math.min(product.images.length - 1, selectedImage + 1)
                  )
                }
                disabled={selectedImage === product.images.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-5">
            {/* Supplier Info */}
            <div className="bg-white rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-semibold">
                  {product.brand?.[0] || "B"}
                </div>
                <Link href={supplierHref} className="text-sm font-medium text-gray-700 hover:text-orange-600">
                  {product.brand || "Unknown Seller"}
                </Link>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {product.rating} Star Rating ({product.reviewCount} user
                  feedback)
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM,
                256GB SSD Storage) - Space Gray
              </h1>

              {/* Product Meta */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mb-4">
                <div>
                  SKU: <span className="text-gray-900">{product.id}</span>
                </div>
                <div>
                  Availability:{" "}
                  <span className="text-green-600 font-medium">In Stock</span>
                </div>
                <div>
                  Brand: <span className="text-gray-900">{product.brand}</span>
                </div>
              </div>

              {/* Product Pricing Header */}
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Product Pricing
              </h3>

              {/* Tier Pricing Boxes */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {product.tierPrices.map((tier, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-3 text-center bg-white"
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      {tier.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${tier.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Price Banner */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-400 bg-blue-100"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Sample Price: ${product.samplePrice}
                  </span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm rounded">
                  Get a Sample
                </Button>
              </div>

              {/* Color Selection */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Color
                </h3>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === idx
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Qty
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 h-10 text-center border-x border-gray-300"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  onClick={addToCart}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-11 px-8 rounded font-medium"
                >
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 h-11 px-8 rounded font-medium"
                >
                  BUY NOW
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 h-11 px-8 rounded font-medium"
                >
                  CHAT NOW
                </Button>
              </div>

              {/* Wishlist & Share */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <button
                  onClick={addToWishlist}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Heart className="w-5 h-5" />
                  Add to Wishlist
                </button>
              </div>

              {/* Share Product */}
              <div className="pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Share product:</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Assurance Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-lg p-4 flex items-start gap-3">
                <Truck className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Free Delivery
                  </h4>
                  <p className="text-sm text-gray-600">Enjoy free delivery</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-start gap-3">
                <RotateCcw className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Return Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    Free 30 Days Delivery Returns.{" "}
                    <span className="text-blue-600 underline cursor-pointer">
                      Details
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  100% Guarantee Safe Checkout
                </h4>
                <div className="flex gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-10 h-7 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="bg-white rounded-lg">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent rounded-none p-0">
              <TabsTrigger
                value="description"
                className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 rounded-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 rounded-none"
              >
                Additional Information
              </TabsTrigger>
              <TabsTrigger
                value="spec"
                className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 rounded-none"
              >
                Specification
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 rounded-none"
              >
                Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  Viverra nec id ad nam lacus sociis leo. Etiam potenti at
                  sapien tortor, quam adipiscing lobortis non convallis et
                  lectus pharetra sed. Sed ornare habitant auctor posuere justo
                  pharetra. Semper gravida sed consectetur quis in hendrerit et
                  sagittis. Et sem cursus turpis a quisque posuere. Ultricies
                  placerat nisi hendrerit ut in mi lectus vehicula praesent vel
                  consectetur. Turpis lacus quisque interdum quis semper aliquet
                  fuerat lectus vitae. Quis dolor quis venenatis sed a habitant
                  egestas habitasse.
                </p>
                <p>
                  Viverra ultricies quisque bibendum placerat nunc sit mauris
                  posuere facilisis nec. Habitant nunc pulvinar lectus facilisi
                  justo auctor faucibus vel integer egestas proin leo. Fermentum
                  volutpat senectus quisque vitae massa turpis ornare lectus
                  pharetra sed amet adipiscing lectus vitae.
                </p>
                <p>
                  Malesuada vitae cursus nec amet arcu congue pharetra elementum
                  id velit. Elit cursus nec eros quam. Et viverra eget sit enim
                  ut consectetur venenatis sed. Fusce libero praesent vitae
                  pharetra sed. Interdum semper venenatis sed convallis habitant
                  fuerat cursus facilisi diam amet arcu. Sed turpis ut interdum
                  posuere auctor leo. Sed amet ornare porta non id pulvinar
                  justo vel consectetur. Senectus quisque adipiscing lobortis
                  pharetra lectus sem nunc egestas habitant quis vitae praesent
                  facilisi etiam.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="info" className="p-6 text-gray-700">
              <div className="space-y-2">
                <div>
                  <strong>Brand:</strong> {product.brand}
                </div>
                <div>
                  <strong>Category:</strong> {product.category}
                </div>
                <div>
                  <strong>SKU:</strong> {product.id}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spec" className="p-6">
              <ul className="space-y-2 text-gray-700">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="review" className="p-6 text-gray-700">
              <p>
                Rated {product.rating} out of 5 based on {product.reviewCount}{" "}
                reviews.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <ProductListingsSection />
        </div>
      </div>
    </div>
  );
}

function slugify(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
