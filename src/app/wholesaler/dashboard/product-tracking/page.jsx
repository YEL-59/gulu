"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Package, Users, TrendingUp, Eye } from "lucide-react";
import resellerProductListingsData from "@/lib/data/resellerProductListings.json";
import productsData from "@/lib/data/products.json";

export default function ProductTrackingPage() {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initialize with default data to avoid hydration mismatch
  const [listings, setListings] = useState(resellerProductListingsData);

  // Load product listings from localStorage on client side only
  useEffect(() => {
    const loadProductListings = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('resellerProductListings');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.length > 0) {
              setListings(parsed);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Error loading product listings:', e);
      }
      // Keep default data if localStorage is empty or error
      setListings(resellerProductListingsData);
    };

    // Load on mount
    loadProductListings();

    // Update listings when localStorage changes
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

  // Mock wholesaler ID (in production, get from session)
  const currentWholesalerId = "wholesaler-1";

  // Get products owned by this wholesaler
  const wholesalerProducts = useMemo(() => {
    return productsData.filter(p => p.sellerId === currentWholesalerId);
  }, []);

  // Group listings by product
  const productTracking = useMemo(() => {
    const tracking = new Map();

    listings
      .filter(listing => listing.wholesalerId === currentWholesalerId && listing.status === "active")
      .forEach(listing => {
        if (!tracking.has(listing.productId)) {
          const product = wholesalerProducts.find(p => p.id === listing.productId);
          tracking.set(listing.productId, {
            productId: listing.productId,
            productName: listing.productName,
            product: product,
            resellers: [],
            totalQuantity: 0,
            totalResellers: 0,
          });
        }

        const productTrack = tracking.get(listing.productId);
        productTrack.resellers.push({
          resellerId: listing.resellerId,
          resellerName: listing.resellerName,
          quantity: listing.quantity,
          addedAt: listing.addedAt,
        });
        productTrack.totalQuantity += listing.quantity;
        productTrack.totalResellers = productTrack.resellers.length;
      });

    return Array.from(tracking.values());
  }, [listings, wholesalerProducts]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!query) return productTracking;
    const q = query.toLowerCase();
    return productTracking.filter(
      track =>
        track.productName.toLowerCase().includes(q) ||
        track.resellers.some(r => r.resellerName.toLowerCase().includes(q))
    );
  }, [productTracking, query]);

  // Get summary stats
  const summaryStats = useMemo(() => {
    const totalProducts = productTracking.length;
    const totalResellers = new Set(
      productTracking.flatMap(track => track.resellers.map(r => r.resellerId))
    ).size;
    const totalQuantity = productTracking.reduce((sum, track) => sum + track.totalQuantity, 0);

    return { totalProducts, totalResellers, totalQuantity };
  }, [productTracking]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Product Tracking</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track which resellers have added your products to their stores
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products Listed</p>
                <p className="text-2xl font-bold mt-1">{summaryStats.totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Resellers</p>
                <p className="text-2xl font-bold mt-1">{summaryStats.totalResellers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Units Listed</p>
                <p className="text-2xl font-bold mt-1">{summaryStats.totalQuantity.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by product name or reseller name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products tracked yet
            </h3>
            <p className="text-gray-600">
              {query
                ? "No products match your search criteria"
                : "No resellers have added your products to their stores yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((track) => (
            <Card key={track.productId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{track.productName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Product ID: {track.productId}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Total Quantity</p>
                      <p className="text-xl font-bold text-[#F36E16]">
                        {track.totalQuantity.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {track.totalResellers} Reseller{track.totalResellers !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reseller Name</TableHead>
                        <TableHead>Reseller ID</TableHead>
                        <TableHead>Quantity Listed</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {track.resellers.map((reseller, idx) => (
                        <TableRow key={`${reseller.resellerId}-${idx}`}>
                          <TableCell className="font-medium">
                            {reseller.resellerName}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {reseller.resellerId}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50">
                              {reseller.quantity} units
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(reseller.addedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">How Product Tracking Works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>When a reseller adds your products to their store, it appears here</li>
                <li>You can see which resellers have listed your products and in what quantities</li>
                <li>Track the total number of units being resold across all resellers</li>
                <li>Monitor when products were added to reseller stores</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

