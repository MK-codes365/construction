import { Recycle } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Link href="/dashboard" className="group flex items-center gap-2" prefetch={false}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
          <Recycle className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden">
          Green Track
        </span>
      </Link>
    </div>
  );
}
