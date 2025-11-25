"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartDataPoint } from "@/types"

interface InboundOutboundProps {
  data: ChartDataPoint[]
  title?: string
  description?: string
}

export function InboundOutbound({
  data,
  title = "Inbound vs Outbound",
  description = "Weekly movement comparison",
}: InboundOutboundProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--color-chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--color-chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--color-muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
              labelStyle={{ color: "hsl(var(--color-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--color-chart-1))"
              fillOpacity={1}
              fill="url(#colorInbound)"
              name="Inbound"
            />
            <Area
              type="monotone"
              dataKey="value2"
              stroke="hsl(var(--color-chart-2))"
              fillOpacity={1}
              fill="url(#colorOutbound)"
              name="Outbound"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
