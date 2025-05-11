'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Info, CheckCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Textarea from '../../ui/textarea';
import Input from '../../ui/Input';
import { EventFormData } from '../EventFormTypes';

interface DetailsSectionProps {
  defaultOpen?: boolean;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
  const aboutEvent = watch('aboutEvent');
  const eventIncludes = watch('eventIncludes');
  const refundPolicy = watch('refundPolicy');
  const capacity = watch('capacity');
  
  const isEmpty = !aboutEvent && !eventIncludes && !refundPolicy;
  const isCompleted = !!aboutEvent;
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <EventSection
      title={t('events.details')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-6">
          {aboutEvent && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.aboutEvent')}</h4>
              <div className="mt-2 whitespace-pre-line">{aboutEvent}</div>
            </div>
          )}
          
          {capacity && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.capacity')}</h4>
              <div className="flex items-center mt-1">
                <Calendar size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">
                  {capacity} {t('events.form.attendees')}
                </span>
              </div>
            </div>
          )}
          
          {eventIncludes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.eventIncludes')}</h4>
              <div className="mt-2 space-y-2">
                {eventIncludes.split('\n').filter(Boolean).map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={16} className="mr-1.5 mt-1 text-[var(--sage-green)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {refundPolicy && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.refundPolicy')}</h4>
              <div className="flex items-start mt-1">
                <Info size={16} className="mr-1.5 mt-1 text-[var(--sage-green)]" />
                <div className="whitespace-pre-line">{refundPolicy}</div>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Textarea
            label={t('events.form.aboutEvent')}
            {...register('aboutEvent', { required: true })}
            error={errors.aboutEvent ? t('events.validation.aboutEventRequired') : undefined}
            rows={6}
            helperText={t('events.form.aboutEventHelp')}
            fullWidth
          />
        </div>
        
        <div>
          <Input
            label={t('events.form.capacity')}
            type="number"
            min="1"
            step="1"
            {...register('capacity', { 
              required: true,
              valueAsNumber: true,
              min: 1
            })}
            error={errors.capacity ? t('events.validation.capacityRequired') : undefined}
            fullWidth
          />
        </div>
        
        <div>
          <Textarea
            label={t('events.form.eventIncludes')}
            {...register('eventIncludes')}
            rows={4}
            helperText={t('events.form.eventIncludesHelp')}
            fullWidth
          />
        </div>
        
        <div>
          <Textarea
            label={t('events.form.refundPolicy')}
            {...register('refundPolicy')}
            rows={4}
            helperText={t('events.form.refundPolicyHelp')}
            fullWidth
          />
        </div>
      </div>
    </EventSection>
  );
};

export default DetailsSection; 