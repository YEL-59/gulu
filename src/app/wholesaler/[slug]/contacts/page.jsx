"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import sellers from "@/lib/data/sellers.json";
import StoreNavbar from "@/components/wholesaler/StoreNavbar";
import StoreHero from "@/components/wholesaler/StoreHero";

export default function WholesalerContactsPage() {
  const params = useParams();
  const sellerSlug = params?.slug?.toString() || "";

  const seller = useMemo(() => {
    const s = sellers.find((x) => x.slug === sellerSlug && x.type === "wholesaler");
    if (s) return s;
    const def = sellers.find((x) => x.isDefault && x.type === "wholesaler");
    return def || null;
  }, [sellerSlug]);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-3">Wholesaler not found</h1>
          <p className="text-gray-600">No default wholesaler configured.</p>
        </div>
      </div>
    );
  }

  const basePath = `/wholesaler/${seller.slug}`;

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <StoreHero seller={seller} />
        <StoreNavbar basePath={basePath} />

        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact with us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold">Email:</div>
                    <div>{seller.email || "sales@example.com"}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Phone:</div>
                    <div>{seller.phone || "+1 (000) 000-0000"}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Address:</div>
                    <div>{seller.location}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Send Message</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-sm">
                  Thanks! We received your message and will get back soon.
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                    <input name="name" value={form.name} onChange={onChange} className="w-full border rounded-md px-3 py-2" placeholder="Adam Smith" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={form.email} onChange={onChange} className="w-full border rounded-md px-3 py-2" placeholder="adam_smith@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={onChange} className="w-full border rounded-md px-3 py-2" placeholder="+888-2786223" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Message</label>
                    <textarea name="message" value={form.message} onChange={onChange} className="w-full border rounded-md px-3 py-2 h-32" placeholder="Write your message" required />
                  </div>
                  <button type="submit" className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md">Send</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}