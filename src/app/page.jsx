import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Users,
  Package,
  Store,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <Badge className="bg-white/20 text-white hover:bg-white/30">
              🚀 The Future of B2B Commerce
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Build Your Business with
              <span className="block text-yellow-300">Gulu Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Connect wholesalers, resellers, and customers in one powerful platform.
              Start dropshipping with confidence and scale your business globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Start Selling Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600">10K+</div>
            <div className="text-gray-600 mt-2">Active Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600">50K+</div>
            <div className="text-gray-600 mt-2">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600">100K+</div>
            <div className="text-gray-600 mt-2">Orders Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600">25+</div>
            <div className="text-gray-600 mt-2">Countries</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools and features designed to help you build, manage, and scale your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Multi-Role System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Separate dashboards for admins, wholesalers, resellers, and customers with role-based permissions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Store className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Custom Storefronts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create beautiful, customizable storefronts that reflect your brand and attract customers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Real-time inventory tracking with automated stock updates and low-stock alerts.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Escrow-based payment system with automatic payouts and refund protection.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive analytics, sales reports, and profit tracking to grow your business.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary-600 mb-4" />
              <CardTitle>Automated Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Auto-invoicing, order processing, and notification systems to save time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How Gulu Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to start your dropshipping business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold">Sign Up & Choose Role</h3>
              <p className="text-gray-600">
                Register as a wholesaler to sell products or as a reseller to create your storefront
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold">List Products or Build Store</h3>
              <p className="text-gray-600">
                Wholesalers upload products, resellers curate and customize their storefronts
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold">Start Earning</h3>
              <p className="text-gray-600">
                Process orders automatically and receive secure payments through our escrow system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100">
            Join thousands of successful sellers already using Gulu to grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}