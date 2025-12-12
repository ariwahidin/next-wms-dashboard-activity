"use client"

import { useState, useEffect, use } from "react"
import { OutboundActivityCard } from "@/components/outbound-activity-card"
import { SearchBar } from "@/components/search-bar"
import { TopNav } from "@/components/navigation/top-nav"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
const fetcher = (url: string) => fetch(url).then(res => res.json());


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [orders, setOrders] = useState<OutboundActivity[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OutboundActivity[]>([])
  const { data, error, isLoading } = useSWR('/api/operations/outbound-activity', fetcher);

  useEffect(() => {
    document.title = "Operations - WMS Activity";
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log("Fetched outbound activity data:", data);
    setOrders(data.activity || []);
    setFilteredOrders(data.activity || []);

    // set selected date to today
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, [data]);



  useEffect(() => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) => order.shipment_id?.toLowerCase().includes(query) || order.customer_name?.toLowerCase().includes(query),
      )
    }

    // Filter by date
    if (selectedDate) {
      console.log("selectedDate", selectedDate)
      console.log("filtered", filtered)
      filtered = filtered.filter((order) => order.outbound_date === selectedDate)
    }

    setFilteredOrders(filtered)
  }, [searchQuery, selectedDate])

  // Group orders by status
  const openOrders = filteredOrders.filter((o) => o.status === "open")
  const pickingOrders = filteredOrders.filter((o) => o.status === "picking")
  const completeOrders = filteredOrders.filter((o) => o.status === "complete")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (

    <>
      <TopNav />
      <PageWrapper title="Outbound Activity" description="">

        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Outbound Activity</h1>
        </div>

        {/* Search Bar */}
        {/* <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}

        {/* Search Bar and Date Filter */}
        <div className="space-y-3 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedDate && (
              <Button variant="outline" size="sm" onClick={() => setSelectedDate("")} className="ml-2">
                Hapus Filter
              </Button>
            )}
          </div>

          {/* Display selected date info */}
          {selectedDate && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Menampilkan data untuk: <span className="font-semibold">{formatDate(selectedDate)}</span>
            </div>
          )}
        </div>

        {/* Status Sections */}
        <div className="space-y-3">
          {/* Open Orders */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Open ({openOrders.length})
            </h2>
            <OutboundActivityCard orders={openOrders} status="open" />
          </div>

          {/* Picking Orders */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Picking ({pickingOrders.length})
            </h2>
            <OutboundActivityCard orders={pickingOrders} status="picking" />
          </div>

          {/* Complete Orders */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Complete ({completeOrders.length})
            </h2>
            <OutboundActivityCard orders={completeOrders} status="complete" />
          </div>
        </div>
      </PageWrapper>
    </>



  )
}
