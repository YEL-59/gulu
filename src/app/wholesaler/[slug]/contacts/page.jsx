"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import StoreNavbar from "@/components/wholesaler/StoreNavbar";

export default function WholesalerContactsPage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((x) => x.slug === sellerSlug);
    return s && s.type === "wholesaler" ? s : null;
  }, [sellerSlug]);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Wholesaler not found</h1>
        </div>
      </div>
    );
  }

  const basePath = `/wholesaler/${seller.slug}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <StoreNavbar basePath={basePath} />
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-700 mb-4">Get in touch with {seller.name}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div><span className="font-semibold">Location:</span> {seller.location}</div>
              <div><span className="font-semibold">Rating:</span> {seller.rating}</div>
              <div><span className="font-semibold">Followers:</span> {seller.followers}</div>
            </div>
            <div className="space-y-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Chat Now</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md">Send Email</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}