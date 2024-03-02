'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Import correcto

export function NavigationEvents(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
  }, [pathname, searchParams]);

  return null;
}
