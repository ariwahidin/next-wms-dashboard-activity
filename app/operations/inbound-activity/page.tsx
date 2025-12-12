"use client"

import { useState, useEffect, use } from "react"
import { SearchBar } from "@/components/inbound/search-bar"
import { TopNav } from "@/components/navigation/top-nav"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { InboundActivityCard } from "@/components/inbound/inbound-activity-card"
const fetcher = (url: string) => fetch(url).then(res => res.json());


export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [orders, setOrders] = useState<InboundActivity[]>([])
  const [filteredOrders, setFilteredOrders] = useState<InboundActivity[]>([])
  const { data, error, isLoading } = useSWR('/api/operations/inbound-activity', fetcher);

  useEffect(() => {
    document.title = "Inbound - WMS Activity";
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log("Fetched inbound activity data:", data);
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
        (order) => order.receipt_id?.toLowerCase().includes(query) || order.supplier_name?.toLowerCase().includes(query),
      )
    }

    // Filter by date
    if (selectedDate) {
      console.log("selectedDate", selectedDate)
      console.log("filtered", filtered)
      filtered = filtered.filter((order) => order.inbound_date === selectedDate)
    }

    setFilteredOrders(filtered)
  }, [searchQuery, selectedDate])

  // Group orders by status
  const openOrders = filteredOrders.filter((o) => o.status === "open")
  const receivedOrders = filteredOrders.filter((o) => o.status === "fully received" || o.status === "partially received" || o.status === "checking")
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
      <PageWrapper title="Inbound Activity" description="">

        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Inbound Activity</h1>
        </div>

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
            <InboundActivityCard orders={openOrders} status="open" />
          </div>

          {/* Picking Orders */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Check in ({receivedOrders.length})
            </h2>
            <InboundActivityCard orders={receivedOrders} status={"checking"}  />
          </div>

          {/* Complete Orders */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Complete ({completeOrders.length})
            </h2>
            <InboundActivityCard orders={completeOrders} status="complete" />
          </div>
        </div>
      </PageWrapper>
    </>



  )
}
