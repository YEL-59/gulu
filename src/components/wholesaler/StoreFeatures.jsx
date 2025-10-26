"use client";
const features = [
  { title: "All-in-One Reselling Hub", desc: "Streamline product sourcing and category-level standards." },
  { title: "No Inventory Stress", desc: "Enjoy flexible terms with real-time stock monitoring." },
  { title: "Automated Compliance", desc: "Simplify checks, policies and reporting with intelligent automation." },
  { title: "Full Audit Lifecycle", desc: "From verification and checks to analytics and workflow tracking." },
  { title: "Performance Monitoring", desc: "Metrics, KPIs and proactive alerts with data-driven insights." },
  { title: "Secure & Scalable", desc: "Enterprise-grade security, role-based controls and resilient design." }
];
export default function StoreFeatures() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {features.map((f) => (
        <div key={f.title} className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold">{f.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}