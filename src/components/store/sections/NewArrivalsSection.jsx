import { Button } from '@/components/ui/button'

export default function NewArrivalsSection() {
    const newArrivals = [
        {
            title: 'Electronics',
            description: 'Latest tech gadgets and devices',
            image: '/images/new-arrivals/electronics.jpg',
            buttonText: 'Shop Now',
            link: '/store/category/electronics',
            size: 'large'
        },
        {
            title: 'Fashion Collections',
            description: 'Trendy clothing and accessories',
            image: '/images/new-arrivals/fashion.jpg',
            buttonText: 'Shop Now',
            link: '/store/category/fashion',
            size: 'medium'
        },
        {
            title: 'Furniture',
            description: 'Modern home and office furniture',
            image: '/images/new-arrivals/furniture.jpg',
            buttonText: 'Shop Now',
            link: '/store/category/furniture',
            size: 'small'
        },
        {
            title: 'Beauty',
            description: 'Skincare and beauty products',
            image: '/images/new-arrivals/beauty.jpg',
            buttonText: 'Shop Now',
            link: '/store/category/beauty',
            size: 'small'
        }
    ]

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-5 h-10 bg-purple-500 rounded"></div>
                    <h2 className="text-2xl font-bold text-gray-900">New Arrival</h2>
                </div>

                {/* New Arrivals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Electronics - Large */}
                    <div className="lg:col-span-1">
                        <div className="relative bg-black rounded-2xl overflow-hidden h-96">
                            <img
                                src={newArrivals[0].image}
                                alt={newArrivals[0].title}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                                <h3 className="text-3xl font-bold mb-4">{newArrivals[0].title}</h3>
                                <p className="text-lg mb-6 text-center">{newArrivals[0].description}</p>
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    {newArrivals[0].buttonText}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Fashion, Furniture, Beauty */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Fashion - Medium */}
                        <div className="relative bg-black rounded-2xl overflow-hidden h-44">
                            <img
                                src={newArrivals[1].image}
                                alt={newArrivals[1].title}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                                <h3 className="text-2xl font-bold mb-2">{newArrivals[1].title}</h3>
                                <p className="text-sm mb-4 text-center">{newArrivals[1].description}</p>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                    {newArrivals[1].buttonText}
                                </Button>
                            </div>
                        </div>

                        {/* Bottom Row - Furniture and Beauty */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Furniture */}
                            <div className="relative bg-black rounded-2xl overflow-hidden h-44">
                                <img
                                    src={newArrivals[2].image}
                                    alt={newArrivals[2].title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                                    <h3 className="text-xl font-bold mb-2">{newArrivals[2].title}</h3>
                                    <p className="text-xs mb-3 text-center">{newArrivals[2].description}</p>
                                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                        {newArrivals[2].buttonText}
                                    </Button>
                                </div>
                            </div>

                            {/* Beauty */}
                            <div className="relative bg-black rounded-2xl overflow-hidden h-44">
                                <img
                                    src={newArrivals[3].image}
                                    alt={newArrivals[3].title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                                    <h3 className="text-xl font-bold mb-2">{newArrivals[3].title}</h3>
                                    <p className="text-xs mb-3 text-center">{newArrivals[3].description}</p>
                                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                        {newArrivals[3].buttonText}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



