'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Star, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

interface SubscriptionUpgradeProps {
  message: string;
  requiredPlan?: string;
  className?: string;
}

/**
 * Component to display subscription upgrade messages
 * Shows a message about requiring a subscription plan upgrade
 * and a button to navigate to the plans page
 */
const SubscriptionUpgrade: React.FC<SubscriptionUpgradeProps> = ({
  message,
  requiredPlan,
  className = ''
}) => {
  const { t } = useLanguage();
  const router = useRouter();
  
  const handleUpgradeClick = () => {
    router.push('/plans');
  };
  
  return (
    <div className={`rounded-md border border-dashed border-[var(--cognac)] bg-[rgba(229,217,202,0.2)] p-4 ${className}`}>
      <div className="flex items-start">
        <div className="mr-3 flex-shrink-0">
          <Lock size={20} className="text-[var(--cognac)]" />
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-medium text-[var(--cognac)]">
            {requiredPlan ? (
              <span className="flex items-center">
                <Star size={14} className="mr-1 text-[var(--cognac)]" />
                {`${requiredPlan} plan required`}
              </span>
            ) : (
              'Subscription required'
            )}
          </h4>
          <p className="mt-1 text-sm text-gray-700">
            {message}
          </p>
          <button
            onClick={handleUpgradeClick}
            className="mt-3 inline-flex items-center rounded-md bg-[var(--sage-green)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--sage-green-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:ring-offset-2"
          >
            <ArrowUp size={14} className="mr-1.5" />
            {t('subscription.upgrade')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade; 