"use client"

import { TopNav } from "@/components/navigation/top-nav"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { StockLevelChart } from "@/components/dashboard/stock-level-chart"
import { InboundOutbound } from "@/components/dashboard/inbound-outbound"
import { WarehouseHeatmap } from "@/components/dashboard/warehouse-heatmap"
import { inventoryTrendData, stockLevelByWarehouse, inboundOutboundData } from "@/data/dummy-analytics"
import { warehouses } from "@/data/dummy-warehouse"
import { inventoryItems } from "@/data/dummy-inventory"
import type { ChartDataPoint, MetricCard, OutboundTransaction, OutboundTransactionByDate } from "@/types"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { OutboundBarChart } from "@/components/dashboard/outbound-bar-chart"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from 'swr';
import { Transactions } from "@/types/dashboard"
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  // Calculate metrics
  const router = useRouter()
  const totalInventory = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockCount = inventoryItems.filter((item) => item.status === "low-stock").length
  const outOfStockCount = inventoryItems.filter((item) => item.status === "out-of-stock").length
  const totalWarehouses = warehouses.length
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0)
  const totalLoad = warehouses.reduce((sum, w) => sum + w.currentLoad, 0)
  const utilization = ((totalLoad / totalCapacity) * 100).toFixed(1)
  const [userEmail, setUserEmail] = useState("")
  const [isReady, setIsReady] = useState(false)
  const { data: orders, error, isLoading } = useSWR('/api/main-dashboard', fetcher);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [stocks, setStocks] = useState<InventoryItem[]>([]);
  const [outboundData, setOutboundData] = useState<OutboundTransactionByDate[]>([]);

  useEffect(() => {
    if (!orders) return;
    console.log("Fetched orders data:", orders);
    setTransactions(orders.activity || []);
    setStocks(orders.stock || []);
    setOutboundData(orders.outbound || []);
  }, [orders]);

  const inboundCount =
    transactions?.reduce((total, order) => {
      if (order.trans_type === "inbound") return total + 1;
      return total;
    }, 0) || 0;

  const outboundCount =
    transactions?.reduce((total, order) => {
      if (order.trans_type === "outbound") return total + 1;
      return total;
    }, 0) || 0;

  const totalQtyIn = stocks?.reduce(
    (sum, item) => sum + (item.qty_in || 0),
    0
  );

  const totalQtyOut = stocks?.reduce(
    (sum, item) => sum + (item.qty_out || 0),
    0
  );

  const totalQtyOnHand = stocks?.reduce(
    (sum, item) => sum + (typeof item.qty_onhand === "string" ? parseInt(item.qty_onhand) : (item.qty_onhand ?? 0)),
    0
  );
  const totalQtyAvailable = stocks?.reduce(
    (sum, item) => sum + (typeof item.qty_available === "string" ? parseInt(item.qty_available) : (item.qty_available ?? 0)),
    0
  );
  const totalQtyAllocated = stocks?.reduce(
    (sum, item) => sum + (typeof item.qty_allocated === "string" ? parseInt(item.qty_allocated) : (item.qty_allocated ?? 0)),
    0
  );


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const email = localStorage.getItem("userEmail")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    setUserEmail(email || "")
    setIsReady(true)
  }, [router])


  if (!isReady) {
    return null
  }

  const inventoryData: ChartDataPoint[] = stocks.map((item, index) => ({
    id: item.item_code,
    name: item.item_name,
    sku: item.item_code,
    category: item.category,
    quantity: item.qty_available || 0,
    status:
      (item.qty_available || 0) === 0
        ? "out-of-stock"
        : (item.qty_available || 0) < 10
          ? "low-stock"
          : "in-stock",
    value: item.qty_available || 0,
  }));


  const metrics: MetricCard[] = [
    {
      id: "inbound-pending",
      label: "Inbound Pending",
      value: inboundCount,
      unit: "orders",
      trend: 0,
      trendDirection: "up",
      icon: "⬇️",
      color: "primary",
    },
    {
      id: "outbound-pending",
      label: "Outbound Pending",
      value: outboundCount,
      unit: "orders",
      trend: 0,
      trendDirection: "down",
      icon: "⬆️",
      color: "warning",
    },
    {
      id: "stock-on-hand",
      label: "Stock On Hand",
      value: totalQtyOnHand,
      unit: "",
      icon: "📦",
      color: "primary",
    },
    {
      id: "stock-allocations",
      label: "Stock Allocations",
      value: totalQtyAllocated,
      unit: "",
      icon: "🚫",
      color: "info",
    },
    {
      id: "stock-availability",
      label: "Stock Availability",
      value: totalQtyAvailable,
      unit: "",
      icon: "✅",
      color: "success",
    },
  ]

  return (
    <>
      <TopNav />
      <PageWrapper title="Dashboard" description="Warehouse Management System Overview">

        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Main Dashboard</h1>
          {/* <p className="text-xs text-slate-600 dark:text-slate-400">
            Kelola dan pantau status pengiriman pesanan Anda secara real-time
          </p> */}
        </div>

        {/* Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric) => (
            <MetricsCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* <InventoryChart data={inventoryTrendData} /> */}
          <InventoryTable data={inventoryData} title="Stock Available" />
          <OutboundBarChart data={outboundData} title="Outbound Transactions Chart" />
          {/* <StockLevelChart data={stockLevelByWarehouse} />
          <InboundOutbound data={inboundOutboundData} />
          <WarehouseHeatmap /> */}
        </div>
      </PageWrapper>
    </>
  )
}
