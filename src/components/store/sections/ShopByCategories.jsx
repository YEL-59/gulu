import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ShopByCategories() {
    const categories = [
        { name: 'Headphones', icon: '/images/categories/headphones.svg', link: '/store/category/headphones' },
        { name: 'Chairs', icon: '/images/categories/chairs.svg', link: '/store/category/chairs' },
        { name: 'Bags', icon: '/images/categories/bags.svg', link: '/store/category/bags' },
        { name: 'Backpacks', icon: '/images/categories/backpacks.svg', link: '/store/category/backpacks' },
        { name: 'Cameras', icon: '/images/categories/cameras.svg', link: '/store/category/cameras' },
        { name: 'Watches', icon: '/images/categories/watches.svg', link: '/store/category/watches' },
        { name: 'Jewelry', icon: '/images/categories/jewelry.svg', link: '/store/category/jewelry' }
    ]

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-5 h-10 bg-blue-500 rounded"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Shop with Categories</h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={category.link}
                            className="group text-center hover:scale-105 transition-transform duration-300"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    className="w-10 h-10"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}




