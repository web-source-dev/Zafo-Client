'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CalendarIcon, Clock } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import { EventFormData } from '../EventFormTypes';

interface DateTimeSectionProps {
  defaultOpen?: boolean;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
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
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    
    try {
      // Create a dummy date with the time
      const today = new Date().toISOString().split('T')[0];
      const date = new Date(`${today}T${timeString}`);
      
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return timeString;
    }
  };
  
  return (
    <EventSection
      title={t('events.dateTime')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-4">
          {(startDate || startTime) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.startDateTime')}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {startDate && (
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-1.5 text-[var(--sage-green)]" />
                    <span className="text-base">{formatDate(startDate)}</span>
                  </div>
                )}
                {startTime && (
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1.5 text-[var(--sage-green)]" />
                    <span className="text-base">{formatTime(startTime)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(endDate || endTime) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.endDateTime')}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {endDate && (
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-1.5 text-[var(--sage-green)]" />
                    <span className="text-base">{formatDate(endDate)}</span>
                  </div>
                )}
                {endTime && (
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1.5 text-[var(--sage-green)]" />
                    <span className="text-base">{formatTime(endTime)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {registrationDeadline && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.registrationDeadline')}</h4>
              <div className="flex items-center mt-1">
                <CalendarIcon size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{formatDate(registrationDeadline)}</span>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Input
              label={t('events.form.startDate')}
              type="date"
              {...register('startDate', { required: true })}
              error={errors.startDate ? t('events.validation.datesRequired') : undefined}
              fullWidth
            />
          </div>
          <div>
            <Input
              label={t('events.form.startTime')}
              type="time"
              {...register('startTime', { required: true })}
              error={errors.startTime ? t('events.validation.datesRequired') : undefined}
              fullWidth
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Input
              label={t('events.form.endDate')}
              type="date"
              {...register('endDate', { required: true })}
              error={errors.endDate ? t('events.validation.datesRequired') : undefined}
              fullWidth
            />
          </div>
          <div>
            <Input
              label={t('events.form.endTime')}
              type="time"
              {...register('endTime', { required: true })}
              error={errors.endTime ? t('events.validation.datesRequired') : undefined}
              fullWidth
            />
          </div>
        </div>
        
        <div>
          <Input
            label={t('events.form.registrationDeadline')}
            type="date"
            {...register('registrationDeadline')}
            helperText={t('events.form.registrationDeadlineHelp')}
            fullWidth
          />
        </div>
      </div>
    </EventSection>
  );
};

export default DateTimeSection; 