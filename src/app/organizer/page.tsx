'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import organizerService, { DashboardOverview } from '@/services/organizer-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import { formatDate, formatCurrency } from '@/utils/dateUtils';

export default function OrganizerDashboard() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching dashboard overview for organizer:', user._id);
        
        // Fetch comprehensive dashboard data
        const data = await organizerService.getDashboardOverview();
        console.log('Dashboard data:', data);
        
        setDashboardData(data);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, user]);

  // Redirect if not authenticated or not organizer
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'organizer' && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Show error if user doesn't have organizer role
  if (isAuthenticated && user && user.role !== 'organizer' && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-medium mb-2">Access Denied</p>
          <p>You need organizer permissions to access this dashboard.</p>
          <div className="mt-4">
            <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the organizer dashboard</h1>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error}</p>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { eventStats, ticketStats, transferStats, monthlyRevenue, recentEvents, recentTickets, refundRequests, stripeAccountStatus } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Organizer Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Manage your events, track sales, and monitor your earnings
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => router.push('/organizer/events/create')}
            className="bg-[var(--sage-green)] hover:bg-emerald-600"
          >
            Create New Event
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/organizer/events')}
          >
            View All Events
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/organizer/refund-requests')}
          >
            Refund Requests ({refundRequests})
          </Button>
          {stripeAccountStatus && !stripeAccountStatus.hasAccount && (
            <Button 
              variant="outline"
              onClick={() => router.push('/organizer/stripe-connect')}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Set Up Payments
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Events"
          value={eventStats.totalEvents.toString()}
          icon="📅"
          description={`${eventStats.publishedEvents} published`}
        />
        <StatCard
          title="Total Tickets Sold"
          value={ticketStats.totalAttendees.toString()}
          icon="🎫"
          description={`${ticketStats.totalAttendees} attendees`}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(ticketStats.totalRevenue, 'CHF')}
          icon="💰"
          description={`Avg: ${formatCurrency(ticketStats.averageTicketPrice, 'CHF')}`}
        />
        <StatCard
          title="Your Earnings"
          value={formatCurrency(ticketStats.organizerPayments, 'CHF')}
          icon="💳"
          description={`90% per ticket - ${transferStats.completedTransfers} transfers`}
        />
      </div>

      {/* Payment Summary and Account Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold">{formatCurrency(ticketStats.totalRevenue, 'CHF')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Fees (10% per ticket)</span>
                <span className="text-gray-500">{formatCurrency(ticketStats.platformFees, 'CHF')}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Your Earnings (90% per ticket)</span>
                  <span className="font-semibold text-lg text-[var(--sage-green)]">
                    {formatCurrency(ticketStats.organizerPayments, 'CHF')}
                  </span>
        </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Transfers</span>
                  <span className="font-semibold text-orange-600">
                    {transferStats.pendingTransfers} transfers
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Completed Transfers</span>
                  <span className="font-semibold text-green-600">
                    {transferStats.completedTransfers} transfers
                  </span>
                </div>
                {transferStats.failedTransfers > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Failed Transfers</span>
                    <span className="font-semibold text-red-600">
                      {transferStats.failedTransfers} transfers
                    </span>
                    </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <Badge 
                  variant={
                    stripeAccountStatus.status === 'active' ? 'success' : 
                    stripeAccountStatus.status === 'pending' ? 'warning' : 'danger'
                  }
                >
                  {stripeAccountStatus.status}
                </Badge>
              </div>
              
              {stripeAccountStatus.hasAccount && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Charges Enabled</span>
                    <Badge variant={stripeAccountStatus.chargesEnabled ? 'success' : 'danger'}>
                      {stripeAccountStatus.chargesEnabled ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payouts Enabled</span>
                    <Badge variant={stripeAccountStatus.payoutsEnabled ? 'success' : 'danger'}>
                      {stripeAccountStatus.payoutsEnabled ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account ID</span>
                    <span className="text-sm font-mono text-gray-500">
                      {stripeAccountStatus.accountId?.slice(-8)}
                    </span>
                    </div>
                </>
              )}
              
              {!stripeAccountStatus.hasAccount && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 text-sm">
                    Set up your Stripe Connect account to receive payments from ticket sales.
                  </p>
                  <Button 
                    onClick={() => router.push('/organizer/stripe-connect')}
                    className="mt-3 bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    Set Up Now
                  </Button>
              </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
        
      {/* Recent Events and Ticket Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          event.status === 'published' ? 'success' : 
                          event.status === 'draft' ? 'outline' : 
                          event.status === 'completed' ? 'info' : 'warning'
                        }>
                          {event.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(new Date(event.startDate))}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500 capitalize">{event.category}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {event.location.online ? 'Online Event' : event.location.name}
              </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{event.soldTickets}/{event.capacity} tickets</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(event.totalRevenue, 'CHF')}
              </div>
            </div>
          </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No events created yet</p>
                <Button 
                  onClick={() => router.push('/organizer/events/create')}
                  className="mt-2"
                  size="sm"
                >
                  Create Your First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Ticket Sales */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Ticket Sales</CardTitle>
             
            </div>
          </CardHeader>
          <CardContent>
            {recentTickets.length > 0 ? (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {typeof ticket.eventId === 'string' ? 'Event' : ticket.eventId.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          ticket.paymentStatus === 'paid' ? 'success' : 
                          ticket.paymentStatus === 'pending' ? 'warning' : 'danger'
                        }>
                          {ticket.paymentStatus}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(new Date(ticket.purchasedAt))}
                        </span>
          </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {typeof ticket.attendee === 'string' ? 'Attendee' : 
                         `${ticket.attendee.firstName} ${ticket.attendee.lastName}`}
        </div>
      </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{ticket.quantity} tickets</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(ticket.totalAmount, 'CHF')}
          </div>
        </div>
      </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No ticket sales yet</p>
                <p className="text-sm">Create and publish events to start selling tickets</p>
              </div>
            )}
          </CardContent>
        </Card>
          </div>

      {/* Event Status Breakdown and Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Event Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Event Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{eventStats.totalEvents}</div>
                <div className="text-sm text-blue-800">Total Events</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{eventStats.publishedEvents}</div>
                <div className="text-sm text-green-800">Published</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{eventStats.draftEvents}</div>
                <div className="text-sm text-gray-800">Draft</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{eventStats.completedEvents}</div>
                <div className="text-sm text-purple-800">Completed</div>
              </div>
            </div>
            {eventStats.canceledEvents > 0 && (
              <div className="mt-4 text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{eventStats.canceledEvents}</div>
                <div className="text-sm text-red-800">Canceled</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length > 0 ? (
              <div className="space-y-3">
                {monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-500">{month.tickets} tickets sold</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[var(--sage-green)]">
                        {formatCurrency(month.revenue, 'CHF')}
                      </div>
                    </div>
              </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No revenue data available</p>
                <p className="text-sm">Start selling tickets to see monthly revenue</p>
              </div>
            )}
          </CardContent>
        </Card>
          </div>

      {/* Refund Requests Summary */}
      {refundRequests > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pending Refund Requests</CardTitle>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => router.push('/organizer/refund-requests')}
              >
                View All ({refundRequests})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    {refundRequests} refund request{refundRequests !== 1 ? 's' : ''} pending review
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Review and process refund requests from your event attendees.
                  </p>
                </div>
            </div>
          </div>
          </CardContent>
        </Card>
        )}
      </div>
  );
}
