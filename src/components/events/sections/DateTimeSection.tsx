'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import EventPriceCalculator from './EventPriceCalculator';
import { EventFormData } from '../EventFormTypes';

interface DateTimeSectionProps {
  defaultOpen?: boolean;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, formState: { errors, defaultValues } } = useFormContext<EventFormData>();
  
  // Determine if this is an edit of an existing event
  const [isExistingEvent, setIsExistingEvent] = useState(false);
  
  useEffect(() => {
    // If we have default values for dates, this is likely an edit of an existing event
    if (defaultValues?.startDate && defaultValues?.endDate) {
      setIsExistingEvent(true);
    }
  }, [defaultValues]);
  
  const startDate = watch('startDate');
  const startTime = watch('startTime');
  const endDate = watch('endDate');
  const endTime = watch('endTime');
  const registrationDeadline = watch('registrationDeadline');
  
  const isEmpty = !startDate && !startTime && !endDate && !endTime;
  const isCompleted = !!startDate && !!startTime && !!endDate && !!endTime;
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    
    // Create a dummy date to parse the time
    const date = new Date(`2000-01-01T${timeString}`);
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <EventSection
      title={t('events.dateTime')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-6">
          {(startDate || startTime) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.startDateTime')}</h4>
              <div className="flex items-center mt-1">
                <Calendar size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{formatDate(startDate)}</span>
                {startTime && (
                  <>
                    <Clock size={16} className="mx-1.5 text-[var(--sage-green)]" />
                    <span className="text-base">{formatTime(startTime)}</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          {(endDate || endTime) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.endDateTime')}</h4>
              <div className="flex items-center mt-1">
                <Calendar size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{formatDate(endDate)}</span>
                {endTime && (
                  <>
                    <Clock size={16} className="mx-1.5 text-[var(--sage-green)]" />
                    <span className="text-base">{formatTime(endTime)}</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          {registrationDeadline && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.registrationDeadline')}</h4>
              <div className="flex items-center mt-1">
                <Calendar size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{formatDate(registrationDeadline)}</span>
              </div>
            </div>
          )}
          
          {isCompleted && <EventPriceCalculator />}
        </div>
      }
    >
      <div className="space-y-6">
        {isExistingEvent && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">{t('events.dateTimeChangeRestricted')}</p>
              <p className="text-sm">{t('events.dateTimeChangeContact')}: <a href="mailto:support@zafo.com" className="underline">support@zafo.com</a></p>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium text-black mb-3">{t('events.form.startDateTime')}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                type="date"
                label={t('events.form.date')}
                {...register('startDate', { required: true })}
                error={errors.startDate ? t('events.validation.startDateRequired') : undefined}
                fullWidth
                disabled={isExistingEvent}
              />
            </div>
            <div>
              <Input
                type="time"
                label={t('events.form.time')}
                {...register('startTime', { required: true })}
                error={errors.startTime ? t('events.validation.startTimeRequired') : undefined}
                fullWidth
                disabled={isExistingEvent}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-black mb-3">{t('events.form.endDateTime')}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                type="date"
                label={t('events.form.date')}
                {...register('endDate', { required: true })}
                error={errors.endDate ? t('events.validation.endDateRequired') : undefined}
                fullWidth
                disabled={isExistingEvent}
              />
            </div>
            <div>
              <Input
                type="time"
                label={t('events.form.time')}
                {...register('endTime', { required: true })}
                error={errors.endTime ? t('events.validation.endTimeRequired') : undefined}
                fullWidth
                disabled={isExistingEvent}
              />
            </div>
          </div>
        </div>
        
        <div>
          <Input
            type="date"
            label={t('events.form.registrationDeadline')}
            {...register('registrationDeadline')}
            helperText={t('events.form.registrationDeadlineHelp')}
            fullWidth
          />
        </div>
        
        {isCompleted && <EventPriceCalculator />}
      </div>
    </EventSection>
  );
};

export default DateTimeSection; 