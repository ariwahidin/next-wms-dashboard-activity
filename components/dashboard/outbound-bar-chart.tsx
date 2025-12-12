"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { OutboundTransaction, OutboundTransactionByDate } from "@/types"

interface OutboundBarChartProps {
    data: OutboundTransactionByDate[]
    title?: string
}

export function OutboundBarChart({ data, title = "Outbound Transactions Chart" }: OutboundBarChartProps) {

    console.log("data outbound bar chart: ", data)

    const safeData = Array.isArray(data) ? data : []
    const currentDate = new Date()

    const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0"))
    const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()))
    const [weekOffset, setWeekOffset] = useState(0)
    const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly")

    // Generate month and year options
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1).padStart(2, "0"),
        label: new Date(2024, i).toLocaleString("en-US", { month: "long" }),
    }))

    const currentDateForOptions = new Date()
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = currentDateForOptions.getFullYear() - 2 + i
        return { value: String(year), label: String(year) }
    })

    // Process data for chart
    const chartData = useMemo(() => {
        const monthNum = Number.parseInt(selectedMonth)
        const yearNum = Number.parseInt(selectedYear)
        const lastDay = new Date(yearNum, monthNum, 0).getDate()

        // Initialize data for each day
        const dailyData: Record<number, { quantity: number; count: number }> = {}
        for (let day = 1; day <= lastDay; day++) {
            dailyData[day] = { quantity: 0, count: 0 }
        }

        // Aggregate data by day
        safeData.forEach((transaction) => {
            const transDate = new Date(transaction.outbound_date)
            const transMonth = transDate.getMonth() + 1
            const transYear = transDate.getFullYear()
            const day = transDate.getDate()

            if (transMonth === monthNum && transYear === yearNum) {
                dailyData[day].quantity += parseInt(transaction.quantity)
                dailyData[day].count += 1
            }
        })

        // Create array for all days
        const allDays = Array.from({ length: lastDay }, (_, i) => {
            const day = i + 1
            const date = new Date(yearNum, monthNum - 1, day)
            return {
                day: `${day}`,
                fullDate: date,
                dayName: date.toLocaleDateString("id-ID", { weekday: "short" }),
                quantity: dailyData[day].quantity,
                transactions: dailyData[day].count,
            }
        })

        if (viewMode === "monthly") {
            return allDays
        }

        // Calculate week start date based on weekOffset
        const startOfCurrentWeek = new Date(currentDate)
        startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay() + weekOffset * 7)
        startOfCurrentWeek.setHours(0, 0, 0, 0)

        const weekStart = startOfCurrentWeek.getDate()
        const weekEnd = weekStart + 6

        // Filter days that belong to this week and month
        return allDays.filter((day) => {
            const dayNum = Number.parseInt(day.day)
            return dayNum >= weekStart && dayNum <= weekEnd
        })
    }, [safeData, selectedMonth, selectedYear, weekOffset, viewMode, currentDate])

    const monthNum = Number.parseInt(selectedMonth)
    const yearNum = Number.parseInt(selectedYear)
    const lastDay = new Date(yearNum, monthNum, 0).getDate()
    const canNavigate = {
        prev: weekOffset > -Math.ceil(lastDay / 7) + 1,
        next: weekOffset < 0,
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="flex gap-2 mt-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-1 border rounded px-1">
                        <Button
                            size="sm"
                            variant={viewMode === "weekly" ? "default" : "ghost"}
                            className="h-7 text-xs px-2"
                            onClick={() => {
                                setViewMode("weekly")
                                setWeekOffset(0)
                            }}
                        >
                            Week
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === "monthly" ? "default" : "ghost"}
                            className="h-7 text-xs px-2"
                            onClick={() => setViewMode("monthly")}
                        >
                            Month
                        </Button>
                    </div>
                </div>

                {viewMode === "weekly" && (
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 bg-transparent"
                            onClick={() => setWeekOffset((prev) => prev - 1)}
                            disabled={!canNavigate.prev}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground flex-1 text-center">
                            Week {Math.abs(weekOffset) === 0 ? "Now" : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 bg-transparent"
                            onClick={() => setWeekOffset((prev) => prev + 1)}
                            disabled={!canNavigate.next}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" vertical={false} />
                        <XAxis
                            dataKey="dayName"
                            tick={({ x, y, payload }) => {
                                const item = chartData.find((d) => d.dayName === payload.value)
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text x={0} y={0} dy={4} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={11}>
                                            {item?.day}
                                        </text>
                                        <text x={0} y={14} dy={0} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={10}>
                                            {payload.value}
                                        </text>
                                    </g>
                                )
                            }}
                            height={40}
                        />
                        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                            content={({ payload, label }) => {
                                if (!payload || !payload.length) return null

                                // ambil item berdasarkan dayName (label)
                                const item = chartData.find(d => d.dayName === label)
                                const finalLabel = item ? `${item.day} ${label}` : label
                                const qty = Number(payload[0].value)

                                return (
                                    <div
                                        style={{
                                            background: "#000",
                                            color: "#fff",
                                            padding: "6px 10px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            border: "1px solid #333"
                                        }}
                                    >
                                        <div>{finalLabel}</div>
                                        <div>Qty: {qty}</div>
                                    </div>
                                )
                            }}
                        />


                        <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>Days: {chartData.length}</span>
                    <span>
                        Total: {
                            chartData.reduce(
                                (sum, d) => sum + (typeof d.quantity === "string" ? parseInt(d.quantity) : d.quantity),
                                0
                            )
                        }
                    </span>
                    <span>Active: {chartData.filter((d) => d.quantity > 0).length}</span>
                </div>
            </CardContent>
        </Card>
    )
}
