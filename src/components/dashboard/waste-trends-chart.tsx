'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyWaste}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k kg`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={4}
            {...chartConfig.total}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}