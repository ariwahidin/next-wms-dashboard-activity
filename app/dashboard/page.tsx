// app/components/LogisticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { TopNav } from '@/components/navigation/top-nav';
import { PageWrapper } from '@/components/shared/page-wrapper';

interface DailyData {
  date: string;
  count: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface LogisticsData {
  inboundDaily: DailyData[];
  outboundDaily: DailyData[];
  inboundStatus: StatusData[];
  outboundStatus: StatusData[];
}

const LogisticsDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-11');
  const [inboundData, setInboundData] = useState<DailyData[]>([]);
  const [outboundData, setOutboundData] = useState<DailyData[]>([]);
  const [inboundStatus, setInboundStatus] = useState<StatusData[]>([]);
  const [outboundStatus, setOutboundStatus] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logistics?month=${selectedMonth}`);
      const data: LogisticsData = await response.json();
      
      setInboundData(data.inboundDaily);
      setOutboundData(data.outboundDaily);
      setInboundStatus(data.inboundStatus);
      setOutboundStatus(data.outboundStatus);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const monthOptions = [
    { value: '2025-10', label: 'Oktober 2025' },
    { value: '2025-11', label: 'November 2025' },
    { value: '2025-12', label: 'Desember 2025' }
  ];

  const COLORS_INBOUND = ['#3B82F6', '#8B5CF6', '#10B981', '#06B6D4'];
  const COLORS_OUTBOUND = ['#F59E0B', '#EF4444', '#10B981'];

  const totalInbound = inboundData.reduce((sum, item) => sum + item.count, 0);
  const totalOutbound = outboundData.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <TopNav />
    <PageWrapper title="Dashboard" description="Warehouse Management System Overview">
    {/* <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"> */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Logistics Dashboard</h1>
          <p className="text-slate-400">Monitor transaksi inbound dan outbound secara real-time</p>
        </div> */}

        {/* Month Selector */}
        <div className="mb-6 mt-4 flex items-center gap-3">
          <Calendar className="text-blue-400" size={24} />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingDown className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Total Inbound</p>
                  <p className="text-white text-3xl font-bold">{totalInbound}</p>
                </div>
              </div>
            </div>
            <div className="text-blue-100 text-sm">Transaksi masuk bulan ini</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <div>
                  <p className="text-orange-100 text-sm">Total Outbound</p>
                  <p className="text-white text-3xl font-bold">{totalOutbound}</p>
                </div>
              </div>
            </div>
            <div className="text-orange-100 text-sm">Transaksi keluar bulan ini</div>
          </div>
        </div>

        {/* Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          {/* Inbound Bar Chart */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Transaksi Inbound Harian</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inboundData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Outbound Bar Chart */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-orange-400" size={24} />
              <h2 className="text-xl font-bold text-white">Transaksi Outbound Harian</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outboundData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inbound Status Pie */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Status Inbound</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inboundStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inboundStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_INBOUND[index % COLORS_INBOUND.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {inboundStatus.map((status, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS_INBOUND[idx] }}
                  />
                  <span className="text-slate-300 text-sm">{status.name}: {status.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outbound Status Pie */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Status Outbound</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={outboundStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {outboundStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_OUTBOUND[index % COLORS_OUTBOUND.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {outboundStatus.map((status, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS_OUTBOUND[idx] }}
                  />
                  <span className="text-slate-300 text-sm">{status.name}: {status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    {/* </div> */}
    </PageWrapper>
    </>
  );
};

export default LogisticsDashboard;