"use client"

import { useState } from "react"
import DashboardShell from "@/components/reseller/dashboard/DashboardShell"
import ProductsTable from "@/components/reseller/dashboard/store/ProductsTable"
import { ProductFormModal, ProductViewModal, ConfirmDeleteDialog } from "@/components/reseller/dashboard/store/ProductModals"

export default function ResellerStoreTabPage() {
  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [addingOpen, setAddingOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSubmit = (payload) => {
    // In a real app, call API. For now, just log.
    console.log("Saved product", payload)
  }

  return (
    <DashboardShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Products</h1>
        </div>

        <ProductsTable
          onView={(p) => setViewing(p)}
          onEdit={(p) => setEditing(p)}
          onDelete={(p) => setDeleting(p)}
          onAdd={() => setAddingOpen(true)}
        />

        <ProductViewModal open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} product={viewing} />
        <ProductFormModal open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSubmit={handleSubmit} />
        <ProductFormModal open={addingOpen} onOpenChange={setAddingOpen} onSubmit={handleSubmit} />
        <ConfirmDeleteDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} product={deleting} onConfirm={(p) => console.log("Delete", p)} />
      </div>
    </DashboardShell>
  )
}