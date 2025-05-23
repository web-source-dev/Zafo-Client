'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { FaCheck, FaStar, FaTrophy, FaRocket, FaSpinner, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '@/auth/auth-context';
import { Plan } from '@/services/subscription-service';
import subscriptionService from '@/services/subscription-service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const { isAuthenticated, isOrganizer, isSubscribed, user, subscription, refreshSubscription } = useAuth();
  const router = useRouter();
  
  // Fetch plans from the API
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await subscriptionService.getPlans();
      if (response.success && response.data) {
        setPlans(response.data);
      } else {
        console.error('Failed to fetch plans:', response.message);
        toast.error('Failed to load subscription plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Error loading subscription plans');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch subscription details and plans on component mount
  useEffect(() => {
    const initializeData = async () => {
      // First check subscription status if authenticated
      if (isAuthenticated) {
        await refreshSubscription();
      }
      // Then fetch plans
      await fetchPlans();
    };
    
    initializeData();
  }, [isAuthenticated, fetchPlans, refreshSubscription]);
  
  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
  };

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      toast.error('You need to log in first');
      router.push('/login?redirect=plans');
      return;
    }
    
    if (!isOrganizer && user?.role !== 'admin') {
      // Display message that only organizers can subscribe
      toast.error('Only organizers can subscribe to plans');
      return;
    }
    
    // Check if trying to subscribe to current plan with same billing cycle
    if (isSubscribed && subscription?.plan?._id === planId) {
      const currentBillingCycle = subscription.billingCycle;
      if (currentBillingCycle === billingCycle) {
        toast.success('You are already subscribed to this plan');
        router.push('/dashboard/subscription');
        return;
      }
    }
    
    setIsSubscribing(true);
    
    try {
      // Create a checkout session
      const response = await subscriptionService.createCheckoutSession({
        planId,
        billingCycle
      });
      
      if (response.success && response.data?.sessionUrl) {
        // Redirect to Stripe checkout
        subscriptionService.redirectToCheckout(response.data.sessionUrl);
      } else {
        toast.error(response.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to process subscription request');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    if (!isSubscribed || !subscription) {
      return handleSubscribe(planId);
    }
    
    // Confirm plan change
    if (!confirm('Are you sure you want to change your subscription plan? You will be redirected to Stripe to complete this change.')) {
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      // Create a checkout session for plan change
      const response = await subscriptionService.createCheckoutSession({
        planId,
        billingCycle
      });
      
      if (response.success && response.data?.sessionUrl) {
        // Redirect to Stripe checkout
        subscriptionService.redirectToCheckout(response.data.sessionUrl);
      } else {
        toast.error(response.message || 'Failed to create checkout session for plan change');
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      toast.error('Failed to process plan change request');
    } finally {
      setIsSubscribing(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };
  
  const renderPlanIcons = (plan: Plan) => {
    switch (plan.name) {
      case 'Starter':
        return <FaRocket className="h-6 w-6" />;
      case 'Growth':
        return <FaStar className="h-6 w-6" />;
      case 'Pro':
        return <FaTrophy className="h-6 w-6" />;
      default:
        return <FaStar className="h-6 w-6" />;
    }
  };
  
  const getCurrentPlanId = () => {
    return subscription?.plan?._id || null;
  };
  
  const getButtonText = (plan: Plan) => {
    const isCurrentPlan = getCurrentPlanId() === plan._id;
    
    if (isSubscribing) {
      return 'Processing...';
    }
    
    if (isCurrentPlan) {
      // Check if billing cycle matches
      const currentBillingCycle = subscription?.billingCycle;
      if (currentBillingCycle === billingCycle) {
        return 'Current Plan';
      } else {
        return `Switch to ${billingCycle}`;
      }
    }
    
    if (isSubscribed) {
      return 'Change to this Plan';
    }
    
    return 'Get Started';
  };
  
  const isButtonDisabled = (plan: Plan) => {
    const isCurrentPlan = getCurrentPlanId() === plan._id;
    
    if (isSubscribing) {
      return true;
    }
    
    if (isCurrentPlan) {
      // Only disable if current plan with same billing cycle
      const currentBillingCycle = subscription?.billingCycle;
      return currentBillingCycle === billingCycle;
    }
    
    return false;
  };
  
  const getButtonIcon = (plan: Plan) => {
    const isCurrentPlan = getCurrentPlanId() === plan._id;
    
    if (isSubscribing) {
      return <FaSpinner className="animate-spin mr-2" />;
    }
    
    if (isCurrentPlan && subscription?.billingCycle !== billingCycle) {
      return <FaExchangeAlt className="mr-2" />;
    }
    
    if (isSubscribed && !isCurrentPlan) {
      return <FaExchangeAlt className="mr-2" />;
    }
    
    return null;
  };

  const handleButtonClick = (plan: Plan) => {
    const isCurrentPlan = getCurrentPlanId() === plan._id;
    
    if (isCurrentPlan) {
      // If it's the current plan with same billing cycle, go to subscription page
      if (subscription?.billingCycle === billingCycle) {
        router.push('/dashboard/subscription');
        return;
      }
      
      // Otherwise, change billing cycle
      handleChangePlan(plan._id);
      return;
    }
    
    if (isSubscribed) {
      // If already subscribed to different plan, handle plan change
      handleChangePlan(plan._id);
    } else {
      // New subscription
      handleSubscribe(plan._id);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="animate-spin h-12 w-12 mx-auto text-[var(--sage-green)]" />
          <p className="mt-4 text-lg text-gray-600">Loading subscription plans...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-white relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-[var(--sage-green)]/5 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Organizer note */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Organizer Plans</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take your event organizing to the next level with our professional plans.
              All plans are exclusively designed for event organizers.
            </p>
            {isSubscribed && (
              <div className="mt-4 py-2 px-4 bg-blue-50 text-blue-700 rounded-lg inline-flex items-center">
                <FaInfoCircle className="mr-2" />
                You currently have an active {subscription?.plan?.name} plan ({subscription?.billingCycle}).
              </div>
            )}
          </motion.div>
          
          {/* Billing toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-12">
            <div className="bg-[var(--taupe)] p-1 rounded-lg inline-flex items-center shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[var(--sage-green)] shadow-sm'
                    : 'text-gray-600 hover:text-[var(--sage-green)] hover:bg-white/20'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-[var(--sage-green)] shadow-sm'
                    : 'text-gray-600 hover:text-[var(--sage-green)] hover:bg-white/20'
                }`}
              >
                Yearly 
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 ml-2 rounded-full">
                  Save 15%+
                </span>
              </button>
            </div>
          </motion.div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              // Determine if this plan is the currently subscribed plan
              const isCurrentPlan = getCurrentPlanId() === plan._id;
              const isPopular = plan.name === 'Growth';
              
              return (
                <motion.div
                  key={plan._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border ${
                    isCurrentPlan ? 'border-blue-500' : isPopular ? 'border-[var(--sage-green)]' : 'border-gray-200'
                  } relative bg-white transform hover:-translate-y-1 duration-300`}
                >
                  {isPopular && !isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-[var(--sage-green)] text-white px-4 py-1 text-sm font-medium rounded-bl-xl">
                      Popular
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-br-xl">
                      Current Plan
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full mr-3 ${isCurrentPlan ? 'bg-blue-100 text-blue-600' : isPopular ? 'bg-[var(--sage-green)]/10 text-[var(--sage-green)]' : 'bg-gray-100 text-gray-600'}`}>
                        {renderPlanIcons(plan)}
                      </div>
                      <h3 className="text-2xl font-bold text-[var(--sage-green)]">
                        {plan.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 min-h-[3em]">
                      {plan.description}
                    </p>
                    
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          ${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                        </span>
                        <span className="text-gray-500 ml-2">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-green-600 text-sm mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Save ${(plan.priceMonthly * 12 - plan.priceYearly).toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant={isCurrentPlan ? 'primary' : isPopular ? 'primary' : 'outline'}
                      fullWidth
                      size="lg"
                      onClick={() => handleButtonClick(plan)}
                      disabled={isButtonDisabled(plan)}
                      className={`${isPopular && !isCurrentPlan ? 'shadow-lg shadow-[var(--sage-green)]/20' : ''} 
                                ${isCurrentPlan && subscription?.billingCycle === billingCycle ? 'cursor-pointer' : ''}`}
                    >
                      {getButtonIcon(plan)}
                      {getButtonText(plan)}
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-8 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">What&apos;s included</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <FaCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Extra selling point */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center max-w-3xl mx-auto p-6 rounded-lg border border-[var(--sage-green)]/30 bg-[var(--sage-green)]/5"
          >
            <h3 className="text-xl font-bold text-[var(--sage-green)] mb-2">
              {billingCycle === 'yearly' ? 
                'Save with annual billing!' : 
                'Try Zafo risk-free with our 14-day money-back guarantee'}
            </h3>
            <p className="text-gray-700">
              {billingCycle === 'yearly' ? 
                'Switch to annual billing and save up to 20% compared to monthly billing.' : 
                'All plans come with a 14-day money-back guarantee. No questions asked.'}
            </p>
            {billingCycle === 'monthly' && (
              <button 
                onClick={toggleBillingCycle}
                className="mt-3 text-[var(--sage-green)] font-medium hover:underline inline-flex items-center"
              >
                Switch to annual billing
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 