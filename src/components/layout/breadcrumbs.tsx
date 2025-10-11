
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center text-sm font-medium text-muted-foreground">
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div key={href} className="flex items-center">
            {isLast ? (
              <span className="text-foreground font-semibold">{name}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {name}
              </Link>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 mx-1" />}
          </div>
        );
      })}
    </nav>
  );
}
