"use client"

import { useMemo, useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2, Plus, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import productsData from "@/lib/data/products.json"

export default function ProductsTable({ onView, onEdit, onDelete, onAdd }) {
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortDir, setSortDir] = useState("asc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = productsData
    const rows = q
      ? base.filter(p =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.id || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q)
      )
      : base
    const sorted = [...rows].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      let av, bv
      switch (sortBy) {
        case "price":
          av = Number(a.price) || 0; bv = Number(b.price) || 0; break
        case "rating":
          av = Number(a.rating) || 0; bv = Number(b.rating) || 0; break
        case "reviews":
          av = Number(a.reviewCount) || 0; bv = Number(b.reviewCount) || 0; break
        case "stock":
          av = a.inStock ? 1 : 0; bv = b.inStock ? 1 : 0; break
        default:
          av = (a.name || "").toLowerCase(); bv = (b.name || "").toLowerCase();
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return sorted
  }, [query, sortBy, sortDir])

  const toggleSortDir = () => setSortDir(d => (d === "asc" ? "desc" : "asc"))

  useEffect(() => { setPage(1) }, [query, sortBy, sortDir, pageSize])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const end = Math.min(filtered.length, start + pageSize)
  const currentRows = filtered.slice(start, end)
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name, SKU, category, brand"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-80"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="min-w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={toggleSortDir} title="Toggle sort order">
            <ArrowUpDown />
            {sortDir === "asc" ? "Asc" : "Desc"}
          </Button>
        </div>

        {/* <div className="flex items-center gap-2">
          <Button className="bg-[#F36E16] hover:bg-[#e06212]" onClick={() => onAdd?.()}>
            <Plus />
            New Product
          </Button>
        </div> */}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">{p.name}</span>
                  <span className="text-xs text-gray-500">SKU: {p.id}</span>
                </div>
              </TableCell>
              <TableCell>${Number(p.price).toFixed(2)}</TableCell>
              <TableCell>{p.size || "—"}</TableCell>
              <TableCell>{p.color || "—"}</TableCell>
              <TableCell>{p.quantity ?? "—"}</TableCell>
              <TableCell>{p.inStock ? "In Stock" : "Out of Stock"}</TableCell>
              <TableCell>
                <Badge variant={p.inStock ? "default" : "outline"}>
                  {p.badge || (p.inStock ? "Active" : "Inactive")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView?.(p)} title="View">
                    <Eye />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit?.(p)} title="Edit">
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete?.(p)} title="Delete">
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              Showing {filtered.length === 0 ? 0 : start + 1}–{end} of {filtered.length} products
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page</span>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                  <SelectTrigger className="h-8 min-w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled={!canPrev} onClick={() => canPrev && setPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft />
                </Button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <Button variant="outline" size="icon" disabled={!canNext} onClick={() => canNext && setPage(p => Math.min(totalPages, p + 1))}>
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </TableCaption>
      </Table>
    </div>
  )
}