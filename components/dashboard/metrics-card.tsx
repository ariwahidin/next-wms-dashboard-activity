import { cn } from "@/lib/utils"
import type { MetricCard as MetricCardType } from "@/types"

interface MetricsCardProps {
  metric: MetricCardType
}

export function MetricsCard({ metric }: MetricsCardProps) {
  const colorMap = {
    primary: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/30",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    info: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
  }

  const color = colorMap[metric.color || "primary"]

  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{metric.value}</span>
            {metric.unit && <span className="text-sm text-muted-foreground">{metric.unit}</span>}
          </div>
          {/* {metric.trend !== undefined && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-semibold",
                  metric.trendDirection === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {metric.trendDirection === "up" ? "↑" : "↓"} {Math.abs(metric.trend)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )} */}
        </div>
        {metric.icon && (
          <div className={cn("rounded-lg p-3", color.bg)}>
            <span className="text-xl">{metric.icon}</span>
          </div>
        )}
      </div>
    </div>
  )
}
