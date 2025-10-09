import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

export default function FeatureHighlights() {
  const features = [
    {
      icon: Truck,
      title: "Fasted Delivery",
      description: "Delivery in 24/H",
    },
    {
      icon: RotateCcw,
      title: "24 Hours Return",
      description: "100% money-back guarantee",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Your money is safe",
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      description: "Live contact/message",
    },
  ];

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center border border-gray-100 rounded-md p-5 divide-x divide-gray-100">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex items-center gap-4 px-6 py-5 w-full sm:w-1/2 lg:w-1/4 transition-all duration-300 hover:bg-gray-50"
              >
                <div className="transition-colors duration-300 group-hover:text-orange-500">
                  <Icon className="w-8 h-8 text-gray-800 transition-colors duration-300 group-hover:text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base transition-colors duration-300 group-hover:text-orange-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
