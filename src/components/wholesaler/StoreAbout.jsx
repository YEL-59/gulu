"use client";
export default function StoreAbout({ seller }) {
  if (!seller) return null;
  return (
    <section id="about" className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">About {seller.name}</h2>
      <p className="text-gray-700">{seller.about}</p>
    </section>
  );
}