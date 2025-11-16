"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Pencil, Trash2, Search, TrendingUp, DollarSign, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DropshippedProductsTable() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    
    // Listen for storage changes (in production, use API polling or websockets)
    const interval = setInterval(loadProducts, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem("wholesalerDropshippedProducts");
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading dropshipped products:", error);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const handleDelete = (product) => {
    try {
      const updated = products.filter((p) => p.id !== product.id);
      localStorage.setItem(
        "wholesalerDropshippedProducts",
        JSON.stringify(updated)
      );
      setProducts(updated);
      setDeletingProduct(null);
      alert("Product removed successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to remove product");
    }
  };

  const toggleStatus = (product) => {
    try {
      const updated = products.map((p) =>
        p.id === product.id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      );
      localStorage.setItem(
        "wholesalerDropshippedProducts",
        JSON.stringify(updated)
      );
      setProducts(updated);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const totalProfit = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + (p.profitAmount || 0), 0);
  }, [filteredProducts]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">No dropshipped products yet</p>
        <p className="text-sm text-gray-500">
          Browse supplier products and add them to your store
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-blue-700">{filteredProducts.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 mb-1">Avg. Profit Margin</p>
          <p className="text-2xl font-bold text-green-700">
            {filteredProducts.length > 0
              ? (
                  filteredProducts.reduce((sum, p) => sum + (p.profitMargin || 0), 0) /
                  filteredProducts.length
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Total Potential Profit</p>
          <p className="text-2xl font-bold text-purple-700">
            ${totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Supplier Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      {product.category && (
                        <p className="text-xs text-gray-500">{product.category}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-900">{product.supplierName}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-gray-700">
                    ${product.supplierPrice?.toFixed(2) || "0.00"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-semibold text-[#F36E16]">
                    ${product.sellingPrice?.toFixed(2) || "0.00"}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">
                      ${product.profitAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {product.profitMargin?.toFixed(1) || "0.0"}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.status === "active" ? "default" : "outline"}
                    className={
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {product.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(product)}
                      title={product.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {product.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingProduct(product)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Product?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{deletingProduct?.productName}" from your dropshipped products? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(deletingProduct)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

