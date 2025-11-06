'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isWithinInterval } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { projectSites, wasteLogs } from '@/lib/data';
import type { WasteLog } from '@/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { anchorReportToBlockchain } from '@/lib/blockchain';
import sha256 from 'crypto-js/sha256';

const reportSchema = z.object({
  reportType: z.string(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  project: z.string(),
  format: z.string(),
});

type ReportValues = z.infer<typeof reportSchema>;

// Function to convert array of objects to CSV
const convertToCSV = (data: any[], header: string[]) => {
  const replacer = (key: any, value: any) => (value === null ? '' : value);
  const csv = [
    header.join(','),
    ...data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    ),
  ].join('\r\n');
  return csv;
};

// Function to trigger file download
const downloadFile = async (content: string, filename: string, mimeType: string, description: string) => {
  // Hash content and anchor to blockchain
  const hash = sha256(content).toString();
  const result = await anchorReportToBlockchain(hash, description);
  // Show blockchain proof in toast
  if (result.status === 'ok') {
    window.alert(`Report anchored to blockchain!\nTx: ${result.txHash}\nBlock: ${result.blockNumber}`);
  } else {
    window.alert(`Blockchain anchoring failed: ${result.message}`);
  }
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const downloadPDF = (
  title: string,
  headers: string[],
  data: any[][],
  filename: string,
  blockchainProof?: { txHash: string; blockNumber: number }
) => {
  const doc = new jsPDF();
  doc.text(title, 14, 20);
  // Get the final Y position from autoTable's return value
  // autoTable returns void, but attaches finalY to doc
  autoTable(doc, {
    startY: 25,
    head: [headers],
    body: data,
  });
  // @ts-ignore
  const y = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 25 + data.length * 10 + 20;
  if (blockchainProof) {
    doc.text('Blockchain Proof:', 14, y + 15);
    
    // Split the hash into chunks of 60 characters for better readability
    const hash = blockchainProof.txHash;
    const chunkSize = 60;
    const hashChunks = hash.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
    
    // Write "Tx Hash:" label
    doc.text('Tx Hash:', 14, y + 25);
    
    // Write each chunk of the hash on a new line, indented
    hashChunks.forEach((chunk, index) => {
      doc.text(chunk, 25, y + 25 + (index + 1) * 10);
    });
    
    // Write block number below the hash
    doc.text(`Block: ${blockchainProof.blockNumber}`, 14, y + 25 + (hashChunks.length + 1) * 10);
  }
  doc.save(filename);
};

export default function ReportsPage() {
  const { toast } = useToast();

  const form = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: 'summary',
      project: 'all',
      format: 'csv',
      dateRange: {
        from: new Date('2024-01-01T00:00:00'),
        to: new Date('2025-12-31T23:59:59'),
      },
    },
  });

  const generateReport = (values: ReportValues, filteredLogs: WasteLog[]) => {
    const { reportType, format: fileFormat } = values;
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `${reportType}-report-${dateStr}.${fileFormat}`;

    let headers: string[] = [];
    let reportData: any[] = [];
    let reportTitle: string = '';

    switch (reportType) {
      case 'summary':
        reportTitle = 'Waste Summary Report';
        const totalWaste = filteredLogs.reduce(
          (acc, log) => acc + log.quantity,
          0
        );
        const recycledWaste = filteredLogs
          .filter((log) => log.disposalMethod === 'Recycled')
          .reduce((acc, log) => acc + log.quantity, 0);
        const diversionRate =
          totalWaste > 0 ? (recycledWaste / totalWaste) * 100 : 0;

        headers = ['Metric', 'Value', 'Unit'];
        reportData = [
          { Metric: 'Total Waste', Value: totalWaste.toFixed(2), Unit: 'kg' },
          {
            Metric: 'Recycled Waste',
            Value: recycledWaste.toFixed(2),
            Unit: 'kg',
          },
          {
            Metric: 'Disposed Waste',
            Value: (totalWaste - recycledWaste).toFixed(2),
            Unit: 'kg',
          },
          {
            Metric: 'Diversion Rate',
            Value: diversionRate.toFixed(2),
            Unit: '%',
          },
          { Metric: 'Total Logs', Value: filteredLogs.length, Unit: '' },
        ];
        break;

      case 'sustainability':
        reportTitle = 'Sustainability KPI Report';
        const byMaterial = filteredLogs.reduce(
          (acc, log) => {
            if (!acc[log.materialType]) {
              acc[log.materialType] = { total: 0, recycled: 0 };
            }
            acc[log.materialType].total += log.quantity;
            if (log.disposalMethod === 'Recycled') {
              acc[log.materialType].recycled += log.quantity;
            }
            return acc;
          },
          {} as Record<string, { total: number; recycled: number }>
        );

        headers = [
          'MaterialType',
          'TotalQuantity_kg',
          'RecycledQuantity_kg',
          'RecyclingRate_percent',
        ];
        reportData = Object.entries(byMaterial).map(([material, data]) => ({
          MaterialType: material,
          TotalQuantity_kg: data.total.toFixed(2),
          RecycledQuantity_kg: data.recycled.toFixed(2),
          RecyclingRate_percent: (
            data.total > 0 ? (data.recycled / data.total) * 100 : 0
          ).toFixed(2),
        }));
        break;

      case 'full':
        reportTitle = 'Full Data Export';
        headers = Object.keys(filteredLogs[0] || {}) as (keyof WasteLog)[];
        reportData = filteredLogs.map((log) => ({
          ...log,
          date: format(log.date, 'yyyy-MM-dd'),
        }));
        break;

      default:
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invalid report type selected.',
        });
        return;
    }

    if (fileFormat === 'csv') {
      const csvData = convertToCSV(
        reportData,
        reportType === 'full' ? headers : Object.keys(reportData[0] || {})
      );
  downloadFile(csvData, filename, 'text/csv;charset=utf-8;', reportTitle);
    } else if (fileFormat === 'pdf') {
      const pdfHeaders =
        reportType === 'full' ? headers : Object.keys(reportData[0] || {});
      const pdfBody = reportData.map((row) =>
        pdfHeaders.map((header) => row[header])
      );
      // For PDF, hash the raw data string
      const pdfContent = JSON.stringify({ title: reportTitle, headers: pdfHeaders, body: pdfBody });
      anchorReportToBlockchain(sha256(pdfContent).toString(), reportTitle).then((result) => {
        if (result.status === 'ok') {
          downloadPDF(reportTitle, pdfHeaders, pdfBody, filename, { txHash: result.txHash, blockNumber: result.blockNumber });
          window.alert(`Report anchored to blockchain!\nTx: ${result.txHash}\nBlock: ${result.blockNumber}`);
        } else {
          downloadPDF(reportTitle, pdfHeaders, pdfBody, filename);
          window.alert(`Blockchain anchoring failed: ${result.message}`);
        }
      });
    }

    toast({
      title: 'Report Generated',
      description: `Your "${reportType}" report has been downloaded as a ${fileFormat.toUpperCase()} file.`,
    });
  };

  function onSubmit(values: ReportValues) {
    const { dateRange, project } = values;
    // Require both dates
    if (!dateRange.from || !dateRange.to) {
      toast({
        variant: 'destructive',
        title: 'Date Range Required',
        description: 'Please select both a start and end date for your report.',
      });
      return;
    }
    // Prevent invalid range
    if (dateRange.from > dateRange.to) {
      toast({
        variant: 'destructive',
        title: 'Invalid Date Range',
        description: 'The start date cannot be after the end date.',
      });
      return;
    }
    const filteredLogs = wasteLogs.filter((log) => {
      const inDateRange = isWithinInterval(log.date, {
        start: dateRange.from,
        end: dateRange.to,
      });
      const matchesSite =
        project === 'all' || getSiteById(project)?.name === log.site;
      return inDateRange && matchesSite;
    });

    if (filteredLogs.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data Available',
        description:
          'There is no waste data matching your selected criteria.',
      });
      return;
    }

    generateReport(values, filteredLogs);
  }

  const getSiteById = (id: string) =>
    projectSites.find((site) => site.id === id);

  return (
    <>
      <PageHeader
        title="Automated Reports"
        description="Generate and download sustainability and waste summary reports."
      />
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
            <CardDescription>
              Select your criteria to generate a custom report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="summary">
                            Waste Summary Report
                          </SelectItem>
                          <SelectItem value="sustainability">
                            Sustainability KPI Report
                          </SelectItem>
                          <SelectItem value="full">Full Data Export</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date range</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, 'LLL dd, y')} -{' '}
                                    {format(field.value.to, 'LLL dd, y')}
                                  </>
                                ) : (
                                  format(field.value.from, 'LLL dd, y')
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Site</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Sites</SelectItem>
                            {projectSites.map((site) => (
                              <SelectItem key={site.id} value={site.id}>
                                {site.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
