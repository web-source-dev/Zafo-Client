'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import ticketService, { UserReportsData } from '@/services/ticket-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Ticket, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin,
  Star,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/dateUtils';

export default function UserReportsPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [reportsData, setReportsData] = useState<UserReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchReportsData();
  }, [isAuthenticated, router]);

  const fetchReportsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ticketService.getUserReports();
      
      if (response.success && response.data) {
        setReportsData(response.data);
      } else {
        setError(response.message || 'Failed to load reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReportsData();
    setRefreshing(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      conference: 'bg-blue-500',
      workshop: 'bg-green-500',
      seminar: 'bg-purple-500',
      networking: 'bg-orange-500',
      social: 'bg-pink-500',
      other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (!isAuthenticated) {
    return null;
  }

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

  if (!reportsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-4">{error || 'No reports data found'}</p>
            <button
              onClick={handleRefresh}
              className="bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--sage-green)] rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Reports & Analytics
                </h1>
                <p className="text-gray-600 text-sm">
                  Comprehensive overview of your event participation and spending patterns
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Spent</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(reportsData.overview.totalSpent, 'CHF')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-green-900">
                    {reportsData.overview.totalTickets}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Individual attendee tickets</p>
                </div>
                <Ticket className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg. Ticket Price</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCurrency(reportsData.overview.averageTicketPrice, 'CHF')}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Spending Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Monthly Spending Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {reportsData.monthlySpending.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div 
                        className="w-full bg-[var(--sage-green)] rounded-t"
                        style={{ 
                          height: `${Math.max(10, (month.spending / Math.max(...reportsData.monthlySpending.map(m => m.spending))) * 200)}px` 
                        }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatCurrency(month.spending, 'CHF')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Breakdown and Favorite Organizers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Category Preferences
              </CardTitle>
              <p className="text-sm text-gray-600">Individual attendee tickets by event category</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.categoryBreakdown.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${getCategoryColor(category.category)}`}></div>
                      <div>
                        <p className="font-medium">{formatCategoryName(category.category)}</p>
                        <p className="text-sm text-gray-500">{category.events} events</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.spending, 'CHF')}</p>
                      <p className="text-sm text-gray-500">{category.tickets} tickets</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favorite Organizers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Favorite Organizers
              </CardTitle>
              <p className="text-sm text-gray-600">Top organizers by individual attendee tickets purchased</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.favoriteOrganizers.map((organizer, index) => (
                  <div key={organizer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--sage-green)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{organizer.name}</p>
                        <p className="text-sm text-gray-500">{organizer.events} events</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(organizer.spending, 'CHF')}</p>
                      <p className="text-sm text-gray-500">{organizer.tickets} tickets</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organizer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportsData.recentActivity.map((activity) => (
                    <tr key={activity.ticketId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.eventTitle}</div>
                        {activity.eventDate && (
                          <div className="text-sm text-gray-500">
                            {formatDate(new Date(activity.eventDate))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(new Date(activity.purchasedAt))}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(activity.amount, activity.currency)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.organizer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-indigo-900">Total Events</h3>
              <p className="text-3xl font-bold text-indigo-900">{reportsData.events.total}</p>
              <p className="text-sm text-indigo-600 mt-1">
                {reportsData.events.upcoming} tickets for upcoming events
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-red-900">Refund Requests</h3>
              <p className="text-3xl font-bold text-red-900">{reportsData.overview.refundRequests}</p>
              <p className="text-sm text-red-600 mt-1">
                {formatCurrency(reportsData.overview.refundedAmount, 'CHF')} refunded
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 