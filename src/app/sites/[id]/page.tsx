'use client';

import { useParams, notFound } from 'next/navigation';
import { getSiteById, wasteLogs } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { RecentLogsTable } from '@/components/dashboard/recent-logs-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export default function SiteDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [site, setSite] = React.useState(getSiteById(id));

  if (!site) {
    notFound();
  }

  const siteLogs = wasteLogs.filter(log => log.site === site.name);

  return (
    <>
      <PageHeader
        title={site.name}
        description={`Details for project site ID: ${site.id}`}
      >
        <Button asChild variant="outline">
          <Link href="/sites">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Sites
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium text-right">{site.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Site Manager</span>
              <span className="font-medium">{site.manager}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date</span>
              <span className="font-medium">{format(site.startDate, 'LLLL d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Area</span>
              <span className="font-medium">{site.squareMeters.toLocaleString()} m²</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Waste Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Logs</p>
                        <p className="text-2xl font-bold">{siteLogs.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Waste</p>
                        <p className="text-2xl font-bold">
                            {(siteLogs.reduce((acc, log) => acc + log.quantity, 0) / 1000).toFixed(2)} tons
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Waste Logs for this Site</CardTitle>
          <CardDescription>
            A complete list of all waste entries logged for {site.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentLogsTable logs={siteLogs} />
        </CardContent>
      </Card>
    </>
  );
}
