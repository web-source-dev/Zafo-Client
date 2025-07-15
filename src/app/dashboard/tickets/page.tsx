'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import ticketService, { Ticket } from '@/services/ticket-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/utils/dateUtils';

export default function UserTicketsPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundingTicket, setRefundingTicket] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<{ [ticketId: string]: number[] }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchTickets();
  }, [isAuthenticated, router]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await ticketService.getUserTickets();
      
      if (response.success && response.data) {
        setTickets(response.data.tickets);
      } else {
        setError(response.message || t('tickets.fetchError'));
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(t('tickets.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefundRequest = async (ticketId: string) => {
    if (!refundReason.trim()) {
      setError(t('tickets.refundReasonRequired'));
      return;
    }

    const selectedTicketNumbers = selectedTickets[ticketId] || [];
    if (selectedTicketNumbers.length === 0) {
      setError(t('tickets.selectTicketsToRefund'));
      return;
    }

    try {
      setRefundingTicket(ticketId);
      const response = await ticketService.requestTicketRefund(ticketId, {
        reason: refundReason.trim(),
        refundTickets: selectedTicketNumbers
      });

      if (response.success) {
        setError(null);
        setRefundReason('');
        setRefundingTicket(null);
        setSelectedTickets(prev => ({ ...prev, [ticketId]: [] }));
        // Refresh tickets
        await fetchTickets();
        alert(t('tickets.refundRequested'));
      } else {
        setError(response.message || t('tickets.refundRequestFailed'));
      }
    } catch (err) {
      console.error('Error requesting refund:', err);
      setError(t('tickets.refundRequestFailed'));
    } finally {
      setRefundingTicket(null);
    }
  };

  const handleTicketSelection = (ticketId: string, ticketNumber: number, checked: boolean) => {
    setSelectedTickets(prev => {
      const current = prev[ticketId] || [];
      if (checked) {
        return { ...prev, [ticketId]: [...current, ticketNumber] };
      } else {
        return { ...prev, [ticketId]: current.filter(num => num !== ticketNumber) };
      }
    });
  };

  const canRefund = (ticket: Ticket) => {
    if (ticket.paymentStatus !== 'paid' || ticket.refundStatus !== 'none') {
      return false;
    }

    // Check if event has ended
    const eventEndDate = typeof ticket.eventId === 'object' 
      ? new Date(ticket.eventId.endDate) 
      : new Date();
    const currentDate = new Date();

    return currentDate < eventEndDate;
  };

  const getRefundableTickets = (ticket: Ticket) => {
    return ticket.ticketDetails.filter(detail => detail.refundStatus === 'none');
  };

  const calculateRefundAmount = (ticket: Ticket, selectedNumbers: number[]) => {
    if (selectedNumbers.length === 0) return 0;
    
    const pricePerTicket = ticket.ticketPrice / ticket.quantity;
    const totalRefundAmount = selectedNumbers.length * pricePerTicket;
    const cancellationFee = selectedNumbers.length * 2.50; // 2.50 CHF per ticket
    
    return Math.max(0, totalRefundAmount - cancellationFee);
  };

  const getEventTitle = (ticket: Ticket) => {
    return typeof ticket.eventId === 'object' ? ticket.eventId.title : 'Unknown Event';
  };

  const getEventDate = (ticket: Ticket) => {
    if (typeof ticket.eventId === 'object') {
      return formatDate(new Date(ticket.eventId.startDate));
    }
    return 'Unknown Date';
  };

  const getEventLocation = (ticket: Ticket) => {
    if (typeof ticket.eventId === 'object') {
      return ticket.eventId.location.name;
    }
    return 'Unknown Location';
  };

  const getEventImage = (ticket: Ticket) => {
    if (typeof ticket.eventId === 'object' && ticket.eventId.coverImage) {
      return ticket.eventId.coverImage;
    }
    return null;
  };

  const getPaymentStatusBadge = (ticket: Ticket) => {
    switch (ticket.paymentStatus) {
      case 'paid':
        return <Badge variant="default">{t('tickets.status.paid')}</Badge>;
      case 'pending':
        return <Badge variant="outline">{t('tickets.status.pending')}</Badge>;
      case 'failed':
        return <Badge variant="outline">{t('tickets.status.failed')}</Badge>;
      case 'refunded':
        return <Badge variant="outline">{t('tickets.status.refunded')}</Badge>;
      case 'partially_refunded':
        return <Badge variant="outline">{t('tickets.status.partiallyRefunded')}</Badge>;
      default:
        return <Badge variant="outline">{ticket.paymentStatus}</Badge>;
    }
  };

  const getRefundStatusBadge = (ticket: Ticket) => {
    switch (ticket.refundStatus) {
      case 'requested':
        return <Badge variant="outline">{t('tickets.refundStatus.requested')}</Badge>;
      case 'approved':
        return <Badge variant="default">{t('tickets.refundStatus.approved')}</Badge>;
      case 'rejected':
        return <Badge variant="outline">{t('tickets.refundStatus.rejected')}</Badge>;
      case 'completed':
        return <Badge variant="default">{t('tickets.refundStatus.completed')}</Badge>;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--sage-green)] mb-2">
          {t('dashboard.myTickets')}
        </h1>
        <p className="text-gray-600">
          {t('tickets.description')}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('tickets.noTickets')}</h3>
            <p className="text-gray-500 mb-4">{t('tickets.noTicketsDesc')}</p>
            <Button onClick={() => router.push('/events')}>
              {t('tickets.browseEvents')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-[var(--sage-green)]">
                      {getEventTitle(ticket)}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{getEventDate(ticket)}</span>
                      <span>{getEventLocation(ticket)}</span>
                      <span>{t('tickets.quantity')}: {ticket.quantity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getPaymentStatusBadge(ticket)}
                    {getRefundStatusBadge(ticket)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {getEventImage(ticket) && (
                      <div className="mb-4">
                        <Image
                          src={getEventImage(ticket)!}
                          alt={getEventTitle(ticket)}
                          width={300}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{t('tickets.totalAmount')}:</span>
                        <span className="font-bold text-[var(--sage-green)]">
                          {ticket.ticketPrice} {ticket.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {ticket.ticketDetails && ticket.ticketDetails.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">{t('tickets.attendees')}</h4>
                        <div className="space-y-2">
                          {ticket.ticketDetails.map((detail, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex-1">
                                <div className="text-sm font-medium">{detail.attendeeName}</div>
                                <div className="text-xs text-gray-600">{detail.attendeeEmail}</div>
                                <div className="text-xs text-gray-500">{t('tickets.ticket')} #{detail.ticketNumber}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {detail.refundStatus !== 'none' && (
                                  <Badge variant="outline" className="text-xs">
                                    {t(`tickets.refundStatus.${detail.refundStatus}`)}
                                  </Badge>
                                )}
                                {canRefund(ticket) && detail.refundStatus === 'none' && (
                                  <input
                                    type="checkbox"
                                    checked={selectedTickets[ticket._id]?.includes(detail.ticketNumber) || false}
                                    onChange={(e) => handleTicketSelection(ticket._id, detail.ticketNumber, e.target.checked)}
                                    className="rounded border-gray-300 text-[var(--sage-green)] focus:ring-[var(--sage-green)]"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Refund Section */}
                    {canRefund(ticket) && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">{t('tickets.requestRefund')}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t('tickets.refundReason')}
                            </label>
                            <textarea
                              value={refundReason}
                              onChange={(e) => setRefundReason(e.target.value)}
                              placeholder={t('tickets.refundReasonPlaceholder')}
                              className="w-full p-2 border rounded-md text-sm"
                              rows={3}
                            />
                          </div>
                          
                          {selectedTickets[ticket._id] && selectedTickets[ticket._id].length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-md">
                              <div className="text-sm font-medium mb-1">
                                {t('tickets.selectedForRefund')}: {selectedTickets[ticket._id].length} {t('tickets.tickets')}
                              </div>
                              <div className="text-sm text-gray-600">
                                {t('tickets.refundAmount')}: {calculateRefundAmount(ticket, selectedTickets[ticket._id])} {ticket.currency}
                              </div>
                            </div>
                          )}
                          
                          <Button
                            onClick={() => handleRefundRequest(ticket._id)}
                            disabled={refundingTicket === ticket._id || selectedTickets[ticket._id]?.length === 0}
                            className="w-full"
                          >
                            {refundingTicket === ticket._id ? t('tickets.requestingRefund') : t('tickets.requestRefund')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {!canRefund(ticket) && ticket.refundStatus === 'none' && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-500">{t('tickets.cannotRefund')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 