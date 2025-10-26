"use client";

import Image from "next/image";
import { CheckCircle, Clock, MapPin, MessageCircle, Mail } from "lucide-react";

export default function StoreHero({ seller }) {
  if (!seller) return null;

  const fallbackSrc = "/assets/home/sellerbg.png";
  const bannerSrc = seller.banner && seller.banner.trim() ? seller.banner : fallbackSrc;
  const membershipYears = seller.years || "1 year";

  return (
    <>
      {/* Top banner background */}
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
        <Image
          src={bannerSrc}
          alt={`${seller.name} banner`}
          fill
          sizes="100vw"
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      {/* Hero info bar */}
      <section
        id="home"
        className="bg-[#EAF3FF] text-gray-900 rounded-lg p-6 mb-6 border border-blue-50"
      >
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-800">
              {seller.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold">{seller.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  <CheckCircle className="h-4 w-4" /> Verified Reseller
                </span>
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <Clock className="h-4 w-4" /> {membershipYears}
                </span>
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <MapPin className="h-4 w-4" /> {seller.location}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" /> CHAT NOW
            </button>
            <button className="px-3 py-2 bg-white text-gray-900 border rounded-md inline-flex items-center gap-1">
              <Mail className="h-4 w-4" /> SEND EMAIL
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
