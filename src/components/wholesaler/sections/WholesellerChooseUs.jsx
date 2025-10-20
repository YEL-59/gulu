import { ShieldCheck, CreditCard, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Easy Store Setup",
    desc: "Get your store up and running in minutes with our intuitive setup process. No technical knowledge required.",
    icon: ShieldCheck,
    bg: "bg-blue-50",
    dot: "bg-blue-400",
  },
  {
    title: "Secure Payments",
    desc: "Accept payments safely with our secure payment processing. Get paid quickly with multiple payout options.",
    icon: CreditCard,
    bg: "bg-orange-50",
    dot: "bg-orange-400",
  },
  {
    title: "Analytics & Insights",
    desc: "Track your sales, understand your customers, and grow your business with detailed analytics and reports.",
    icon: BarChart3,
    bg: "bg-pink-50",
    dot: "bg-pink-400",
  },
];

export default function WholesellerChooseUs() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">
          Why Choose Our Platform?
        </h2>
        <p className="text-gray-600 mt-2">
          Everything you need to build and grow your online business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map(({ title, desc, icon: Icon, bg, dot }, i) => (
          <div key={i} className={`${bg} rounded-xl p-6 shadow-sm`}>
            <div className="flex flex-col justify-center items-center  gap-4">
              <div
                className={`w-10 h-10 rounded-full ${dot} flex items-center justify-center bg-opacity-20`}
              ></div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <Icon className="h-5 w-5 text-gray-700" />
                  <h3 className="font-semibold text-lg ">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm mt-2 text-center">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
