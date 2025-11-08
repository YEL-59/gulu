"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WholesalerTermsPage() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const eligibilityCriteria = [
    {
      title: "Manufacturers",
      desc: "Companies that produce and manufacture products",
    },
    {
      title: "Verified Suppliers",
      desc: "Established suppliers with verified credentials",
    },
    {
      title: "Registered Companies",
      desc: "Companies registered for at least 5 years (preferably)",
    },
  ];

  const importantNotes = [
    {
      icon: AlertCircle,
      title: "Limited Approval",
      desc: "Only a limited number of wholesalers will be approved on our platform. Your application may be rejected even without specific explanation.",
    },
    {
      icon: AlertCircle,
      title: "Exclusive Approval Process",
      desc: "Approval is done exclusively by the Super Admin (our team). The review process may take time.",
    },
    {
      icon: Info,
      title: "Recommendation",
      desc: "If you are not a manufacturer or supplier, we strongly recommend you apply as a reseller instead.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Become a Wholesaler / Full-Seller
        </h1>
        <p className="text-gray-600 text-center mt-2 mb-8">
          Before proceeding with your application, please review the eligibility requirements and important information below.
        </p>

        <Card className="max-w-4xl mx-auto mb-6">
          <CardContent className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-3 text-blue-900">
                Eligibility Requirements
              </h2>
              <p className="text-sm text-blue-800 mb-4">
                Our primary goal is to encourage users to become resellers, not wholesalers. 
                Therefore, only the following types of businesses are eligible to become wholesalers:
              </p>
              <div className="space-y-3">
                {eligibilityCriteria.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900">{item.title}</div>
                      <div className="text-sm text-blue-800">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-3 text-amber-900">
                Important Information
              </h2>
              <div className="space-y-4">
                {importantNotes.map((note, i) => {
                  const Icon = note.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-amber-900">{note.title}</div>
                        <div className="text-sm text-amber-800">{note.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-gray-600 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-2">
                    Not Eligible? Consider Becoming a Reseller
                  </div>
                  <div className="text-sm text-gray-700 mb-3">
                    If you do not meet the above criteria, we strongly recommend choosing Reseller instead. 
                    As a reseller, you can still sell products on our platform by sourcing from approved wholesalers.
                  </div>
                  <Link href="/reseller/terms">
                    <Button variant="outline" className="text-sm">
                      Learn More About Becoming a Reseller
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-gray-700">
                  I have read and understood the eligibility requirements and important information above. 
                  I confirm that I meet the criteria to become a wholesaler, and I understand that my application 
                  may be rejected without specific explanation. I agree to proceed with the wholesaler registration.
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link href="/wholesaler">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button
                className="bg-[#F36E16] hover:bg-[#e06212] w-full sm:w-auto"
                disabled={!accepted}
                onClick={() => router.push("/wholesaler/onboarding")}
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

