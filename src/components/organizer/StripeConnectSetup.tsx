'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import organizerService from '@/services/organizer-service';
import { useLanguage } from '@/i18n/language-context';
import LoadingScreen from '../ui/LoadingScreen';

interface StripeAccountStatus {
  hasAccount: boolean;
  status: 'not_setup' | 'pending' | 'active';
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

const StripeConnectSetup: React.FC = () => {
  const { t } = useLanguage();
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    email: '',
    businessType: 'individual'
  });

  useEffect(() => {
    fetchAccountStatus();
  }, []);

  const fetchAccountStatus = async () => {
    try {
      setIsLoading(true);
      const data = await organizerService.getStripeAccountStatus();
      setAccountStatus(data);
    } catch (error) {
      console.error('Error fetching account status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createStripeAccount = async () => {
    try {
      setIsCreating(true);
      const data = await organizerService.createStripeAccount({
        country: formData.country,
        email: formData.email,
        businessType: formData.businessType as 'individual' | 'company'
      });
      // Redirect to Stripe onboarding
      window.location.href = data.accountLink;
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      alert(t('payment.stripeConnect.failedToCreate'));
    } finally {
      setIsCreating(false);
    }
  };

  const createAccountLink = async () => {
    try {
      setIsLoading(true);
      const data = await organizerService.createAccountLink();
      window.location.href = data.accountLink;
    } catch (error) {
      console.error('Error creating account link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!accountStatus) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>{t('payment.stripeConnect.failedToLoad')}</p>
        </div>
      </Card>
    );
  }

  if (!accountStatus.hasAccount) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('payment.stripeConnect.setupTitle')}</h2>
        <p className="text-gray-600 mb-6">
          {t('payment.stripeConnect.setupDescription')}
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('payment.stripeConnect.country')}</label>
            <Select
              value={formData.country}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, country: e.target.value })}
              options={[
                { value: "", label: t('payment.stripeConnect.selectCountry') },
                { value: "CH", label: "Switzerland" },
                { value: "DE", label: "Germany" },
                { value: "FR", label: "France" },
                { value: "IT", label: "Italy" },
                { value: "US", label: "United States" },
                { value: "GB", label: "United Kingdom" }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t('payment.stripeConnect.email')}</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your-email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">{t('payment.stripeConnect.businessType')}</label>
            <Select
              value={formData.businessType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, businessType: e.target.value })}
              options={[
                { value: "individual", label: t('payment.stripeConnect.individual') },
                { value: "company", label: t('payment.stripeConnect.company') }
              ]}
            />
          </div>
          
          <Button
            onClick={createStripeAccount}
            disabled={isCreating || !formData.country || !formData.email}
            className="w-full"
          >
            {isCreating ? t('payment.stripeConnect.creatingAccount') : t('payment.stripeConnect.createAccount')}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t('payment.stripeConnect.accountTitle')}</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{t('payment.stripeConnect.accountStatus')}</span>
          <span className={`px-2 py-1 rounded text-sm ${
            accountStatus.status === 'active' ? 'bg-green-100 text-green-800' :
            accountStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {accountStatus.status === 'active' ? t('payment.stripeConnect.active') :
             accountStatus.status === 'pending' ? t('payment.stripeConnect.pending') : t('payment.stripeConnect.notSetup')}
          </span>
        </div>
        
        {accountStatus.accountId && (
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('payment.stripeConnect.accountId')}</span>
            <span className="text-sm text-gray-600">{accountStatus.accountId}</span>
          </div>
        )}
        
        {accountStatus.detailsSubmitted !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('payment.stripeConnect.detailsSubmitted')}</span>
            <span className={accountStatus.detailsSubmitted ? 'text-green-600' : 'text-red-600'}>
              {accountStatus.detailsSubmitted ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        
        {accountStatus.chargesEnabled !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('payment.stripeConnect.paymentsEnabled')}</span>
            <span className={accountStatus.chargesEnabled ? 'text-green-600' : 'text-red-600'}>
              {accountStatus.chargesEnabled ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        
        {accountStatus.payoutsEnabled !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('payment.stripeConnect.payoutsEnabled')}</span>
            <span className={accountStatus.payoutsEnabled ? 'text-green-600' : 'text-red-600'}>
              {accountStatus.payoutsEnabled ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        
        {accountStatus.status === 'pending' && (
          <div className="mt-6">
            <Button onClick={createAccountLink} className="w-full">
              {t('payment.stripeConnect.completeSetup')}
            </Button>
          </div>
        )}
        
        {accountStatus.status === 'active' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              {t('payment.stripeConnect.accountActive')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StripeConnectSetup; 