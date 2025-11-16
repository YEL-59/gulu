"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  DollarSign,
  Truck,
  Info,
  Calculator,
  Store,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Star,
  BarChart3,
  Users,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import productsData from "@/lib/data/products.json";
import sellers from "@/lib/data/sellers.json";

function slugify(str) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ResellerProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(10); // Default to MOQ
  const [retailPrice, setRetailPrice] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Fix hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current reseller ID (in production, get from session)
  const currentResellerId = "reseller-1";

  // Load product
  const product = useMemo(() => {
    if (!mounted) return null;
    
    const idOrSlug = params?.slug?.toString() || "";
    const found =
      productsData.find((p) => p.id === idOrSlug) ||
      productsData.find((p) => slugify(p.name) === idOrSlug);
    if (!found) return null;

    const tierBase = found.price;
    // Wholesale pricing tiers (better discounts for resellers)
    const tiers = [
      { label: "1 - 49 Units", price: tierBase, minQty: 1, maxQty: 49, discount: 0 },
      {
        label: "50 - 99 Units",
        price: Math.round(tierBase * 0.75 * 100) / 100,
        minQty: 50,
        maxQty: 99,
        discount: 25,
      },
      {
        label: "100 - 499 Units",
        price: Math.round(tierBase * 0.65 * 100) / 100,
        minQty: 100,
        maxQty: 499,
        discount: 35,
      },
      {
        label: "500+ Units",
        price: Math.round(tierBase * 0.55 * 100) / 100,
        minQty: 500,
        maxQty: Infinity,
        discount: 45,
      },
    ];

    return {
      ...found,
      images: found.images || [
        found.image,
        found.image,
        found.image,
        found.image,
      ],
      description: found.description || `${found.name} by ${found.brand}. High-quality ${found.category} product with excellent reviews and customer satisfaction.`,
      features: (found.tags || []).map(
        (t) => t.charAt(0).toUpperCase() + t.slice(1)
      ),
      tierPrices: tiers,
      moq: 10, // Minimum Order Quantity
      stockCount: found.inStock ? 500 : 0,
      leadTime: "3-5 business days",
      warranty: "1 year manufacturer warranty",
      returnPolicy: "30-day return policy",
    };
  }, [params, mounted]);

  // Get wholesaler info
  const wholesaler = useMemo(() => {
    if (!product) return null;
    return sellers.find((s) => s.id === product.sellerId) || null;
  }, [product]);

  // Calculate current tier price based on quantity
  const currentTier = useMemo(() => {
    if (!product) return null;
    const qty = Number(quantity) || 0;
    return (
      product.tierPrices.find(
        (tier) => qty >= tier.minQty && qty <= tier.maxQty
      ) || product.tierPrices[0]
    );
  }, [product, quantity]);

  // Handle quantity change with validation
  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 0;
    
    if (value === "") {
      setQuantity("");
      setQuantityError("");
      return;
    }

    if (isNaN(numValue) || numValue < 1) {
      setQuantityError("Quantity must be at least 1");
      return;
    }

    if (product && numValue < product.moq) {
      setQuantityError(`Minimum order quantity is ${product.moq} units`);
      setQuantity(numValue);
      return;
    }

    if (product && numValue > product.stockCount) {
      setQuantityError(`Only ${product.stockCount} units available`);
      setQuantity(numValue);
      return;
    }

    setQuantity(numValue);
    setQuantityError("");
  };

  // Select tier by clicking on it
  const handleTierSelect = (tier) => {
    if (!product) return;
    const midQty = Math.floor((tier.minQty + Math.min(tier.maxQty, product.stockCount)) / 2);
    const safeQty = Math.max(tier.minQty, Math.min(midQty, product.stockCount));
    setQuantity(safeQty);
    setQuantityError("");
  };

  // Calculate profit
  const profitCalculation = useMemo(() => {
    if (!currentTier || !retailPrice) return null;
    const wholesaleCost = currentTier.price;
    const retail = Number(retailPrice) || 0;
    const qty = Number(quantity) || 0;

    if (retail <= 0 || qty <= 0) return null;
    if (retail <= wholesaleCost) return null; // Invalid - retail should be higher

    const totalCost = wholesaleCost * qty;
    const totalRevenue = retail * qty;
    const profit = totalRevenue - totalCost;
    const margin = retail > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0;

    return {
      wholesaleCost,
      retail,
      quantity: qty,
      totalCost,
      totalRevenue,
      profit,
      margin,
    };
  }, [currentTier, retailPrice, quantity]);

  // Check if product is already in store
  const isInStore = useMemo(() => {
    if (!product || !mounted) return false;
    try {
      const existing = JSON.parse(
        localStorage.getItem("resellerProductListings") || "[]"
      );
      return existing.some(
        (item) =>
          item.productId === product.id && item.resellerId === currentResellerId
      );
    } catch {
      return false;
    }
  }, [product, currentResellerId, mounted]);

  const handleAddToStore = () => {
    if (!product) return;

    const qty = Number(quantity) || 0;

    if (qty < product.moq) {
      setQuantityError(`Minimum order quantity is ${product.moq} units`);
      return;
    }

    if (qty > product.stockCount) {
      setQuantityError(`Only ${product.stockCount} units available`);
      return;
    }

    if (quantityError) {
      return;
    }

    const reseller = sellers.find((s) => s.id === currentResellerId);
    const resellerName = reseller?.name || "Reseller";

    const newListing = {
      id: `rpl-${Date.now()}`,
      resellerId: currentResellerId,
      resellerName: resellerName,
      productId: product.id,
      productName: product.name,
      wholesalerId: product.sellerId,
      wholesalerProductId: product.id,
      quantity: qty,
      addedAt: new Date().toISOString(),
      status: "active",
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("resellerProductListings") || "[]"
      );
      const updated = [...existing, newListing];
      localStorage.setItem("resellerProductListings", JSON.stringify(updated));

      alert(
        `✅ Successfully added ${qty} unit(s) of "${product.name}" to your store!`
      );
      router.push("/reseller/dashboard/store");
    } catch (error) {
      console.error("Error saving product listing:", error);
      alert("❌ Error adding product. Please try again.");
    }
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-3 text-red-900">Product not found</h1>
            <p className="text-red-700 mb-6">
              We couldn't find the product you're looking for. It may have been removed or the link is incorrect.
            </p>
            <Button onClick={() => router.push("/reseller/dashboard/store/browse")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/reseller/dashboard"
              className="hover:text-[#F36E16] transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/reseller/dashboard/store"
              className="hover:text-[#F36E16] transition-colors"
            >
              Store
            </Link>
            <span>/</span>
            <Link
              href="/reseller/dashboard/store/browse"
              className="hover:text-[#F36E16] transition-colors"
            >
              Browse
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="relative bg-gradient-to-br from-gray-50 to-white flex items-center justify-center h-[550px] w-full group">
                  <img
                    src={product.images[selectedImage] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white text-lg px-6 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-2">
              <button
                className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-[#F36E16] disabled:opacity-50 transition-all"
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                disabled={selectedImage === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 overflow-hidden flex-1">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === index
                        ? "border-[#F36E16] ring-2 ring-orange-200 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || product.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  </button>
                ))}
              </div>

              <button
                className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-[#F36E16] disabled:opacity-50 transition-all"
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
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="outline" className="text-sm">{product.category}</Badge>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Out of Stock
                  </Badge>
                )}
                {product.rating && (
                  <Badge variant="outline" className="text-yellow-600">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400" />
                    {product.rating} ({product.reviewCount || 0})
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="space-y-1 text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="font-medium">SKU:</span> {product.id}
                </p>
                {product.brand && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                )}
              </div>
            </div>

            {/* Wholesale Pricing Tiers - Now Clickable! */}
            <Card className="shadow-lg border-2 border-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-[#F36E16]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Wholesale Pricing Tiers</h2>
                    <p className="text-sm text-gray-600">Click a tier to select quantity range</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {product.tierPrices.map((tier, idx) => {
                    const isActive =
                      currentTier?.minQty === tier.minQty &&
                      currentTier?.maxQty === tier.maxQty;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTierSelect(tier)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isActive
                            ? "border-[#F36E16] bg-gradient-to-r from-orange-50 to-orange-100 shadow-md scale-[1.02]"
                            : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 text-lg">
                                {tier.label}
                              </span>
                              {tier.discount > 0 && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Save {tier.discount}%
                                </Badge>
                              )}
                              {isActive && (
                                <Badge className="bg-[#F36E16] text-white text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                            {isActive && (
                              <p className="text-xs text-[#F36E16] font-medium mt-1">
                                Current pricing tier for your quantity
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold text-[#F36E16]">
                              ${tier.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">per unit</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quantity Input Section */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-[#F36E16]" />
                  <h2 className="text-xl font-semibold">Order Quantity</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(Math.max(product.moq, (Number(quantity) || product.moq) - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:border-[#F36E16] hover:bg-orange-50 transition-all"
                        disabled={!product.inStock}
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        min={product.moq}
                        max={product.stockCount}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value) || product.moq;
                          handleQuantityChange(Math.max(product.moq, val));
                        }}
                        className="flex-1 text-center text-lg font-semibold"
                        disabled={!product.inStock}
                      />
                      <button
                        onClick={() => handleQuantityChange(Math.min(product.stockCount, (Number(quantity) || product.moq) + 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:border-[#F36E16] hover:bg-orange-50 transition-all"
                        disabled={!product.inStock || (Number(quantity) || 0) >= product.stockCount}
                      >
                        +
                      </button>
                    </div>
                    {quantityError && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {quantityError}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>MOQ: {product.moq} units</span>
                      <span>•</span>
                      <span>Available: {product.stockCount} units</span>
                    </div>
                  </div>

                  {currentTier && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-600 text-sm">Total Cost:</span>
                          <p className="text-xs text-gray-500 mt-1">
                            {quantity} units × ${currentTier.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-3xl font-bold text-[#F36E16]">
                          ${((currentTier.price * (Number(quantity) || product.moq))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profit Calculator */}
            <Card className="shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Profit Calculator</h2>
                    <p className="text-xs text-gray-600">Calculate your profit margin</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Retail Price (per unit)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter your selling price"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(e.target.value)}
                      className="w-full text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      What price will you sell this to your customers?
                    </p>
                  </div>

                  {profitCalculation ? (
                    <div className="bg-white rounded-lg p-5 space-y-3 border-2 border-green-200 shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Wholesale Cost:</span>
                        <span className="font-semibold">
                          ${profitCalculation.wholesaleCost.toFixed(2)} × {profitCalculation.quantity} = $
                          {profitCalculation.totalCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Your Revenue:</span>
                        <span className="font-semibold">
                          ${profitCalculation.retail.toFixed(2)} × {profitCalculation.quantity} = $
                          {profitCalculation.totalRevenue.toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900 text-lg">Your Profit:</span>
                          <span className="text-3xl font-bold text-green-600">
                            ${profitCalculation.profit.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Profit Margin:</span>
                          <span className="text-xl font-bold text-green-600">
                            {profitCalculation.margin}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : retailPrice && Number(retailPrice) <= (currentTier?.price || 0) ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Retail price must be higher than wholesale cost (${currentTier?.price.toFixed(2)})
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Available Stock</p>
                      <p className="text-lg font-bold text-gray-900">{product.stockCount} units</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Lead Time</p>
                      <p className="text-lg font-bold text-gray-900">{product.leadTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add to Store Section */}
            <Card className="shadow-lg border-2 border-[#F36E16]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Store className="h-5 w-5 text-[#F36E16]" />
                  </div>
                  <h2 className="text-xl font-semibold">Add to Store</h2>
                </div>
                
                {isInStore ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-900">Already in Your Store</p>
                    <Link href="/reseller/dashboard/store">
                      <Button variant="outline" className="mt-3">
                        View in Store
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-[#F36E16] hover:bg-[#e06212] h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={handleAddToStore}
                    disabled={!product.inStock || quantityError || (Number(quantity) || 0) < product.moq || (Number(quantity) || 0) > product.stockCount}
                  >
                    <Store className="h-5 w-5 mr-2" />
                    Add {quantity || product.moq} Units to Store
                  </Button>
                )}

                {!product.inStock && (
                  <p className="text-sm text-red-600 mt-3 text-center flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    This product is currently out of stock
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Tabs defaultValue="specifications" className="w-full">
                <TabsList className="w-full justify-start border-b bg-gray-50 rounded-none p-0">
                  <TabsTrigger
                    value="specifications"
                    className="px-6 py-4 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-medium"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipping"
                    className="px-6 py-4 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-medium"
                  >
                    Shipping & Returns
                  </TabsTrigger>
                  <TabsTrigger
                    value="wholesaler"
                    className="px-6 py-4 border-b-2 border-transparent data-[state=active]:border-[#F36E16] data-[state=active]:text-[#F36E16] rounded-none font-medium"
                  >
                    Wholesaler Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="specifications" className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3">Product Description</h3>
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3">Key Features</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-4">Product Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-600 text-sm">Category:</span>
                          <p className="font-medium text-gray-900">{product.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Brand:</span>
                          <p className="font-medium text-gray-900">{product.brand || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">SKU:</span>
                          <p className="font-medium text-gray-900">{product.id}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Warranty:</span>
                          <p className="font-medium text-gray-900">{product.warranty}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Return Policy:</span>
                          <p className="font-medium text-gray-900">{product.returnPolicy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="p-8">
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">Shipping Information</h3>
                          <div className="space-y-2 text-gray-700">
                            <p><span className="font-semibold">Lead Time:</span> {product.leadTime}</p>
                            <p><span className="font-semibold">Processing:</span> Orders are typically processed within 1-2 business days</p>
                            <p><span className="font-semibold">Tracking:</span> You will receive tracking information once your order ships</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">Return Policy</h3>
                          <p className="text-gray-700">{product.returnPolicy}. Unopened items in original packaging can be returned within the specified period.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="wholesaler" className="p-8">
                  {wholesaler ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Wholesaler Details</h3>
                            <div className="space-y-3">
                              <div>
                                <span className="text-gray-600 text-sm">Name:</span>
                                <p className="font-semibold text-gray-900 text-lg">{wholesaler.name}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 text-sm">Type:</span>
                                <p className="font-medium text-gray-900 capitalize">{wholesaler.type}</p>
                              </div>
                              <Link
                                href={`/wholesaler/${wholesaler.slug}`}
                                className="inline-block mt-4"
                              >
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                  <Users className="h-4 w-4 mr-2" />
                                  View Wholesaler Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Wholesaler information not available.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
