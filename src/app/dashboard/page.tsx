'use client';

import React from 'react';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projectSites, materialTypes } from '@/lib/data';
import type { WasteLog } from '@/lib/types';
import { fetchWasteLogs } from '@/services/arService';
import { StatsCards } from '@/components/dashboard/stats-cards';
import useWasteLive from '@/hooks/useWasteLive';
import { WasteTrendsChart } from '@/components/dashboard/waste-trends-chart';
import { TopMaterialsChart } from '@/components/dashboard/top-materials-chart';
import { RecentLogsTable } from '@/components/dashboard/recent-logs-table';
import GISMapExample from '@/components/GISMapExample';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DiversionRateChart } from '@/components/dashboard/diversion-rate-chart';
import { Separator } from '@/components/ui/separator';
import { AIChat } from '@/components/dashboard/ai-chat';
import AISafetyMonitor from '@/components/ai/AISafetyMonitor';
import RiskPredictor from '@/components/ai/RiskPredictor';
import ARBlueprintViewer from '@/components/ar-vr/ARBlueprintViewer';

import BlockchainEventsPanel from '@/components/dashboard/blockchain-events';

// Importing VR Safety Training
import VRSafetyTraining from '@/components/ar-vr/VRSafetyTraining.js';

export default function DashboardPage() {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [selectedSite, setSelectedSite] = React.useState('all');
  const [selectedMaterial, setSelectedMaterial] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setDate({
      from: addDays(new Date(), -29),
      to: new Date(),
    });
    setIsClient(true);
  }, []);

  const [wasteLogs, setWasteLogs] = React.useState<WasteLog[]>([]);

  React.useEffect(() => {
    if (isClient) {
      fetchWasteLogs().then(res => {
        if (res.status === 'ok') {
          // Convert date strings to Date objects for filtering
          const logs: WasteLog[] = res.logs.map((log: any) => ({
            ...log,
            date: log.date ? new Date(log.date) : new Date(),
          }));
          setWasteLogs(logs);
        }
      });
    }
  }, [isClient]);

  // Live subscription: append incoming waste logs pushed by the GIS backend.
  // This provides near-real-time updates to the dashboard charts without a
  // full reload. useWasteLive is a hook and must be called at the top level of
  // the component; it accepts an `enabled` flag so it is safe to call here.
  const handleIncoming = React.useCallback((payload: any) => {
    const incoming: WasteLog = {
      id: payload.id,
      site: payload.site,
      materialType: payload.materialType,
      quantity: Number(payload.quantity) || 0,
      disposalMethod: payload.disposalMethod || 'Unknown',
      date: payload.date ? new Date(payload.date) : new Date(),
      binId: payload.binId || '',
      cause: payload.cause || '',
    };

    setWasteLogs((prev) => {
      if (prev.find((l) => l.id === incoming.id)) return prev;
      return [incoming, ...prev];
    });
  }, []);

  // Call the hook unconditionally (hook handles `enabled` guard internally).
  useWasteLive(handleIncoming, isClient);

  const filteredLogs = React.useMemo(() => {
    if (!isClient || !date?.from || !date?.to) {
      return [];
    }
    return wasteLogs.filter((log: WasteLog) => {
      const isAfterStartDate = log.date >= (date.from as Date);
      const isBeforeEndDate = log.date <= (date.to as Date);
      const inDateRange = isAfterStartDate && isBeforeEndDate;

      const matchesSite =
        selectedSite === 'all' || log.site === selectedSite;
      const matchesMaterial =
        selectedMaterial === 'all' || log.materialType === selectedMaterial;

      const matchesSearch =
        searchTerm.trim() === '' ||
        log.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.disposalMethod.toLowerCase().includes(searchTerm.toLowerCase());

      return inDateRange && matchesSite && matchesMaterial && matchesSearch;
    });
  }, [date, selectedSite, selectedMaterial, searchTerm, isClient, wasteLogs]);

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="grid gap-1">
              <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">
                Dashboard
              </CardTitle>
              <CardDescription>
                An overview of waste management performance.
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal col-span-1 md:col-span-1',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {projectSites.map((site) => (
                  <SelectItem key={site.id} value={site.name}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedMaterial}
              onValueChange={setSelectedMaterial}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Materials" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <StatsCards logs={filteredLogs} selectedSite={selectedSite} />
      
      <Card>
        <CardHeader>
          <CardTitle>Project Sites Map</CardTitle>
          <CardDescription>
            Spatial view of project sites and recent waste logs. Use filters to focus the map.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GISMapExample />
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Waste Generation Trends</CardTitle>
            <CardDescription>
              Total waste generated per day in the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <WasteTrendsChart
              logs={filteredLogs}
              dateRange={{
                from: date?.from || new Date(),
                to: date?.to || new Date(),
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Diversion Rate Trend</CardTitle>
            <CardDescription>
              Recycling rate percentage over the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DiversionRateChart
              logs={filteredLogs}
              dateRange={{
                from: date?.from || new Date(),
                to: date?.to || new Date(),
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Waste Materials</CardTitle>
            <CardDescription>
              Most common materials by quantity in the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopMaterialsChart logs={filteredLogs} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Waste Logs</CardTitle>
          <CardDescription>
            A list of the most recently logged waste entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentLogsTable logs={filteredLogs} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Safety Monitor</CardTitle>
            <CardDescription>
              Real-time safety alerts and risk predictions powered by AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AISafetyMonitor />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Predictor</CardTitle>
            <CardDescription>
              AI-powered risk score and incident estimate for your site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskPredictor />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>AR Blueprint Viewer</CardTitle>
            <CardDescription>
              View construction blueprints in AR.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ARBlueprintViewer />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>VR Safety Training</CardTitle>
            <CardDescription>
              Interactive VR safety training modules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VRSafetyTraining />
          </CardContent>
        </Card>
      </div>
      <AIChat logs={filteredLogs} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Blockchain Activity</CardTitle>
          <CardDescription>
            Recent blockchain events and proofs for audit and transparency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlockchainEventsPanel />
        </CardContent>
      </Card>
    </div>
  );
}
