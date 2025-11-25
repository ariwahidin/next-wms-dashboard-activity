// Dashboard Types
export interface MetricCard {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: number
  trendDirection?: "up" | "down"
  icon?: string
  color?: "primary" | "success" | "warning" | "danger" | "info"
}

// Inventory Types
export interface InventoryItem {
  id: string
  sku: string
  name: string
  quantity: number
  warehouseId: string
  minStock: number
  maxStock: number
  location: string
  lastUpdated: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

// Warehouse Types
export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  currentLoad: number
  zones: number
}

// Analytics Types
// export interface ChartDataPoint {
//   name: string
//   value: number
//   value2?: number
//   timestamp?: string
// }

export type ChartDataPoint = {
  name: string
  value: number
  value2?: number
  id?: string
  sku?: string
  category?: string
  quantity?: number
  status?: "in-stock" | "low-stock" | "out-of-stock"
}

export interface WarehouseAnalytics {
  warehouseId: string
  inbound: number
  outbound: number
  pending: number
  completed: number
}

export type OutboundTransaction = {
  id: string
  date: Date | string
  itemName: string
  sku: string
  quantity: number
  destination: string
  status: "pending" | "shipped" | "delivered"
}

export type OutboundTransactionByDate = {
  outbound_date: Date | string
  quantity: string 
}

