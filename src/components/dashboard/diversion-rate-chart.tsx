'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
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

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dailyData}>
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
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            domain={[0, 100]}
          />
          <Tooltip
            content={<ChartTooltipContent 
                formatter={(value) => `${(value as number).toFixed(1)}%`}
                indicator="dot" 
            />}
          />
          <Line
            dataKey="rate"
            type="monotone"
            stroke="var(--color-rate)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
