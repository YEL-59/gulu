import { Button } from '@/components/ui/button'
import ProductCard from '@/components/store/ProductCard'
import { ArrowRight } from 'lucide-react'

export default function FeaturedProducts() {
    const featuredProducts = [
        {
            id: 5,
            name: 'Samsung Galaxy Tab S9',
            price: 799,
            originalPrice: 899,
            rating: 4.7,
            reviewCount: 456,
            image: '/images/products/samsung-tab-s9.jpg',
            badge: 'New',
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
        },
        {
            id: 7,
            name: 'Xbox Wireless Controller',
            price: 59,
            originalPrice: 69,
            rating: 4.7,
            reviewCount: 892,
            image: '/images/products/xbox-controller.jpg',
            badge: 'Sale',
            inStock: true
        },
        {
            id: 8,
            name: 'Sony WH-1000XM5',
            price: 399,
            originalPrice: 449,
            rating: 4.9,
            reviewCount: 2341,
            image: '/images/products/sony-headphones.jpg',
            badge: 'Discount',
            inStock: true
        }
    ]

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-5 h-10 bg-green-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                    </div>

                    <Button variant="outline" className="flex items-center">
                        View All
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Discount Banner */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white h-full flex flex-col justify-center">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold mb-2">40% Discount</h3>
                                <p className="text-lg mb-4">On Desktop Computers</p>
                                <img
                                    src="/images/banners/desktop-computer.jpg"
                                    alt="Desktop Computer"
                                    className="w-full h-32 object-contain mb-4"
                                />
                                <Button className="bg-white text-orange-500 hover:bg-gray-100">
                                    Shop Now
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Products Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


