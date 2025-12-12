// app/api/logistics/route.ts
import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface InboundRaw {
  inbound_date?: string;
  quantity: string;
}

interface OutboundRaw {
  outbound_date?: string;
  quantity: string;
}

interface InboundStatusRaw {
  status: string;
  count: number;
}

interface OutboundStatusRaw {
  status: string;
  count: number;
}

interface DailyData {
  date: string;
  count: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface LogisticsResponse {
  inboundDaily: DailyData[];
  outboundDaily: DailyData[];
  inboundStatus: StatusData[];
  outboundStatus: StatusData[];
}

// Fungsi untuk transform data bar chart
function transformToChartData(
  rawData: (InboundRaw | OutboundRaw)[],
  dateField: 'inbound_date' | 'outbound_date',
  year: number,
  month: number
): DailyData[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyMap = new Map<string, number>();

  // Aggregate data by date
  rawData.forEach(item => {
    // @ts-ignore
    const date = new Date(item[dateField]);
    if (date.getFullYear() === year && date.getMonth() === month - 1) {
      const day = date.getDate().toString().padStart(2, '0');
      const currentCount = dailyMap.get(day) || 0;
      dailyMap.set(day, currentCount + parseInt(item.quantity));
    }
  });

  // Generate full month data (including empty days)
  const result: DailyData[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day.toString().padStart(2, '0');
    result.push({
      date: dayStr,
      count: dailyMap.get(dayStr) || 0
    });
  }

  return result;
}

// Fungsi untuk transform data pie chart
function transformStatusData(
  rawStatusData: (InboundStatusRaw | OutboundStatusRaw)[]
): StatusData[] {
  return rawStatusData.map(item => ({
    name: item.status,
    value: item.count
  }));
}

export async function GET(request: NextRequest): Promise<NextResponse<LogisticsResponse>> {
  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get('month') || '2024-11';
  const [year, month] = monthParam.split('-').map(Number);

  // ============================================
  // DATA UNTUK BAR CHART (Transaksi Harian)
  // ============================================
  // const inboundRawData: InboundRaw[] = [
  //   { inbound_date: "2024-10-16", quantity: "578" },
  //   { inbound_date: "2024-10-16", quantity: "320" },
  //   { inbound_date: "2024-10-17", quantity: "450" },
  //   { inbound_date: "2024-10-18", quantity: "290" },
  //   { inbound_date: "2024-10-21", quantity: "610" },
  //   { inbound_date: "2024-10-22", quantity: "380" },
  //   { inbound_date: "2024-10-23", quantity: "520" },
  //   { inbound_date: "2024-10-24", quantity: "440" },
  //   { inbound_date: "2024-10-25", quantity: "350" },
  //   { inbound_date: "2024-11-01", quantity: "490" },
  //   { inbound_date: "2024-11-04", quantity: "560" },
  //   { inbound_date: "2024-11-05", quantity: "410" },
  //   { inbound_date: "2024-11-06", quantity: "480" },
  //   { inbound_date: "2024-11-07", quantity: "390" },
  //   { inbound_date: "2024-11-08", quantity: "530" },
  //   { inbound_date: "2024-11-11", quantity: "460" },
  //   { inbound_date: "2024-11-12", quantity: "420" },
  //   { inbound_date: "2024-11-13", quantity: "510" },
  //   { inbound_date: "2024-11-14", quantity: "370" },
  //   { inbound_date: "2024-11-15", quantity: "590" },
  // ];

  const inboundRawData = await getInboundTransactionByDate();

  const outboundRawData = await getOutboundTransactionByDate();

  // const outboundRawData: OutboundRaw[] = [
  //   { outbound_date: "2024-10-16", quantity: "445" },
  //   { outbound_date: "2024-10-16", quantity: "280" },
  //   { outbound_date: "2024-10-17", quantity: "520" },
  //   { outbound_date: "2024-10-18", quantity: "360" },
  //   { outbound_date: "2024-10-21", quantity: "490" },
  //   { outbound_date: "2024-10-22", quantity: "410" },
  //   { outbound_date: "2024-10-23", quantity: "550" },
  //   { outbound_date: "2024-10-24", quantity: "380" },
  //   { outbound_date: "2024-10-25", quantity: "470" },
  //   { outbound_date: "2024-11-01", quantity: "510" },
  //   { outbound_date: "2024-11-04", quantity: "430" },
  //   { outbound_date: "2024-11-05", quantity: "490" },
  //   { outbound_date: "2024-11-06", quantity: "540" },
  //   { outbound_date: "2024-11-07", quantity: "360" },
  //   { outbound_date: "2024-11-08", quantity: "480" },
  //   { outbound_date: "2024-11-11", quantity: "420" },
  //   { outbound_date: "2024-11-12", quantity: "510" },
  //   { outbound_date: "2024-11-13", quantity: "460" },
  //   { outbound_date: "2024-11-14", quantity: "390" },
  //   { outbound_date: "2024-11-15", quantity: "530" },
  // ];

  // ============================================
  // DATA UNTUK PIE CHART (Status Transaksi)
  // ============================================
  // const inboundStatusRawData: InboundStatusRaw[] = [
  //   { status: "Open", count: 15 },
  //   { status: "Checking", count: 23 },
  //   { status: "Received", count: 18 },
  //   { status: "Complete", count: 44 }
  // ];

  const inboundStatusRawData = await getInboundStatus();
  const outboundStatusRawData = await getOutboundStatus();

  // const outboundStatusRawData: OutboundStatusRaw[] = [
  //   { status: "Open", count: 12 },
  //   { status: "Picking", count: 28 },
  //   { status: "Complete", count: 52 }
  // ];

  // Transform data untuk chart
  const inboundDaily = transformToChartData(inboundRawData, 'inbound_date', year, month);
  const outboundDaily = transformToChartData(outboundRawData, 'outbound_date', year, month);
  const inboundStatus = transformStatusData(inboundStatusRawData);
  const outboundStatus = transformStatusData(outboundStatusRawData);

  return NextResponse.json({
    inboundDaily,
    outboundDaily,
    inboundStatus,
    outboundStatus
  });
}

export async function getOutboundTransactionByDate() {
  const sql = `SELECT a.outbound_date, 
    SUM(b.quantity) as quantity
    FROM outbound_headers a
    LEFT JOIN outbound_details b on a.id = b.outbound_id
    WHERE a.[status] <> 'cancel' 
    GROUP BY a.outbound_date
    ORDER BY a.outbound_date ASC`;
  return queryDB(sql);
}
export async function getInboundTransactionByDate() {
  const sql = `SELECT a.inbound_date, 
    SUM(b.quantity) as quantity
    FROM inbound_headers a
    LEFT JOIN inbound_details b on a.id = b.inbound_id
    WHERE a.[status] <> 'cancel' 
    GROUP BY a.inbound_date
    ORDER BY a.inbound_date ASC`;
  return queryDB(sql);
}

export async function getInboundStatus() {
  const sql = `WITH statusInbound AS (
    SELECT 
        a.inbound_date, 
        SUM(b.quantity) AS quantity,
        a.[status]
    FROM inbound_headers a
    LEFT JOIN inbound_details b ON a.id = b.inbound_id
    WHERE a.[status] <> 'cancel'
    GROUP BY a.inbound_date, a.status
),
sumStatus AS (
    SELECT 
        [status],
        SUM(quantity) AS total_quantity_per_status
    FROM statusInbound
    GROUP BY [status]
),
grandTotal AS (
    SELECT SUM(total_quantity_per_status) AS grand_total
    FROM sumStatus
)
SELECT 
    s.[status],
    CAST((s.total_quantity_per_status * 100.0) / g.grand_total AS DECIMAL(10,2)) AS [count]
FROM sumStatus s
CROSS JOIN grandTotal g;`;
  return queryDB(sql);
}
export async function getOutboundStatus() {
  const sql = `WITH statusOutbound AS (
    SELECT 
        a.outbound_date, 
        SUM(b.quantity) AS quantity,
        a.[status]
    FROM outbound_headers a
    LEFT JOIN outbound_details b ON a.id = b.outbound_id
    -- WHERE a.[status] <> 'cancel'
    GROUP BY a.outbound_date, a.status
),
sumStatus AS (
    SELECT 
        [status],
        SUM(quantity) AS total_quantity_per_status
    FROM statusOutbound
    GROUP BY [status]
),
grandTotal AS (
    SELECT SUM(total_quantity_per_status) AS grand_total
    FROM sumStatus
)
SELECT 
    s.[status],
    CAST((s.total_quantity_per_status * 100.0) / g.grand_total AS DECIMAL(10,2)) AS [count]
FROM sumStatus s
CROSS JOIN grandTotal g;;`;
  return queryDB(sql);
}

/* 
=======================================================================
CONTOH QUERY JIKA MENGGUNAKAN DATABASE (Prisma)
=======================================================================

// Query untuk Bar Chart - Transaksi Harian
const inboundRawData = await prisma.inbound.findMany({
  where: {
    inbound_date: {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1)
    }
  },
  select: {
    inbound_date: true,
    quantity: true
  }
});

const outboundRawData = await prisma.outbound.findMany({
  where: {
    outbound_date: {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1)
    }
  },
  select: {
    outbound_date: true,
    quantity: true
  }
});

// Query untuk Pie Chart - Status Transaksi
const inboundStatusRawData = await prisma.inbound.groupBy({
  by: ['status'],
  where: {
    inbound_date: {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1)
    }
  },
  _count: {
    status: true
  }
}).then(results => results.map(r => ({
  status: r.status,
  count: r._count.status
})));

const outboundStatusRawData = await prisma.outbound.groupBy({
  by: ['status'],
  where: {
    outbound_date: {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1)
    }
  },
  _count: {
    status: true
  }
}).then(results => results.map(r => ({
  status: r.status,
  count: r._count.status
})));

=======================================================================
CONTOH QUERY JIKA MENGGUNAKAN RAW SQL
=======================================================================

// Bar Chart - Inbound
const inboundRawData = await db.query(`
  SELECT inbound_date, quantity 
  FROM inbound 
  WHERE YEAR(inbound_date) = ? AND MONTH(inbound_date) = ?
`, [year, month]);

// Bar Chart - Outbound
const outboundRawData = await db.query(`
  SELECT outbound_date, quantity 
  FROM outbound 
  WHERE YEAR(outbound_date) = ? AND MONTH(outbound_date) = ?
`, [year, month]);

// Pie Chart - Inbound Status
const inboundStatusRawData = await db.query(`
  SELECT status, COUNT(*) as count 
  FROM inbound 
  WHERE YEAR(inbound_date) = ? AND MONTH(inbound_date) = ?
  GROUP BY status
`, [year, month]);

// Pie Chart - Outbound Status
const outboundStatusRawData = await db.query(`
  SELECT status, COUNT(*) as count 
  FROM outbound 
  WHERE YEAR(outbound_date) = ? AND MONTH(outbound_date) = ?
  GROUP BY status
`, [year, month]);

*/