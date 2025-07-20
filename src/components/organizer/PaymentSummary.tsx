'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

interface PaymentSummaryProps {
  totalTickets: number;
  totalRevenue: number;
  platformFees: number;
  organizerPayments: number;
  pendingTransfers: number;
  completedTransfers: number;
  failedTransfers: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  totalTickets,
  totalRevenue,
  platformFees,
  organizerPayments,
  pendingTransfers,
  completedTransfers,
  failedTransfers
}) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {t('payment.paymentSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('payment.totalTickets')}</span>
            <span className="font-semibold">{totalTickets}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('payment.totalRevenue')}</span>
            <span className="font-semibold text-green-600">
              CHF {totalRevenue.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('payment.platformFees')}</span>
            <span className="font-semibold text-red-600">
              CHF {platformFees.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('payment.yourEarnings')}</span>
            <span className="font-semibold text-blue-600">
              CHF {organizerPayments.toFixed(2)}
            </span>
          </div>
          
          <hr className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('payment.pendingTransfers')}</span>
              <span className="font-semibold text-yellow-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {pendingTransfers}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('payment.completedTransfers')}</span>
              <span className="font-semibold text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {completedTransfers}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('payment.failedTransfers')}</span>
              <span className="font-semibold text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {failedTransfers}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary; 