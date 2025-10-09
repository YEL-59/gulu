import { Truck, Shield, Headphones, CreditCard } from 'lucide-react'

export default function FeatureHighlights() {
    const features = [
        {
            icon: Truck,
            title: 'Free Shipping',
            description: 'Free shipping on orders over $100'
        },
        {
            icon: Shield,
            title: 'Money Back Guarantee',
            description: '30-day money back guarantee'
        },
        {
            icon: Headphones,
            title: 'Online Support 24/7',
            description: '24/7 customer support available'
        },
        {
            icon: CreditCard,
            title: 'Secure Payment',
            description: '100% secure payment processing'
        }
    ]

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon
                        return (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <IconComponent className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}


