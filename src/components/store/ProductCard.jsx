'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'

export default function ProductCard({ product, viewMode = 'grid' }) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const toggleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsWishlisted(!isWishlisted)
    }

    const addToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // Handle add to cart logic
        console.log('Added to cart:', product)
    }

    if (viewMode === 'list') {
        return (
            <Link href={`/store/product/${product.id}`}>
                <div className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <div className="flex items-center mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">${product.price}</span>
                            {product.originalPrice && (
                                <span className="text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={toggleWishlist}>
                            <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
                        </Button>
                        <Button size="sm" onClick={addToCart}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link href={`/store/product/${product.id}`}>
            <div
                className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge */}
                    {product.badge && (
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${product.badge === 'New' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                            {product.badge}
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200"
                    >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                    </button>

                    {/* Quick Actions */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center space-x-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                        <Button size="sm" variant="secondary" onClick={addToCart}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                        <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white px-3 py-1 rounded text-sm font-medium">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}


