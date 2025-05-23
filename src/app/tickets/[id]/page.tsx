'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/auth/auth-context';
import ProtectedRoute from '@/auth/protected-route';
import { format, parseISO } from 'date-fns';
import ticketService, { TicketOrder, IndividualTicket } from '@/services/ticket-service';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { Calendar, MapPin, FileText, Ticket as TicketIcon, Download, ArrowLeft, User, Mail, CheckCircle, X, Edit, Save, Plus, Loader } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [ticketOrder, setTicketOrder] = useState<TicketOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Attendee edit state
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [attendeeEmail, setAttendeeEmail] = useState<string>('');
  const [savingAttendee, setSavingAttendee] = useState(false);
  
  // Fetch ticket order
  useEffect(() => {
    const fetchTicketOrder = async () => {
      try {
        setLoading(true);
        
        if (!params.id || typeof params.id !== 'string') {
          setError('Invalid ticket ID');
          setLoading(false);
          return;
        }
        
        const response = await ticketService.getTicketById(params.id);
        
        if (response.success && response.data) {
          setTicketOrder(response.data);
        } else {
          setError(response.message || 'Failed to load ticket details');
        }
      } catch (err: any) {
        console.error('Error fetching ticket details:', err);
        setError('An error occurred while loading ticket details');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchTicketOrder();
    }
  }, [isAuthenticated, params.id]);
  
  // Format payment status for display
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
  
  // Start editing attendee
  const startEditingAttendee = (ticket: IndividualTicket) => {
    setEditingTicket(ticket.ticketNumber);
    setAttendeeName(ticket.attendeeName || '');
    setAttendeeEmail(ticket.attendeeEmail || '');
  };
  
  // Cancel editing attendee
  const cancelEditingAttendee = () => {
    setEditingTicket(null);
    setAttendeeName('');
    setAttendeeEmail('');
  };
  
  // Save attendee information
  const saveAttendeeInfo = async (ticketNumber: string) => {
    if (!ticketOrder) return;
    
    setSavingAttendee(true);
    try {
      const response = await ticketService.updateAttendeeInfo({
        ticketOrderId: ticketOrder._id,
        ticketNumber,
        attendeeName,
        attendeeEmail
      });
      
      if (response.success && response.data) {
        // Update local ticket order state
        const updatedTickets = ticketOrder.tickets.map(ticket => {
          if (ticket.ticketNumber === ticketNumber) {
            return {
              ...ticket,
              attendeeName: response.data?.attendeeName || attendeeName || null,
              attendeeEmail: response.data?.attendeeEmail || attendeeEmail || null
            };
          }
          return ticket;
        });
        
        setTicketOrder({
          ...ticketOrder,
          tickets: updatedTickets
        });
        
        toast.success('Attendee information updated successfully');
        cancelEditingAttendee();
      } else {
        toast.error(response.message || 'Failed to update attendee information');
      }
    } catch (err: any) {
      console.error('Error updating attendee info:', err);
      toast.error('An error occurred while updating attendee information');
    } finally {
      setSavingAttendee(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="bg-[var(--taupe)] min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/tickets" className="inline-flex items-center text-[var(--sage-green)] hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to All Tickets
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-[var(--sage-green)]">Ticket Details</h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
            </div>
          ) : error || !ticketOrder ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">
                {error || 'Ticket not found'}
              </h2>
              <p className="text-gray-600 mb-6">
                Unable to load ticket details. Please try again later.
              </p>
              <Button onClick={() => router.push('/tickets')}>
                Back to My Tickets
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Information */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-[var(--sage-green)]">Event Information</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Event Image */}
                    {typeof ticketOrder.event === 'object' && ticketOrder.event.coverImage && (
                      <div className="rounded-md overflow-hidden">
                        <Image
                          src={ticketOrder.event.coverImage}
                          alt={ticketOrder.event.title}
                          width={500}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Event Details */}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {typeof ticketOrder.event === 'object' ? (
                          <Link href={`/events/${ticketOrder.event.slug}`} className="hover:text-[var(--sage-green)]">
                            {ticketOrder.event.title}
                          </Link>
                        ) : (
                          'Event'
                        )}
                      </h3>
                      
                      {/* Date and Location */}
                      {typeof ticketOrder.event === 'object' && (
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                            <span>
                              {format(parseISO(ticketOrder.event.startDate.toString()), 'EEEE, MMMM d, yyyy')}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                            <span>
                              {format(parseISO(ticketOrder.event.startDate.toString()), 'h:mm a')} - 
                              {format(parseISO(ticketOrder.event.endDate.toString()), 'h:mm a')}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
                            <span>
                              {ticketOrder.event.location.online 
                                ? 'Online Event' 
                                : `${ticketOrder.event.location.name}, ${ticketOrder.event.location.address.city}`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Order Information */}
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Order Information</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Order #:</span>
                          <p className="font-medium">{ticketOrder.orderNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Purchase Date:</span>
                          <p className="font-medium">
                            {format(parseISO(ticketOrder.createdAt.toString()), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <p className="font-medium">{ticketOrder.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Amount:</span>
                          <p className="font-medium">
                            {ticketOrder.amount === 0 
                              ? 'Free' 
                              : `${ticketOrder.amount} ${ticketOrder.currency}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Payment Status:</span>
                          <div className="mt-1">{formatStatus(ticketOrder.paymentStatus)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* PDF Download */}
                  {ticketOrder.paymentStatus === 'succeeded' && ticketOrder.pdfUrl && (
                    <CardFooter className="border-t bg-gray-50">
                      <a
                        href={ticketOrder.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center bg-[var(--sage-green)] text-white py-2 px-4 rounded-md hover:bg-[#3a5233] transition-colors"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Tickets PDF
                      </a>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              {/* Tickets List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-[var(--sage-green)]">Your Tickets</h2>
                    <p className="text-gray-600 text-sm">
                      Each ticket can be used for one attendee. You can update the attendee information for each ticket.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {ticketOrder.tickets.map((ticket) => (
                        <div key={ticket.ticketNumber} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                            <div className="flex items-center">
                              <TicketIcon className="h-5 w-5 text-[var(--sage-green)] mr-2" />
                              <span className="font-medium">Ticket #{ticket.ticketNumber}</span>
                            </div>
                            
                            {ticket.isCheckedIn && (
                              <div className="flex items-center text-green-600 text-sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>
                                  {ticket.checkedInAt 
                                    ? `Checked in: ${format(parseISO(ticket.checkedInAt.toString()), 'MMM d, yyyy, h:mm a')}` 
                                    : 'Checked in'}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            {/* QR Code section - improved to handle and display QR codes properly */}
                            {ticket.qrCodeUrl ? (
                              <div className="flex justify-center mb-4">
                                <div className="p-3 border-2 border-[var(--sage-green)] rounded-lg">
                                  <Image
                                    src={ticket.qrCodeUrl}
                                    alt={`QR Code for ticket ${ticket.ticketNumber}`}
                                    width={180}
                                    height={180}
                                    className="h-[180px] w-[180px]"
                                  />
                                  <p className="text-center text-xs mt-2 text-gray-500">Scan for entry</p>
                                </div>
                              </div>
                            ) : (
                              ticketOrder.paymentStatus === 'succeeded' ? (
                                <div className="flex justify-center mb-4 border h-[180px] w-[180px] mx-auto items-center bg-gray-50 rounded-lg">
                                  <div className="text-center p-4">
                                    <Loader className="h-10 w-10 text-gray-300 mx-auto mb-2 animate-spin" />
                                    <p className="text-gray-400 text-sm">
                                      Loading QR code...
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-center mb-4 border-2 border-dashed h-[180px] w-[180px] mx-auto items-center bg-gray-50 rounded-lg">
                                  <div className="text-center p-4">
                                    <TicketIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm">
                                      QR Code will appear after successful payment
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                            
                            {/* Attendee Information */}
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Attendee Information</h4>
                              
                              {editingTicket === ticket.ticketNumber ? (
                                <div className="space-y-3">
                                  <div>
                                    <label htmlFor="attendeeName" className="block text-sm font-medium text-gray-700 mb-1">
                                      Full Name
                                    </label>
                                    <input
                                      type="text"
                                      id="attendeeName"
                                      className="w-full p-2 border rounded-md"
                                      value={attendeeName}
                                      onChange={(e) => setAttendeeName(e.target.value)}
                                      placeholder="Enter attendee name"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="attendeeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                      Email
                                    </label>
                                    <input
                                      type="email"
                                      id="attendeeEmail"
                                      className="w-full p-2 border rounded-md"
                                      value={attendeeEmail}
                                      onChange={(e) => setAttendeeEmail(e.target.value)}
                                      placeholder="Enter attendee email"
                                    />
                                  </div>
                                  
                                  <div className="flex space-x-2 mt-3">
                                    <Button
                                      onClick={() => saveAttendeeInfo(ticket.ticketNumber)}
                                      disabled={savingAttendee}
                                      className="inline-flex items-center"
                                      size="sm"
                                    >
                                      {savingAttendee ? (
                                        <>
                                          <div className="animate-spin h-4 w-4 mr-1 border-2 border-t-0 border-r-0 rounded-full" />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="h-4 w-4 mr-1" />
                                          Save
                                        </>
                                      )}
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      onClick={cancelEditingAttendee}
                                      disabled={savingAttendee}
                                      size="sm"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>
                                      {ticket.attendeeName || 'Not specified'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>
                                      {ticket.attendeeEmail || 'Not specified'}
                                    </span>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => startEditingAttendee(ticket)}
                                      disabled={ticketOrder.paymentStatus !== 'succeeded'}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      {ticket.attendeeName || ticket.attendeeEmail 
                                        ? 'Edit Attendee' 
                                        : 'Add Attendee'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 