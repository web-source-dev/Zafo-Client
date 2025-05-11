'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../auth/auth-context';
import Navbar from '../common/Navbar';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface SidebarItem {
  name: string;
  href: string;
  icon: (className: string) => React.ReactElement;
  current?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navigation: SidebarItem[];
}

export default function DashboardLayout({ children, title, navigation }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Handle clicks outside the sidebar to close it (on mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--taupe)]">
      {/* Mobile sidebar overlay - stays fixed and doesn't affect layout */}
      <div 
        className={`
          fixed inset-0 z-40 md:hidden bg-[var(--sage-green)] bg-opacity-75
          ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          transition-opacity ease-linear duration-300
        `}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      
      {/* Mobile sidebar - stays fixed and doesn't affect layout */}
      <div 
        id="mobile-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50 w-full max-w-[280px] flex flex-col bg-white shadow-xl md:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform ease-in-out duration-300
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 bg-[var(--sage)] border-b border-[var(--cognac)]">
          <h2 className="text-lg font-medium text-black truncate">{title}</h2>
          <button
            className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-[var(--taupe-light)] text-black"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-3 py-3 text-base font-medium rounded-md
                  ${item.current 
                    ? 'bg-[var(--sage)] text-black' 
                    : 'text-black hover:bg-[var(--taupe)] hover:text-[var(--sage-green)]'}
                `}
              >
                {item.icon(`
                  flex-shrink-0 mr-4 h-6 w-6
                  ${item.current ? 'text-[var(--sage-green)]' : 'text-[var(--sage-green)] group-hover:text-[var(--sage-green)]'}
                `)}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="px-2 py-2 border-t border-[var(--cognac)]">
          <LanguageSwitcher />
        </div>
        
        <div className="flex-shrink-0 flex border-t border-[var(--cognac)] p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--sage)] flex items-center justify-center">
              <span className="text-lg font-medium text-black">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium text-black">
                {user?.firstName} {user?.lastName}
              </p>
              <button
                onClick={handleLogout}
                className="mt-1 px-2 py-1 text-xs font-medium text-[var(--sage-green)] hover:text-[#424b3c] hover:bg-[var(--taupe-light)] rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main layout that doesn't get pushed - restructured */}
      <div className="flex flex-col min-h-screen">
        {/* Desktop sidebar - only visible on desktop */}
        <div className="hidden md:flex md:w-64 md:flex-shrink-0 md:fixed md:inset-y-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-full border-r border-[var(--cognac)] bg-white">
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-[var(--sage)] border-b border-[var(--cognac)]">
                <h2 className="text-lg font-medium text-black truncate">{title}</h2>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                <nav className="mt-2 flex-1 px-2 bg-white space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150
                        ${item.current 
                          ? 'bg-[var(--sage)] text-black' 
                          : 'text-black hover:bg-[var(--taupe)] hover:text-[var(--sage-green)]'}
                      `}
                    >
                      {item.icon(`
                        flex-shrink-0 mr-3 h-6 w-6
                        ${item.current ? 'text-[var(--sage-green)]' : 'text-[var(--sage-green)] group-hover:text-[var(--sage-green)]'}
                      `)}
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="px-2 mb-2">
                <LanguageSwitcher />
              </div>
              <div className="flex-shrink-0 flex border-t border-[var(--cognac)] p-4">
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--sage)] flex items-center justify-center">
                    <span className="text-lg font-medium text-black">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium text-black truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-[var(--sage-green)] hover:text-[#424b3c]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content wrapper */}
        <div className="flex flex-col md:ml-64 min-w-0 flex-1">
          {/* Mobile header */}
          <div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white border-b border-[var(--cognac)] md:hidden">
            <button
              type="button"
              className="px-4 border-r border-[var(--cognac)] text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--sage-green)]"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
            <div className="flex-1 flex justify-between px-4">
              <div className="flex-1 flex items-center">
                <h1 className="text-lg font-semibold text-[var(--sage-green)] truncate">{title}</h1>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none pb-6">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 