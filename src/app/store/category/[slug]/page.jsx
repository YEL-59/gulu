'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProductCard from '@/components/store/ProductCard'
import { Filter, Grid, List } from 'lucide-react'

export default function CategoryPage({ params }) {
    const [viewMode, setViewMode] = useState('grid')
    const [sortBy, setSortBy] = useState('featured')
    const [priceRange, setPriceRange] = useState([0, 2000])
    const [filters, setFilters] = useState({
        brand: [],
        color: [],
        size: []
    })

    // Sample category data - replace with real data fetching
    const category = {
        name: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
        description: `Shop the best ${params.slug} products with great deals and fast shipping.`,
        productCount: 156
    }

    // Sample products - replace with real data fetching
    const products = [
        {
            id: 1,
            name: 'DJI Mavic 3 Pro',
            price: 1599,
            originalPrice: 1999,
            rating: 4.8,
            reviewCount: 1247,
            image: '/images/products/dji-mavic-3-pro.jpg',
            badge: 'Sale',
            inStock: true
        },
        {
            id: 2,
            name: 'iPhone 15 Pro',
            price: 999,
            originalPrice: 1099,
            rating: 4.9,
            reviewCount: 2156,
            image: '/images/products/iphone-15-pro.jpg',
            badge: 'New',
            inStock: true
        },
        {
            id: 3,
            name: 'Apple Vision Pro',
            price: 3499,
            originalPrice: 3499,
            rating: 4.7,
            reviewCount: 892,
            image: '/images/products/apple-vision-pro.jpg',
            badge: 'New',
            inStock: true
        },
        {
            id: 4,
            name: 'HP OMEN 17t Laptop',
            price: 1299,
            originalPrice: 1599,
            rating: 4.6,
            reviewCount: 543,
            image: '/images/products/hp-omen-laptop.jpg',
            badge: 'Sale',
            inStock: true
        },
        {
            id: 5,
            name: 'JBL Tune 510BT',
            price: 49,
            originalPrice: 79,
            rating: 4.5,
            reviewCount: 1234,
            image: '/images/products/jbl-headphones.jpg',
            badge: 'Sale',
            inStock: true
        },
        {
            id: 6,
            name: 'Apple Watch Series 8',
            price: 399,
            originalPrice: 429,
            rating: 4.8,
            reviewCount: 1876,
            image: '/images/products/apple-watch.jpg',
            badge: 'Sale',
            inStock: true
        }
    ]

    const handleSortChange = (value) => {
        setSortBy(value)
        // Handle sorting logic
    }

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                <p className="text-gray-600">{category.description}</p>
                <p className="text-sm text-gray-500 mt-2">{category.productCount} products</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border rounded-lg p-6 sticky top-4">
                        <h3 className="font-semibold mb-4 flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </h3>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Price Range</h4>
                            <div className="space-y-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                                />
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Brand</h4>
                            <div className="space-y-2">
                                {['Apple', 'Samsung', 'Sony', 'DJI', 'HP'].map(brand => (
                                    <label key={brand} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            onChange={() => handleFilterChange('brand', brand)}
                                        />
                                        <span className="text-sm">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3">Color</h4>
                            <div className="space-y-2">
                                {['Black', 'White', 'Gray', 'Blue', 'Red'].map(color => (
                                    <label key={color} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            onChange={() => handleFilterChange('color', color)}
                                        />
                                        <span className="text-sm">{color}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button variant="outline" className="w-full">
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
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
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
                    <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                            : 'grid-cols-1'
                        }`}>
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg">
                            Load More Products
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}



