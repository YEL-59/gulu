"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Star, Package, TrendingUp, DollarSign } from "lucide-react";
import productsData from "@/lib/data/products.json";
import AddDropshippingProductModal from "./AddDropshippingProductModal";

export default function DropshippingBrowse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock supplier products (in production, these would come from a suppliers API)
  // For now, we'll use products that don't belong to the current wholesaler
  const supplierProducts = useMemo(() => {
    // Filter products that could be from suppliers/manufacturers
    // In a real app, these would have a supplierId or manufacturerId
    return productsData.filter((p) => {
      const matchesSearch = 
        !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "all" || 
        p.category?.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(productsData.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, []);

  const handleAddProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {supplierProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No supplier products found</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supplierProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.png";
                      }}
                    />
                  ) : (
                    <Package className="h-16 w-16 text-gray-400" />
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">{product.brand || "Unknown Brand"}</p>
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {product.rating} ({product.reviewCount || 0})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#F36E16]">
                        ${Number(product.price || 0).toFixed(2)}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-gray-500 line-through">
                          ${Number(product.originalPrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={product.inStock ? "default" : "outline"}
                      className={product.inStock ? "bg-green-100 text-green-700" : ""}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  {/* Category */}
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}

                  {/* Add Button */}
                  <Button
                    className="w-full bg-[#F36E16] hover:bg-[#e06212] text-white"
                    onClick={() => handleAddProduct(product)}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <AddDropshippingProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
      />
    </div>
  );
}

