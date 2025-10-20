import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WholesellerHero = () => {
  return (
    <section className="bg-[#EAF3FF] py-20">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug">
            Start Selling verified wholesalers' products Online
            <span className="text-[#1A73E8]"> Today</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl">
            Start selling verified wholesalers' products individually and build
            your business through our platform.
          </p>
          <div className="mt-6">
            <Link href="/wholesaler/onboarding">
              <Button className="bg-[#F36E16] hover:bg-[#e06212]">
                BECOME A WHOLESALER
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-sm">
          <Image
            src="/assets/home/girl.png"
            alt="Start selling as a reseller"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default WholesellerHero;
