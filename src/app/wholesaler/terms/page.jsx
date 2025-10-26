"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WholesalerTermsPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const policies = [
    {
      title: "1. Product Availability",
      desc: "Wholesalers are allowed to sell only the products that are listed and available on the platform.",
    },
    {
      title: "2. Order Fulfillment",
      desc: "All orders must be processed and fulfilled exclusively through the platform to ensure quality and tracking.",
    },
    {
      title: "3. Fund Release Policy",
      desc: "Payment for completed orders will be released only after the order is fulfilled and verified through the platform.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Wholesaler Terms & Conditions
        </h1>
        <p className="text-gray-600 text-center mt-2 mb-8">
          Before proceeding with your registration, please review and accept the
          following conditions to join our platform as a wholesaler:
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
                onClick={() => router.push("/wholesaler/onboarding")}
              >
                Accept & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}