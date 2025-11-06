'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ReferenceLine,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { WasteLog } from '@/lib/types';
import { format, subDays, eachDayOfInterval, isWithinInterval } from 'date-fns';

const chartConfig = {
  total: {
    label: 'Total Waste (kg)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function WasteTrendsChart({
  logs,
  dateRange,
}: {
  logs: WasteLog[];
  dateRange: { from: Date; to: Date };
}) {
  const dailyWaste = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  }).map((day) => ({
    date: format(day, 'MMM d'),
    total: 0,
  }));

  logs.forEach((log) => {
    if (
      isWithinInterval(log.date, { start: dateRange.from, end: dateRange.to })
    ) {
      const dateStr = format(log.date, 'MMM d');
      const entry = dailyWaste.find((d) => d.date === dateStr);
      if (entry) {
        entry.total += log.quantity;
      }
    }
  });

  // compute a simple average for a reference line
  const avg = dailyWaste.reduce((s, d) => s + d.total, 0) / Math.max(1, dailyWaste.length);

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyWaste} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.85} />
              <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k kg`}
          />
          <Tooltip content={<ChartTooltipContent indicator="dot" />} />
          <ReferenceLine y={avg} strokeOpacity={0.2} strokeDasharray="3 6" label={{ value: `Avg ${Math.round(avg)} kg`, position: 'top' }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--color-total)"
            fillOpacity={1}
            fill="url(#gradTotal)"
            activeDot={{ r: 6 }}
            animationDuration={700}
          />
          <Brush dataKey="date" height={24} stroke="#ccc" travellerWidth={8} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}