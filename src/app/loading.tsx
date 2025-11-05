import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  );
}
