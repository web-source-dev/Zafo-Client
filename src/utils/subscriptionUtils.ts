import { Plan, Subscription } from '../services/subscription-service';

/**
 * Subscription feature check utility functions
 */

export interface PlanFeatureCheck {
  allowed: boolean;
  requiresUpgrade: boolean;
  message?: string;
  requiredPlan?: string;
}

/**
 * Check if user can create paid events based on their subscription
 */
export const canCreatePaidEvents = (
  subscription: Subscription | null,
  subscribedPlan: Plan | null
): PlanFeatureCheck => {
  // Free users can't create paid events
  if (!subscription || !subscribedPlan) {
    return {
      allowed: false,
      requiresUpgrade: true,
      message: 'Paid events require a subscription plan',
      requiredPlan: 'Starter'
    };
  }

  // Check if plan allows pricing
  if (subscribedPlan.limits?.allowPricing) {
    return { allowed: true, requiresUpgrade: false };
  }

  return {
    allowed: false,
    requiresUpgrade: true,
    message: 'Paid events require a higher subscription plan',
    requiredPlan: 'Starter'
  };
};

/**
 * Check if user can add detailed event descriptions
 */
export const canAddDetailedDescription = (
  subscription: Subscription | null,
  subscribedPlan: Plan | null
): PlanFeatureCheck => {
  // Free users can only add basic descriptions
  if (!subscription || !subscribedPlan) {
    return {
      allowed: false,
      requiresUpgrade: true,
      message: 'Detailed event descriptions require a subscription plan',
      requiredPlan: 'Starter'
    };
  }

  // Check if plan allows detailed descriptions
  if (subscribedPlan.limits?.allowDetailedDescription) {
    return { allowed: true, requiresUpgrade: false };
  }

  return {
    allowed: false,
    requiresUpgrade: true,
    message: 'Detailed event descriptions require a higher subscription plan',
    requiredPlan: 'Starter'
  };
};

/**
 * Check if user can add advanced features like multiple speakers
 */
export const canAddAdvancedFeatures = (
  subscription: Subscription | null,
  subscribedPlan: Plan | null
): PlanFeatureCheck => {
  // Free users can't add advanced features
  if (!subscription || !subscribedPlan) {
    return {
      allowed: false,
      requiresUpgrade: true,
      message: 'Advanced event features require a subscription plan',
      requiredPlan: 'Growth'
    };
  }

  // Check if plan allows advanced features
  if (subscribedPlan.limits?.allowAdvancedFeatures) {
    return { allowed: true, requiresUpgrade: false };
  }

  return {
    allowed: false,
    requiresUpgrade: true,
    message: 'Advanced event features require a higher subscription plan',
    requiredPlan: 'Growth'
  };
};

/**
 * Check if user can add premium features
 */
export const canAddPremiumFeatures = (
  subscription: Subscription | null,
  subscribedPlan: Plan | null
): PlanFeatureCheck => {
  // Free users can't add premium features
  if (!subscription || !subscribedPlan) {
    return {
      allowed: false,
      requiresUpgrade: true,
      message: 'Premium event features require a Pro subscription plan',
      requiredPlan: 'Pro'
    };
  }

  // Check if plan allows premium features
  if (subscribedPlan.limits?.allowPremiumFeatures) {
    return { allowed: true, requiresUpgrade: false };
  }

  return {
    allowed: false,
    requiresUpgrade: true,
    message: 'Premium event features require a Pro subscription plan',
    requiredPlan: 'Pro'
  };
};

/**
 * Check if user has reached their event creation limits
 */
export const checkEventCreationLimits = (
  monthlyCount: number,
  yearlyCount: number,
  subscription: Subscription | null,
  subscribedPlan: Plan | null
): PlanFeatureCheck => {
  // Free users have very limited event creation (2 per month, 5 per year)
  if (!subscription || !subscribedPlan) {
    const freeMonthlyLimit = 2;
    const freeYearlyLimit = 5;

    if (monthlyCount >= freeMonthlyLimit) {
      return {
        allowed: false,
        requiresUpgrade: true,
        message: `Free users can only create ${freeMonthlyLimit} events per month. Please upgrade to a paid plan for more.`,
        requiredPlan: 'Starter'
      };
    }

    if (yearlyCount >= freeYearlyLimit) {
      return {
        allowed: false,
        requiresUpgrade: true,
        message: `Free users can only create ${freeYearlyLimit} events per year. Please upgrade to a paid plan for more.`,
        requiredPlan: 'Starter'
      };
    }

    return { allowed: true, requiresUpgrade: false };
  }

  // Check against plan limits
  if (subscribedPlan.limits) {
    if (monthlyCount >= subscribedPlan.limits.monthlyEvents) {
      return {
        allowed: false,
        requiresUpgrade: true,
        message: `You have reached your limit of ${subscribedPlan.limits.monthlyEvents} events this month on your ${subscribedPlan.name} plan.`,
        requiredPlan: subscribedPlan.name === 'Starter' ? 'Growth' : 'Pro'
      };
    }

    if (yearlyCount >= subscribedPlan.limits.yearlyEvents) {
      return {
        allowed: false,
        requiresUpgrade: true,
        message: `You have reached your limit of ${subscribedPlan.limits.yearlyEvents} events this year on your ${subscribedPlan.name} plan.`,
        requiredPlan: subscribedPlan.name === 'Starter' ? 'Growth' : 'Pro'
      };
    }
  }

  return { allowed: true, requiresUpgrade: false };
};

/**
 * Check if user can add gallery images
 */
export const canAddGalleryImages = (
  subscription: Subscription | null,
  subscribedPlan: Plan | null
): PlanFeatureCheck => {
  // Free users can't add gallery images
  if (!subscription || !subscribedPlan) {
    return {
      allowed: false,
      requiresUpgrade: true,
      message: 'Gallery images require a subscription plan',
      requiredPlan: 'Starter'
    };
  }

  return { allowed: true, requiresUpgrade: false };
};

/**
 * Check if user can set custom event duration
 */
export const canSetCustomEventDuration = (
  subscription: Subscription | null,
  subscribedPlan: Plan | null,
  durationHours: number
): PlanFeatureCheck => {
  // Free users are limited to 24 hour events
  if (!subscription || !subscribedPlan) {
    if (durationHours > 24) {
      return {
        allowed: false,
        requiresUpgrade: true,
        message: 'Events longer than 24 hours require a subscription plan',
        requiredPlan: 'Starter'
      };
    }
  }

  return { allowed: true, requiresUpgrade: false };
}; 