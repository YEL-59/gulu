'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Share2, Star, Truck, RotateCcw } from 'lucide-react'
import { useParams } from 'next/navigation'
import productsData from '@/lib/data/products.json'
import Breadcrumb from '@/components/common/Breadcrumb'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function ProductPage() {
    const params = useParams()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const product = useMemo(() => {
        const idOrSlug = params?.slug?.toString() || ''
        const found = productsData.find(p => p.id === idOrSlug) || productsData.find(p => slugify(p.name) === idOrSlug)
        if (!found) return null
        const tierBase = found.price
        const tiers = [
            { label: '1 - 49 Pieces', price: tierBase },
            { label: '50 - 99 Pieces', price: Math.round(tierBase * 0.75 * 100) / 100 },
            { label: '100+ Pieces', price: Math.round(tierBase * 0.65 * 100) / 100 },
        ]
        return {
            ...found,
            images: [found.image, found.image, found.image],
            description: `${found.name} by ${found.brand}. High-quality ${found.category} product with excellent reviews.`,
            features: (found.tags || []).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
            sizes: ['Standard'],
            colors: ['Space Gray', 'Black', 'White'],
            stockCount: found.inStock ? 99 : 0,
            tierPrices: tiers,
        }
    }, [params])

    const addToCart = () => {
        // Handle add to cart logic
        console.log('Added to cart:', { product, quantity, selectedSize, selectedColor })
    }

    const addToWishlist = () => {
        // Handle add to wishlist logic
        console.log('Added to wishlist:', product)
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white border rounded-lg p-8 text-center">
                    <h1 className="text-2xl font-semibold mb-3">Product not found</h1>
                    <p className="text-gray-600">We couldn’t find the product you’re looking for.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb className="mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="bg-white border rounded-lg overflow-hidden p-6 flex items-center justify-center">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-[420px] object-contain"
                        />
                    </div>
                    <div className="flex gap-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-16 h-16 rounded-lg overflow-hidden border ${selectedImage === index ? 'border-accent-500 ring-2 ring-accent-200' : 'border-gray-200'}`}
                            >
                                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain bg-[#F5F5F5]" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            <span className="inline-block h-6 w-6 rounded-full bg-pink-400 text-white flex items-center justify-center text-xs">B</span>
                            Shenzhen Feitian Technology Co., Ltd.
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                            <span className="text-xs text-gray-600">{product.rating.toFixed(1)} Star Rating ({product.reviewCount} user feedback)</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-semibold leading-snug">{product.name} – {product.brand}</h1>
                        <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
                            <span>SKU: <span className="text-gray-800">{product.id}</span></span>
                            <span>Brand: <span className="text-gray-800">{product.brand}</span></span>
                            <span>Category: <span className="text-gray-800">{product.category}</span></span>
                            <span>Availability: <span className="text-green-600 font-medium">{product.inStock ? 'In Stock' : 'Out of Stock'}</span></span>
                        </div>
                        {/* Tier pricing (3 boxes aligned like screenshot) */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {product.tierPrices.map((t, idx) => (
                                <div key={idx} className="rounded-md border border-gray-200 bg-white px-4 py-3 text-center">
                                    <div className="text-[11px] md:text-xs text-gray-600">{t.label}</div>
                                    <div className="text-lg md:text-2xl font-semibold">${t.price}</div>
                                </div>
                            ))}
                        </div>
                        {/* Sample price bar */}
                        <div className="flex items-center justify-between rounded-md border border-blue-200 bg-[#EEF5FF] px-3 py-2 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="inline-block h-5 w-5 rounded-full bg-blue-500/20 border border-blue-300" />
                                <span className="text-gray-800">Sample Price: ${product.price}</span>
                            </div>
                            <Button className="bg-[#2F6FED] hover:bg-[#1e57c6] h-8 px-3 text-sm rounded">Get a Sample</Button>
                        </div>
                    </div>

                    <p className="text-gray-700">{product.description}</p>

                    {/* Size Selection */}
                    <div>
                        <h3 className="font-semibold mb-2">Size</h3>
                        <div className="flex space-x-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 border rounded ${selectedSize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <h3 className="font-semibold mb-2">Color</h3>
                        <div className="flex items-center gap-3">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    aria-label={color}
                                    className={`h-5 w-5 md:h-6 md:w-6 rounded-full border ${selectedColor === color ? 'border-[#F36E16] ring-2 ring-[#F36E16]/20' : 'border-gray-300'}`}
                                    style={{ backgroundColor: color.toLowerCase().includes('gray') ? '#c7c7c7' : color.toLowerCase() }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <h3 className="font-semibold mb-2">Quantity</h3>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </Button>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 h-9 text-center"
                                min="1"
                                max={product.stockCount}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                            >
                                +
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{product.stockCount} in stock</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={addToCart} className="px-6 h-10 bg-[#F36E16] hover:bg-[#e06212]">ADD TO CART</Button>
                            <Button variant="outline" className="px-6 h-10 border-[#F36E16] text-[#F36E16] hover:bg-[#FFF2E9]">BUY NOW</Button>
                            <Button variant="outline" className="px-6 h-10 border-[#2F6FED] text-[#2F6FED] hover:bg-[#EEF5FF]">CHAT NOW</Button>
                            <Button variant="ghost" onClick={addToWishlist} className="px-4 h-10">
                                <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" className="px-4 h-10">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-xs text-gray-500">Share product:</div>
                    </div>

                    {/* Features */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-4">Key Features</h3>
                            <ul className="space-y-2">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Delivery & Assurance */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border rounded p-3">
                            <div className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-accent-500" />
                                <div>
                                    <div className="text-sm font-medium">Free Delivery</div>
                                    <div className="text-xs text-gray-600">Enjoy free delivery</div>
                                </div>
                            </div>
                        </div>
                        <div className="border rounded p-3">
                            <div className="flex items-center gap-2">
                                <RotateCcw className="h-5 w-5 text-orange-500" />
                                <div>
                                    <div className="text-sm font-medium">Return Delivery</div>
                                    <div className="text-xs text-gray-600">Free 30 Days Delivery Returns</div>
                                </div>
                            </div>
                        </div>
                        <div className="border rounded p-3">
                            <div className="text-sm font-medium">100% Guarantee Safe Checkout</div>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="h-5 w-8 bg-gray-200 rounded" />
                                <span className="h-5 w-8 bg-gray-200 rounded" />
                                <span className="h-5 w-8 bg-gray-200 rounded" />
                                <span className="h-5 w-8 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <Tabs defaultValue="description">
                    <TabsList className="gap-2 border-b border-gray-200 pb-2">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="info">Additional information</TabsTrigger>
                        <TabsTrigger value="spec">Specification</TabsTrigger>
                        <TabsTrigger value="review">Review</TabsTrigger>
                    </TabsList>
                    <div className="mt-4 border rounded-lg bg-white">
                        <TabsContent value="description" className="p-6 text-gray-700">
                            {product.description}
                        </TabsContent>
                        <TabsContent value="info" className="p-6 text-gray-700">
                            Brand: {product.brand} · Category: {product.category} · SKU: {product.id}
                        </TabsContent>
                        <TabsContent value="spec" className="p-6 text-gray-700">
                            <ul className="list-disc ml-6 space-y-1">
                                {product.features.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </TabsContent>
                        <TabsContent value="review" className="p-6 text-gray-700">
                            Rated {product.rating} out of 5 based on {product.reviewCount} reviews.
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

function slugify(str) {
    return str
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}




