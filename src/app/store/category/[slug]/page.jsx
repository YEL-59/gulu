"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/store/ProductCard";
import { ArrowRight, Filter, Grid, List } from "lucide-react";
import { useParams } from "next/navigation";
import Pagination from "@/components/ui/pagination";
import productsData from "@/lib/data/products.json";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function CategoryPage() {
  const params = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedCategory, setSelectedCategory] =
    useState("Electronic Devices");
  const [selectedPriceBand, setSelectedPriceBand] = useState("all");
  const [filters, setFilters] = useState({
    brand: [],
    tags: [],
  });

  const categoryOptions = [
    "Electronic Devices",
    "Computer & Laptop",
    "Computer Accessories",
    "Smartphone",
    "Headphone",
    "Mobile Accessories",
    "Gaming Console",
    "Camera & Photo",
    "TV & Home Appliances",
    "Watches & Accessories",
    "GPS & Navigation",
    "Wearable Technology",
  ];

  const priceBands = [
    { label: "All Price", value: "all", range: [0, 100000] },
    { label: "Under $20", value: "under20", range: [0, 20] },
    { label: "$30 to $50", value: "30to50", range: [30, 50] },
    { label: "$50 to $100", value: "50to100", range: [50, 100] },
    { label: "$100 to $500", value: "100to500", range: [100, 500] },
    { label: "$500 to $1,000", value: "500to1000", range: [500, 1000] },
    { label: "$1,000 to $10,000", value: "1000to10000", range: [1000, 10000] },
  ];

  const brandOptions = [
    "Apple",
    "Microsoft",
    "Google",
    "Samsung",
    "HP",
    "Xiaomi",
    "Symphony",
    "Sony",
    "Panasonic",
    "Intel",
    "One Plus",
    "Philips",
    "Toshiba",
  ];

  const popularTags = [
    "Game",
    "Iphone",
    "TV",
    "Asus Laptop",
    "Macbook",
    "SSD",
    "Graphics Card",
    "Power Bank",
    "Smart TV",
    "Speaker",
    "Tablet",
    "Microwave",
    "Samsung",
  ];

  // Sample category data - replace with real data fetching
  const category = {
    name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
    description: `Shop the best ${params.slug} products with great deals and fast shipping.`,
    productCount: 156,
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    // Handle sorting logic
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory("Electronic Devices");
    setSelectedPriceBand("all");
    setMinPrice(0);
    setMaxPrice(2000);
    setFilters({ brand: [], tags: [] });
    setCurrentPage(1);
  };

  const bandRange = priceBands.find((b) => b.value === selectedPriceBand)
    ?.range || [0, 100000];
  const appliedMin = Math.min(minPrice || 0, bandRange[0]);
  const appliedMax = Math.max(maxPrice || bandRange[1], bandRange[1]);

  // Filter by category slug from params if available in dataset
  const slugCategory = params?.slug?.toLowerCase?.() || "";
  const datasetCategories = useMemo(() => {
    const set = new Set();
    productsData.forEach((p) => {
      const c = (p.category || "").toLowerCase();
      if (c) set.add(c);
    });
    return set;
  }, []);

  const filteredProducts = productsData.filter((p) => {
    const pCat = (p.category || "").toLowerCase();
    const shouldFilterByCategory =
      slugCategory && datasetCategories.has(slugCategory);
    const categoryMatch = shouldFilterByCategory ? pCat === slugCategory : true;
    const withinPrice = p.price >= appliedMin && p.price <= appliedMax;
    const brandOk =
      filters.brand.length === 0 || filters.brand.includes(p.brand);
    const tagOk =
      filters.tags.length === 0 ||
      (p.tags && filters.tags.some((t) => p.tags.includes(t)));
    return categoryMatch && withinPrice && brandOk && tagOk;
  });

  // Sort products
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        arr.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      default:
        break; // featured: keep original order
    }
    return arr;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const visibleProducts = sortedProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4" />
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          {category.productCount} products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h3 className="font-semibold mb-4 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </h3>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {categoryOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      className="mr-2 accent-accent-500"
                      checked={selectedCategory === option}
                      onChange={() => {
                        setSelectedCategory(option);
                        setCurrentPage(1);
                      }}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={10000}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(parseInt(e.target.value) || 0);
                    setCurrentPage(1);
                  }}
                  className="w-full accent-accent-500"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(parseInt(e.target.value) || 0);
                      setCurrentPage(1);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(parseInt(e.target.value) || 0);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {priceBands.map((b) => (
                  <label key={b.value} className="flex items-center">
                    <input
                      type="radio"
                      name="price-band"
                      className="mr-2 accent-accent-500"
                      checked={selectedPriceBand === b.value}
                      onChange={() => {
                        setSelectedPriceBand(b.value);
                        setCurrentPage(1);
                      }}
                    />
                    <span className="text-sm">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Brands */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Popular Brands</h4>
              <div className="grid grid-cols-2 gap-2">
                {brandOptions.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 accent-accent-500"
                      checked={filters.brand.includes(brand)}
                      onChange={() => handleFilterChange("brand", brand)}
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Tag */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Popular Tag</h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleFilterChange("tags", tag)}
                    className={`${
                      filters.tags.includes(tag)
                        ? "bg-accent-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    } px-3 py-1 rounded text-xs`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#E7F1FF] rounded-2xl p-8 text-white h-full flex flex-col justify-between items-center">
              <div className="text-center">
                <h5 className="text-[#F36E16]">COMPUTER & ACCESSORIES</h5>
                <h3 className="text-4xl font-bold text-black py-2">
                  40% Discount
                </h3>
                <p className="text-lg mb-4 font-normal text-black">
                  For all ellectronics products
                </p>
                <div>
                  <p className="text-lg font-normal text-black">
                    Offers ends in:
                  </p>
                  <Button className="bg-[#FEF1E8] inline text-black">
                    ENDS OF WINTER
                  </Button>
                </div>

                <Button className="bg-accent-500  text-white hover:bg-gray-100 px-10 py-5 mt-10">
                  Shop Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div>
                <img
                  src="/assets/home/product7.png"
                  alt="Desktop Computer"
                  className="w-full h-[100%] object-contain mb-4"
                />
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-5"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
              className="py-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
