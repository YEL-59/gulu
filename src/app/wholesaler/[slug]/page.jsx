"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import productsData from "@/lib/data/products.json";
import ProductCard from "@/components/store/ProductCard";
import StoreHero from "@/components/wholesaler/StoreHero";
import StoreNavbar from "@/components/wholesaler/StoreNavbar";
import StoreAbout from "@/components/wholesaler/StoreAbout";
import StoreFeatures from "@/components/wholesaler/StoreFeatures";
import StoreFilters from "@/components/store/StoreFilters";

export default function WholesalerStorePage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((s) => s.slug === sellerSlug);
    return s && s.type === "wholesaler" ? s : null;
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
          <h1 className="text-2xl font-semibold mb-3">Wholesaler store not found</h1>
          <p className="text-gray-600">We couldn't find the wholesaler you are looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Modular store sections */}
        <StoreHero seller={seller} />
        <StoreNavbar />
        <StoreFeatures />
        <section id="products">
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
        </section>
        <div className="mt-6">
          <StoreAbout seller={seller} />
        </div>
      </div>
    </div>
  );
}