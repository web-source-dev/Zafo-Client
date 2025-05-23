'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  organizerOnly?: boolean;
  userOnly?: boolean;
  requireSubscription?: boolean;
  requiredPlanId?: string;
  fallbackUrl?: string;
  subscriptionFallbackUrl?: string;
}

/**
 * Higher-order component for protecting routes based on authentication, roles, and subscription status
 * 
 * Usage examples:
 * - Basic authentication protection:
 *   <ProtectedRoute>
 *     <YourComponent />
 *   </ProtectedRoute>
 * 
 * - Admin-only protection:
 *   <ProtectedRoute adminOnly>
 *     <AdminComponent />
 *   </ProtectedRoute>
 * 
 * - Organizer protection (allows both organizers and admins):
 *   <ProtectedRoute organizerOnly>
 *     <OrganizerComponent />
 *   </ProtectedRoute>
 *
 * - Subscription protection:
 *   <ProtectedRoute requireSubscription>
 *     <SubscriptionOnlyComponent />
 *   </ProtectedRoute>
 * 
 * - Specific plan protection:
 *   <ProtectedRoute requireSubscription requiredPlanId="plan-id-here">
 *     <PremiumComponent />
 *   </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false, 
  organizerOnly = false,
  userOnly = false,
  requireSubscription = false,
  requiredPlanId,
  fallbackUrl = '/login',
  subscriptionFallbackUrl = '/plans'
}) => {
  const { 
    isAuthenticated, 
    isAdmin, 
    isOrganizer, 
    isUser, 
    isLoading, 
    hasRequiredSubscription
  } = useAuth();
  const router = useRouter();

  // Show nothing while authentication is being checked
  if (isLoading) {
    return null;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    // Use redirects on client-side only
    if (typeof window !== 'undefined') {
      console.log('Not authenticated, redirecting to:', fallbackUrl);
      router.push(fallbackUrl);
    }
    return null;
  }

  // Check user access if required
  if (userOnly && !isUser) {
    // Use redirects on client-side only
    if (typeof window !== 'undefined') {
      console.log('User access required, redirecting to unauthorized page');
      router.push('/unauthorized');
    }
    return null;
  }

  // Check admin access if required
  if (adminOnly && !isAdmin) {
    // Use redirects on client-side only
    if (typeof window !== 'undefined') {
      console.log('Admin access required, redirecting to unauthorized page');
      router.push('/unauthorized');
    }
    return null;
  }

  // Check organizer access if required
  if (organizerOnly && !isOrganizer) {
    // Use redirects on client-side only
    if (typeof window !== 'undefined') {
      console.log('Organizer access required, redirecting to unauthorized page');
      router.push('/unauthorized');
    }
    return null;
  }

  // Check subscription if required
  if (requireSubscription && !hasRequiredSubscription(requiredPlanId)) {
    // Use redirects on client-side only
    if (typeof window !== 'undefined') {
      console.log('Subscription required, redirecting to plans page');
      router.push(subscriptionFallbackUrl);
    }
    return null;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 