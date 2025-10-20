"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    // Sample items to visualize the layout (replace with real cart state)
    {
      id: 1,
      name: "4K UHD LED Smart TV with Chromecast Built-in",
      price: 70,
      quantity: 1,
      image: "/images/products/dji-mavic-3-pro.jpg",
    },
    {
      id: 2,
      name: "4K UHD LED Smart TV with Chromecast Built-in",
      price: 70,
      quantity: 1,
      image: "/images/products/dji-mavic-3-pro.jpg",
    },
    {
      id: 3,
      name: "Wired Over-Ear Gaming Headphones with USB",
      price: 250,
      quantity: 3,
      image: "/images/products/dji-mavic-3-pro.jpg",
    },
  ]);
  const [coupon, setCoupon] = useState("");
  const router = useRouter();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const shipping = useMemo(() => (subtotal > 100 ? 0 : 10), [subtotal]);
  const discount = useMemo(() => (coupon.toLowerCase() === "save24" ? subtotal * 0.24 : 0), [coupon, subtotal]);
  const tax = useMemo(() => Math.round(subtotal * 0.12 * 100) / 100, [subtotal]);
  const total = useMemo(() => Math.max(subtotal + shipping + tax - discount, 0), [subtotal, shipping, tax, discount]);

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleProceedToCheckout = () => {
    try {
      const payload = { items: cartItems, subtotal, shipping, discount, tax, total, coupon };
      if (typeof window !== "undefined") {
        localStorage.setItem("checkoutCart", JSON.stringify(payload));
      }
    } catch (e) {
      // ignore localStorage errors
    }
    router.push("/store/billingAddress");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white">
              {/* Header Row */}
              <div className="grid grid-cols-12 items-center border-b bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Item Rows */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center px-4 py-4">
                    {/* Product */}
                    <div className="col-span-6 flex items-center gap-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mr-2 h-6 w-6 rounded-full border flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-600"
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded border object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-800">{item.name}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center text-sm text-gray-700">${item.price.toFixed(2)}</div>

                    {/* Quantity */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center rounded border">
                        <button
                          className="px-2 py-1 text-gray-700 hover:bg-gray-50"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value) - item.quantity)
                          }
                          className="w-12 border-0 text-center"
                        />
                        <button
                          className="px-2 py-1 text-gray-700 hover:bg-gray-50"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 text-right text-sm font-medium text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Return to Shop */}
            <div className="mt-4 flex items-center justify-between">
              <Button variant="outline" className="h-10">Return to Shop</Button>
            </div>
          </div>

          {/* Card Totals & Coupon */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card Totals */}
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Card Totals</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Sub-total</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Discount</span><span>{discount ? `$${discount.toFixed(2)}` : "$0"}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total</span>
                  <span className="text-xl font-semibold">${total.toFixed(2)} USD</span>
                </div>
              </div>
              <Button onClick={handleProceedToCheckout} className="w-full mt-4 bg-[#F36E16] hover:bg-[#e06212] h-11">PROCEED TO CHECKOUT</Button>
            </div>

            {/* Coupon Code */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="text-lg font-semibold mb-4">Coupon Code</h3>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Enter coupon here"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Apply Coupon</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
