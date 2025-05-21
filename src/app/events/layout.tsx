'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isListPage = pathname === '/events';
  
  return (
    <main className="min-h-screen bg-[var(--taupe)]">
      {/* Navigation breadcrumb - only show on detail pages */}
      {!isListPage && (
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm flex items-center text-[var(--sage-green)]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/events" className="hover:underline">Events</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Details</span>
          </div>
        </div>
      )}
      
      {children}
    </main>
  );
} 