import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ReportsLoading() {
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
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
