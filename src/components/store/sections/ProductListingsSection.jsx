import ProductCard from '@/components/store/ProductCard'

export default function ProductListingsSection() {
    const productLists = {
        bestSeller: [
            {
                id: 9,
                name: 'MacBook Pro M3',
                price: 1999,
                rating: 4.9,
                reviewCount: 3421,
                image: '/images/products/macbook-pro.jpg',
                inStock: true
            },
            {
                id: 10,
                name: 'Samsung Galaxy S24',
                price: 999,
                rating: 4.8,
                reviewCount: 2156,
                image: '/images/products/samsung-s24.jpg',
                inStock: true
            },
            {
                id: 11,
                name: 'AirPods Pro 2',
                price: 249,
                rating: 4.7,
                reviewCount: 1876,
                image: '/images/products/airpods-pro.jpg',
                inStock: true
            }
        ],
        newArrival: [
            {
                id: 12,
                name: 'iPad Pro 12.9"',
                price: 1099,
                rating: 4.8,
                reviewCount: 892,
                image: '/images/products/ipad-pro.jpg',
                inStock: true
            },
            {
                id: 13,
                name: 'Nintendo Switch OLED',
                price: 349,
                rating: 4.6,
                reviewCount: 1234,
                image: '/images/products/nintendo-switch.jpg',
                inStock: true
            },
            {
                id: 14,
                name: 'Sony PlayStation 5',
                price: 499,
                rating: 4.9,
                reviewCount: 4567,
                image: '/images/products/ps5.jpg',
                inStock: true
            }
        ],
        trending: [
            {
                id: 15,
                name: 'Tesla Model 3',
                price: 39999,
                rating: 4.8,
                reviewCount: 2341,
                image: '/images/products/tesla-model3.jpg',
                inStock: true
            },
            {
                id: 16,
                name: 'Dyson V15 Detect',
                price: 749,
                rating: 4.7,
                reviewCount: 1567,
                image: '/images/products/dyson-v15.jpg',
                inStock: true
            },
            {
                id: 17,
                name: 'Nespresso Vertuo',
                price: 199,
                rating: 4.5,
                reviewCount: 892,
                image: '/images/products/nespresso-vertuo.jpg',
                inStock: true
            }
        ],
        topRated: [
            {
                id: 18,
                name: 'iPhone 15 Pro Max',
                price: 1199,
                rating: 4.9,
                reviewCount: 5432,
                image: '/images/products/iphone-15-pro-max.jpg',
                inStock: true
            },
            {
                id: 19,
                name: 'Samsung QLED TV',
                price: 1299,
                rating: 4.8,
                reviewCount: 1876,
                image: '/images/products/samsung-qled.jpg',
                inStock: true
            },
            {
                id: 20,
                name: 'Bose QuietComfort 45',
                price: 329,
                rating: 4.7,
                reviewCount: 1234,
                image: '/images/products/bose-qc45.jpg',
                inStock: true
            }
        ]
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-5 h-10 bg-indigo-500 rounded"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Listings</h2>
                </div>

                {/* Product Lists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Best Seller */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Seller</h3>
                        <div className="space-y-4">
                            {productLists.bestSeller.map(product => (
                                <div key={product.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Arrival */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">New Arrival</h3>
                        <div className="space-y-4">
                            {productLists.newArrival.map(product => (
                                <div key={product.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trending Products */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Products</h3>
                        <div className="space-y-4">
                            {productLists.trending.map(product => (
                                <div key={product.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Rated */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rated</h3>
                        <div className="space-y-4">
                            {productLists.topRated.map(product => (
                                <div key={product.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}




