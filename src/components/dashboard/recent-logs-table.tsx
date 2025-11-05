import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { WasteLog } from '@/lib/types';
import { format } from 'date-fns';

export function RecentLogsTable({ logs }: { logs: WasteLog[] }) {
  const sortedLogs = [...logs].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Bin ID</TableHead>
          <TableHead>Cause</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.materialType}</TableCell>
              <TableCell>{log.quantity.toLocaleString()} kg</TableCell>
              <TableCell>{log.site}</TableCell>
              <TableCell>{log.binId || 'N/A'}</TableCell>
              <TableCell>{log.cause || 'N/A'}</TableCell>
              <TableCell>{format(log.date, 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    log.disposalMethod === 'Recycled' ? 'default' : 'secondary'
                  }
                  className={
                    log.disposalMethod === 'Recycled'
                      ? 'bg-primary/20 text-primary-foreground border-primary/20 hover:bg-primary/30'
                      : ''
                  }
                >
                  {log.disposalMethod}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
