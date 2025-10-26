"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import productsData from "@/lib/data/products.json";
import ProductCard from "@/components/store/ProductCard";
import StoreNavbar from "@/components/reseller/StoreNavbar";
import StoreFilters from "@/components/store/StoreFilters";

export default function ResellerProductsPage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((x) => x.slug === sellerSlug);
    return s && s.type === "reseller" ? s : null;
  }, [sellerSlug]);

  const sellerProducts = useMemo(() => {
    if (!seller) return [];
    const byId = productsData.filter((p) => p.sellerId && p.sellerId === seller.id);
    if (byId.length) return byId;
    return productsData.filter(
      (p) => (p.brand || "").toLowerCase() === seller.name.toLowerCase()
    );
  }, [seller]);

  const [visibleProducts, setVisibleProducts] = useState([]);
  useEffect(() => { setVisibleProducts(sellerProducts); }, [sellerProducts]);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Reseller not found</h1>
        </div>
      </div>
    );
  }

  const basePath = `/reseller/${seller.slug}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <StoreNavbar basePath={basePath} />
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-700">Browse catalog from {seller.name}.</p>
        </section>
        <StoreFilters allProducts={sellerProducts} onChange={setVisibleProducts} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {visibleProducts.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-lg border text-center text-gray-600">
              No products match the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}