"use client";

import Image from "next/image";

export default function StoreAbout({ seller }) {
  if (!seller) return null;

  const aboutText =
    seller.about ||
    "We are a verified reseller providing quality products and reliable service. Our mission is to help businesses source and resell trending items with confidence and speed.";
  const imageSrc =
    seller.aboutImage && seller.aboutImage.trim()
      ? seller.aboutImage
      : "/assets/home/girl.png";

  return (
    <section id="about" className="bg-[#EAF3FF] rounded-lg py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">About {seller.name}</h2>
          <p className="text-gray-700 leading-relaxed">
            {aboutText}
          </p>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">CHAT WITH US</button>
        </div>
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-sm bg-white">
          <Image
            src={imageSrc}
            alt={`About ${seller.name}`}
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}