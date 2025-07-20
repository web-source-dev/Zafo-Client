'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/language-context';
import { useAuth } from '@/auth/auth-context';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ticketService from '@/services/ticket-service';
import eventService, { Event } from '@/services/event-service';
import { ArrowLeft, Users, Calendar, MapPin, CreditCard, Download, FileText } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import Image from 'next/image';

interface Participant {
  _id: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: string;
  ticketPrice: number;
  currency: string;
  purchaseDate: Date;
  paymentStatus: string;
  refundStatus: string;
  quantity: number;
}

export default function EventParticipantsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalRevenue: 0,
    paidTickets: 0,
    pendingTickets: 0,
    refundedTickets: 0
  });

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch event details
        const eventResponse = await eventService.getEvent(params.id as string);
        
        if (eventResponse.success && eventResponse.data) {
          setEvent(eventResponse.data);
          
          // Verify that this event belongs to the current user
          const eventOrganizerId = typeof eventResponse.data.organizer === 'string' 
            ? eventResponse.data.organizer 
            : eventResponse.data.organizer._id;
            
          const userId = user?._id?.toString();
          const organizerId = eventOrganizerId?.toString();
          
          if (userId !== organizerId && user?.role !== 'admin') {
            setError(t('events.unauthorized'));
            return;
          }
          
          // Fetch participants (tickets for this event)
          const ticketsResponse = await ticketService.getOrganizerTickets({
            eventId: params.id as string
          });
          
          if (ticketsResponse.success && ticketsResponse.data) {
            const tickets = ticketsResponse.data.tickets;
            
            // Transform tickets into participants
            const participantsList: Participant[] = [];
            let totalRevenue = 0;
            let paidTickets = 0;
            let pendingTickets = 0;
            let refundedTickets = 0;
            
            tickets.forEach(ticket => {
              // Only include tickets that are not fully refunded
              if (ticket.paymentStatus !== 'refunded') {
                ticket.ticketDetails.forEach(detail => {
                  // Skip refunded individual tickets
                  if (detail.refundStatus !== 'completed') {
                    participantsList.push({
                      _id: `${ticket._id}-${detail.ticketNumber}`,
                      attendeeName: detail.attendeeName,
                      attendeeEmail: detail.attendeeEmail,
                      ticketNumber: detail.ticketNumber,
                      ticketPrice: ticket.ticketPrice / ticket.quantity,
                      currency: ticket.currency,
                      purchaseDate: new Date(ticket.purchasedAt),
                      paymentStatus: ticket.paymentStatus || 'pending',
                      refundStatus: detail.refundStatus || 'none',
                      quantity: 1
                    });
                    
                    if (ticket.paymentStatus === 'paid') {
                      totalRevenue += ticket.ticketPrice / ticket.quantity;
                      paidTickets++;
                    } else if (ticket.paymentStatus === 'pending') {
                      pendingTickets++;
                    }
                  } else {
                    refundedTickets++;
                  }
                });
              } else {
                refundedTickets += ticket.quantity;
              }
            });
            
            setParticipants(participantsList);
            setStats({
              totalParticipants: participantsList.length,
              totalRevenue,
              paidTickets,
              pendingTickets,
              refundedTickets
            });
          }
        } else {
          setError(eventResponse.message || t('events.notFound'));
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message || t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventAndParticipants();
  }, [params.id, t, user]);

  // Handle back to event details
  const handleBackToEvent = () => {
    router.push(`/organizer/events/${params.id}`);
  };

  // Handle export participants
  const handleExportParticipants = () => {
    if (participants.length === 0) return;
    
    const csvContent = [
      ['Name', 'Email', 'Ticket Number', 'Price', 'Purchase Date', 'Payment Status'],
      ...participants.map(p => [
        p.attendeeName,
        p.attendeeEmail,
        p.ticketNumber,
        `${p.ticketPrice} ${p.currency}`,
        p.purchaseDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        p.paymentStatus
      ])
    ].map(row => 
      row.map(cell => 
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `participants-${event?.title || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error || t('events.notFound')}
          </div>
          <Button onClick={handleBackToEvent}>
            {t('events.backToEvent')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToEvent}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('events.backToEvent')}
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--sage-green)] mb-2">
                {t('events.participants')} - {event.title}
              </h1>
              <p className="text-lg text-gray-600">
                {t('events.participantsDescription')}
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button 
                variant="outline"
                onClick={handleExportParticipants}
                disabled={participants.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('events.exportParticipants')}
              </Button>
            </div>
          </div>
        </div>

        {/* Event Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {event.coverImage && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[var(--sage-green)]">{event.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(new Date(event.startDate))}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-[var(--sage-green)]">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('events.totalParticipants')}</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-green-100">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('events.paidTickets')}</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.paidTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-yellow-100">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('events.pendingTickets')}</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.pendingTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-red-100">
                  <CreditCard className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('events.refundedTickets')}</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.refundedTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-2 bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{t('events.totalRevenue')}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-CH', {
                      style: 'currency',
                      currency: 'CHF'
                    }).format(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('events.participantsList')} ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('events.noParticipants')}</h3>
                <p className="text-gray-500">{t('events.noParticipantsDescription')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.participant')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.ticketNumber')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.price')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.purchaseDate')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('events.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <tr key={participant._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {participant.attendeeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {participant.attendeeEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.ticketNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('en-CH', {
                            style: 'currency',
                            currency: participant.currency
                          }).format(participant.ticketPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(participant.purchaseDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={participant.paymentStatus === 'paid' ? 'default' : 'outline'}
                              className={`text-xs ${
                                participant.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : participant.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              {t(`tickets.status.${participant.paymentStatus}`)}
                            </Badge>
                            {participant.refundStatus !== 'none' && (
                              <Badge 
                                variant="outline"
                                className="text-xs bg-orange-100 text-orange-800 border-orange-200"
                              >
                                {t(`tickets.refundStatus.${participant.refundStatus}`)}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 