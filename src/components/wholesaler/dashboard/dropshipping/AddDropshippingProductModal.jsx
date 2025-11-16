"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calculator, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddDropshippingProductModal({ open, onOpenChange, product }) {
  const [supplierPrice, setSupplierPrice] = useState("");
  const [markupPercent, setMarkupPercent] = useState("30");
  const [sellingPrice, setSellingPrice] = useState("");
  const [profitAmount, setProfitAmount] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  useEffect(() => {
    if (product) {
      // Set supplier price to product price (in production, this would come from supplier)
      setSupplierPrice(product.price?.toString() || "");
      setSellingPrice("");
      setMarkupPercent("30");
    }
  }, [product]);

  useEffect(() => {
    if (supplierPrice && markupPercent) {
      const supplier = parseFloat(supplierPrice) || 0;
      const markup = parseFloat(markupPercent) || 0;
      const calculatedSelling = supplier * (1 + markup / 100);
      setSellingPrice(calculatedSelling.toFixed(2));
      
      const profit = calculatedSelling - supplier;
      setProfitAmount(profit);
      setProfitMargin((profit / calculatedSelling) * 100);
    }
  }, [supplierPrice, markupPercent]);

  useEffect(() => {
    if (sellingPrice && supplierPrice) {
      const selling = parseFloat(sellingPrice) || 0;
      const supplier = parseFloat(supplierPrice) || 0;
      if (selling > supplier) {
        const profit = selling - supplier;
        setProfitAmount(profit);
        setProfitMargin((profit / selling) * 100);
        // Recalculate markup based on selling price
        const newMarkup = ((selling - supplier) / supplier) * 100;
        setMarkupPercent(newMarkup.toFixed(2));
      }
    }
  }, [sellingPrice, supplierPrice]);

  const handleSubmit = () => {
    if (!product || !supplierPrice || !sellingPrice) {
      return;
    }

    const dropshippedProduct = {
      id: `dropship-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      supplierPrice: parseFloat(supplierPrice),
      sellingPrice: parseFloat(sellingPrice),
      markupPercent: parseFloat(markupPercent),
      profitAmount: profitAmount,
      profitMargin: profitMargin,
      supplierId: "supplier-1", // In production, get from product
      supplierName: product.brand || "Unknown Supplier",
      addedAt: new Date().toISOString(),
      status: "active",
      category: product.category,
      brand: product.brand,
    };

    // Save to localStorage (in production, call API)
    try {
      const existing = JSON.parse(
        localStorage.getItem("wholesalerDropshippedProducts") || "[]"
      );
      existing.push(dropshippedProduct);
      localStorage.setItem(
        "wholesalerDropshippedProducts",
        JSON.stringify(existing)
      );
      
      // Reset form
      setSupplierPrice("");
      setSellingPrice("");
      setMarkupPercent("30");
      
      onOpenChange(false);
      // In production, show success toast and refresh products list
      alert("Product added to your store successfully!");
    } catch (error) {
      console.error("Error saving dropshipped product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  if (!product) return null;

  const isValid = supplierPrice && sellingPrice && parseFloat(sellingPrice) > parseFloat(supplierPrice);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product via Dropshipping</DialogTitle>
          <DialogDescription>
            Set your pricing and profit margin for this product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Preview */}
          <Card className="p-4 bg-gray-50">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand || "Unknown Brand"}</p>
                {product.category && (
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Pricing Configuration */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Supplier Price */}
              <div className="space-y-2">
                <Label htmlFor="supplierPrice" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Supplier Price
                </Label>
                <Input
                  id="supplierPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500">
                  Cost from supplier (per unit)
                </p>
              </div>

              {/* Markup Percentage */}
              <div className="space-y-2">
                <Label htmlFor="markupPercent" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Markup (%)
                </Label>
                <Input
                  id="markupPercent"
                  type="number"
                  step="0.01"
                  min="0"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(e.target.value)}
                  placeholder="30"
                />
                <p className="text-xs text-gray-500">
                  Your profit percentage
                </p>
              </div>
            </div>

            {/* Selling Price */}
            <div className="space-y-2">
              <Label htmlFor="sellingPrice" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Your Selling Price
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-gray-500">
                Price customers will pay (auto-calculated or set manually)
              </p>
            </div>
          </div>

          {/* Profit Summary */}
          {isValid && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Profit per Unit</p>
                  <p className="text-lg font-bold text-green-700">
                    ${profitAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Profit Margin</p>
                  <p className="text-lg font-bold text-green-700">
                    {profitMargin.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Markup</p>
                  <p className="text-lg font-bold text-green-700">
                    {markupPercent}%
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Warning */}
          {sellingPrice && supplierPrice && parseFloat(sellingPrice) <= parseFloat(supplierPrice) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selling price must be higher than supplier price to make a profit.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              When a customer orders this product, the order will be automatically forwarded to the supplier for fulfillment. You'll receive the profit margin on each sale.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-[#F36E16] hover:bg-[#e06212]"
          >
            Add to Store
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

