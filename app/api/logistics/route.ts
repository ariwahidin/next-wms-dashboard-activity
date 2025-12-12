import { NextRequest, NextResponse } from 'next/server';

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

// Generate data untuk seluruh bulan
function generateMonthlyData(year: number, month: number): { 
  inboundDaily: DailyData[]; 
  outboundDaily: DailyData[]; 
} {
  const daysInMonth = new Date(year, month, 0).getDate();
  const inboundDaily: DailyData[] = [];
  const outboundDaily: DailyData[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayName = date.getDay();
    const dateStr = day.toString().padStart(2, '0');
    
    // Sabtu (6) dan Minggu (0) = 0 transaksi
    const isWeekend = dayName === 0 || dayName === 6;
    
    inboundDaily.push({
      date: dateStr,
      count: isWeekend ? 0 : Math.floor(Math.random() * 50) + 10
    });
    
    outboundDaily.push({
      date: dateStr,
      count: isWeekend ? 0 : Math.floor(Math.random() * 45) + 15
    });
  }
  
  return { inboundDaily, outboundDaily };
}

export async function GET(request: NextRequest): Promise<NextResponse<LogisticsResponse>> {
  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get('month') || '2024-11';
  const [year, month] = monthParam.split('-').map(Number);
  
  const { inboundDaily, outboundDaily } = generateMonthlyData(year, month);
  
  // Generate status data
  const inboundStatus: StatusData[] = [
    { name: 'Open', value: Math.floor(Math.random() * 30) + 10 },
    { name: 'Checking', value: Math.floor(Math.random() * 25) + 15 },
    { name: 'Received', value: Math.floor(Math.random() * 20) + 10 },
    { name: 'Complete', value: Math.floor(Math.random() * 40) + 30 }
  ];
  
  const outboundStatus: StatusData[] = [
    { name: 'Open', value: Math.floor(Math.random() * 25) + 15 },
    { name: 'Picking', value: Math.floor(Math.random() * 30) + 20 },
    { name: 'Complete', value: Math.floor(Math.random() * 35) + 25 }
  ];
  
  return NextResponse.json({
    inboundDaily,
    outboundDaily,
    inboundStatus,
    outboundStatus
  });
}