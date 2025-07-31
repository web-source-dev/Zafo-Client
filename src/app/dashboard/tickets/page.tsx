'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/auth/auth-context';
import { useLanguage } from '@/i18n/language-context';
import ticketService, { Ticket } from '@/services/ticket-service';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import QRCodeComponent from '@/components/ui/QRCode';
import { formatDate } from '@/utils/dateUtils';
import { generateTicketPDF, generateAllTicketsPDF, TicketData } from '@/utils/pdfGenerator';
import { Calendar, MapPin, Users, CreditCard, Clock, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, Eye, EyeOff, Download, FileText } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function UserTicketsPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundingTicket, setRefundingTicket] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<{ [ticketId: string]: { [detailIndex: number]: boolean } }>({});
  const [expandedTickets, setExpandedTickets] = useState<{ [ticketId: string]: boolean }>({});
  const [showRefundForm, setShowRefundForm] = useState<{ [ticketId: string]: boolean }>({});
  const [downloadingTicket, setDownloadingTicket] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState<{ [ticketId: string]: boolean }>({});

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

    const ticket = tickets.find(t => t._id === ticketId);
    if (!ticket) {
      setError(t('tickets.ticketNotFound'));
      return;
    }

    // Get selected ticket details by index
    const selectedIndices = Object.keys(selectedTickets[ticketId] || {})
      .filter(index => selectedTickets[ticketId][parseInt(index)])
      .map(index => parseInt(index));
      
    if (selectedIndices.length === 0) {
      setError(t('tickets.selectTicketsToRefund'));
      return;
    }

    // Get the actual ticket numbers from the selected indices
    const selectedTicketNumbers = selectedIndices.map(index => {
      const detail = ticket.ticketDetails[index];
      if (!detail || !detail.ticketNumber) {
        console.warn('Invalid ticket detail at index:', index, detail);
        return null;
      }
      return detail.ticketNumber;
    }).filter(num => num !== null);

    if (selectedTicketNumbers.length === 0) {
      setError(t('tickets.noValidTicketsSelected'));
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
        setSelectedTickets(prev => ({ ...prev, [ticketId]: {} }));
        setShowRefundForm(prev => ({ ...prev, [ticketId]: false }));
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

  const handleTicketSelection = (ticketId: string, detailIndex: number, checked: boolean) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [detailIndex]: checked
      }
    }));
  };

  const toggleTicketExpansion = (ticketId: string) => {
    setExpandedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  const toggleRefundForm = (ticketId: string) => {
    setShowRefundForm(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  const handleDownloadTicket = async (ticket: Ticket, detailIndex: number) => {
    const detail = ticket.ticketDetails[detailIndex];
    if (!detail) return;

    setDownloadingTicket(`${ticket._id}-${detailIndex}`);
    
    try {
      const ticketData: TicketData = {
        eventTitle: getEventTitle(ticket),
        eventDate: getEventDate(ticket),
        eventLocation: getEventLocation(ticket),
        attendeeName: detail.attendeeName,
        attendeeEmail: detail.attendeeEmail,
        ticketNumber: detail.ticketNumber,
        ticketPrice: ticket.ticketPrice / ticket.quantity,
        currency: ticket.currency,
        purchaseDate: formatDate(new Date(ticket.purchasedAt)),
        qrCodeData: '' // This will be generated in the PDF function
      };

      await generateTicketPDF(ticketData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    } finally {
      setDownloadingTicket(null);
    }
  };

  const handleDownloadAllTicketsForEvent = async (ticket: Ticket) => {
    setDownloadingAll(prev => ({ ...prev, [ticket._id]: true }));
    
    try {
      const allTicketData: TicketData[] = [];
      
      ticket.ticketDetails.forEach((detail) => {
        // Skip tickets that are refunded (completed)
        if (detail.refundStatus === 'completed') {
          return;
        }
        
        allTicketData.push({
          eventTitle: getEventTitle(ticket),
          eventDate: getEventDate(ticket),
          eventLocation: getEventLocation(ticket),
          attendeeName: detail.attendeeName,
          attendeeEmail: detail.attendeeEmail,
          ticketNumber: detail.ticketNumber,
          ticketPrice: ticket.ticketPrice / ticket.quantity,
          currency: ticket.currency,
          purchaseDate: formatDate(new Date(ticket.purchasedAt)),
          qrCodeData: '' // This will be generated in the PDF function
        });
      });

      // Only generate PDF if there are non-refunded tickets
      if (allTicketData.length > 0) {
        await generateAllTicketsPDF(allTicketData);
      } else {
        setError('No active tickets available for download');
      }
    } catch (error) {
      console.error('Error generating PDFs:', error);
      setError('Failed to generate PDFs');
    } finally {
      setDownloadingAll(prev => ({ ...prev, [ticket._id]: false }));
    }
  };

  const canRefund = (ticket: Ticket) => {
    if (ticket.paymentStatus !== 'paid' || ticket.refundStatus !== 'none') {
      return false;
    }

    const eventEndDate = typeof ticket.eventId === 'object' 
      ? new Date(ticket.eventId.endDate) 
      : new Date();
    const currentDate = new Date();

    return currentDate < eventEndDate;
  };

  const calculateRefundAmount = (ticket: Ticket, selectedTicketNumbers: string[]) => {
    if (selectedTicketNumbers.length === 0) return 0;
    
    const pricePerTicket = ticket.ticketPrice / ticket.quantity;
    const totalRefundAmount = selectedTicketNumbers.length * pricePerTicket;
    const cancellationFee = selectedTicketNumbers.length * 2.50;
    
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
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs">
          <CheckCircle size={10} className="mr-1" />
          {t('tickets.status.paid')}
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
          <Clock size={10} className="mr-1" />
          {t('tickets.status.pending')}
        </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
          <XCircle size={10} className="mr-1" />
          {t('tickets.status.failed')}
        </Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
          {t('tickets.status.refunded')}
        </Badge>;
      case 'partially_refunded':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
          {t('tickets.status.partiallyRefunded')}
        </Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{ticket.paymentStatus}</Badge>;
    }
  };

  const getRefundStatusBadge = (ticket: Ticket) => {
    switch (ticket.refundStatus) {
      case 'requested':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
          <AlertCircle size={10} className="mr-1" />
          {t('tickets.refundStatus.requested')}
        </Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs">
          <CheckCircle size={10} className="mr-1" />
          {t('tickets.refundStatus.approved')}
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
          <XCircle size={10} className="mr-1" />
          {t('tickets.refundStatus.rejected')}
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
          <CheckCircle size={10} className="mr-1" />
          {t('tickets.refundStatus.completed')}
        </Badge>;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[var(--sage-green)] rounded-lg">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.myTickets')}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('tickets.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {tickets.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('tickets.noTickets')}</h3>
              <p className="text-gray-500 mb-4 text-sm">{t('tickets.noTicketsDesc')}</p>
              <Button 
                onClick={() => router.push('/events')}
                className="bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {t('tickets.browseEvents')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Compact Tickets List */
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
                {/* Main Ticket Row */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      {getEventImage(ticket) ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={getEventImage(ticket)!}
                            alt={getEventTitle(ticket)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {getEventTitle(ticket)}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{getEventDate(ticket)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{getEventLocation(ticket)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{ticket.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getPaymentStatusBadge(ticket)}
                          {getRefundStatusBadge(ticket)}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-[var(--sage-green)]">
                            {ticket.ticketPrice} {ticket.currency}
                          </span>
                          <span className="text-gray-500">
                            {formatDate(new Date(ticket.purchasedAt))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Download All Tickets for this Event */}
                          <Button
                            onClick={() => handleDownloadAllTicketsForEvent(ticket)}
                            disabled={downloadingAll[ticket._id]}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {downloadingAll[ticket._id] ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-600"></div>
                                <span>Generating...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Download All</span>
                              </div>
                            )}
                          </Button>
                          {canRefund(ticket) && (
                            <Button
                              onClick={() => toggleRefundForm(ticket._id)}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              {showRefundForm[ticket._id] ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                              {t('tickets.requestRefund')}
                            </Button>
                          )}
                          <Button
                            onClick={() => toggleTicketExpansion(ticket._id)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {expandedTickets[ticket._id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedTickets[ticket._id] && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-4">
                      {/* Attendees */}
                      {ticket.ticketDetails && ticket.ticketDetails.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t('tickets.attendees')}
                          </h4>
                          <div className="grid gap-3">
                            {ticket.ticketDetails.map((detail, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    {/* QR Code */}
                                    <div className="flex-shrink-0">
                                      <div className="bg-white p-0.5 rounded border border-gray-200 shadow-sm">
                                        <QRCodeComponent
                                          value={`Name: ${detail.attendeeName}\nEmail: ${detail.attendeeEmail}\nTicket Number: ${detail.ticketNumber}\nAmount: ${ticket.ticketPrice / ticket.quantity} ${ticket.currency}\nPurchase Date: ${formatDate(new Date(ticket.purchasedAt))}`}
                                          size={80}
                                          className="mb-0"
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Attendee Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 truncate">{detail.attendeeName}</div>
                                      <div className="text-gray-600 truncate">{detail.attendeeEmail}</div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {t('tickets.ticket')} {detail.ticketNumber}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Download Button */}

                                    {detail.refundStatus === 'none' && (
                                    <Button
                                      onClick={() => handleDownloadTicket(ticket, index)}
                                      disabled={downloadingTicket === `${ticket._id}-${index}`}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-6 px-2"
                                    >
                                      {downloadingTicket === `${ticket._id}-${index}` ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-600"></div>
                                      ) : (
                                        <Download className="h-3 w-3" />
                                      )}
                                    </Button>
                                    )}                                    
                                    {/* Refund Status */}
                                    {detail.refundStatus !== 'none' && (
                                      <Badge variant="outline" className="text-xs">
                                       Refund {t(`tickets.refundStatus.${detail.refundStatus}`)}
                                      </Badge>
                                    )}
                                    
                                    {/* Refund Checkbox */}
                                    {canRefund(ticket) && detail.refundStatus === 'none' && (
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={selectedTickets[ticket._id]?.[index] || false}
                                          onChange={(e) => handleTicketSelection(ticket._id, index, e.target.checked)}
                                          className="rounded border-gray-300 text-[var(--sage-green)] focus:ring-[var(--sage-green)] focus:ring-1"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">{t('tickets.selectForRefund')}</span>
                                      </label>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Refund Form */}
                      {showRefundForm[ticket._id] && canRefund(ticket) && (
                        <div className="bg-white border border-orange-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            {t('tickets.requestRefund')}
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('tickets.refundReason')}
                              </label>
                              <textarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                placeholder={t('tickets.refundReasonPlaceholder')}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[var(--sage-green)] focus:border-[var(--sage-green)] resize-none"
                                rows={2}
                              />
                            </div>
                            
                            {Object.keys(selectedTickets[ticket._id] || {}).filter(index => selectedTickets[ticket._id][parseInt(index)]).length > 0 && (
                              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-xs font-medium text-gray-900">
                                    {t('tickets.selectedForRefund')}: {Object.keys(selectedTickets[ticket._id] || {}).filter(index => selectedTickets[ticket._id][parseInt(index)]).length} {t('tickets.tickets')}
                                  </div>
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                                    {Object.keys(selectedTickets[ticket._id] || {}).filter(index => selectedTickets[ticket._id][parseInt(index)]).length} {t('tickets.selected')}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {t('tickets.refundAmount')}: <span className="font-semibold text-[var(--sage-green)]">
                                    {calculateRefundAmount(ticket, Object.keys(selectedTickets[ticket._id] || {}).filter(index => selectedTickets[ticket._id][parseInt(index)]).map(index => ticket.ticketDetails[parseInt(index)].ticketNumber))} {ticket.currency}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <Button
                              onClick={() => handleRefundRequest(ticket._id)}
                              disabled={refundingTicket === ticket._id || Object.keys(selectedTickets[ticket._id] || {}).filter(index => selectedTickets[ticket._id][parseInt(index)]).length === 0}
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {refundingTicket === ticket._id ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                                  {t('tickets.requestingRefund')}
                                </div>
                              ) : (
                                t('tickets.requestRefund')
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {!canRefund(ticket) && ticket.refundStatus === 'none' && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{t('tickets.cannotRefund')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 