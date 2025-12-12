"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ChartDataPoint } from "@/types"

interface InventoryTableProps {
  data: ChartDataPoint[]
  title?: string
  itemsPerPage?: number
}

export function InventoryTable({ data, title = "Inventory", itemsPerPage = 10 }: InventoryTableProps) {
  const safeData = Array.isArray(data) ? data : []
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return safeData

    const query = searchQuery.toLowerCase()
    return safeData.filter((item) => {
      const name = (item.name || "").toLowerCase()
      const sku = (item.sku || "").toLowerCase()
      const category = (item.category || "").toLowerCase()

      return name.includes(query) || sku.includes(query) || category.includes(query)
    })
  }, [safeData, searchQuery])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "in-stock":
        return "text-green-600"
      case "low-stock":
        return "text-yellow-600"
      case "out-of-stock":
        return "text-red-600"
      default:
        return "text-foreground"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Input
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 h-8 text-xs"
        />
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-t border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">GMC</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Item Code</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Item Name</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Qty</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <tr key={item.id || idx} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2">{item.gmc}</td>
                    <td className="px-4 py-2">{item.item_code}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{item.category || "-"}</td>
                    <td className="px-4 py-2 text-right font-medium">{item.quantity ?? item.value ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-border">
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} items
            </span>
          </div>

          {/* pagination buttons */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-7 text-xs"
              >
                Prev
              </Button>

              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
