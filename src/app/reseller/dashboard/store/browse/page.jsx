"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import productsData from "@/lib/data/products.json";
import sellers from "@/lib/data/sellers.json";
import resellerProductListingsData from "@/lib/data/resellerProductListings.json";

export default function BrowseWholesalerProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Get added products for current reseller (in production, use actual reseller ID from session)
  const currentResellerId = "reseller-1"; // Mock reseller ID

  // Initialize with default data to avoid hydration mismatch
  const [productListings, setProductListings] = useState(resellerProductListingsData);

  // Load existing product listings from localStorage on client side only
  useEffect(() => {
    const loadProductListings = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('resellerProductListings');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.length > 0) {
              setProductListings(parsed);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Error loading product listings:', e);
      }
      // Keep default data if localStorage is empty or error
      setProductListings(resellerProductListingsData);
    };

    // Load on mount
    loadProductListings();

    // Reload listings when localStorage changes
    const handleStorageChange = () => {
      loadProductListings();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      const interval = setInterval(handleStorageChange, 1000);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  const addedProductIds = useMemo(() => {
    return new Set(
      productListings
        .filter(listing => listing.resellerId === currentResellerId && listing.status === "active")
        .map(listing => listing.productId)
    );
  }, [productListings, currentResellerId]);

  // Filter products from wholesalers only
  const wholesalerProducts = useMemo(() => {
    const wholesalerIds = sellers
      .filter((s) => s.type === "wholesaler")
      .map((s) => s.id);

    return productsData.filter((p) => {
      const matchesWholesaler = wholesalerIds.includes(p.sellerId);
      const matchesQuery = !query ||
        (p.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(query.toLowerCase()) ||
        (p.brand || "").toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;

      return matchesWholesaler && matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const categories = useMemo(() => {
    const cats = new Set(wholesalerProducts.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [wholesalerProducts]);

  const handleAddToStoreClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowQuantityDialog(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedProduct || quantity < 1) return;

    // Get reseller name (in production, get from session)
    const reseller = sellers.find(s => s.id === currentResellerId);
    const resellerName = reseller?.name || "Reseller";

    // Create new product listing
    const newListing = {
      id: `rpl-${Date.now()}`,
      resellerId: currentResellerId,
      resellerName: resellerName,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      wholesalerId: selectedProduct.sellerId,
      wholesalerProductId: selectedProduct.id,
      quantity: parseInt(quantity),
      addedAt: new Date().toISOString(),
      status: "active"
    };

    // Save to localStorage (in production, call API)
    try {
      const existing = productListings;
      const updated = [...existing, newListing];
      localStorage.setItem('resellerProductListings', JSON.stringify(updated));

      // Update state immediately
      setProductListings(updated);

      // Close dialog and reset
      setShowQuantityDialog(false);
      setSelectedProduct(null);
      setQuantity(1);

      alert(`Successfully added ${quantity} unit(s) of "${selectedProduct.name}" to your store!`);
    } catch (error) {
      console.error('Error saving product listing:', error);
      alert('Error adding product. Please try again.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Browse Wholesaler Products</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Browse and add products from approved wholesalers to your store
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {wholesalerProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {query || category !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No wholesaler products available at the moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wholesalerProducts.map((product) => {
            const isAdded = addedProductIds.has(product.id);
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image - Clickable to detail page */}
                  <Link href={`/reseller/dashboard/store/product/${product.id}`}>
                    <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                      {product.image || product.images ? (
                        <img
                          src={product.image || product.images}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div>
                      <Link
                        href={`/reseller/dashboard/store/product/${product.id}`}
                        className="hover:text-[#F36E16] transition-colors"
                      >
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {product.brand || "No brand"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                      {product.inStock ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#F36E16]">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Wholesale price</p>
                        {product.rating && (
                          <div className="text-xs sm:text-sm text-gray-600 mt-1">
                            ⭐ {product.rating} ({product.reviewCount || 0} reviews)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/reseller/dashboard/store/product/${product.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-xs sm:text-sm"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className={`flex-1 text-xs sm:text-sm ${isAdded
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-[#F36E16] hover:bg-[#e06212]"
                          }`}
                        onClick={() => handleAddToStoreClick(product)}
                        disabled={isAdded || !product.inStock}
                      >
                        {isAdded ? (
                          <>
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Added</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Quick Add</span>
                            <span className="sm:hidden">Add</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-blue-900 min-w-0">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Browse products from approved wholesalers</li>
                <li>Click "Add to Store" to add products to your store</li>
                <li>When you receive an order, you'll need to purchase the product from the wholesaler first</li>
                <li>After purchasing, you can ship to your customer and withdraw earnings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity Dialog */}
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add Product to Store</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Enter the quantity you want to add to your store
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
              <div>
                <Label className="text-xs sm:text-sm font-medium">Product</Label>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{selectedProduct.name}</p>
              </div>
              <div>
                <Label htmlFor="quantity" className="text-xs sm:text-sm">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many units do you want to list in your store?
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowQuantityDialog(false)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#F36E16] hover:bg-[#e06212] w-full sm:w-auto text-xs sm:text-sm"
              onClick={handleConfirmAdd}
            >
              Add to Store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

