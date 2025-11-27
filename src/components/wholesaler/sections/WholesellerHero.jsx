import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Package } from "lucide-react";

const WholesellerHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16 md:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full shadow-sm">
              <TrendingUp className="h-4 w-4 text-[#F36E16]" />
              <span className="text-sm font-medium text-gray-700">
                Join 10,000+ Successful Wholesalers
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Start Selling{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#1A73E8]">Verified</span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-blue-200/40 -z-0"></span>
                </span>{" "}
                Wholesalers' Products
                <span className="block text-[#F36E16] mt-2">Online Today</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
                Build your business by selling verified wholesalers' products individually. 
                Join our platform and start growing your revenue today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-[#1A73E8]" />
                  <span className="text-2xl font-bold text-gray-900">10K+</span>
                </div>
                <p className="text-xs text-gray-600">Active Sellers</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-5 w-5 text-[#F36E16]" />
                  <span className="text-2xl font-bold text-gray-900">50K+</span>
                </div>
                <p className="text-xs text-gray-600">Products</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">98%</span>
                </div>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/wholesaler/terms">
                <Button 
                  size="lg"
                  className="bg-[#F36E16] hover:bg-[#e06212] text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  BECOME A WHOLESALER
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/wholesaler/dashboard">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold border-2 border-gray-300 hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all duration-300"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-orange-100 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1A73E8]/10 to-[#F36E16]/10 rounded-3xl transform -rotate-3"></div>
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/assets/home/girl.png"
                  alt="Start selling as a wholesaler"
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-200 animate-bounce">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900">Live Now</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#F36E16] to-[#e06212] rounded-2xl p-4 shadow-xl text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">$2M+</div>
                  <div className="text-xs opacity-90">Monthly Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesellerHero;
