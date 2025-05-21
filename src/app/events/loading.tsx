import React from 'react';
import { Card } from '@/components/ui/Card';

export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-6 w-96 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Filters Section Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Skeleton */}
          <div className="col-span-1 md:col-span-3 mb-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
          
          {/* Filter Skeletons */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="h-full">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            
            <div className="p-4 space-y-4">
              {/* Tags Skeleton */}
              <div className="flex space-x-2">
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              
              {/* Title Skeleton */}
              <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              
              {/* Description Skeleton */}
              <div className="space-y-1">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
              </div>
              
              {/* Details Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 