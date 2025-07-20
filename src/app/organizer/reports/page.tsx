'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/language-context';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import organizerService from '@/services/organizer-service';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Download, 
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Star,
  TrendingDown
} from 'lucide-react';

interface ReportData {
  overview: {
    totalEvents: number;
    totalRevenue: number;
    totalTickets: number;
    avgTicketPrice: number;
    totalParticipants: number;
    fillRate: number;
    avgEventRevenue: number;
    bestPerformingEvent: string;
    totalRefunds: number;
    refundRate: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    tickets: number;
    events: number;
  }>;
  eventPerformance: Array<{
    eventId: string;
    title: string;
    revenue: number;
    tickets: number;
    capacity: number;
    fillRate: number;
    startDate: string;
    category: string;
    status: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    events: number;
    revenue: number;
    tickets: number;
    avgRevenue: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    amount?: number;
    date: string;
  }>;
  weeklyTrends: Array<{
    week: string;
    revenue: number;
    tickets: number;
    events: number;
  }>;
  topEvents: Array<{
    eventId: string;
    title: string;
    revenue: number;
    tickets: number;
    fillRate: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function OrganizerReportsPage() {
  const { t } = useLanguage();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30'); // days
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [timeframe]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const dashboardData = await organizerService.getDashboardOverview();
      
      // Transform the dashboard data to match our ReportData interface
      const transformedData: ReportData = {
        overview: {
          totalEvents: dashboardData.eventStats.totalEvents,
          totalRevenue: dashboardData.ticketStats.totalRevenue,
          totalTickets: dashboardData.ticketStats.totalTickets,
          avgTicketPrice: dashboardData.ticketStats.averageTicketPrice || 0,
          totalParticipants: dashboardData.ticketStats.totalAttendees,
          fillRate: dashboardData.eventStats.totalEvents > 0 
            ? (dashboardData.ticketStats.totalAttendees / (dashboardData.eventStats.totalEvents * 100)) * 100 
            : 0,
          avgEventRevenue: dashboardData.eventStats.totalEvents > 0 
            ? dashboardData.ticketStats.totalRevenue / dashboardData.eventStats.totalEvents 
            : 0,
          bestPerformingEvent: dashboardData.recentEvents.length > 0 
            ? dashboardData.recentEvents.reduce((best, current) => 
                current.totalRevenue > best.totalRevenue ? current : best
              ).title 
            : 'N/A',
          totalRefunds: dashboardData.ticketStats.refundedTickets,
          refundRate: dashboardData.ticketStats.totalTickets > 0 
            ? (dashboardData.ticketStats.refundedTickets / dashboardData.ticketStats.totalTickets) * 100 
            : 0
        },
        monthlyRevenue: dashboardData.monthlyRevenue ? dashboardData.monthlyRevenue.map(item => ({
          month: item.month,
          revenue: item.revenue,
          tickets: item.tickets,
          events: (item as unknown as { events: number }).events || 0
        })) : [],
        eventPerformance: dashboardData.recentEvents.map(event => ({
          eventId: event._id,
          title: event.title,
          revenue: event.totalRevenue,
          tickets: event.soldTickets,
          capacity: event.capacity,
          fillRate: event.capacity > 0 ? (event.soldTickets / event.capacity) * 100 : 0,
          startDate: event.startDate.toString(),
          category: event.category,
          status: event.status
        })),
        categoryBreakdown: [], // Will be calculated below
        recentActivity: dashboardData.recentTickets.map(ticket => ({
          type: 'ticket_purchase',
          description: `Ticket purchased for ${ticket.quantity} attendee(s)`,
          amount: ticket.totalAmount,
          date: ticket.purchasedAt.toString()
        })),
        weeklyTrends: [], // Will be calculated from monthly data
        topEvents: dashboardData.recentEvents
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .slice(0, 5)
          .map(event => ({
            eventId: event._id,
            title: event.title,
            revenue: event.totalRevenue,
            tickets: event.soldTickets,
            fillRate: event.capacity > 0 ? (event.soldTickets / event.capacity) * 100 : 0
          }))
      };

      // Calculate category breakdown
      const categoryMap = new Map<string, { events: number; revenue: number; tickets: number }>();
      
      dashboardData.recentEvents.forEach(event => {
        const category = event.category;
        const existing = categoryMap.get(category) || { events: 0, revenue: 0, tickets: 0 };
        categoryMap.set(category, {
          events: existing.events + 1,
          revenue: existing.revenue + event.totalRevenue,
          tickets: existing.tickets + event.soldTickets
        });
      });

      transformedData.categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        ...data,
        avgRevenue: data.events > 0 ? data.revenue / data.events : 0
      }));

      // Calculate weekly trends from monthly data
      if (dashboardData.monthlyRevenue && dashboardData.monthlyRevenue.length > 0) {
        transformedData.weeklyTrends = dashboardData.monthlyRevenue.map((item, index) => ({
          week: `Week ${index + 1}`,
          revenue: item.revenue / 4, // Approximate weekly revenue
          tickets: item.tickets / 4,
          events: 1 // Default to 1 event per week
        }));
      }

      setReportData(transformedData);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReportData();
    setIsRefreshing(false);
  };

  const handleExportComprehensiveReport = () => {
    if (!reportData) return;
    
    const csvContent = [
      // Overview Section
      ['COMPREHENSIVE ORGANIZER REPORT'],
      ['Generated on', new Date().toLocaleDateString()],
      ['Timeframe', `${timeframe} days`],
      [''],
      
      // Overview Metrics
      ['OVERVIEW METRICS'],
      ['Metric', 'Value'],
      ['Total Events', reportData.overview.totalEvents],
      ['Total Revenue', `CHF ${reportData.overview.totalRevenue.toFixed(2)}`],
      ['Total Tickets Sold', reportData.overview.totalTickets],
      ['Average Ticket Price', `CHF ${reportData.overview.avgTicketPrice.toFixed(2)}`],
      ['Total Participants', reportData.overview.totalParticipants],
      ['Overall Fill Rate', `${reportData.overview.fillRate.toFixed(1)}%`],
      ['Average Event Revenue', `CHF ${reportData.overview.avgEventRevenue.toFixed(2)}`],
      ['Best Performing Event', reportData.overview.bestPerformingEvent],
      ['Total Refunds', reportData.overview.totalRefunds],
      ['Refund Rate', `${reportData.overview.refundRate.toFixed(1)}%`],
      [''],
      
      // Monthly Revenue
      ['MONTHLY REVENUE BREAKDOWN'],
      ['Month', 'Revenue (CHF)', 'Tickets Sold', 'Events'],
      ...reportData.monthlyRevenue.map(item => [
        item.month,
        item.revenue.toFixed(2),
        item.tickets,
        item.events || 0
      ]),
      [''],
      
      // Event Performance
      ['EVENT PERFORMANCE DETAILS'],
      ['Event Title', 'Category', 'Status', 'Revenue (CHF)', 'Tickets Sold', 'Capacity', 'Fill Rate (%)', 'Start Date'],
      ...reportData.eventPerformance.map(event => [
        event.title,
        event.category,
        event.status,
        event.revenue.toFixed(2),
        event.tickets,
        event.capacity,
        event.fillRate.toFixed(1),
        new Date(event.startDate).toLocaleDateString()
      ]),
      [''],
      
      // Category Breakdown
      ['CATEGORY BREAKDOWN'],
      ['Category', 'Events', 'Revenue (CHF)', 'Tickets Sold', 'Average Revenue per Event'],
      ...reportData.categoryBreakdown.map(category => [
        category.category,
        category.events,
        category.revenue.toFixed(2),
        category.tickets,
        category.avgRevenue.toFixed(2)
      ]),
      [''],
      
      // Top Events
      ['TOP 5 PERFORMING EVENTS'],
      ['Event Title', 'Revenue (CHF)', 'Tickets Sold', 'Fill Rate (%)'],
      ...reportData.topEvents.map(event => [
        event.title,
        event.revenue.toFixed(2),
        event.tickets,
        event.fillRate.toFixed(1)
      ]),
      [''],
      
      // Recent Activity
      ['RECENT ACTIVITY'],
      ['Description', 'Amount (CHF)', 'Date'],
      ...reportData.recentActivity.map(activity => [
        activity.description,
        activity.amount ? activity.amount.toFixed(2) : 'N/A',
        new Date(activity.date).toLocaleDateString()
      ])
    ].map(row => 
      row.map(cell => 
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-organizer-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
          <Button onClick={handleRefresh}>
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('reports.noData')}</h3>
            <p className="text-gray-500">{t('reports.noDataDescription')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--sage-green)] mb-2">
                {t('reports.title')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('reports.subtitle')}
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {/* Timeframe Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)]"
                >
                  <option value="7">{t('reports.last7Days')}</option>
                  <option value="30">{t('reports.last30Days')}</option>
                  <option value="90">{t('reports.last90Days')}</option>
                  <option value="365">{t('reports.lastYear')}</option>
                </select>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {t('reports.refresh')}
              </Button>

              <Button 
                onClick={handleExportComprehensiveReport}
                className="bg-[var(--sage-green)] hover:bg-[var(--sage-green)]/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('reports.exportComprehensive')}
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-[var(--sage-green)]">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('reports.totalEvents')}</p>
                  <p className="text-lg font-semibold text-gray-900">{reportData.overview.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('reports.totalRevenue')}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    CHF {reportData.overview.totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-orange-100">
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('reports.avgTicketPrice')}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    CHF {reportData.overview.avgTicketPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-red-100">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('reports.refundRate')}</p>
                  <p className="text-lg font-semibold text-gray-900">{reportData.overview.refundRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-indigo-100">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('reports.totalParticipants')}</p>
                  <p className="text-lg font-semibold text-gray-900">{reportData.overview.totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-pink-100">
                  <Clock className="h-5 w-5 text-pink-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('reports.bestPerformingEvent')}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{reportData.overview.bestPerformingEvent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('reports.revenue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.monthlyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={reportData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'revenue' ? `CHF ${value.toFixed(2)}` : value,
                        name === 'revenue' ? t('reports.revenue') : t('reports.tickets')
                      ]}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('reports.noData')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                {t('reports.categoryBreakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, revenue }) => `${category}: CHF ${revenue.toFixed(0)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {reportData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`CHF ${value.toFixed(2)}`, t('reports.revenue')]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t('reports.noCategoryData')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('reports.eventPerformance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.eventPerformance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.event')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.category')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.revenue')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.tickets')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.fillRate')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('reports.startDate')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.eventPerformance.map((event) => (
                      <tr key={event.eventId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">
                            {t(`events.categories.${event.category}`)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          CHF {event.revenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.tickets} / {event.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={event.fillRate >= 80 ? 'default' : event.fillRate >= 50 ? 'outline' : 'outline'}
                            className={`${
                              event.fillRate >= 80 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : event.fillRate >= 50
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {event.fillRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('reports.noEventData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('reports.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {reportData.recentActivity.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString()} - {new Date(activity.date).toLocaleTimeString()}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className="text-sm font-medium text-green-600">
                        +CHF {activity.amount.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('reports.noActivity')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 