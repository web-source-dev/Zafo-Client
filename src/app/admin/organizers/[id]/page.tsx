'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Input from '../../../../components/ui/Input';
import { 
  ArrowLeft,
  AlertCircle,
  Lock,
  Unlock,
  Send,
} from 'lucide-react';
import adminService, { Organizer, OrganizerPaymentStats } from '../../../../services/admin-service';

interface Ticket {
  id: string;
  eventTitle: string;
  ticketPrice: number;
  organizerPayment: number;
  transferStatus: 'pending' | 'completed' | 'failed';
  purchasedAt: string;
}

export default function OrganizerDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const organizerId = params.id as string;
  
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [stats, setStats] = useState<OrganizerPaymentStats & { recentTickets: Ticket[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Fetch organizer details
  const fetchOrganizerDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getOrganizerStats(organizerId);
      
      if (response.success && response.data) {
        setOrganizer(response.data.organizer);
        setStats(response.data.stats as OrganizerPaymentStats & { recentTickets: Ticket[] });
      } else {
        throw new Error(response.message || 'Failed to fetch organizer details');
      }
    } catch (err: unknown) {
      console.error('Error fetching organizer details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizer details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (organizerId) {
      fetchOrganizerDetails();
    }
  }, [organizerId]);

  // Handle payment block toggle
  const handlePaymentBlock = async (isBlocked: boolean) => {
    if (!organizer) return;
    
    setIsBlocking(true);
    
    try {
      const response = await adminService.toggleOrganizerPaymentBlock(organizer._id, {
        isBlocked,
        reason: isBlocked ? blockReason : undefined
      });
      
      if (response.success) {
        setOrganizer(response.data || null);
        setShowBlockModal(false);
        setBlockReason('');
      } else {
        throw new Error(response.message || 'Failed to update payment block status');
      }
    } catch (err: unknown) {
      console.error('Error updating payment block:', err);
      setError(err instanceof Error ? err.message : 'Failed to update payment block status');
    } finally {
      setIsBlocking(false);
    }
  };

  // Handle manual transfer
  const handleManualTransfer = async () => {
    if (!organizer) return;
    
    setIsTransferring(true);
    
    try {
      const response = await adminService.transferToOrganizer(organizer._id);
      
      if (response.success) {
        // Refresh the organizer details
        fetchOrganizerDetails();
        alert(`Transfer completed. Processed ${response.data?.totalProcessed} tickets.`);
      } else {
        throw new Error(response.message || 'Failed to process transfer');
      }
    } catch (err: unknown) {
      console.error('Error processing transfer:', err);
      setError(err instanceof Error ? err.message : 'Failed to process transfer');
    } finally {
      setIsTransferring(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
    );
  }

  if (!organizer || !stats) {
    return (
        <div className="text-center py-8">
          <p className="text-gray-600">Organizer not found</p>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/organizers')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Organizers
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[var(--sage-green)]">
                {organizer.firstName} {organizer.lastName}
              </h1>
              <p className="text-gray-600">{organizer.email}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {organizer.isPaymentBlocked ? (
              <Button
                variant="outline"
                onClick={() => handlePaymentBlock(false)}
                disabled={isBlocking}
              >
                <Unlock className="h-4 w-4 mr-2" />
                {isBlocking ? 'Unblocking...' : 'Unblock Payments'}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowBlockModal(true)}
                disabled={isBlocking}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isBlocking ? 'Blocking...' : 'Block Payments'}
              </Button>
            )}
            
            {stats.totalRemaining > 0 && !organizer.isPaymentBlocked && (
              <Button
                onClick={handleManualTransfer}
                disabled={isTransferring}
              >
                <Send className="h-4 w-4 mr-2" />
                {isTransferring ? 'Processing...' : 'Send Payment'}
              </Button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Organizer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{organizer.firstName} {organizer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{organizer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={organizer.isActive ? 'success' : 'danger'}>
                      {organizer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={organizer.isPaymentBlocked ? 'danger' : 'success'}>
                      {organizer.isPaymentBlocked ? 'Payments Blocked' : 'Payments Active'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Stripe Account</label>
                  <p className="text-lg">
                    {organizer.stripeCustomerId ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
                {organizer.isPaymentBlocked && organizer.paymentBlockReason && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Block Reason</label>
                    <p className="text-lg text-red-600">{organizer.paymentBlockReason}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-lg">{new Date(organizer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Revenue</label>
                    <p className="text-2xl font-bold text-green-600">
                      CHF {stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Tickets</label>
                    <p className="text-2xl font-bold">
                      {stats.totalTickets}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Sent</label>
                    <p className="text-xl font-bold text-blue-600">
                      CHF {stats.totalSent.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pending</label>
                    <p className="text-xl font-bold text-orange-600">
                      CHF {stats.totalRemaining.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pending Transfers</label>
                    <p className="text-lg font-bold text-orange-600">
                      {stats.pendingTransfers}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Completed Transfers</label>
                    <p className="text-lg font-bold text-green-600">
                      {stats.completedTransfers}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Failed Transfers</label>
                    <p className="text-lg font-bold text-red-600">
                      {stats.failedTransfers}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets */}
        {stats.recentTickets && stats.recentTickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Event</th>
                      <th className="text-left py-3 px-4">Ticket Price</th>
                      <th className="text-left py-3 px-4">Organizer Payment</th>
                      <th className="text-left py-3 px-4">Transfer Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTickets.map((ticket: Ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{ticket.eventTitle}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">CHF {ticket.ticketPrice.toFixed(2)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-blue-600">CHF {ticket.organizerPayment.toFixed(2)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={
                              ticket.transferStatus === 'completed' ? 'success' : 
                              ticket.transferStatus === 'failed' ? 'danger' : 'warning'
                            }
                          >
                            {ticket.transferStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">
                            {new Date(ticket.purchasedAt).toLocaleDateString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Block Organizer Payments</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to block payments for {organizer.firstName} {organizer.lastName}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason (optional)</label>
              <Input
                value={blockReason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBlockReason(e.target.value)}
                placeholder="Enter reason for blocking payments..."
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePaymentBlock(true)}
                disabled={isBlocking}
              >
                {isBlocking ? 'Blocking...' : 'Block Payments'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 