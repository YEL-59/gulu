'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

export default function CategoryMenu() {
    const [selectedCategory, setSelectedCategory] = useState('Computer & Laptop')
    const [selectedSubCategory, setSelectedSubCategory] = useState('HP')

    const categories = [
        {
            name: 'Furniture',
            subCategories: ['Living Room', 'Bedroom', 'Office', 'Outdoor']
        },
        {
            name: 'Computer & Laptop',
            subCategories: ['Asus', 'HP', 'Lenovo', 'Dell', 'Huawei', 'MacBook', 'Samsung', 'Xiaomi']
        },
        {
            name: 'Headphone',
            subCategories: ['Wireless', 'Wired', 'Gaming', 'Professional']
        },
        {
            name: 'Man Clothes',
            subCategories: ['Shirts', 'Pants', 'Jackets', 'Accessories']
        },
        {
            name: 'Gaming Console',
            subCategories: ['PlayStation', 'Xbox', 'Nintendo', 'PC Gaming']
        },
        {
            name: 'SmartPhone',
            subCategories: ['iPhone', 'Samsung', 'Google Pixel', 'OnePlus']
        },
        {
            name: 'Camera & Photo',
            subCategories: ['DSLR', 'Mirrorless', 'Action Cameras', 'Lenses']
        },
        {
            name: 'TV & Homes Appliances',
            subCategories: ['Smart TVs', 'Refrigerators', 'Washing Machines', 'Air Conditioners']
        },
        {
            name: 'Watches & Accessories',
            subCategories: ['Smart Watches', 'Luxury Watches', 'Sports Watches', 'Accessories']
        },
        {
            name: 'GPS & Navigation',
            subCategories: ['Car GPS', 'Handheld GPS', 'Marine GPS', 'Aviation GPS']
        },
        {
            name: 'Wearable Technology',
            subCategories: ['Fitness Trackers', 'Smart Glasses', 'Health Monitors', 'VR Headsets']
        }
    ]

    const currentCategory = categories.find(cat => cat.name === selectedCategory)

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Category</h3>
                <h3 className="text-lg font-semibold">Sub Category</h3>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Main Categories */}
                <div className="bg-white rounded-lg p-4">
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedCategory === category.name
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => {
                                    setSelectedCategory(category.name)
                                    setSelectedSubCategory(category.subCategories[0])
                                }}
                            >
                                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                {selectedCategory === category.name && (
                                    <ChevronRight className="h-4 w-4 text-blue-600" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Sub Categories */}
                <div className="bg-white rounded-lg p-4">
                    <div className="space-y-1">
                        {currentCategory?.subCategories.map((subCategory) => (
                            <div
                                key={subCategory}
                                className={`p-2 rounded cursor-pointer transition-colors ${selectedSubCategory === subCategory
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedSubCategory(subCategory)}
                            >
                                <span className="text-sm font-medium text-gray-900">{subCategory}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
