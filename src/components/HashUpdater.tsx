'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HashUpdater() {
  const pathname = usePathname();
  useEffect(() => {
    const hash = pathname === '/' ? 'home' : pathname.replace(/^\//, '');
    window.location.hash = hash;
  }, [pathname]);
  return null;
}
