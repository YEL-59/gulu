"use client";
import { useEffect, useMemo, useState } from "react";

export default function StoreFilters({ allProducts = [], onChange }) {
  const prices = useMemo(() => {
    const vals = allProducts.map((p) => Number(p.price) || 0);
    return {
      min: vals.length ? Math.min(...vals) : 0,
      max: vals.length ? Math.max(...vals) : 0,
    };
  }, [allProducts]);

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => (p.category || "misc").toLowerCase()));
    return ["all", ...Array.from(set)];
  }, [allProducts]);

  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState(prices.max);

  useEffect(() => {
    setPrice(prices.max);
  }, [prices.max]);

  useEffect(() => {
    const filtered = allProducts.filter((p) => {
      const inCat = category === "all" || (p.category || "misc").toLowerCase() === category;
      const inPrice = (Number(p.price) || 0) <= (Number(price) || 0);
      return inCat && inPrice;
    });
    onChange?.(filtered);
  }, [category, price, allProducts, onChange]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">Category</span>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 w-full sm:w-auto">
          <span className="font-medium">Max Price</span>
          <input
            type="range"
            min={prices.min}
            max={prices.max || 0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full sm:w-64"
          />
          <span className="ml-2 text-gray-900 font-semibold">${price}</span>
        </label>
      </div>
    </div>
  );
}