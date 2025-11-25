"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { warehouses } from "@/data/dummy-warehouse"
import { cn } from "@/lib/utils"

export function WarehouseHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Warehouse Utilization</CardTitle>
        <CardDescription className="text-xs">Current capacity usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {warehouses.map((warehouse) => {
            const utilization = (warehouse.currentLoad / warehouse.capacity) * 100
            const barColor = utilization > 90 ? "bg-red-500" : utilization > 70 ? "bg-yellow-500" : "bg-green-500"

            return (
              <div key={warehouse.id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{warehouse.name}</span>
                  <span className="text-xs text-muted-foreground">{utilization.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-border">
                  <div
                    className={cn("h-full rounded-full transition-all", barColor)}
                    style={{ width: `${utilization}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
