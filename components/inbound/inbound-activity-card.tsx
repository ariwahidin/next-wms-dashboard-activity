"use client"

import { useEffect, useRef, useState } from "react"
import { OrderDetailModal } from "./order-detail-modal";
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface InboundActivityCardProps {
  orders: InboundActivity[]
  status: "open" | "checking" | "fully received" | "partially received" | "complete"
}

export function InboundActivityCard({ orders, status }: InboundActivityCardProps) {
  const [selectedOrder, setSelectedOrder] = useState<InboundActivityDetail | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOrderClick = async (order: InboundActivity) => {
    setIsModalOpen(true)

    const res = await fetch(
      `/api/operations/inbound-activity-detail?receipt=${order.receipt_id}`
    )
    const data = await res.json()
    if (data.activity && data.activity.length > 0) {
      setSelectedOrder(data.activity[0])
    }
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current || orders.length === 0) return

    const container = scrollContainerRef.current
    let scrollPosition = 0
    let isScrollingForward = true

    const interval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth

      if (isScrollingForward) {
        scrollPosition += 2
        if (scrollPosition >= maxScroll) {
          isScrollingForward = false
          scrollPosition = maxScroll
        }
      } else {
        scrollPosition -= 2
        if (scrollPosition <= 0) {
          isScrollingForward = true
          scrollPosition = 0
        }
      }

      container.scrollLeft = scrollPosition
    }, 30)

    // Stop scrolling on hover
    container.addEventListener("mouseenter", () => clearInterval(interval))
    container.addEventListener("mouseleave", () => { })

    return () => clearInterval(interval)
  }, [orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return {
          bg: "bg-orange-50 dark:bg-orange-950",
          border: "border-orange-200 dark:border-orange-800",
          badge: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
          icon: "🟠",
        }

      case "checking":
        return {
          bg: "bg-purple-50 dark:bg-purple-950",
          border: "border-purple-200 dark:border-purple-800",
          badge: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
          icon: "🟣",
      }
      case "partially received":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950",
          border: "border-yellow-200 dark:border-yellow-800",
          badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
          icon: "🟡",
      }
      case "fully received":
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-blue-200 dark:border-blue-800",
          badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
          icon: "🟢",
        }
      case "complete":
        return {
          bg: "bg-green-50 dark:bg-green-950",
          border: "border-green-200 dark:border-green-800",
          badge: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
          icon: "✅",
        }
      default:
        return {
          bg: "bg-slate-50 dark:bg-slate-900",
          border: "border-slate-200 dark:border-slate-800",
          badge: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200",
          icon: "❓",
        }
    }
  }

  const colors = getStatusColor(status)

  if (orders.length === 0) {
    return (
      <div className={`${colors.bg} border ${colors.border} rounded-lg p-3 text-center`}>
        <p className="text-xs text-slate-600 dark:text-slate-400">Tidak ada pesanan</p>
      </div>
    )
  }

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {orders.map((order) => (
          <div
            onClick={() => handleOrderClick(order)}
            key={order.id}
            className={`flex-shrink-0 w-60 ${colors.bg} border ${colors.border} rounded-lg p-2 transition-all hover:shadow-lg hover:scale-105 duration-300 cursor-pointer`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{order.receipt_id}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{order.supplier_name}</p>

              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${colors.badge}`}>
                {order.status}
              </span>
            </div>

            {/* Quantity Section */}
            <div className="space-y-2 mb-3">

              <table className="w-full text-xs mb-1">
                <thead>
                  <tr className="border-none border-slate-200 dark:border-slate-700">
                    <th className="py-1 font-medium text-slate-600 dark:text-slate-400 text-center">Plan</th>
                    <th className="text-center py-1 font-medium text-slate-600 dark:text-slate-400">Check</th>
                    <th className="text-center py-1 font-medium text-slate-600 dark:text-slate-400">Received</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-bold text-slate-900 dark:text-white text-center">{order.quantity_req}</td>
                    <td className="py-1 font-bold text-slate-900 dark:text-white text-center">{order.quantity_scan}</td>
                    <td className="py-1 font-bold text-slate-900 dark:text-white text-center">{order.quantity_rcvd}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-lg">{colors.icon}</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                {order.inbound_date && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                    {new Date(order.inbound_date).toLocaleDateString("id-ID")}
                  </p>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
      <OrderDetailModal isOpen={isModalOpen} order={selectedOrder} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
