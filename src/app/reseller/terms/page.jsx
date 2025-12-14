"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResellerTermsPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const policies = [
    {
      title: "1. Product Availability",
      desc: "Resellers can sell only products available on our platform (from approved wholesalers).",
    },
    {
      title: "2. Order Fulfillment Process",
      desc: "After receiving an order, the reseller must first purchase the product from the wholesaler through the platform. Only after purchasing the product will the reseller be able to withdraw earnings from our platform.",
    },
    {
      title: "3. Products Already in Stock",
      desc: "If the reseller already has the product in stock, they may proceed to ship it and withdraw earnings after verification.",
    },
    {
      title: "4. Platform Benefits",
      desc: "These policies are designed for the benefit and protection of all users, ensuring that resellers do not accept orders and then disappear without fulfillment, wholesalers are paid before supply, and buyers receive their products reliably.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Reseller Terms & Conditions
        </h1>
        <p className="text-gray-600 text-center mt-2 mb-8">
          Before proceeding with your registration, please review and accept the
          following key rules and conditions to join our platform as a reseller:
        </p>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6 space-y-6">
            {policies.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.desc}</div>
                </div>
              </div>
            ))}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              I have read and agree to the above terms and conditions
            </label>

            <div className="flex justify-end">
              <Button
                className="bg-[#F36E16] hover:bg-[#e06212]"
                disabled={!accepted}
                onClick={() => router.push("/auth/signup?role_id=3")}
              >
                Accept & Continue to Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
