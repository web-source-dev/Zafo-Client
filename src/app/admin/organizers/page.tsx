'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Lock,
  Unlock,
  Send,
  RefreshCw,
  Clock
} from 'lucide-react';
import adminService, { Organizer, OrganizerQueryParams } from '../../../services/admin-service';

export default function OrganizersPage() {
  const router = useRouter();
  
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizers, setTotalOrganizers] = useState(0);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  } | null>(null);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch organizers
  const fetchOrganizers = async (params: OrganizerQueryParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getOrganizers({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        ...params
      });
      
      if (response.success && response.data) {
        setOrganizers(response.data.organizers);
        setTotalPages(response.data.pages);
        setTotalOrganizers(response.data.total);
      } else {
        throw new Error(response.message || 'Failed to fetch organizers');
      }
    } catch (err: unknown) {
      console.error('Error fetching organizers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, [currentPage, searchTerm, statusFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Handle payment block toggle
  const handlePaymentBlock = async (organizer: Organizer, isBlocked: boolean) => {
    setIsBlocking(true);
    setError(null);
    
    try {
      const response = await adminService.toggleOrganizerPaymentBlock(organizer._id, {
        isBlocked,
        reason: isBlocked ? blockReason : undefined
      });
      
      if (response.success) {
        // Update the organizer in the list
        setOrganizers(prev => 
          prev.map(org => 
            org._id === organizer._id 
              ? { ...org, isPaymentBlocked: isBlocked, paymentBlockReason: isBlocked ? blockReason : undefined }
              : org
          )
        );
        setShowBlockModal(false);
        setBlockReason('');
        
        // Show success message
        const message = isBlocked 
          ? `Payments blocked for ${organizer.firstName} ${organizer.lastName}${blockReason ? `: ${blockReason}` : ''}`
          : `Payments unblocked for ${organizer.firstName} ${organizer.lastName}`;
        showNotification('success', message);
      } else {
        throw new Error(response.message || 'Failed to update payment block status');
      }
    } catch (err: unknown) {
      console.error('Error updating payment block:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment block status';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setIsBlocking(false);
    }
  };

  // Handle manual transfer
  const handleManualTransfer = async (organizer: Organizer) => {
    setIsTransferring(true);
    setError(null);
    
    try {
      const response = await adminService.transferToOrganizer(organizer._id);
      
      if (response.success) {
        // Show success message
        const message = response.message || `Transfer completed successfully. Processed ${response.data?.totalProcessed} tickets.`;
        showNotification('success', message);
        
        // Refresh the organizers list to get updated stats
        fetchOrganizers();
      } else {
        // Show specific error message
        const errorMessage = response.message || 'Failed to process transfer';
        setError(errorMessage);
        showNotification('error', errorMessage);
      }
    } catch (err: unknown) {
      console.error('Error processing transfer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process transfer';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setIsTransferring(false);
    }
  };

  // Get status message for organizer
  const getOrganizerStatusMessage = (organizer: Organizer) => {
    const stats = organizer.paymentStats;
    
    if (organizer.isPaymentBlocked) {
      return {
        message: 'Payments Blocked',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
    
    if (!stats.hasStripeAccount) {
      return {
        message: 'No Stripe Account',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }
    
    if (stats.totalRemaining > 0) {
      return {
        message: 'Pending Transfers',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
    
    if (stats.totalSent > 0) {
      return {
        message: 'Transfers Complete',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
    
    return {
      message: 'No Activity',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  // Get transfer button state
  const getTransferButtonState = (organizer: Organizer) => {
    const stats = organizer.paymentStats;
    
    if (organizer.isPaymentBlocked) {
      return {
        disabled: true,
        text: 'Payments Blocked',
        variant: 'outline' as const,
        icon: <Lock className="h-4 w-4" />
      };
    }
    
    if (!stats.hasStripeAccount) {
      return {
        disabled: true,
        text: 'No Stripe Account',
        variant: 'outline' as const,
        icon: <AlertCircle className="h-4 w-4" />
      };
    }
    
    if (stats.totalRemaining > 0) {
      return {
        disabled: isTransferring,
        text: isTransferring ? 'Processing...' : 'Send Payment',
        variant: 'primary' as const,
        icon: <Send className="h-4 w-4" />
      };
    }
    
    return {
      disabled: true,
      text: 'No Pending Transfers',
      variant: 'outline' as const,
      icon: <CheckCircle className="h-4 w-4" />
    };
  };

  // Calculate total stats
  const totalStats = organizers.reduce((acc, organizer) => {
    const stats = organizer.paymentStats;
    return {
      totalRevenue: acc.totalRevenue + stats.totalRevenue,
      totalSent: acc.totalSent + stats.totalSent,
      totalRemaining: acc.totalRemaining + stats.totalRemaining,
      totalTickets: acc.totalTickets + stats.totalTickets,
      pendingTransfers: acc.pendingTransfers + stats.pendingTransfers,
      completedTransfers: acc.completedTransfers + stats.completedTransfers,
      failedTransfers: acc.failedTransfers + stats.failedTransfers
    };
  }, { 
    totalRevenue: 0, 
    totalSent: 0, 
    totalRemaining: 0, 
    totalTickets: 0,
    pendingTransfers: 0,
    completedTransfers: 0,
    failedTransfers: 0
  });

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : notification.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
              {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
              {notification.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-400" />}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setNotification(null)}
                className="inline-flex text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--sage-green)]">Organizer Management</h1>
            <p className="text-gray-600">Manage organizers and their payment transfers</p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchOrganizers()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[var(--sage-green)]" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Organizers</p>
                  <p className="text-2xl font-bold">{totalOrganizers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">CHF {totalStats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold">CHF {totalStats.totalSent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">CHF {totalStats.totalRemaining.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending Transfers</p>
                  <p className="text-xl font-bold">{totalStats.pendingTransfers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Completed Transfers</p>
                  <p className="text-xl font-bold">{totalStats.completedTransfers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Failed Transfers</p>
                  <p className="text-xl font-bold">{totalStats.failedTransfers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle>Organizer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {organizers.filter(org => org.paymentStats.transferStatus === 'available').length}
                </p>
                <p className="text-sm text-gray-600">Ready for Transfer</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {organizers.filter(org => org.paymentStats.transferStatus === 'no_stripe').length}
                </p>
                <p className="text-sm text-gray-600">Need Stripe Setup</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {organizers.filter(org => org.paymentStats.transferStatus === 'blocked').length}
                </p>
                <p className="text-sm text-gray-600">Payments Blocked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {organizers.filter(org => org.paymentStats.transferStatus === 'none').length}
                </p>
                <p className="text-sm text-gray-600">No Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search organizers..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Organizers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Organizers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Organizer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Total Revenue</th>
                      <th className="text-left py-3 px-4">Sent</th>
                      <th className="text-left py-3 px-4">Pending</th>
                      <th className="text-left py-3 px-4">Transfer Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizers.map((organizer) => {
                      const statusInfo = getOrganizerStatusMessage(organizer);
                      const transferButton = getTransferButtonState(organizer);
                      
                      return (
                        <tr key={organizer._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{organizer.firstName} {organizer.lastName}</p>
                              <p className="text-sm text-gray-600">{organizer.email}</p>
                              <p className="text-xs text-gray-500">{organizer.role}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={organizer.isActive ? 'success' : 'danger'}>
                              {organizer.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium">CHF {organizer.paymentStats.totalRevenue.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{organizer.paymentStats.totalTickets} tickets</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-green-600">CHF {organizer.paymentStats.totalSent.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{organizer.paymentStats.completedTransfers} transfers</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-orange-600">CHF {organizer.paymentStats.totalRemaining.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{organizer.paymentStats.pendingTransfers} pending</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.color}`}>
                              {statusInfo.message}
                            </div>
                            {organizer.isPaymentBlocked && organizer.paymentBlockReason && (
                              <p className="text-xs text-gray-500 mt-1">{organizer.paymentBlockReason}</p>
                            )}
                            {!organizer.paymentStats.hasStripeAccount && (
                              <p className="text-xs text-gray-500 mt-1">Needs Stripe setup</p>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/admin/organizers/${organizer._id}`)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {organizer.isPaymentBlocked ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePaymentBlock(organizer, false)}
                                  disabled={isBlocking}
                                  title="Unblock Payments"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrganizer(organizer);
                                    setShowBlockModal(true);
                                  }}
                                  disabled={isBlocking}
                                  title="Block Payments"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant={transferButton.variant}
                                onClick={() => handleManualTransfer(organizer)}
                                disabled={transferButton.disabled}
                                title={transferButton.text}
                              >
                                {transferButton.icon}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Block Modal */}
      {showBlockModal && selectedOrganizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Block Organizer Payments</h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to block payments for <strong>{selectedOrganizer.firstName} {selectedOrganizer.lastName}</strong>?
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>Current Status:</strong> {selectedOrganizer.paymentStats.totalRemaining > 0 ? `CHF ${selectedOrganizer.paymentStats.totalRemaining.toFixed(2)} pending` : 'No pending transfers'}</p>
                <p><strong>Total Revenue:</strong> CHF {selectedOrganizer.paymentStats.totalRevenue.toFixed(2)}</p>
                <p><strong>Stripe Account:</strong> {selectedOrganizer.paymentStats.hasStripeAccount ? 'Connected' : 'Not connected'}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason for blocking (optional)</label>
              <Input
                value={blockReason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBlockReason(e.target.value)}
                placeholder="Enter reason for blocking payments..."
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePaymentBlock(selectedOrganizer, true)}
                disabled={isBlocking}
                variant="danger"
              >
                {isBlocking ? 'Blocking...' : 'Block Payments'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowBlockModal(false);
                  setSelectedOrganizer(null);
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