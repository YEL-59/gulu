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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name, SKU, category, brand"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 md:w-80 text-sm"
          />
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="min-w-[140px] sm:min-w-40 text-xs sm:text-sm">
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
            <Button variant="outline" onClick={toggleSortDir} title="Toggle sort order" className="text-xs sm:text-sm px-2 sm:px-3">
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">{sortDir === "asc" ? "Asc" : "Desc"}</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-[#F36E16] hover:bg-[#e06212] text-xs sm:text-sm px-3 sm:px-4" onClick={() => onAdd?.()}>
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="ml-1 sm:ml-2">New Product</span>
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {currentRows.length === 0 ? (
          <div className="p-6 text-center text-gray-600 text-sm">
            No products found.
          </div>
        ) : (
          currentRows.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base text-gray-900 mb-1 break-words">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">SKU: {p.id}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">${Number(p.price).toFixed(2)}</span>
                    <Badge variant={p.inStock ? "default" : "outline"} className="text-xs">
                      {p.badge || (p.inStock ? "Active" : "Inactive")}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3 pt-3 border-t">
                <div>
                  <span className="text-gray-500">Size:</span>{" "}
                  <span className="font-medium text-gray-900">{p.size || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Color:</span>{" "}
                  <span className="font-medium text-gray-900">{p.color || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-500">QTY:</span>{" "}
                  <span className="font-medium text-gray-900">{p.quantity ?? "—"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>{" "}
                  <span className={`font-medium ${p.inStock ? "text-green-600" : "text-red-600"}`}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => onView?.(p)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => onEdit?.(p)}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete?.(p)}
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block relative w-full overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Product</TableHead>
              <TableHead className="text-xs sm:text-sm">Price</TableHead>
              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Size</TableHead>
              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Color</TableHead>
              <TableHead className="text-xs sm:text-sm">QTY</TableHead>
              <TableHead className="text-xs sm:text-sm">Stock</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-900 font-medium break-words">{p.name}</span>
                    <span className="text-xs text-gray-500">SKU: {p.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm font-medium">${Number(p.price).toFixed(2)}</TableCell>
                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{p.size || "—"}</TableCell>
                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{p.color || "—"}</TableCell>
                <TableCell className="text-xs sm:text-sm">{p.quantity ?? "—"}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <span className={p.inStock ? "text-green-600" : "text-red-600"}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.inStock ? "default" : "outline"} className="text-xs">
                    {p.badge || (p.inStock ? "Active" : "Inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => onView?.(p)} title="View">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => onEdit?.(p)} title="Edit">
                      <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => onDelete?.(p)} title="Delete">
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-600 text-sm py-6">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {filtered.length === 0 ? 0 : start + 1}–{end} of {filtered.length} products
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="h-8 min-w-[70px] sm:min-w-20 text-xs sm:text-sm">
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
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canPrev} onClick={() => canPrev && setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs sm:text-sm whitespace-nowrap">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={!canNext} onClick={() => canNext && setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
