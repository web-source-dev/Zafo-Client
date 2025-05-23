'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign, Tag } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import { useAuth } from '../../../auth/auth-context';
import { canCreatePaidEvents } from '../../../utils/subscriptionUtils';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import SubscriptionUpgrade from '../../ui/SubscriptionUpgrade';
import { EventFormData } from '../EventFormTypes';

interface PricingSectionProps {
  defaultOpen?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const { subscription, subscribedPlan } = useAuth();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, setValue, formState: { errors } } = useFormContext<EventFormData>();
  
  const isFree = watch('isFree');
  const priceAmount = watch('price.amount');
  const priceCurrency = watch('price.currency');
  const tags = watch('tags') || [];
  
  // Check if user can create paid events
  const pricingCheck = canCreatePaidEvents(subscription, subscribedPlan);
  
  // Force events to be free if user doesn't have permission to set pricing
  useEffect(() => {
    if (!pricingCheck.allowed && !isFree) {
      setValue('isFree', true);
    }
  }, [pricingCheck.allowed, isFree, setValue]);
  
  const isEmpty = false; // Always has at least free/paid status
  const isCompleted = isFree || (!!priceAmount && !!priceCurrency);
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const tagValue = target.value.trim();
      
      if (tagValue && !tags.includes(tagValue)) {
        setValue('tags', [...tags, tagValue]);
        target.value = '';
      }
    }
  };
  
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setValue('tags', newTags);
  };
  
  const formatCurrency = (amount: number, currency: string): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (e) {
      console.error('Error formatting currency:', e);
      return `${amount} ${currency}`;
    }
  };
  
  return (
    <EventSection
      title={t('events.pricing')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">{t('events.form.price')}</h4>
            <div className="flex items-center mt-1">
              <DollarSign size={16} className="mr-1.5 text-[var(--sage-green)]" />
              <span className="text-xl font-semibold">
                {isFree 
                  ? t('events.form.free') 
                  : formatCurrency(priceAmount || 0, priceCurrency || 'EUR')}
              </span>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.tags')}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div key={index} className="inline-flex items-center bg-[rgba(83,94,75,0.1)] text-[var(--sage-green)] px-3 py-1 rounded-full text-sm">
                    <Tag size={12} className="mr-1.5" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {!pricingCheck.allowed && (
          <SubscriptionUpgrade
            message={pricingCheck.message || "You need a subscription to create paid events."}
            requiredPlan={pricingCheck.requiredPlan}
            className="mb-4"
          />
        )}
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isFree"
            {...register('isFree')}
            className="h-4 w-4 text-[var(--sage-green)] border-[var(--cognac)] rounded focus:ring-[var(--sage-green)]"
            disabled={!pricingCheck.allowed}
          />
          <label 
            htmlFor="isFree" 
            className={`ml-2 block text-sm ${!pricingCheck.allowed ? 'text-gray-500' : 'text-black'}`}
          >
            {t('events.form.isFree')}
            {!pricingCheck.allowed && (
              <span className="ml-2 text-xs text-[var(--cognac)]">
                (Required for your plan)
              </span>
            )}
          </label>
        </div>
        
        {!isFree && pricingCheck.allowed && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Input
                label={t('events.form.priceAmount')}
                type="number"
                min="0"
                step="0.01"
                {...register('price.amount', { 
                  required: !isFree,
                  valueAsNumber: true,
                  min: 0
                })}
                error={!isFree && errors.price?.amount ? t('events.validation.priceRequired') : undefined}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                {t('events.form.currency')}
              </label>
              <select
                {...register('price.currency', { required: !isFree })}
                className="border border-[var(--cognac)] rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-[rgba(83,94,75,0.2)] focus:border-[var(--sage-green)]"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
              {!isFree && errors.price?.currency && (
                <p className="mt-1 text-sm text-red-600">{t('events.validation.currencyRequired')}</p>
              )}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            {t('events.form.tags')}
          </label>
          <div className="mb-2">
            <Input
              placeholder={t('events.form.tagsPlaceholder')}
              onKeyDown={handleTagInputKeyDown}
              helperText={t('events.form.tagsHelp')}
              fullWidth
            />
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <div key={index} className="inline-flex items-center bg-[rgba(83,94,75,0.1)] text-[var(--sage-green)] px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1.5 text-[var(--sage-green)] hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isPublic"
              {...register('isPublic')}
              className="h-4 w-4 text-[var(--sage-green)] border-[var(--cognac)] rounded focus:ring-[var(--sage-green)]"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-black">
              {t('events.form.isPublic')}
            </label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            {t('events.form.isPublicHelp')}
          </p>
        </div>
      </div>
    </EventSection>
  );
};

export default PricingSection; 