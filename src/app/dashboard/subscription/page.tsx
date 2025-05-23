'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/auth/auth-context';
import ProtectedRoute from '@/auth/protected-route';
import subscriptionService, { Subscription } from '@/services/subscription-service';
import Button from '@/components/ui/Button';
import { FaSpinner, FaInfoCircle, FaCreditCard, FaCheckCircle, FaExclamationCircle, FaSync } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SubscriptionManagementPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { isAuthenticated, isOrganizer, refreshSubscription } = useAuth();
  const router = useRouter();

  const fetchSubscriptionDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      // First sync with Stripe to ensure we have latest data
      setIsSyncing(true);
      const syncResponse = await subscriptionService.syncSubscriptionWithStripe();
      setIsSyncing(false);
      
      if (syncResponse.success) {
        setSubscription(syncResponse.data?.subscription || null);
        // Also refresh the auth context
        await refreshSubscription();
        return;
      }
      
      // Fallback to regular fetch if sync fails
      console.log('Sync failed, fetching subscription directly');
      const response = await subscriptionService.getCurrentSubscription();
      if (response.success) {
        setSubscription(response.data || null);
      } else {
        toast.error(response.message || 'Failed to load subscription details');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Error loading subscription details');
    } finally {
      setIsLoading(false);
    }
  }, [refreshSubscription]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionDetails();
    }
  }, [isAuthenticated, fetchSubscriptionDetails]);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await subscriptionService.cancelSubscription();
      if (response.success) {
        toast.success('Subscription cancelled successfully');
        // Refresh both contexts
        await refreshSubscription();
        await fetchSubscriptionDetails();
      } else {
        toast.error(response.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Error cancelling subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSyncSubscription = async () => {
    setIsSyncing(true);
    try {
      const response = await subscriptionService.syncSubscriptionWithStripe();
      if (response.success) {
        setSubscription(response.data?.subscription || null);
        // Also refresh the auth context
        await refreshSubscription();
        toast.success('Subscription synced with Stripe successfully');
      } else {
        toast.error(response.message || 'Failed to sync subscription');
      }
    } catch (error) {
      console.error('Error syncing subscription:', error);
      toast.error('Error syncing subscription with Stripe');
    } finally {
      setIsSyncing(false);
    }
  };

  const goToPlans = () => {
    router.push('/plans');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'canceled':
        return <FaExclamationCircle className="text-orange-500 mr-2" />;
      case 'past_due':
        return <FaExclamationCircle className="text-red-500 mr-2" />;
      default:
        return <FaInfoCircle className="text-blue-500 mr-2" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'canceled':
        return 'Cancelled';
      case 'past_due':
        return 'Past Due';
      case 'incomplete':
        return 'Incomplete';
      case 'trialing':
        return 'Trial';
      case 'unpaid':
        return 'Unpaid';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <ProtectedRoute organizerOnly>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncSubscription}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Syncing...
              </>
            ) : (
              <>
                <FaSync className="mr-2" />
                Sync with Stripe
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaSpinner className="animate-spin h-8 w-8 mx-auto text-[var(--sage-green)]" />
            <p className="mt-4 text-gray-600">Loading subscription details...</p>
          </div>
        ) : !subscription ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <FaInfoCircle className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Active Subscription</h2>
              <p className="text-gray-600 mb-6">
                You don't have an active subscription yet. Subscribe to a plan to access premium features.
              </p>
              <Button variant="primary" size="lg" onClick={goToPlans}>
                View Plans
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{subscription.plan.name} Plan</h2>
                  <div className="flex items-center mt-1">
                    {getStatusIndicator(subscription.status)}
                    <span className={`text-sm font-medium ${
                      subscription.status === 'active' ? 'text-green-600' : 
                      subscription.status === 'canceled' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {getStatusText(subscription.status)}
                    </span>
                    {subscription.cancelAtPeriodEnd && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Cancels on {formatDate(subscription.currentPeriodEnd)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${subscription.billingCycle === 'monthly' ? subscription.plan.priceMonthly : subscription.plan.priceYearly}
                    <span className="text-sm text-gray-500 font-normal">
                      /{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)} billing
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Billing Cycle</div>
                  <div className="font-medium text-gray-900">
                    {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Next Billing Date</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(subscription.currentPeriodEnd)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Subscription Started</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(subscription.currentPeriodStart)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Subscription ID</div>
                  <div className="font-medium text-gray-900 truncate">
                    {subscription.stripeSubscriptionId}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subscription.plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">Manage Subscription</h3>
                  {!subscription.cancelAtPeriodEnd && subscription.status === 'active' ? (
                    <p className="text-sm text-gray-500 mt-1">
                      You can cancel your subscription at any time. You'll still have access until the end of your billing period.
                    </p>
                  ) : subscription.cancelAtPeriodEnd ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Your subscription is set to cancel on {formatDate(subscription.currentPeriodEnd)}.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      Your subscription is not active. Please check your payment method or contact support.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={goToPlans}
                    className="flex-1 md:flex-none"
                  >
                    Change Plan
                  </Button>
                  {!subscription.cancelAtPeriodEnd && subscription.status === 'active' && (
                    <Button
                      variant="danger"
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="flex-1 md:flex-none"
                    >
                      {isCancelling ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Section (can be expanded in future) */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FaCreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Payment methods can be managed through Stripe. For any billing inquiries or to update your payment information, please contact our support team.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SubscriptionManagementPage; 