import type { ChartDataPoint, WarehouseAnalytics } from "@/types"

export const inventoryTrendData: ChartDataPoint[] = [
  { name: "Jan", value: 45000, value2: 38000 },
  { name: "Feb", value: 48000, value2: 40500 },
  { name: "Mar", value: 52000, value2: 42300 },
  { name: "Apr", value: 50500, value2: 43200 },
  { name: "May", value: 54000, value2: 45800 },
  { name: "Jun", value: 58500, value2: 48200 },
  { name: "Jul", value: 61200, value2: 50100 },
  { name: "Aug", value: 59800, value2: 49500 },
]

export const stockLevelByWarehouse: ChartDataPoint[] = [
  { name: "Jakarta Hub", value: 38500 },
  { name: "Surabaya Hub", value: 28200 },
  { name: "Bandung Hub", value: 19800 },
  { name: "Medan Hub", value: 14500 },
]

export const inboundOutboundData: ChartDataPoint[] = [
  { name: "Mon", value: 2400, value2: 2210 },
  { name: "Tue", value: 1398, value2: 2290 },
  { name: "Wed", value: 9800, value2: 2000 },
  { name: "Thu", value: 3908, value2: 2108 },
  { name: "Fri", value: 4800, value2: 2289 },
  { name: "Sat", value: 3800, value2: 2500 },
  { name: "Sun", value: 4300, value2: 2100 },
]

export const topProductsData: ChartDataPoint[] = [
  { name: "SKU-A001", value: 2850 },
  { name: "SKU-E005", value: 2150 },
  { name: "SKU-D004", value: 1920 },
  { name: "SKU-B002", value: 1250 },
  { name: "SKU-F006", value: 890 },
]

export const warehouseAnalytics: WarehouseAnalytics[] = [
  { warehouseId: "WH-001", inbound: 125, outbound: 108, pending: 23, completed: 1200 },
  { warehouseId: "WH-002", inbound: 98, outbound: 85, pending: 18, completed: 950 },
  { warehouseId: "WH-003", inbound: 72, outbound: 65, pending: 12, completed: 720 },
  { warehouseId: "WH-004", inbound: 45, outbound: 38, pending: 8, completed: 420 },
]
