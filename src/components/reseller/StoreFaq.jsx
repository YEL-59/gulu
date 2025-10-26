"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function StoreFaq({ seller }) {
  const baseProductsPath = seller?.slug ? `/reseller/${seller.slug}/products` : "/store";

  const faqs = [
    {
      q: "How much do you charge for pedicure?",
      a: "Pricing varies by service type and duration. Our base pedicure starts at $30, with add-ons available for gel polish, spa upgrades, and more. Please check the services page for the latest pricing.",
    },
    {
      q: "What types of treatments do you offer?",
      a: "We offer a range of treatments including manicures, pedicures, nail art, spa treatments, and special care services. Our team is trained across multiple techniques to ensure quality and comfort.",
    },
    {
      q: "How do I book my appointment?",
      a: "You can book online, via phone, or by visiting our store. Online booking lets you choose preferred dates, times, and providers, and you’ll receive confirmation instantly.",
    },
    {
      q: "Can I cancel my appointment?",
      a: "Yes. You can cancel up to 24 hours before your appointment without a fee. Same-day cancellations may incur a small charge to cover reserved time.",
    },
  ];

  return (
    <section className="w-full">
      {/* Top CTA banner */}
      <div className="bg-blue-50">
        <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Ready to Start Your Selling Journey?</h2>
          <p className="mt-2 text-sm text-gray-600">Join our community of successful sellers and start building your online business today.</p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href={baseProductsPath}>
                Browse Products
                <span aria-hidden className="ml-1">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ + Image */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* FAQ */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
            <div className="mt-4 space-y-3">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger>
                      <span className="text-sm text-gray-800">{item.q}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-6 text-gray-700">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full h-[280px] sm:h-[360px]">
            <Image
              src="/assets/home/girl.png"
              alt="Consultation"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg object-cover shadow-sm"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
