'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import organizerService from '@/services/organizer-service';

interface StripeAccountStatus {
  hasAccount: boolean;
  status: 'not_setup' | 'pending' | 'active';
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

const StripeConnectSetup: React.FC = () => {
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
      alert('Failed to create Stripe account');
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
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading account status...</p>
        </div>
      </Card>
    );
  }

  if (!accountStatus) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>Failed to load account status</p>
        </div>
      </Card>
    );
  }

  if (!accountStatus.hasAccount) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Set up Stripe Connect</h2>
        <p className="text-gray-600 mb-6">
          To receive payments from ticket sales, you need to set up a Stripe Connect account.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <Select
              value={formData.country}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, country: e.target.value })}
              options={[
                { value: "", label: "Select country" },
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
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your-email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Business Type</label>
            <Select
              value={formData.businessType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, businessType: e.target.value })}
              options={[
                { value: "individual", label: "Individual" },
                { value: "company", label: "Company" }
              ]}
            />
          </div>
          
          <Button
            onClick={createStripeAccount}
            disabled={isCreating || !formData.country || !formData.email}
            className="w-full"
          >
            {isCreating ? 'Creating account...' : 'Create Stripe Account'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Stripe Connect Account</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Account Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            accountStatus.status === 'active' ? 'bg-green-100 text-green-800' :
            accountStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {accountStatus.status === 'active' ? 'Active' :
             accountStatus.status === 'pending' ? 'Pending' : 'Not Setup'}
          </span>
        </div>
        
        {accountStatus.accountId && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Account ID:</span>
            <span className="text-sm text-gray-600">{accountStatus.accountId}</span>
          </div>
        )}
        
        {accountStatus.detailsSubmitted !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Details Submitted:</span>
            <span className={accountStatus.detailsSubmitted ? 'text-green-600' : 'text-red-600'}>
              {accountStatus.detailsSubmitted ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        
        {accountStatus.chargesEnabled !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Payments Enabled:</span>
            <span className={accountStatus.chargesEnabled ? 'text-green-600' : 'text-red-600'}>
              {accountStatus.chargesEnabled ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        
        {accountStatus.payoutsEnabled !== undefined && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Payouts Enabled:</span>
            <span className={accountStatus.payoutsEnabled ? 'text-green-600' : 'text-red-600'}>
              {accountStatus.payoutsEnabled ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        
        {accountStatus.status === 'pending' && (
          <div className="mt-6">
            <Button onClick={createAccountLink} className="w-full">
              Complete Account Setup
            </Button>
          </div>
        )}
        
        {accountStatus.status === 'active' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              ✓ Your Stripe account is active and ready to receive payments!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StripeConnectSetup; 