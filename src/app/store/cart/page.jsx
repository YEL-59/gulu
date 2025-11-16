"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/store";

export default function CartPage() {
  const { items: cartItems = [], updateQuantity, removeItem, subtotal = 0 } = useCart();
  const [coupon, setCoupon] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fix hydration mismatch: only render cart items after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure cartItems is always an array
  // During SSR, always use empty array to match server render
  const safeCartItems = mounted && Array.isArray(cartItems) ? cartItems : [];
  const safeSubtotal = mounted ? (Number(subtotal) || 0) : 0;

  const shipping = useMemo(() => (safeSubtotal > 100 ? 0 : 10), [safeSubtotal]);
  const discount = useMemo(() => {
    if (!coupon || typeof coupon !== 'string') return 0;
    return coupon.toLowerCase() === "save24" ? safeSubtotal * 0.24 : 0;
  }, [coupon, safeSubtotal]);
  const tax = useMemo(() => Math.round(safeSubtotal * 0.12 * 100) / 100, [safeSubtotal]);
  const total = useMemo(() => Math.max(safeSubtotal + shipping + tax - discount, 0), [safeSubtotal, shipping, tax, discount]);

  const handleProceedToCheckout = () => {
    // Validate cart is not empty
    if (!safeCartItems || safeCartItems.length === 0) {
      alert('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }

    // Validate all items have required fields
    const invalidItems = safeCartItems.filter(item => !item || !item.id || !item.price || !item.quantity);
    if (invalidItems.length > 0) {
      console.error('Cart contains invalid items:', invalidItems);
      alert('Some items in your cart are invalid. Please remove them and try again.');
      return;
    }

    try {
      const payload = { 
        items: safeCartItems, 
        subtotal: safeSubtotal, 
        shipping, 
        discount, 
        tax, 
        total, 
        coupon: coupon || '' 
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem("checkoutCart", JSON.stringify(payload));
      }
      
      router.push("/store/billingAddress");
    } catch (e) {
      console.error('Error proceeding to checkout:', e);
      alert('Failed to proceed to checkout. Please try again.');
    }
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
                {safeCartItems.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  safeCartItems.map((item) => {
                    if (!item || !item.id) return null;
                    
                    const itemPrice = Number(item.price) || 0;
                    const itemQuantity = Number(item.quantity) || 1;
                    const itemSubtotal = itemPrice * itemQuantity;
                    const itemImage = item.image || '/placeholder-image.png';
                    const itemName = item.name || 'Unknown Product';

                    return (
                      <div key={item.id} className="grid grid-cols-12 items-center px-4 py-4">
                        {/* Product */}
                        <div className="col-span-6 flex items-center gap-3">
                          <button
                            onClick={() => {
                              try {
                                removeItem(item.id);
                              } catch (error) {
                                console.error('Error removing item:', error);
                                alert('Failed to remove item. Please try again.');
                              }
                            }}
                            className="mr-2 h-6 w-6 rounded-full border flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-600"
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                          <img 
                            src={itemImage} 
                            alt={itemName} 
                            className="h-14 w-14 rounded border object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.png';
                            }}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-800">{itemName}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center text-sm text-gray-700">
                          ${itemPrice.toFixed(2)}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center rounded border">
                            <button
                              className="px-2 py-1 text-gray-700 hover:bg-gray-50"
                              onClick={() => {
                                try {
                                  updateQuantity(item.id, -1, { mode: 'delta' });
                                } catch (error) {
                                  console.error('Error updating quantity:', error);
                                }
                              }}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              value={itemQuantity}
                              min="1"
                              onChange={(e) => {
                                try {
                                  const newQty = Number(e.target.value);
                                  if (!isNaN(newQty) && newQty >= 1) {
                                    updateQuantity(item.id, newQty, { mode: 'set' });
                                  }
                                } catch (error) {
                                  console.error('Error updating quantity:', error);
                                }
                              }}
                              className="w-12 border-0 text-center"
                            />
                            <button
                              className="px-2 py-1 text-gray-700 hover:bg-gray-50"
                              onClick={() => {
                                try {
                                  updateQuantity(item.id, 1, { mode: 'delta' });
                                } catch (error) {
                                  console.error('Error updating quantity:', error);
                                }
                              }}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-right text-sm font-medium text-gray-800">
                          ${itemSubtotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
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
                <div className="flex justify-between"><span>Sub-total</span><span>${safeSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Discount</span><span>{discount ? `$${discount.toFixed(2)}` : "$0.00"}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total</span>
                  <span className="text-xl font-semibold">${total.toFixed(2)} USD</span>
                </div>
              </div>
              <Button 
                onClick={handleProceedToCheckout} 
                disabled={safeCartItems.length === 0}
                className="w-full mt-4 bg-[#F36E16] hover:bg-[#e06212] h-11 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PROCEED TO CHECKOUT
              </Button>
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
