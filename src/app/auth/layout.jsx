

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">


            <main className="flex-1 ">
                <div className="min-h-[calc(100vh-0px)] flex">


                    {/* Left side - Image */}
                    <div
                        className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-500 to-accent-500"
                        style={{
                            backgroundImage: 'url(/assets/auth/auth-bg.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        {/* <div className="absolute inset-0 bg-black/20"></div> */}
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white p-8">
                                <h2 className="text-4xl font-bold mb-4">Welcome to Gulu</h2>
                                <p className="text-xl opacity-90">Your B2B Dropshipping Marketplace</p>
                            </div>
                        </div> */}
                    </div>

                    {/* Right side - Auth Content */}
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>
                </div>
            </main>


        </div>
    )
}
