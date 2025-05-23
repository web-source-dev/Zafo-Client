import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section with Search Skeleton */}
      <div className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--sage)] py-8 px-4 mb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <div className="h-9 w-64 bg-white/30 animate-pulse rounded-lg mx-auto mb-3"></div>
            <div className="h-5 w-96 bg-white/30 animate-pulse rounded-lg mx-auto max-w-full"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="max-w-3xl mx-auto">
            <div className="flex w-full overflow-hidden rounded-lg shadow-lg">
              <div className="flex-1 h-12 bg-white/90 animate-pulse"></div>
              <div className="w-24 h-12 bg-[var(--sage-green-light)] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-16">
        {/* Mobile Filter Toggle Skeleton - Only visible on mobile */}
        <div className="md:hidden mb-6">
          <div className="h-10 bg-white animate-pulse rounded-lg shadow-sm"></div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar Skeleton - Narrower */}
          <aside className="hidden md:block md:w-56 lg:w-60 flex-shrink-0">
            <Card className="sticky top-6 border border-gray-200 shadow-sm overflow-hidden">
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
                  {/* Categories Section Skeleton */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="h-8 bg-gray-100 animate-pulse rounded-md mt-2"></div>
                  </div>
                  
                  {/* Date Section Skeleton */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="space-y-3 mt-2">
                      <div>
                        <div className="h-3 w-12 bg-gray-200 animate-pulse rounded-lg mb-1"></div>
                        <div className="h-8 bg-gray-100 animate-pulse rounded-md"></div>
                      </div>
                      <div>
                        <div className="h-3 w-10 bg-gray-200 animate-pulse rounded-lg mb-1"></div>
                        <div className="h-8 bg-gray-100 animate-pulse rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sort Section Skeleton */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="h-8 bg-gray-100 animate-pulse rounded-md mt-2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Events Content */}
          <div className="flex-1">
            {/* Results Summary Skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>

            {/* Events Grid Skeleton - Wider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  {/* Image Skeleton */}
                  <div className="h-44 bg-gray-200 animate-pulse"></div>
                  
                  <CardContent className="p-4">
                    {/* Tags Skeleton */}
                    <div className="flex gap-2 mb-2">
                      <div className="h-5 w-20 bg-[var(--sage-green-light)] animate-pulse rounded-full"></div>
                      <div className="h-5 w-16 bg-green-100 animate-pulse rounded-full"></div>
                    </div>
                    
                    {/* Title Skeleton */}
                    <div className="h-6 w-full bg-gray-200 animate-pulse rounded-lg mb-1.5"></div>
                    
                    {/* Description Skeleton */}
                    <div className="space-y-1 mb-3">
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px w-full bg-gray-200 my-3"></div>
                    
                    {/* Details Skeleton */}
                    <div className="space-y-1.5">
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-1.5"></div>
                        <div className="h-3 w-28 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-1.5"></div>
                        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-[var(--sage-green-light)] animate-pulse rounded-full mr-1.5"></div>
                        <div className="h-3 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-3.5 w-3.5 bg-gray-200 animate-pulse rounded-full mr-1"></div>
                        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
                      </div>
                      <div className="h-3 w-20 bg-[var(--sage-green-light)] animate-pulse rounded-lg"></div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm bg-white">
                <div className="h-8 w-20 bg-gray-100 border border-gray-300 animate-pulse rounded-l-md"></div>
                <div className="hidden sm:flex">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-8 w-8 border-t border-b border-gray-300 animate-pulse ${
                        index === 1 ? 'bg-[var(--sage-green-light)]' : 'bg-gray-100'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="sm:hidden h-8 px-2 border-t border-b border-gray-300 flex items-center">
                  <div className="h-3 w-12 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
                <div className="h-8 w-20 bg-gray-100 border border-gray-300 animate-pulse rounded-r-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 