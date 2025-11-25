"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartDataPoint } from "@/types"

interface StockLevelChartProps {
  data: ChartDataPoint[]
  title?: string
  description?: string
}

export function StockLevelChart({
  data,
  title = "Stock Levels by Warehouse",
  description = "Current inventory per warehouse",
}: StockLevelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
              labelStyle={{ color: "hsl(var(--color-foreground))" }}
            />
            <Bar dataKey="value" fill="hsl(var(--color-chart-1))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
