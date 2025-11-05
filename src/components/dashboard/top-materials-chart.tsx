'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { materialTypes } from '@/lib/data';
import type { WasteLog } from '@/lib/types';

const chartConfig = {
  value: {
    label: 'Quantity (kg)',
  },
  ...materialTypes.reduce((acc, type, index) => {
    acc[type] = {
      label: type,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {}),
} satisfies ChartConfig;

export function TopMaterialsChart({ logs }: { logs: WasteLog[] }) {
  const materialTotals = React.useMemo(() => {
    const totals = materialTypes.map((type) => ({
      name: type,
      value: logs
        .filter((log) => log.materialType === type)
        .reduce((acc, log) => acc + log.quantity, 0),
      fill: `hsl(var(--chart-${materialTypes.indexOf(type) + 1}))`,
    }));

    return totals.filter((t) => t.value > 0).sort((a, b) => b.value - a.value);
  }, [logs]);

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={materialTotals}
            dataKey="value"
            nameKey="name"
            innerRadius="50%"
            strokeWidth={5}
          >
            {materialTotals.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}