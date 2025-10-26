"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import productsData from "@/lib/data/products.json";
import ProductCard from "@/components/store/ProductCard";
import StoreNavbar from "@/components/wholesaler/StoreNavbar";
import StoreFilters from "@/components/store/StoreFilters";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/store/ChatPanel";

export default function WholesalerProductsPage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((x) => x.slug === sellerSlug && x.type === "wholesaler");
    if (s) return s;
    const def = sellers.find((x) => x.isDefault && x.type === "wholesaler");
    return def || null;
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

    return productsData.slice(0, 24);
  }, [seller]);

  const [visibleProducts, setVisibleProducts] = useState([]);
  useEffect(() => { setVisibleProducts(sellerProducts); }, [sellerProducts]);

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
        <StoreNavbar basePath={basePath} />
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-700">Browse catalog from {seller.name}.</p>
          <div className="mt-4">
            <Button className="bg-[#F36E16] hover:bg-[#e06212]" onClick={() => setChatOpen(true)}>
              CHAT NOW
            </Button>
          </div>
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

        <ChatPanel open={chatOpen} onOpenChange={setChatOpen} seller={seller} />
      </div>
    </div>
  );
}