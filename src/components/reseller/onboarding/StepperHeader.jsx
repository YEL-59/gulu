import { Check } from "lucide-react";

const steps = [
  { key: 0, label: "Basic info" },
  { key: 1, label: "Business" },
  { key: 2, label: "Payment" },
  { key: 3, label: "Store setup" },
];

export default function StepperHeader({ current }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl md:text-3xl font-bold">Create Your Seller Account</h1>
      <p className="text-gray-500 mt-1">Join thousands of successful sellers on our platform</p>

      <div className="flex items-center justify-center gap-6 mt-6">
        {steps.map((s, idx) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm ${
                current > idx
                  ? "bg-green-500"
                  : current === idx
                  ? "bg-blue-500"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {current > idx ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <div className="ml-2 text-sm">
              <div className={`${current === idx ? "text-gray-900" : "text-gray-600"}`}>{s.label}</div>
            </div>
            {idx < steps.length - 1 && (
              <div className="mx-4 h-0.5 w-12 bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}