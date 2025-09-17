

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">


            <main className="flex-1 bg-gray-50">
                <div className="min-h-[calc(100vh-140px)] flex">
                    {/* Left side - Auth Content */}
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>

                    {/* Right side - Image */}
                    <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-500 to-accent-500">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative flex items-center justify-center p-12 text-white">
                            <div className="text-center space-y-6">
                                <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                                        <span className="text-4xl font-bold">G</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold">Welcome to Gulu</h2>
                                    <p className="text-lg text-white/90 max-w-sm">
                                        The ultimate B2B dropshipping marketplace connecting wholesalers,
                                        resellers, and customers worldwide.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 mt-8">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">10K+</div>
                                            <div className="text-sm text-white/80">Sellers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">50K+</div>
                                            <div className="text-sm text-white/80">Products</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">100K+</div>
                                            <div className="text-sm text-white/80">Orders</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-20 right-32 w-12 h-12 bg-white/10 rounded-full"></div>
                        <div className="absolute top-1/3 right-20 w-6 h-6 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </main>


        </div>
    )
}
