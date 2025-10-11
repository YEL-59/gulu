import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

export default function FeatureHighlights() {
  const features = [
    {
      icon: Truck,
      title: "Fastest Delivery",
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
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-4 
            border border-gray-100 
            rounded-lg 
            divide-y sm:divide-y-0 sm:divide-x 
            divide-gray-100 
            overflow-hidden
            p-3
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="
                  group flex items-center sm:items-start md:items-center 
                  gap-4 px-6 py-6 
                  transition-all duration-300 hover:bg-gray-50
                "
              >
                {/* Icon with animation */}
                <div
                  className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1
"
                >
                  <Icon className="w-8 h-8 text-gray-800 transition-colors duration-300 group-hover:text-orange-500" />
                </div>

                {/* Text Content */}
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


