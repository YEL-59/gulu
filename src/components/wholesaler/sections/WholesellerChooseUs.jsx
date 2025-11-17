import { ShieldCheck, CreditCard, BarChart3, Zap, Globe, Headphones } from "lucide-react";

const features = [
  {
    title: "Easy Store Setup",
    desc: "Get your store up and running in minutes with our intuitive setup process. No technical knowledge required.",
    icon: ShieldCheck,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Secure Payments",
    desc: "Accept payments safely with our secure payment processing. Get paid quickly with multiple payout options.",
    icon: CreditCard,
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Analytics & Insights",
    desc: "Track your sales, understand your customers, and grow your business with detailed analytics and reports.",
    icon: BarChart3,
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Lightning Fast",
    desc: "Experience blazing-fast performance with optimized infrastructure. Your customers will love the speed.",
    icon: Zap,
    gradient: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Global Reach",
    desc: "Sell to customers worldwide with our international shipping and multi-currency support.",
    icon: Globe,
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "24/7 Support",
    desc: "Get help whenever you need it with our round-the-clock customer support team.",
    icon: Headphones,
    gradient: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

export default function WholesellerChooseUs() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
            <span className="text-sm font-medium text-blue-700">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Powerful features designed to help you build, grow, and scale your online business effortlessly
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map(({ title, desc, icon: Icon, gradient, bg, border, iconBg, iconColor }, i) => (
            <div
              key={i}
              className={`group relative ${bg} rounded-2xl p-8 border-2 ${border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 ${iconBg} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-7 w-7 ${iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900 transition-colors">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {desc}
                </p>

                {/* Decorative element */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity duration-300 -translate-y-1/2 translate-x-1/2`}></div>
              </div>

              {/* Hover border effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 ${border} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F36E16] to-[#e06212] rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <span className="font-semibold">Explore All Features</span>
            <Zap className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
