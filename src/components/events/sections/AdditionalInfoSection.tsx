'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusCircle, MessageCircle, Clock, AlertTriangle, Plus, X, Info } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import { useAuth } from '../../../auth/auth-context';
import { canAddAdvancedFeatures } from '../../../utils/subscriptionUtils';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import Textarea from '../../ui/textarea';
import Button from '../../ui/Button';
import SubscriptionUpgrade from '../../ui/SubscriptionUpgrade';
import { EventFormData } from '../EventFormTypes';

interface AdditionalInfoSectionProps {
  defaultOpen?: boolean;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const { subscription, subscribedPlan } = useAuth();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { control, register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalFields',
  });
  
  // Check if user can add advanced features
  const advancedFeatureCheck = canAddAdvancedFeatures(subscription, subscribedPlan);
  
  const additionalFields = watch('additionalFields') || [];
  const ageRangeMin = watch('ageRange.min');
  const ageRangeMax = watch('ageRange.max');
  const arriveBy = watch('arriveBy');
  const deliverBy = watch('deliverBy');
  
  const isEmpty = !arriveBy && !deliverBy && 
    (!ageRangeMin && !ageRangeMax) && 
    (!additionalFields || additionalFields.length === 0);
    
  const isCompleted = false; // These are all optional fields
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleAddField = () => {
    // Completely prevent adding fields for free users
    if (!subscription) {
      return;
    }
    
    // Only allow one additional field for paid users without advanced features
    if (subscription && !advancedFeatureCheck.allowed && additionalFields.length >= 1) {
      return;
    }
    
    append({ title: '', content: '' });
  };
  
  // Check if additional fields should be disabled
  const isAdditionalFieldDisabled = () => {
    if (!subscription) {
      return true;
    }
    
    if (subscription && !advancedFeatureCheck.allowed && additionalFields.length >= 1) {
      return true;
    }
    
    return false;
  };
  
  // Get appropriate message for additional fields limitations
  const getAdditionalFieldsMessage = () => {
    if (!subscription) {
      return "Additional fields require a subscription. Please upgrade to a paid plan.";
    }
    
    return advancedFeatureCheck.message || "Upgrade to add more custom fields to your event.";
  };
  
  return (
    <EventSection
      title={t('events.additionalInfo')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-6">
          {(ageRangeMin || ageRangeMax) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.ageRange')}</h4>
              <div className="flex items-center mt-1">
                <AlertTriangle size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">
                  {ageRangeMin && ageRangeMax 
                    ? `${ageRangeMin} - ${ageRangeMax} ${t('events.form.years')}` 
                    : ageRangeMin 
                      ? `${t('events.form.minAge')}: ${ageRangeMin} ${t('events.form.years')}` 
                      : `${t('events.form.maxAge')}: ${ageRangeMax} ${t('events.form.years')}`}
                </span>
              </div>
            </div>
          )}
          
          {arriveBy && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.arriveBy')}</h4>
              <div className="flex items-center mt-1">
                <Clock size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{arriveBy}</span>
              </div>
            </div>
          )}
          
          {deliverBy && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.deliverBy')}</h4>
              <div className="flex items-center mt-1">
                <Clock size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{deliverBy}</span>
              </div>
            </div>
          )}
          
          {additionalFields && additionalFields.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.additionalFields')}</h4>
              <div className="mt-2 space-y-4">
                {additionalFields.map((field, index) => (
                  <div key={index} className="border border-[var(--cognac)] rounded-lg p-3">
                    <h5 className="font-medium text-[var(--sage-green)]">{field.title}</h5>
                    <div className="mt-1 whitespace-pre-line">{field.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-black mb-3">{t('events.form.ageRange')}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                label={t('events.form.minAge')}
                type="number"
                min="0"
                {...register('ageRange.min', { 
                  valueAsNumber: true,
                  min: 0
                })}
                fullWidth
              />
            </div>
            <div>
              <Input
                label={t('events.form.maxAge')}
                type="number"
                min="0"
                {...register('ageRange.max', { 
                  valueAsNumber: true,
                  min: 0
                })}
                fullWidth
              />
            </div>
          </div>
        </div>
        
        <div>
          <Input
            label={t('events.form.arriveBy')}
            {...register('arriveBy')}
            helperText={t('events.form.arriveByHelp')}
            fullWidth
          />
        </div>
        
        <div>
          <Input
            label={t('events.form.deliverBy')}
            {...register('deliverBy')}
            helperText={t('events.form.deliverByHelp')}
            fullWidth
          />
        </div>
        
        <div className="border-t border-[var(--cognac)] pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-black">{t('events.form.additionalFields')}</h4>
            {isAdditionalFieldDisabled() ? (
              <div className="flex items-center">
                <span className="text-xs text-[var(--cognac)] mr-2">
                  {!subscription ? "Subscription required" : "Upgrade for more fields"}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={true}
                  className="flex items-center opacity-50"
                >
                  <Plus size={16} className="mr-1.5" />
                  {t('events.form.addField')}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddField}
                className="flex items-center"
              >
                <Plus size={16} className="mr-1.5" />
                {t('events.form.addField')}
              </Button>
            )}
          </div>
          
          {isAdditionalFieldDisabled() && (
            <SubscriptionUpgrade
              message={getAdditionalFieldsMessage()}
              requiredPlan={!subscription ? "Starter" : advancedFeatureCheck.requiredPlan}
              className="mb-4"
            />
          )}
          
          {!subscription && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 flex items-start">
              <Info size={18} className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Free plan limitation:</strong> Additional fields are only available 
                  with a paid subscription plan. Upgrade to add custom fields to your events.
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-[var(--cognac)] rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">{t('events.form.field')} #{index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Input
                      label={t('events.form.fieldTitle')}
                      {...register(`additionalFields.${index}.title` as const, { required: true })}
                      error={errors.additionalFields?.[index]?.title ? t('events.validation.fieldTitleRequired') : undefined}
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      label={t('events.form.fieldContent')}
                      {...register(`additionalFields.${index}.content` as const, { required: true })}
                      error={errors.additionalFields?.[index]?.content ? t('events.validation.fieldContentRequired') : undefined}
                      rows={3}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {fields.length === 0 && !isAdditionalFieldDisabled() && (
              <div className="text-center py-8 border border-dashed border-[var(--cognac)] rounded-lg">
                <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 mb-2">{t('events.form.noAdditionalFields')}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddField}
                  className="inline-flex items-center"
                >
                  <PlusCircle size={16} className="mr-1.5" />
                  {t('events.form.addFirstField')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </EventSection>
  );
};

export default AdditionalInfoSection; 