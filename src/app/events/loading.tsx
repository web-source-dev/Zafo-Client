import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

export default function EventsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search Skeleton - Enhanced with overlay */}
      <div className="relative bg-gradient-to-r from-[var(--sage-green)] to-[var(--sage)] py-12 px-4 mb-0">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="mb-8 text-center">
            <div className="h-10 w-64 md:w-72 bg-white/30 animate-pulse rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-white/30 animate-pulse rounded-lg mx-auto max-w-full"></div>
          </div>

          {/* Search Bar Skeleton - Enhanced with better styling */}
          <div className="max-w-3xl mx-auto">
            <div className="flex w-full overflow-hidden rounded-lg shadow-xl">
              <div className="flex-1 h-12 bg-white/95 animate-pulse"></div>
              <div className="w-28 h-12 bg-[var(--sage-green-light)] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Page title bar */}
      <div className="bg-white py-6 border-b border-gray-200 mb-6 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="h-7 w-40 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-16">
        {/* Mobile Filter Toggle Skeleton - Enhanced for mobile */}
        <div className="md:hidden mb-6">
          <div className="h-10 bg-white animate-pulse rounded-lg shadow-sm"></div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar Skeleton - Enhanced with better spacing */}
          <aside className="hidden md:block md:w-56 lg:w-64 flex-shrink-0">
            <Card className="sticky top-24 border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-[#f9fafb] border-b border-gray-200 py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-2"></div>
                    <div className="h-5 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {/* Categories Section Skeleton - Enhanced */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="h-9 bg-gray-100 animate-pulse rounded-md mt-2"></div>
                  </div>
                  
                  {/* Date Section Skeleton - Enhanced */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="space-y-4 mt-2">
                      <div>
                        <div className="h-3 w-12 bg-gray-200 animate-pulse rounded-lg mb-1.5"></div>
                        <div className="h-9 bg-gray-100 animate-pulse rounded-md"></div>
                      </div>
                      <div>
                        <div className="h-3 w-10 bg-gray-200 animate-pulse rounded-lg mb-1.5"></div>
                        <div className="h-9 bg-gray-100 animate-pulse rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sort Section Skeleton - Enhanced */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="h-9 bg-gray-100 animate-pulse rounded-md mt-2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Events Content - Enhanced */}
          <div className="flex-1">
            {/* Events Grid Skeleton - Enhanced cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  {/* Image Skeleton - Enhanced with tag overlays */}
                  <div className="h-48 bg-gray-200 animate-pulse relative">
                    {/* Category tag skeleton */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="h-5 w-20 bg-white/90 animate-pulse rounded-full"></div>
                    </div>
                    {/* Price tag skeleton */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="h-5 w-16 bg-[var(--sage-green-light)]/90 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                  
                  <CardContent className="p-5">                    
                    {/* Title Skeleton */}
                    <div className="h-6 w-full bg-gray-200 animate-pulse rounded-lg mb-2"></div>
                    
                    {/* Description Skeleton */}
                    <div className="space-y-1 mb-4">
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px w-full bg-gray-200 my-4"></div>
                    
                    {/* Details Skeleton */}
                    <div className="space-y-2.5">
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-2"></div>
                        <div className="h-3 w-28 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-2"></div>
                        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-2"></div>
                        <div className="h-3 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-gray-200 animate-pulse rounded-full mr-1.5"></div>
                        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                      <div className="h-3 w-20 bg-[var(--sage-green-light)] animate-pulse rounded-lg"></div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Pagination Skeleton - Enhanced */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm bg-white">
                <div className="h-9 w-24 bg-gray-100 border border-gray-300 animate-pulse rounded-l-md"></div>
                <div className="hidden sm:flex">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-9 w-9 border-t border-b border-gray-300 animate-pulse ${
                        index === 1 ? 'bg-[var(--sage-green-light)]' : 'bg-gray-100'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="sm:hidden h-9 px-3 border-t border-b border-gray-300 flex items-center">
                  <div className="h-3 w-12 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
                <div className="h-9 w-24 bg-gray-100 border border-gray-300 animate-pulse rounded-r-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 