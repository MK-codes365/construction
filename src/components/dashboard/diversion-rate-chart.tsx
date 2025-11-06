"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Brush,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { WasteLog } from '@/lib/types';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';

const chartConfig = {
  rate: {
    label: 'Diversion Rate',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function DiversionRateChart({
  logs,
  dateRange,
}: {
  logs: WasteLog[];
  dateRange: { from: Date; to: Date };
}) {
  const dailyData = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  }).map((day) => {
    const dayLogs = logs.filter((log) => isSameDay(log.date, day));
    const totalWaste = dayLogs.reduce((acc, log) => acc + log.quantity, 0);
    const recycledWaste = dayLogs
      .filter((log) => log.disposalMethod === 'Recycled')
      .reduce((acc, log) => acc + log.quantity, 0);
    const rate = totalWaste > 0 ? (recycledWaste / totalWaste) * 100 : 0;

    return {
      date: format(day, 'MMM d'),
      rate: rate,
    };
  });

  // compute average diversion rate for reference
  const avgRate =
    dailyData.reduce((s, d) => s + (d.rate || 0), 0) / Math.max(1, dailyData.length);

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="gradRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-rate)" stopOpacity={0.85} />
              <stop offset="100%" stopColor="var(--color-rate)" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            domain={[0, 100]}
          />
          <Tooltip
            content={<ChartTooltipContent formatter={(value) => `${(value as number).toFixed(1)}%`} indicator="dot" />}
          />
          <ReferenceLine y={avgRate} strokeOpacity={0.2} strokeDasharray="3 6" label={{ value: `Avg ${avgRate.toFixed(0)}%`, position: 'top' }} />
          <Area
            dataKey="rate"
            type="monotone"
            stroke="var(--color-rate)"
            strokeWidth={2}
            fill="url(#gradRate)"
            activeDot={{ r: 5 }}
            animationDuration={700}
          />
          <Brush dataKey="date" height={24} stroke="#ccc" travellerWidth={8} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
