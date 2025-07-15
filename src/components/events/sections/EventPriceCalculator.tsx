'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '../../../i18n/language-context';
import { EventFormData } from '../EventFormTypes';

const EventPriceCalculator = () => {
  const { t } = useLanguage();
  const { watch, setValue } = useFormContext<EventFormData>();
  
  const startDate = watch('startDate');
  const startTime = watch('startTime');
  const endDate = watch('endDate');
  const endTime = watch('endTime');
  const isFree = watch('isFree');
  
  // Calculate event duration in hours
  const calculateDuration = (): number => {
    if (!startDate || !startTime || !endDate || !endTime) return 0;
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    // Calculate duration in milliseconds and convert to hours
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    return Math.max(0, durationHours);
  };
  
  // Calculate platform fee based on duration
  const calculatePlatformFee = (durationHours: number): number => {
    // For events up to 1 day (24h): 350 CHF
    // For events of 1 day or more: 675 CHF
    return durationHours <= 24 ? 350 : 675;
  };
  
  // Update calculated values whenever dates/times change
  useEffect(() => {
    if (isFree) return; // Skip calculation for free events
    
    const durationHours = calculateDuration();
    const calculatedAmount = calculatePlatformFee(durationHours);
    
    // Update form values with calculated data
    setValue('price.durationHours', durationHours);
    setValue('price.calculatedAmount', calculatedAmount);
    
  }, [startDate, startTime, endDate, endTime, isFree, setValue]);
  
  // Don't render anything if dates/times aren't set yet
  if (!startDate || !startTime || !endDate || !endTime) return null;
  
  // Don't render for free events
  if (isFree) return null;
  
  const durationHours = calculateDuration();
  const platformFee = calculatePlatformFee(durationHours);
  
  // Format duration for display
  const formatDuration = (hours: number): string => {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    
    if (days > 0) {
      return `${days} ${days === 1 ? t('events.day') : t('events.days')} ${remainingHours > 0 ? `${remainingHours} ${remainingHours === 1 ? t('events.hour') : t('events.hours')}` : ''}`;
    }
    
    return `${remainingHours} ${remainingHours === 1 ? t('events.hour') : t('events.hours')}`;
  };
  
  return (
    <div className="mt-4 p-4 bg-[rgba(83,94,75,0.05)] rounded-lg">
      <h4 className="font-medium text-[var(--sage-green)] mb-2">{t('events.platformFee')}</h4>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('events.eventDuration')}:</span>
          <span className="font-medium">{formatDuration(durationHours)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>{t('events.platformFeeAmount')}:</span>
          <span className="font-medium">
            {new Intl.NumberFormat('en-CH', {
              style: 'currency',
              currency: 'CHF'
            }).format(platformFee)}
          </span>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          {t('events.platformFeeExplanation')}
        </div>
      </div>
    </div>
  );
};

export default EventPriceCalculator; 