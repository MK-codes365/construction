import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of waste management performance."
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[260px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
      </PageHeader>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-1/2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-1/2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
