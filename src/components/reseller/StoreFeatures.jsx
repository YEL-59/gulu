"use client";

import { ShieldCheck, Package, CheckSquare, FileText, Activity, Lock } from "lucide-react";

const features = [
  {
    title: "All-in-One Reselling Hub",
    desc: "Access trending products across categories, ready to sell instantly.",
    icon: ShieldCheck,
  },
  {
    title: "No Inventory Stress",
    desc: "Enjoy real-time stock updates and restocks with zero inventory management.",
    icon: Package,
  },
  {
    title: "Automated Compliance",
    desc: "Simplify checklists, policies, and reporting with intelligent automation.",
    icon: CheckSquare,
  },
  {
    title: "Full Audit Lifecycle",
    desc: "Plan, execute, and close audits seamlessly with evidence & workflow tracking.",
    icon: FileText,
  },
  {
    title: "Performance Monitoring",
    desc: "Monitor KPIs/KRIs, analyze trends, and receive proactive alerts.",
    icon: Activity,
  },
  {
    title: "Secure & Scalable",
    desc: "Enterprise-grade security, role-based access, and flexible integrations.",
    icon: Lock,
  },
];

export default function StoreFeatures() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ title, desc, icon: Icon }, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Icon className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}