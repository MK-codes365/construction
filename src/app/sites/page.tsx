'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { projectSites } from '@/lib/data';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { AddSiteDialog } from '@/components/sites/add-site-dialog';
import { EditSiteDialog } from '@/components/sites/edit-site-dialog';

export default function SitesPage() {
  const [key, setKey] = React.useState(0);
  const [sites, setSites] = React.useState(projectSites);

  const handleSiteChange = () => {
    // This forces a re-render of the component by updating its key
    // and re-fetching the sites from the source
    setSites([...projectSites]);
    setKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <PageHeader
        key={key}
        title="Project Sites"
        description="Manage your construction sites and view their details."
      >
        <AddSiteDialog onSiteAdded={handleSiteChange} />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Site List</CardTitle>
          <CardDescription>
            A list of all active and past project sites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Site Manager</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Area (m²)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">
                     <Link href={`/sites/${site.id}`} className="hover:underline">
                      {site.name}
                    </Link>
                  </TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>{site.manager}</TableCell>
                  <TableCell>{format(site.startDate, 'LLL dd, yyyy')}</TableCell>
                   <TableCell>{site.squareMeters.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                         <DropdownMenuItem asChild>
                          <EditSiteDialog site={site} onSiteUpdated={handleSiteChange} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/sites/${site.id}`}>View Details</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
