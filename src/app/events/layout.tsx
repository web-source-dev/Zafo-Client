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
    <main className="min-h-screen bg-gradient-to-b from-[var(--taupe)] to-[#f8f9fa]">
      {/* Navigation breadcrumb - only show on detail pages */}
      {!isListPage && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="text-sm flex items-center text-gray-500">
              <Link href="/" className="hover:text-[var(--sage-green)] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/events" className="hover:text-[var(--sage-green)] transition-colors">Events</Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--sage-green)] font-medium">Details</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Page content */}
      <div className="min-h-[calc(100vh-70px)]">
        {children}
      </div>
    </main>
  );
} 