"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ChevronLeft } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const discount = coupon?.toLowerCase() === "save24" ? 24 : 0; // simple demo
  const taxRate = 0.12; // 12% demo tax; adjust per region
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6" />
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white">
            {/* Header Row */}
            <div className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.6fr)] items-center border-b px-4 py-3 text-sm text-gray-600">
              <div className="font-medium">Products</div>
              <div className="font-medium">Price</div>
              <div className="font-medium">Quantity</div>
              <div className="font-medium">Sub-Total</div>
            </div>

            {/* Line Items */}
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.6fr)] items-center px-4 py-4 border-b last:border-b-0"
                >
                  {/* Product cell */}
                  <div className="flex items-center gap-4">
                    <button
                      aria-label="Remove"
                      className="flex-shrink-0 h-6 w-6 rounded-full border text-gray-500 hover:text-red-600 hover:border-red-300 flex items-center justify-center"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">In stock • Ships free</p>
                    </div>
                  </div>

                  {/* Price cell */}
                  <div className="text-gray-900">${item.price}</div>

                  {/* Quantity cell */}
                  <div>
                    <div className="inline-flex items-center border rounded-lg h-10 px-2 bg-gray-50">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 w-8 text-center font-medium">
                        {String(item.quantity).padStart(2, "0")}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal cell */}
                  <div className="text-gray-900 font-medium">
                    ${ (item.price * item.quantity).toFixed(2) }
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Return to shop */}
          <div className="mt-4">
            <Link href="/store/category/electronics" className="inline-flex items-center gap-2 border rounded-lg px-4 h-10 text-gray-700 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
              RETURN TO SHOP
            </Link>
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
            <Button className="w-full mt-4 bg-[#F36E16] hover:bg-[#e06212] h-11">PROCEED TO CHECKOUT</Button>
          </div>

          {/* Coupon Code */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Coupon Code</h3>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 h-10"
              />
              <Button
                className="bg-[#2F6FED] hover:bg-[#1e57c6] h-10 px-5"
                onClick={() => {
                  // No server call; just demo apply
                  if (coupon.trim() === "") return;
                }}
              >
                APPLY COUPON
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
