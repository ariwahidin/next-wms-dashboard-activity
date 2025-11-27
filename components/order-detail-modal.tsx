"use client"

import { useState, useMemo } from "react"
import { X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface OutboundActivity {
  id: string
  shipment_id: string
  customer_name: string
  outbound_date: string
  status: "open" | "picking" | "complete"
  items?: Array<{
    id: string
    product_name: string
    quantity: number
    sku: string
  }>
  created_at?: string
  updated_at?: string
}

interface OrderDetailModalProps {
  isOpen: boolean
  order: OutboundActivity | null
  onClose: () => void
}

export function OrderDetailModal({ isOpen, order, onClose }: OrderDetailModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = useMemo(() => {
    if (!order?.items) return []
    if (!searchQuery.trim()) return order.items

    const query = searchQuery.toLowerCase()
    return order.items.filter(
      (item) => item.product_name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query),
    )
  }, [order?.items, searchQuery])

  if (!isOpen || !order) return null

  const statusColors = {
    open: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    picking: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    complete: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{order.shipment_id}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{order.customer_name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Status</p>
                <Badge className={`mt-2 ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Date</p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  {new Date(order.outbound_date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Items ({filteredItems.length})
                </p>
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Cari produk atau SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{item.product_name}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">SKU: {item.sku}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {item.quantity}x
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tidak ada item yang sesuai</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close
            </Button>
            {/* <Button className="flex-1">Edit Order</Button> */}
          </div>
        </div>
      </div>
    </>
  )
}
