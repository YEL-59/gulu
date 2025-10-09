'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react'

export default function ProductPage({ params }) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')

    // Sample product data - replace with real data fetching
    const product = {
        id: params.slug,
        name: 'DJI Mavic 3 Pro',
        price: 1599,
        originalPrice: 1999,
        rating: 4.8,
        reviewCount: 1247,
        images: [
            '/images/products/dji-mavic-3-pro-1.jpg',
            '/images/products/dji-mavic-3-pro-2.jpg',
            '/images/products/dji-mavic-3-pro-3.jpg'
        ],
        description: 'Experience the world from above with the DJI Mavic 3 Pro. Capture stunning 5.1K video and 20MP photos with its Hasselblad camera.',
        features: [
            '5.1K Video Recording',
            '20MP Hasselblad Camera',
            '43-minute Flight Time',
            '15km Transmission Range',
            'Obstacle Avoidance'
        ],
        sizes: ['Standard', 'Fly More Combo'],
        colors: ['Gray', 'Black'],
        inStock: true,
        stockCount: 15
    }

    const addToCart = () => {
        // Handle add to cart logic
        console.log('Added to cart:', { product, quantity, selectedSize, selectedColor })
    }

    const addToWishlist = () => {
        // Handle add to wishlist logic
        console.log('Added to wishlist:', product)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                            >
                                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-3xl font-bold">${product.price}</span>
                            <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
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
                                    className={`px-4 py-2 border rounded ${selectedSize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <h3 className="font-semibold mb-2">Color</h3>
                        <div className="flex space-x-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 border rounded ${selectedColor === color ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                >
                                    {color}
                                </button>
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
                                className="w-20 text-center"
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
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <Button onClick={addToCart} className="flex-1" size="lg">
                                Add to Cart
                            </Button>
                            <Button variant="outline" onClick={addToWishlist}>
                                <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="outline">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
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

                    {/* Shipping Info */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <Truck className="h-6 w-6 text-blue-500 mb-2" />
                            <span className="text-sm">Free Shipping</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Shield className="h-6 w-6 text-green-500 mb-2" />
                            <span className="text-sm">2 Year Warranty</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <RotateCcw className="h-6 w-6 text-orange-500 mb-2" />
                            <span className="text-sm">30 Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



