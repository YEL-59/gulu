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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Information</DialogTitle>
          <DialogDescription>Provide product details and save.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">SKU</label>
            <Input value={form.id} onChange={(e) => update("id", e.target.value)} placeholder="SKU (e.g., p-999)" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Product Name</label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Input product name" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Size</label>
            <Input value={form.size} onChange={(e) => update("size", e.target.value)} placeholder="Size" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Color</label>
            <Input value={form.color} onChange={(e) => update("color", e.target.value)} placeholder="Color" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Product Category</label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="w-full">
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
            <label className="text-xs text-gray-600">Price</label>
            <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Input price" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Quantity</label>
            <Input type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="Input stock" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Status</label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-600">Product Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {form.images.map((url, idx) => (
              <div key={idx} className="border rounded-md h-24 flex items-center justify-center text-xs text-gray-500 bg-gray-50">
                Photo {idx + 1}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button className="bg-[#F36E16] hover:bg-[#e06212]" onClick={handleSave}>Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProductViewModal({ open, onOpenChange, product }) {
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>SKU: {product.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge>{product.category}</Badge>
            <Badge variant={product.inStock ? "default" : "outline"}>{product.inStock ? "In Stock" : "Out of Stock"}</Badge>
          </div>
          <div className="text-sm text-gray-700">Brand: {product.brand || "—"}</div>
          <div className="text-sm text-gray-700">Price: ${Number(product.price).toFixed(2)}</div>
          <div className="text-sm text-gray-700">Rating: {product.rating ?? "—"} ({product.reviewCount ?? 0} reviews)</div>
          <div className="text-sm text-gray-700">Color: {product.color || "—"}</div>
          <div className="text-sm text-gray-700">Size: {product.size || "—"}</div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange?.(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ConfirmDeleteDialog({ open, onOpenChange, product, onConfirm }) {
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
          <DialogDescription>Are you sure you want to delete {product.name}? This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm?.(product); onOpenChange?.(false) }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}