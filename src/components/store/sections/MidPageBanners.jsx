import { Button } from '@/components/ui/button'

export default function MidPageBanners() {
    const banners = [
        {
            title: 'New Apple Homepod mini',
            description: 'Experience premium sound quality',
            image: '/images/banners/apple-homepod-mini.jpg',
            buttonText: 'Shop Now',
            buttonLink: '/store/product/apple-homepod-mini'
        },
        {
            title: 'Xiaomi Mi 11 Ultra 12GB + 256GB',
            description: 'Flagship smartphone with advanced camera',
            image: '/images/banners/xiaomi-mi-11-ultra.jpg',
            buttonText: 'Shop Now',
            buttonLink: '/store/product/xiaomi-mi-11-ultra'
        }
    ]

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {banners.map((banner, index) => (
                        <div key={index} className="relative bg-gray-100 rounded-2xl overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {banner.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {banner.description}
                                    </p>
                                    <Button className="w-fit bg-orange-500 hover:bg-orange-600">
                                        {banner.buttonText}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-48 object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}




