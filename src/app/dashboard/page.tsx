'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { DashboardIcon,Calendar, Clock } from '../../components/layout/DashboardIcons';
import userService, { DashboardOverview, SpendingAnalytics } from '../../services/user-service';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar as CalendarIcon, MapPin as MapPinIcon, Ticket, TrendingDown, Star, AlertCircle, CheckCircle, XCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [analyticsData, setAnalyticsData] = useState<SpendingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch dashboard overview and analytics in parallel
      const [dashboardResponse, analyticsResponse] = await Promise.all([
        userService.getDashboardOverview(),
        userService.getSpendingAnalytics()
      ]);

      if (dashboardResponse.success && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      } else {
        setError(dashboardResponse.message || 'Failed to load dashboard data');
      }

      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalyticsData(analyticsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Paid
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      conference: '#3B82F6',
      workshop: '#10B981',
      seminar: '#F59E0B',
      networking: '#8B5CF6',
      social: '#EF4444',
      other: '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[var(--sage-green)] rounded-lg">
              <DashboardIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {dashboardData.userProfile.firstName}!
              </h1>
              <p className="text-gray-600">
                Here&apos;s your event activity overview
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Tickets"
            value={dashboardData.ticketStats.totalTickets.toString()}
            icon={<Ticket className="h-6 w-6 text-[var(--sage-green)]" />}
            description={`${dashboardData.ticketStats.paidTickets} paid`}
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(dashboardData.ticketStats.totalSpent, 'CHF')}
            icon={<DollarSign className="h-6 w-6 text-[var(--sage-green)]" />}
            description={`${dashboardData.ticketStats.averageTicketPrice.toFixed(2)} CHF avg`}
          />
          <StatCard
            title="Upcoming Events"
            value={dashboardData.eventStats.upcomingEvents.toString()}
            icon={<Calendar className="h-6 w-6 text-[var(--sage-green)]" />}
            description={`${dashboardData.eventStats.pastEvents} completed`}
          />
          <StatCard
            title="Refund Requests"
            value={dashboardData.refundRequests.toString()}
            icon={<AlertCircle className="h-6 w-6 text-[var(--sage-green)]" />}
            description="Pending review"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Spending Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--sage-green)]" />
                Monthly Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData && analyticsData.monthlySpending.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${formatCurrency(value, 'CHF')}`, 'Spending']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="spending" fill="var(--sage-green)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <TrendingDown className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No spending data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[var(--sage-green)]" />
                Favorite Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData && analyticsData.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, totalSpent }) => `${formatCategoryName(category)}: ${formatCurrency(totalSpent, 'CHF')}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalSpent"
                    >
                      {analyticsData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value, 'CHF')} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No category data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--sage-green)]" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.upcomingEventsDetails.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingEventsDetails.slice(0, 5).map((event) => (
                    <div key={event._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {event.coverImage && (
                        <div className="flex-shrink-0">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={event.coverImage}
                              alt={event.eventTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          <Link href={`/events/${event.slug}`} className="hover:text-[var(--sage-green)]">
                            {event.eventTitle}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{event.eventDate ? formatDate(new Date(event.eventDate)) : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPinIcon className="h-3 w-3" />
                          <span className="truncate">{event.eventLocation}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {event.quantity} ticket{event.quantity > 1 ? 's' : ''}
                          </span>
                          {getPaymentStatusBadge(event.paymentStatus)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dashboardData.upcomingEventsDetails.length > 5 && (
                    <div className="text-center pt-2">
                      <Link 
                        href="/dashboard/tickets" 
                        className="text-[var(--sage-green)] hover:text-[var(--sage-green-dark)] text-sm font-medium"
                      >
                        View all {dashboardData.upcomingEventsDetails.length} events →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">No upcoming events</p>
                  <Link 
                    href="/events" 
                    className="bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Browse Events
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--sage-green)]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity._id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-[var(--sage-green)] flex items-center justify-center">
                          <Ticket className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Purchased {activity.quantity} ticket{activity.quantity > 1 ? 's' : ''} for {activity.eventTitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(activity.amount, activity.currency)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(new Date(activity.purchasedAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                  {dashboardData.recentActivity.length > 5 && (
                    <div className="text-center pt-2">
                      <Link 
                        href="/dashboard/tickets" 
                        className="text-[var(--sage-green)] hover:text-[var(--sage-green-dark)] text-sm font-medium"
                      >
                        View all activity →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--sage-green)]" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Paid Tickets</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {dashboardData.ticketStats.paidTickets}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {dashboardData.ticketStats.pendingTickets}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Net Spending</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(dashboardData.ticketStats.netSpending, 'CHF')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Member Since</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {formatDate(new Date(dashboardData.userProfile.memberSince))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 