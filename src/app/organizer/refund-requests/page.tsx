"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/auth/auth-context";
import ticketService from "@/services/ticket-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useLanguage } from "@/i18n/language-context";

interface RefundRequest {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: {
      name: string;
      online: boolean;
    };
  };
  attendee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  quantity: number;
  ticketDetails: Array<{
    attendeeName: string;
    attendeeEmail: string;
    ticketNumber: number;
    refundStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'completed';
    refundAmount?: number;
    refundReason?: string;
    refundedAt?: Date;
  }>;
  ticketPrice: number;
  currency: string;
  platformFee: number;
  organizerPayment: number; 
  stripePaymentIntentId: string;
  stripeTransferId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected' | 'completed';
  refundAmount: number;
  cancellationFee: number;
  refundReason?: string;
  refundedAt?: string;
  organizerTransferStatus: 'pending' | 'completed' | 'failed';
  organizerTransferDate?: string;
  purchasedAt: string;
  updatedAt: string;
}

export default function OrganizerRefundRequestsPage() {
  const { t } = useLanguage();
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketService.getOrganizerRefundRequests();
      if (response.success && response.data) {
        const filteredRequests = response.data.filter(
          (ticket) => ticket.refundStatus === "requested"
        ) as unknown as RefundRequest[];
        setRefundRequests(filteredRequests);
      } else {
        setError(response.message || 'Failed to fetch refund requests');
      }
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      setError('Failed to fetch refund requests');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (ticketId: string, action: "approve" | "reject") => {
    try {
      setProcessing(ticketId);
      setError(null);
      setSuccess(null);
      
      // Get all requested ticket numbers for this ticket
      const ticket = refundRequests.find(t => t._id === ticketId);
      const requestedTicketNumbers = ticket?.ticketDetails
        .filter(detail => detail.refundStatus === 'requested')
        .map(detail => detail.ticketNumber) || [];
      
      const response = await ticketService.processTicketRefund(ticketId, { 
        action,
        refundTickets: requestedTicketNumbers
      });
      
      if (response.success) {
        setSuccess(`Refund ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        await fetchRefundRequests();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || `Failed to ${action} refund`);
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      setError(`Failed to ${action} refund`);
    } finally {
      setProcessing(null);
    }
  };

  const getRequestedTicketsCount = (ticket: RefundRequest) => {
    return ticket.ticketDetails.filter(detail => detail.refundStatus === 'requested').length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount} ${currency}`;
  };

  if (loading) {
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
          Refund Requests
        </h1>
        <p className="text-gray-600">
          Review and process refund requests for your events
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {refundRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No refund requests</h3>
            <p className="text-gray-500">There are no pending refund requests for your events.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {refundRequests.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-[var(--sage-green)]">
                      {ticket.eventId.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{formatDate(ticket.eventId.startDate)}</span>
                      <span>{ticket.eventId.location.name}</span>
                      <span>Quantity: {ticket.quantity}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {getRequestedTicketsCount(ticket)} tickets requested for refund
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="outline">{ticket.refundStatus}</Badge>
                    <Badge variant="outline">{ticket.paymentStatus}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Attendee:</span>
                        <span>{ticket.attendee.firstName} {ticket.attendee.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{ticket.attendee.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">{formatCurrency(ticket.ticketPrice, ticket.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Refund Amount:</span>
                        <span className="font-bold text-[var(--sage-green)]">
                          {formatCurrency(ticket.refundAmount, ticket.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cancellation Fee:</span>
                        <span>{formatCurrency(ticket.cancellationFee, ticket.currency)}</span>
                      </div>
                    </div>
                    
                    {ticket.refundReason && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Refund Reason:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {ticket.refundReason}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Tickets Requested for Refund:</h4>
                    <div className="space-y-2 mb-4">
                      {ticket.ticketDetails.map((detail, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{detail.attendeeName}</div>
                            <div className="text-xs text-gray-600">{detail.attendeeEmail}</div>
                            <div className="text-xs text-gray-500">Ticket #{detail.ticketNumber}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {detail.refundStatus && detail.refundStatus !== 'none' && (
                              <Badge variant="outline" className="text-xs">
                                {detail.refundStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <div className="text-sm font-medium mb-1">
                        {getRequestedTicketsCount(ticket)} tickets will be {processing === ticket._id ? 'processing...' : 'processed'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Refund amount: {formatCurrency(ticket.refundAmount, ticket.currency)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleProcessRefund(ticket._id, 'approve')}
                        disabled={processing === ticket._id}
                        className="flex-1"
                      >
                        {processing === ticket._id ? 'Processing...' : 'Approve All Refunds'}
                      </Button>
                      <Button
                        onClick={() => handleProcessRefund(ticket._id, 'reject')}
                        disabled={processing === ticket._id}
                        variant="outline"
                        className="flex-1"
                      >
                        {processing === ticket._id ? 'Processing...' : 'Reject All Refunds'}
                      </Button>
                    </div>
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