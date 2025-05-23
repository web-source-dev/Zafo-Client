import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function EventDetailLoading() {
  return (
    <div>
      {/* Hero Section Skeleton - Enhanced */}
      <div className="relative h-64 md:h-96 w-full bg-gray-300 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="h-10 w-40 bg-white/20 rounded-md animate-pulse mb-4"></div>
            <div className="h-10 w-2/3 bg-white/20 rounded-md animate-pulse mb-2"></div>
            <div className="h-6 w-1/2 bg-white/20 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeletons */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="aspect-square rounded-md bg-gray-200 animate-pulse"></div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="h-10 w-36 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            
            {/* About Card Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-8 w-44 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-64 md:h-80 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="mt-3">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Speakers Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeletons */}
          <div className="space-y-6">
            {/* Register Card Skeleton */}
            <Card>
              <CardContent className="pt-6">
                {/* Date & Time Skeleton */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="ml-7 space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Location Skeleton */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="ml-7 space-y-2">
                    <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Price Skeleton */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="ml-7">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Capacity Skeleton */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="ml-7">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="mt-8 flex flex-col space-y-3">
                  <div className="h-12 w-full bg-[var(--sage-green-light)] rounded-md animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>

                {/* Refund Policy Skeleton */}
                <div className="mt-6">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Skeleton */}
            <Card>
              <CardHeader>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 