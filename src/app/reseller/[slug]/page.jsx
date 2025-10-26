"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import productsData from "@/lib/data/products.json";
import ProductCard from "@/components/store/ProductCard";
import StoreHero from "@/components/reseller/StoreHero";
import StoreNavbar from "@/components/reseller/StoreNavbar";
import StoreAbout from "@/components/reseller/StoreAbout";
import StoreFilters from "@/components/store/StoreFilters";
import StoreFeatures from "@/components/reseller/StoreFeatures";
import StoreFaq from "@/components/reseller/StoreFaq";
import Storereview from "@/components/reseller/Storereview";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/store/ChatPanel";

export default function ResellerStorePage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((s) => s.slug === sellerSlug);
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

  const [chatOpen, setChatOpen] = useState(false);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Reseller store not found</h1>
          <p className="text-gray-600">We couldn't find the reseller you are looking for.</p>
        </div>
      </div>
    );
  }

  const basePath = `/reseller/${seller.slug}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Modular sections */}
        <StoreHero seller={seller} />
        <StoreNavbar basePath={basePath} />
        <section id="products">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <Button className="bg-[#F36E16] hover:bg-[#e06212]" onClick={() => setChatOpen(true)}>
              CHAT NOW
            </Button>
          </div>
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

        <div className="mt-8">
          <StoreFaq seller={seller} />
        </div>

        <div className="mt-6">
          <StoreAbout seller={seller} />
        </div>
        <div className="mt-8">
          <StoreFeatures />
        </div>
        <div className="mt-8">
          <Storereview />
        </div>

        <ChatPanel open={chatOpen} onOpenChange={setChatOpen} seller={seller} />
      </div>
    </div>
  );
}