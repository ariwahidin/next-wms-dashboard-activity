"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartDataPoint } from "@/types"

interface InventoryChartProps {
  data: ChartDataPoint[]
  title?: string
  description?: string
}

export function InventoryChart({
  data,
  title = "Inventory Trend",
  description = "Monthly inventory levels",
}: InventoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
              labelStyle={{ color: "hsl(var(--color-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--color-chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--color-chart-1))", r: 4 }}
              activeDot={{ r: 6 }}
              name="Total"
            />
            {data[0]?.value2 && (
              <Line
                type="monotone"
                dataKey="value2"
                stroke="hsl(var(--color-chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--color-chart-2))", r: 4 }}
                activeDot={{ r: 6 }}
                name="Available"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
