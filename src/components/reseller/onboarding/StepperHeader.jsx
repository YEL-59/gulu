import { Check, User, Building2, CreditCard, Store } from "lucide-react";

const steps = [
  { key: 0, label: "Basic Info", icon: User, description: "Personal details" },
  { key: 1, label: "Business", icon: Building2, description: "Business information" },
  { key: 2, label: "Payment", icon: CreditCard, description: "Payment setup" },
  { key: 3, label: "Store Setup", icon: Store, description: "Store configuration" },
];

export default function StepperHeader({ current, variant = 'reseller' }) {
  const badgeText = variant === 'wholesaler' ? 'Wholesaler Application' : 'Reseller Registration';
  
  return (
    <div className="text-center mb-8">
      <div className="inline-block px-4 py-2 bg-[#F36E16]/10 rounded-full mb-4">
        <span className="text-[#F36E16] text-sm font-semibold">{badgeText}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1A73E8] to-[#F36E16] bg-clip-text text-transparent">
        Create Your Seller Account
      </h1>
      <p className="text-gray-600 mt-2 text-lg">Join thousands of successful sellers on our platform</p>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-8 mb-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isCompleted = current > idx;
          const isCurrent = current === idx;
          const isPending = current < idx;

          return (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`relative h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200 scale-110"
                      : isCurrent
                      ? "bg-gradient-to-br from-[#F36E16] to-[#e06212] shadow-lg shadow-orange-200 scale-110 ring-4 ring-orange-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className={`h-5 w-5 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                  )}
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>
                <div className="mt-2 text-center min-w-[80px]">
                  <div
                    className={`text-xs font-semibold transition-colors ${
                      isCurrent ? "text-[#F36E16]" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-2 md:mx-4 h-1 w-8 md:w-16 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}