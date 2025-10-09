'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([
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
            inStock: false
        }
    ])

    const removeFromWishlist = (productId) => {
        setWishlistItems(items => items.filter(item => item.id !== productId))
    }

    const addToCart = (product) => {
        // Handle add to cart logic
        console.log('Added to cart:', product)
    }

    const moveAllToCart = () => {
        const inStockItems = wishlistItems.filter(item => item.inStock)
        console.log('Moving all to cart:', inStockItems)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
                    <p className="text-gray-600">{wishlistItems.length} items in your wishlist</p>
                </div>

                {wishlistItems.some(item => item.inStock) && (
                    <Button onClick={moveAllToCart} className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Move All to Cart
                    </Button>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-6">Save items you love for later by clicking the heart icon.</p>
                    <Button>Start Shopping</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="relative group">
                            <ProductCard product={product} />

                            {/* Wishlist Actions */}
                            <div className="absolute top-2 right-2 flex flex-col space-y-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="bg-white/80 hover:bg-white"
                                    onClick={() => removeFromWishlist(product.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>

                            {/* Add to Cart Button */}
                            {product.inStock && (
                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        onClick={() => addToCart(product)}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </div>
                            )}

                            {/* Out of Stock Overlay */}
                            {!product.inStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                    <span className="bg-white px-3 py-1 rounded text-sm font-medium">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Recently Viewed */}
            {wishlistItems.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">You might also like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Add recently viewed products here */}
                    </div>
                </div>
            )}
        </div>
    )
}


