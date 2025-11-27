"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Share2,
  Star,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Shield,
  Zap,
  Package,
  AlertCircle,
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Clock,
  Award,
  Users,
  Store,
  MapPin,
} from "lucide-react";
import { useParams } from "next/navigation";
import productsData from "@/lib/data/products.json";
import sellers from "@/lib/data/sellers.json";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductListingsSection from "@/components/store/sections/ProductListingsSection";
import Link from "next/link";
import ChatPanel from "@/components/store/ChatPanel";
import { useCart, useWishlist } from "@/context/store";

function slugify(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem: addCartItem } = useCart();
  const { addItem: addWishlistItem, isWishlisted, removeItem: removeWishlistItem } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = useMemo(() => {
    if (!mounted) return null;

    const idOrSlug = params?.slug?.toString() || "";
    const found =
      productsData.find((p) => p.id === idOrSlug) ||
      productsData.find((p) => slugify(p.name) === idOrSlug);
    if (!found) return null;

    return {
      ...found,
      images: found.images || [
        found.image,
        found.image,
        found.image,
        found.image,
        found.image,
        found.image,
      ],
      description: found.description || `${found.name} by ${found.brand}. High-quality ${found.category} product with excellent reviews and customer satisfaction. Perfect for everyday use with premium quality and design.`,
      features: (found.tags || []).map(
        (t) => t.charAt(0).toUpperCase() + t.slice(1)
      ),
      sizes: ["Small", "Medium", "Large", "XL"],
      colors: ["#2D2D2D", "#E5E5E5", "#FFFFFF", "#D1D1D1", "#A8A8A8"],
      stockCount: found.inStock ? 99 : 0,
      warranty: "1 Year Manufacturer Warranty",
      returnPolicy: "30-Day Money Back Guarantee",
      shipping: "Free shipping on orders over $100",
    };
  }, [params, mounted]);

  // Compute seller route
  const sellerEntry = useMemo(() => {
    if (!product) return null;
    if (product.sellerId) {
      const byId = sellers.find((s) => s.id === product.sellerId);
      if (byId) return byId;
    }
    const brand = (product.brand || "").toLowerCase();
    return (
      sellers.find((s) => s.name.toLowerCase() === brand) ||
      sellers.find((s) => (s.aliases || []).includes(brand)) ||
      null
    );
  }, [product]);

  const defaultWh =
    sellers.find((s) => s.isDefault && s.type === "wholesaler") || null;
  const supplierHref = sellerEntry
    ? `/${sellerEntry.type}/${sellerEntry.slug}`
    : defaultWh
      ? `/wholesaler/${defaultWh.slug}`
      : `/wholesaler/${slugify(product?.brand || "unknown-seller")}`;

  const availableSellers = useMemo(() => {
    if (!product) return [];
    const brand = (product.brand || "").toLowerCase();
    const matchesByBrand = sellers.filter(
      (s) => s.name.toLowerCase() === brand || (s.aliases || []).includes(brand)
    );
    const matchesByProducts = productsData
      .filter((p) => (p.brand || "").toLowerCase() === brand && p.sellerId)
      .map((p) => sellers.find((s) => s.id === p.sellerId))
      .filter(Boolean);
    const merged = [...matchesByBrand, ...matchesByProducts];
    const unique = [];
    const seen = new Set();
    for (const s of merged) {
      if (!s) continue;
      if (!seen.has(s.id)) {
        seen.add(s.id);
        unique.push(s);
      }
    }
    if (unique.length === 0) {
      return defaultWh ? [defaultWh] : [];
    }
    return unique;
  }, [product, defaultWh]);

  const primarySeller = useMemo(() => {
    if (sellerEntry) return sellerEntry;
    if (availableSellers.length) return availableSellers[0];
    return defaultWh;
  }, [sellerEntry, availableSellers, defaultWh]);

  const handleAddToCart = () => {
    if (!product || !product.id) {
      console.error('Cannot add to cart: Invalid product');
      return;
    }

    const validQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    if (isNaN(validQuantity) || validQuantity < 1) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!product.inStock || product.stockCount === 0) {
      alert('This product is out of stock');
      return;
    }

    try {
      const productPrice = Number(product.price);
      if (isNaN(productPrice) || productPrice < 0) {
        console.error('Invalid product price');
        alert('Product price is invalid. Please contact support.');
        return;
      }

      addCartItem(
        {
          id: product.id,
          name: product.name || 'Unknown Product',
          price: productPrice,
          originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
          image: product.image || (product.images && product.images[0]) || '/placeholder-image.png',
          brand: product.brand,
          sellerId: product.sellerId,
          category: product.category,
          inStock: product.inStock,
          size: selectedSize || undefined,
          color: product.colors?.[selectedColor] || undefined,
        },
        validQuantity
      );

      alert(`✅ Added ${validQuantity} ${product.name || 'item'} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!product || !product.id) {
      console.error('Cannot buy now: Invalid product');
      return;
    }

    const validQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    if (isNaN(validQuantity) || validQuantity < 1) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!product.inStock || product.stockCount === 0) {
      alert('This product is out of stock');
      return;
    }

    try {
      const productPrice = Number(product.price);
      if (isNaN(productPrice) || productPrice < 0) {
        console.error('Invalid product price');
        alert('Product price is invalid. Please contact support.');
        return;
      }

      addCartItem(
        {
          id: product.id,
          name: product.name || 'Unknown Product',
          price: productPrice,
          originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
          image: product.image || (product.images && product.images[0]) || '/placeholder-image.png',
          brand: product.brand,
          sellerId: product.sellerId,
          category: product.category,
          inStock: product.inStock,
          size: selectedSize || undefined,
          color: product.colors?.[selectedColor] || undefined,
        },
        validQuantity
      );

      const subtotal = productPrice * validQuantity;
      const shipping = subtotal > 100 ? 0 : 10;
      const tax = Math.round(subtotal * 0.12 * 100) / 100;
      const discount = 0;
      const total = Math.max(0, subtotal + shipping + tax - discount);

      const payload = {
        items: [{
          id: product.id,
          name: product.name || 'Unknown Product',
          price: productPrice,
          image: product.image || (product.images && product.images[0]) || '/placeholder-image.png',
          quantity: validQuantity,
        }],
        subtotal,
        shipping,
        discount,
        tax,
        total,
        coupon: '',
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('checkoutCart', JSON.stringify(payload));
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          alert('Failed to save checkout data. Please try again.');
          return;
        }
      }

      router.push('/store/billingAddress');
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Failed to process buy now. Please try again.');
    }
  };

  const handleAddToWishlist = () => {
    if (!product || !product.id) {
      console.error('Cannot add to wishlist: Invalid product');
      return;
    }

    try {
      if (isWishlisted(product.id)) {
        removeWishlistItem(product.id);
      } else {
        addWishlistItem(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <Card className="border-red-200 bg-red-50 shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold mb-3 text-red-900">Product not found</h1>
              <p className="text-red-700 mb-6">
                We couldn't find the product you're looking for.
              </p>
              <Button onClick={() => router.push('/store')} className="bg-[#F36E16] hover:bg-[#e06212]">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentPrice = product.originalPrice
    ? product.price
    : product.price;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Breadcrumb className="mb-4 sm:mb-6 md:mb-8" />

        {/* Main Product Section - Professional Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Left Column - Product Images (6 columns) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-0">
                <div className="relative bg-white flex items-center justify-center aspect-square w-full group max-h-[500px] sm:max-h-[600px] md:max-h-none">
                  {!imageError ? (
                    <img
                      src={product.images[selectedImage] || product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 sm:p-4 md:p-6 transition-transform duration-300 group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-6 sm:p-8 md:p-12">
                      <Package className="h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24 mb-2 sm:mb-3 md:mb-4" />
                      <p className="text-sm sm:text-base">Image not available</p>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice && discountPercent > 0 && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4">
                      <Badge className="bg-red-500 text-white text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1 shadow-lg">
                        -{discountPercent}% OFF
                      </Badge>
                    </div>
                  )}

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white text-sm sm:text-base md:text-lg px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 shadow-xl">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-[#F36E16] disabled:opacity-50 transition-all flex-shrink-0"
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                disabled={selectedImage === 0}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto flex-1 scrollbar-hide">
                {product.images.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageError(false);
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${selectedImage === index
                      ? "border-[#F36E16] ring-2 ring-orange-200"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={image || product.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover bg-gray-50"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  </button>
                ))}
              </div>

              <button
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-[#F36E16] disabled:opacity-50 transition-all flex-shrink-0"
                onClick={() =>
                  setSelectedImage(
                    Math.min(product.images.length - 1, selectedImage + 1)
                  )
                }
                disabled={selectedImage === product.images.length - 1}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Right Column - Product Details (6 columns) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200">
              {/* Brand & Category */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <Link href={supplierHref}>
                  <Badge variant="outline" className="text-xs sm:text-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer">
                    {product.brand || "Brand"}
                  </Badge>
                </Link>
                <Badge variant="outline" className="text-xs sm:text-sm px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5">
                  {product.category}
                </Badge>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-300 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{product.rating || 0}</span> ({product.reviewCount || 0} reviews)
                </span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm text-gray-500 w-full sm:w-auto">SKU: {product.id}</span>
              </div>

              {/* Pricing */}
              <div className="mb-4 sm:mb-5 md:mb-6 pb-4 sm:pb-5 md:pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                  {product.originalPrice && (
                    <span className="text-xl sm:text-2xl text-gray-400 line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl sm:text-4xl font-bold text-[#F36E16]">
                    ${Number(currentPrice).toFixed(2)}
                  </span>
                  {product.originalPrice && discountPercent > 0 && (
                    <Badge className="bg-red-500 text-white text-xs sm:text-sm px-2 py-0.5 sm:py-1">
                      Save {discountPercent}%
                    </Badge>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    You save ${(Number(product.originalPrice) - Number(currentPrice)).toFixed(2)} on this item
                  </p>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4 sm:mb-5">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                    Size
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-medium text-xs sm:text-sm transition-all ${selectedSize === size
                          ? "border-[#F36E16] bg-orange-50 text-[#F36E16]"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4 sm:mb-5">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                    Color
                  </h3>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${selectedColor === idx
                          ? "border-[#F36E16] ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                        style={{ backgroundColor: color }}
                        title={`Color option ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                  Quantity
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setQuantity(1);
                          return;
                        }
                        const numValue = parseInt(value, 10);
                        if (!isNaN(numValue) && numValue >= 1) {
                          setQuantity(numValue);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (isNaN(value) || value < 1) {
                          setQuantity(1);
                        }
                      }}
                      className="w-14 sm:w-16 h-9 sm:h-10 text-center border-x border-gray-300 text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#F36E16]"
                      min="1"
                    />
                    <button
                      onClick={() => {
                        const currentQty = Number(quantity) || 1;
                        setQuantity(currentQty + 1);
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {product.stockCount} available in stock
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 md:mb-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.stockCount === 0}
                    className="flex-1 bg-[#F36E16] hover:bg-[#e06212] text-white h-11 sm:h-12 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.inStock || product.stockCount === 0}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-11 sm:h-12 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Buy Now
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 h-10 sm:h-11 rounded-lg font-medium text-xs sm:text-sm"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Chat with Seller
                </Button>
              </div>

              {/* Wishlist & Share */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${isWishlisted(product.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600"
                      }`}
                  />
                  <span className="hidden sm:inline">{isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                  <span className="sm:hidden">{isWishlisted(product.id) ? "Remove" : "Wishlist"}</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 hidden sm:inline">Share:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:border-[#F36E16] hover:bg-orange-50 transition-all"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs font-medium text-gray-900 mb-0.5">Free Shipping</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">On orders $100+</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs font-medium text-gray-900 mb-0.5">Easy Returns</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">30 Day Guarantee</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-[10px] sm:text-xs font-medium text-gray-900 mb-0.5">Secure Payment</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">100% Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards Section - Below Product Details */}
        <div className="container mx-auto mb-8 sm:mb-10 md:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Product Highlights */}
            {/* <Card className="shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-[#F36E16]" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Why Customers Love This
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Premium Quality</p>
                      <p className="text-xs text-gray-600">High-quality materials for lasting durability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Great Value</p>
                      <p className="text-xs text-gray-600">Best price for the quality you get</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-1">Fast Delivery</p>
                      <p className="text-xs text-gray-600">Quick shipping to get your order fast</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Seller/Reseller Information */}
            {sellerEntry && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-2 sm:gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F36E16] flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                      {(sellerEntry.name || sellerEntry.slug || "S")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {sellerEntry.name}
                        </h3>
                        {sellerEntry.type === "reseller" && (
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5">
                            Reseller
                          </Badge>
                        )}
                        {sellerEntry.type === "wholesaler" && (
                          <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5">
                            Wholesaler
                          </Badge>
                        )}
                      </div>
                      {sellerEntry.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{sellerEntry.location}</span>
                        </div>
                      )}
                      {sellerEntry.rating && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(sellerEntry.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {sellerEntry.rating}
                          </span>
                          {sellerEntry.followers && (
                            <span className="text-xs text-gray-500">
                              • {sellerEntry.followers.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {sellerEntry.about && (
                    <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {sellerEntry.about}
                    </p>
                  )}

                  <Link href={`/${sellerEntry.type}/${sellerEntry.slug}`}>
                    <Button className="w-full bg-[#F36E16] hover:bg-[#e06212] text-white font-medium py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2">
                      <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                      Visit Store
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Available Sellers */}
            {availableSellers.length > 0 && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#F36E16]" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      Available Sellers
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {availableSellers.slice(0, 3).map((s) => (
                      <Link
                        key={s.id}
                        href={`/${s.type}/${s.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#F36E16] hover:bg-orange-50/50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#F36E16] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {(s.name || s.slug || "S")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate mb-0.5">
                            {s.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs px-1.5 py-0.5 ${s.type === "reseller"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                              }`}>
                              {s.type === "reseller" ? "Reseller" : "Wholesaler"}
                            </Badge>
                            {s.location && (
                              <span className="text-xs text-gray-500 truncate">
                                {s.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#F36E16] transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 -mx-3 sm:mx-0">
          <Card className="shadow-xl border-2 border-gray-100 bg-gradient-to-br from-gray-50/50 to-white rounded-lg sm:rounded-xl">
            <CardContent className="p-0">
              <Tabs defaultValue="description" className="w-full">
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b-2 border-gray-200 sm:relative sm:bg-gradient-to-r sm:from-gray-50 sm:to-white sm:backdrop-blur-none">
                  <TabsList className="w-full justify-start border-0 bg-transparent rounded-none p-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                    <TabsTrigger
                      value="description"
                      className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-semibold sm:font-bold text-xs sm:text-sm md:text-base whitespace-nowrap snap-start min-w-fit flex-shrink-0 transition-all hover:text-[#F36E16] hover:border-gray-300 active:scale-95"
                    >
                      <span className="hidden min-[400px]:inline">Description</span>
                      <span className="min-[400px]:hidden">Desc</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="info"
                      className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-semibold sm:font-bold text-xs sm:text-sm md:text-base whitespace-nowrap snap-start min-w-fit flex-shrink-0 transition-all hover:text-[#F36E16] hover:border-gray-300 active:scale-95"
                    >
                      <span className="hidden sm:inline">Additional Info</span>
                      <span className="sm:hidden">Info</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="spec"
                      className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-semibold sm:font-bold text-xs sm:text-sm md:text-base whitespace-nowrap snap-start min-w-fit flex-shrink-0 transition-all hover:text-[#F36E16] hover:border-gray-300 active:scale-95"
                    >
                      <span className="hidden sm:inline">Specifications</span>
                      <span className="sm:hidden">Specs</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-semibold sm:font-bold text-xs sm:text-sm md:text-base whitespace-nowrap snap-start min-w-fit flex-shrink-0 transition-all hover:text-[#F36E16] hover:border-gray-300 active:scale-95"
                    >
                      <span className="hidden sm:inline">Reviews</span>
                      <span className="sm:hidden">Reviews</span>
                      <span className="ml-1 sm:ml-1.5">({product.reviewCount || 0})</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="description" className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 bg-white/50 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div className="max-w-4xl mx-auto">
                    <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">Product Description</h3>
                    <div className="text-gray-700 leading-relaxed sm:leading-loose space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 text-sm sm:text-base md:text-lg">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl">{product.description}</p>
                      <p className="text-sm sm:text-base md:text-lg">
                        This premium product combines exceptional quality with modern design,
                        making it the perfect choice for your needs. Crafted with attention to
                        detail and built to last, it offers outstanding value and performance.
                      </p>
                      <p className="text-sm sm:text-base md:text-lg">
                        Whether you're looking for style, functionality, or both, this product
                        delivers on all fronts. Join thousands of satisfied customers who have
                        made this their go-to choice.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 bg-white/50 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-blue-200 hover:shadow-md transition-shadow">
                      <span className="text-gray-600 text-xs sm:text-sm font-medium block mb-1">Brand:</span>
                      <p className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl break-words">{product.brand || "N/A"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-green-200 hover:shadow-md transition-shadow">
                      <span className="text-gray-600 text-xs sm:text-sm font-medium block mb-1">Category:</span>
                      <p className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl break-words">{product.category}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-purple-200 hover:shadow-md transition-shadow">
                      <span className="text-gray-600 text-xs sm:text-sm font-medium block mb-1">SKU:</span>
                      <p className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl break-all">{product.id}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-orange-200 hover:shadow-md transition-shadow">
                      <span className="text-gray-600 text-xs sm:text-sm font-medium block mb-1">Availability:</span>
                      <p className="font-bold text-green-600 text-sm sm:text-base md:text-lg lg:text-xl">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-pink-200 hover:shadow-md transition-shadow sm:col-span-2">
                      <span className="text-gray-600 text-xs sm:text-sm font-medium block mb-1">Warranty:</span>
                      <p className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl break-words">{product.warranty}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-indigo-200 hover:shadow-md transition-shadow sm:col-span-2">
                      <span className="text-gray-600 text-xs sm:text-sm font-medium block mb-1">Return Policy:</span>
                      <p className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl break-words">{product.returnPolicy}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="spec" className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 bg-white/50 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div className="max-w-4xl mx-auto">
                    <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 mb-3 sm:mb-4 md:mb-6 lg:mb-8">Key Features & Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                      {product.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5 sm:gap-3 md:gap-4 p-3 sm:p-3.5 md:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-md transition-all hover:border-gray-300">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed break-words">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="review" className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 bg-white/50 data-[state=active]:animate-in data-[state=active]:fade-in-50">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center py-6 sm:py-8 md:py-12 lg:py-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl border-2 border-yellow-200 px-4 sm:px-6 md:px-8">
                      <div className="flex justify-center mb-3 sm:mb-4 md:mb-5 lg:mb-6 gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 ${i < Math.floor(product.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-2.5 md:mb-3">
                        {product.rating || 0} out of 5
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-2">
                        Based on {product.reviewCount || 0} customer {product.reviewCount === 1 ? 'review' : 'reviews'}
                      </p>
                      <div className="inline-block bg-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full shadow-md">
                        <span className="text-gray-700 font-semibold text-xs sm:text-sm md:text-base block sm:inline">
                          {product.reviewCount || 0} {product.reviewCount === 1 ? 'Customer' : 'Customers'} Love This Product
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <ProductListingsSection />
        </div>

        {/* Chat Panel */}
        <ChatPanel
          open={chatOpen}
          onOpenChange={setChatOpen}
          seller={primarySeller}
          product={product}
        />
      </div>
    </div>
  );
}
