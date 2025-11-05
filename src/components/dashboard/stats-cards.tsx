'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Recycle,
  Scale,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import type { WasteLog, ProjectSite } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { projectSites } from '@/lib/data';

const WASTE_THRESHOLD = 4000; // 4 tons in kg

export function StatsCards({
  logs,
  selectedSite,
}: {
  logs: WasteLog[];
  selectedSite: string;
}) {
  const totalWaste = logs.reduce((acc, log) => acc + log.quantity, 0);
  const recycledWaste = logs
    .filter((log) => log.disposalMethod === 'Recycled')
    .reduce((acc, log) => acc + log.quantity, 0);
  const disposedWaste = totalWaste - recycledWaste;
  const recyclingRate = totalWaste > 0 ? (recycledWaste / totalWaste) * 100 : 0;

  const thresholdExceeded = totalWaste > WASTE_THRESHOLD;

  const totalSquareMeters =
    selectedSite === 'all'
      ? projectSites.reduce((acc, site) => acc + site.squareMeters, 0)
      : projectSites.find((site) => site.name === selectedSite)
          ?.squareMeters || 0;

  const wastePerSqM =
    totalSquareMeters > 0 ? totalWaste / totalSquareMeters : 0;

  return (
    <>
      {thresholdExceeded && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Waste Threshold Exceeded</AlertTitle>
          <AlertDescription>
            The total waste generated in the selected period has exceeded the{' '}
            {(WASTE_THRESHOLD / 1000).toFixed(1)} ton limit.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Waste Generated
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalWaste / 1000).toFixed(2)} tons
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current filters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Density</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wastePerSqM.toFixed(2)} kg/m²
            </div>
            <p className="text-xs text-muted-foreground">
              Waste per square meter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recycled Waste
            </CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(recycledWaste / 1000).toFixed(2)} tons
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current filters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disposed Waste</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(disposedWaste / 1000).toFixed(2)} tons
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current filters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recycling Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recyclingRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current filters
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
