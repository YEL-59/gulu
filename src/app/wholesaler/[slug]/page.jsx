"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import productsData from "@/lib/data/products.json";
import ProductCard from "@/components/store/ProductCard";
import StoreHero from "@/components/wholesaler/StoreHero";
import StoreNavbar from "@/components/wholesaler/StoreNavbar";
import StoreAbout from "@/components/wholesaler/StoreAbout";
import StoreFilters from "@/components/store/StoreFilters";
import StoreFeatures from "@/components/wholesaler/StoreFeatures";
import StoreFaq from "@/components/wholesaler/StoreFaq";
import Storereview from "@/components/wholesaler/Storereview";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/store/ChatPanel";

export default function WholesalerStorePage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((x) => x.slug === sellerSlug && x.type === "wholesaler");
    if (s) return s;
    const defaultWh = sellers.find((x) => x.isDefault && x.type === "wholesaler");
    return defaultWh || null;
  }, [sellerSlug]);

  const sellerProducts = useMemo(() => {
    if (!seller) return [];
    const byId = productsData.filter((p) => p.sellerId && p.sellerId === seller.id);
    if (byId.length) return byId;

    const sellerName = (seller.name || "").toLowerCase();
    const aliases = Array.isArray(seller.aliases) ? seller.aliases.map((a) => (a || "").toLowerCase()) : [];

    const byBrandOrAlias = productsData.filter((p) => {
      const brand = (p.brand || "").toLowerCase();
      return brand === sellerName || aliases.includes(brand);
    });
    if (byBrandOrAlias.length) return byBrandOrAlias;

    // Fallback: show a curated slice so every wholesaler page looks populated
    return productsData.slice(0, 12);
  }, [seller]);

  const [visibleProducts, setVisibleProducts] = useState([]);
  useEffect(() => {
    setVisibleProducts(sellerProducts);
  }, [sellerProducts]);

  const [chatOpen, setChatOpen] = useState(false);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Wholesaler not found</h1>
          <p className="text-gray-600">No default wholesaler configured.</p>
        </div>
      </div>
    );
  }

  const basePath = `/wholesaler/${seller.slug}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <StoreHero seller={seller} />
        <StoreNavbar basePath={basePath} />

        <section className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store</h1>
          <p className="text-gray-700">Browse catalog from {seller.name}.</p>
          <div className="mt-4">
            <Button className="bg-[#F36E16] hover:bg-[#e06212]" onClick={() => setChatOpen(true)}>
              CHAT NOW
            </Button>
          </div>
        </section>

        <section className="mb-8">
          <StoreFilters allProducts={sellerProducts} onChange={setVisibleProducts} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <StoreFaq seller={seller} basePath={basePath} />
            <StoreAbout seller={seller} />
          </div>
          <div>
            <StoreFeatures />
          </div>
        </div>
        <div className="mt-8">
          <Storereview />
        </div>

        <ChatPanel open={chatOpen} onOpenChange={setChatOpen} seller={seller} />
      </div>
    </div>
  );
}