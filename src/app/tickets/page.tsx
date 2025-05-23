'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth/auth-context';
import ProtectedRoute from '@/auth/protected-route';
import { format, parseISO } from 'date-fns';
import ticketService, { TicketOrder } from '@/services/ticket-service';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { Calendar, MapPin, FileText, Ticket, Download, ExternalLink, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TicketsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        const filters: Record<string, any> = {
          page,
          limit: 5,
          sort: '-createdAt'
        };
        
        if (statusFilter) {
          filters.status = statusFilter;
        }
        
        const response = await ticketService.getUserTickets(filters);
        
        if (response.success && response.data) {
          setTickets(response.data.tickets);
          setTotalPages(response.data.pagination.pages);
          setTotalTickets(response.data.pagination.total);
        } else {
          setError(response.message || 'Failed to load tickets');
        }
      } catch (err: any) {
        console.error('Error fetching tickets:', err);
        setError('An error occurred while loading your tickets');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated, page, statusFilter]);
  
  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page when changing filters
  };
  
  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  // Format ticket status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      case 'refunded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Refunded</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="bg-[var(--taupe)] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[var(--sage-green)] hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-[var(--sage-green)]">My Tickets</h1>
          
          {/* Filter controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="succeeded">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {tickets.length} of {totalTickets} tickets
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">
                {error}
              </h2>
              <p className="text-gray-600 mb-6">
                Unable to load your tickets. Please try again later.
              </p>
              <Button onClick={() => router.push('/')}>
                Back to Home
              </Button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Ticket className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">
                No Tickets Found
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't purchased any tickets yet. Browse our events to find something you'd like to attend.
              </p>
              <Button onClick={() => router.push('/events')}>
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ticket Cards */}
              {tickets.map((ticket) => {
                // Handle both string and object event types
                const eventTitle = typeof ticket.event === 'object' ? ticket.event.title : 'Event';
                const eventSlug = typeof ticket.event === 'object' ? ticket.event.slug : '';
                const eventDate = typeof ticket.event === 'object' ? ticket.event.startDate : null;
                const eventLocation = typeof ticket.event === 'object' ? ticket.event.location : null;
                const eventCoverImage = typeof ticket.event === 'object' ? ticket.event.coverImage : null;
                
                return (
                  <Card key={ticket._id} className="overflow-hidden">
                    <div className="grid md:grid-cols-12 gap-0">
                      {/* Event Image (small screens: hidden, md: shown) */}
                      {eventCoverImage && (
                        <div className="hidden md:block md:col-span-3 relative h-full">
                          <Image
                            src={eventCoverImage}
                            alt={eventTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Ticket Details */}
                      <div className="md:col-span-9 p-0">
                        <CardHeader className="flex flex-row justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold hover:text-[var(--sage-green)]">
                              <Link href={`/events/${eventSlug}`}>{eventTitle}</Link>
                            </h3>
                            
                            <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-[var(--sage-green)]" />
                                {eventDate ? (
                                  format(parseISO(eventDate.toString()), 'MMM d, yyyy')
                                ) : (
                                  'Date not available'
                                )}
                              </div>
                              
                              {eventLocation && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-[var(--sage-green)]" />
                                  {eventLocation.online ? 'Online Event' : eventLocation.name}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            {formatStatus(ticket.paymentStatus)}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Order Number</p>
                              <p className="font-medium">{ticket.orderNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Purchase Date</p>
                              <p className="font-medium">
                                {format(parseISO(ticket.createdAt.toString()), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Ticket Quantity</p>
                              <p className="font-medium">{ticket.quantity}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Amount</p>
                              <p className="font-medium">
                                {ticket.amount === 0 ? 'Free' : `${ticket.amount} ${ticket.currency}`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="bg-gray-50 border-t">
                          <div className="flex flex-wrap gap-3 w-full">
                            {/* Tickets PDF button (if payment succeeded) */}
                            {ticket.paymentStatus === 'succeeded' && ticket.pdfUrl && (
                              <a
                                href={ticket.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center text-sm px-3 py-2 border border-[var(--sage-green)] text-[var(--sage-green)] bg-white rounded-md hover:bg-[var(--sage-green)] hover:text-white transition-colors"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download Tickets
                              </a>
                            )}
                            
                            {/* View Details button */}
                            <Link
                              href={`/tickets/${ticket._id}`}
                              className="inline-flex items-center justify-center text-sm px-3 py-2 bg-[var(--sage-green)] text-white rounded-md hover:bg-[#3a5233] transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                            
                            {/* Retry Payment button (if payment failed) */}
                            {ticket.paymentStatus === 'failed' && (
                              <Button
                                variant="outline"
                                className="text-red-500 border-red-200"
                                size="sm"
                              >
                                Retry Payment
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="inline-flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="inline-flex items-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 