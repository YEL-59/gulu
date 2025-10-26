"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import productsData from "@/lib/data/products.json";
import ProductCard from "@/components/store/ProductCard";

export default function SellerStorePage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => sellers.find((s) => s.slug === sellerSlug) || null, [sellerSlug]);

  const sellerProducts = useMemo(() => {
    if (!seller) return [];
    // Filter by brand name matching seller name (simple heuristic). Can be replaced with sellerId later.
    return productsData.filter((p) => (p.brand || "").toLowerCase() === seller.name.toLowerCase());
  }, [seller]);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Store not found</h1>
          <p className="text-gray-600">We couldn't find the seller you are looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold">
              {seller.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
              <div className="text-sm text-gray-600">{seller.location} • {seller.type}</div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-700">
              <div>Rating: <span className="font-semibold">{seller.rating}</span></div>
              <div>Followers: <span className="font-semibold">{seller.followers}</span></div>
              <div>Products: <span className="font-semibold">{sellerProducts.length}</span></div>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{seller.about}</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {sellerProducts.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-lg border text-center text-gray-600">
              This seller has no listed products yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}