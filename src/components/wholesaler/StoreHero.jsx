"use client";
export default function StoreHero({ seller }) {
  if (!seller) return null;
  return (
    <section id="home" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
          {seller.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{seller.name}</h1>
          <p className="text-sm opacity-90">{seller.location} • Wholesaler</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>Rating: <span className="font-semibold">{seller.rating}</span></div>
          <div>Followers: <span className="font-semibold">{seller.followers}</span></div>
        </div>
      </div>
    </section>
  );
}