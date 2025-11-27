"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function ProductFormModal({ open, onOpenChange, initial, onSubmit }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    size: "",
    color: "",
    category: "electronics",
    price: "",
    quantity: "",
    status: "active",
    images: ["", "", "", ""],
  })

  useEffect(() => {
    if (initial) {
      setForm(f => ({
        ...f,
        id: initial.id || f.id,
        name: initial.name || f.name,
        size: initial.size || f.size,
        color: initial.color || f.color,
        category: initial.category || f.category,
        price: initial.price ?? f.price,
        quantity: initial.quantity ?? f.quantity,
        status: initial.inStock === false ? "inactive" : "active",
        images: initial.images ? [initial.images, "", "", ""] : f.images,
      }))
    }
  }, [initial])

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSave = () => {
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      quantity: Number(form.quantity) || 0,
      inStock: form.status === "active",
    }
    onSubmit?.(payload)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Product Information</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Provide product details and save.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">SKU</label>
            <Input 
              value={form.id} 
              onChange={(e) => update("id", e.target.value)} 
              placeholder="SKU (e.g., p-999)" 
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Product Name</label>
            <Input 
              value={form.name} 
              onChange={(e) => update("name", e.target.value)} 
              placeholder="Input product name" 
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Size</label>
            <Input 
              value={form.size} 
              onChange={(e) => update("size", e.target.value)} 
              placeholder="Size" 
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Color</label>
            <Input 
              value={form.color} 
              onChange={(e) => update("color", e.target.value)} 
              placeholder="Color" 
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Product Category</label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="computers">Computers</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="home">Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Price</label>
            <Input 
              type="number" 
              value={form.price} 
              onChange={(e) => update("price", e.target.value)} 
              placeholder="Input price" 
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Quantity</label>
            <Input 
              type="number" 
              value={form.quantity} 
              onChange={(e) => update("quantity", e.target.value)} 
              placeholder="Input stock" 
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm text-gray-600 mb-1.5 block">Status</label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <label className="text-xs sm:text-sm text-gray-600 mb-2 block">Product Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {form.images.map((url, idx) => (
              <div key={idx} className="border rounded-md h-20 sm:h-24 md:h-28 flex items-center justify-center text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">
                Photo {idx + 1}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
            className="w-full sm:w-auto text-sm"
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#F36E16] hover:bg-[#e06212] w-full sm:w-auto text-sm" 
            onClick={handleSave}
          >
            Save Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProductViewModal({ open, onOpenChange, product }) {
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl break-words">{product.name}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">SKU: {product.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="text-xs">{product.category}</Badge>
            <Badge variant={product.inStock ? "default" : "outline"} className="text-xs">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <span className="text-gray-600">Brand:</span>{" "}
              <span className="font-medium text-gray-900">{product.brand || "—"}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>{" "}
              <span className="font-medium text-gray-900">${Number(product.price).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Rating:</span>{" "}
              <span className="font-medium text-gray-900">
                {product.rating ?? "—"} ({product.reviewCount ?? 0} reviews)
              </span>
            </div>
            <div>
              <span className="text-gray-600">Color:</span>{" "}
              <span className="font-medium text-gray-900">{product.color || "—"}</span>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>{" "}
              <span className="font-medium text-gray-900">{product.size || "—"}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button 
            onClick={() => onOpenChange?.(false)}
            className="w-full sm:w-auto text-sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ConfirmDeleteDialog({ open, onOpenChange, product, onConfirm }) {
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Delete product</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Are you sure you want to delete <span className="font-medium">{product.name}</span>? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
            className="w-full sm:w-auto text-sm"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => { onConfirm?.(product); onOpenChange?.(false) }}
            className="w-full sm:w-auto text-sm"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}