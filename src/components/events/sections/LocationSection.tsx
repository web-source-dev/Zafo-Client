'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin, Globe, Link } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import { EventFormData } from '../EventFormTypes';

interface LocationSectionProps {
  defaultOpen?: boolean;
}

const LocationSection: React.FC<LocationSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
  const isOnline = watch('isOnline');
  const meetingLink = watch('location.meetingLink');
  const locationName = watch('location.name');
  const street = watch('location.address.street');
  const city = watch('location.address.city');
  const postalCode = watch('location.address.postalCode');
  const country = watch('location.address.country');
  
  const isEmpty = isOnline ? !meetingLink : !locationName || !street || !city || !postalCode || !country;
  const isCompleted = isOnline ? !!meetingLink : (!!locationName && !!street && !!city && !!postalCode && !!country);
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const formatAddress = () => {
    const parts = [street, postalCode, city, country].filter(Boolean);
    return parts.join(', ');
  };
  
  return (
    <EventSection
      title={t('events.location')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">{t('events.form.locationType')}</h4>
            <div className="flex items-center mt-1">
              {isOnline ? (
                <div className="flex items-center">
                  <Globe size={16} className="mr-1.5 text-[var(--sage-green)]" />
                  <span className="text-base">{t('events.form.online')}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1.5 text-[var(--sage-green)]" />
                  <span className="text-base">{t('events.form.inPerson')}</span>
                </div>
              )}
            </div>
          </div>
          
          {isOnline && meetingLink && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.meetingLink')}</h4>
              <div className="flex items-start mt-1">
                <Link size={16} className="mr-1.5 mt-1 text-[var(--sage-green)]" />
                <a 
                  href={meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base text-blue-600 hover:underline overflow-hidden text-ellipsis break-all"
                >
                  {meetingLink}
                </a>
              </div>
            </div>
          )}
          
          {!isOnline && (
            <>
              {locationName && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('events.form.locationName')}</h4>
                  <div className="flex items-center mt-1">
                    <MapPin size={16} className="mr-1.5 text-[var(--sage-green)]" />
                    <span className="text-base font-medium">{locationName}</span>
                  </div>
                </div>
              )}
              
              {(street || city || postalCode || country) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('events.form.address')}</h4>
                  <address className="text-base not-italic mt-1 ml-6">
                    {street && <div>{street}</div>}
                    {(city || postalCode) && (
                      <div>
                        {postalCode} {city}
                      </div>
                    )}
                    {country && <div>{country}</div>}
                  </address>
                </div>
              )}
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isOnline"
            {...register('isOnline')}
            className="h-4 w-4 text-[var(--sage-green)] border-[var(--cognac)] rounded focus:ring-[var(--sage-green)]"
          />
          <label htmlFor="isOnline" className="ml-2 block text-sm text-black">
            {t('events.form.isOnline')}
          </label>
        </div>
        
        {isOnline ? (
          <div>
            <Input
              label={t('events.form.meetingLink')}
              {...register('location.meetingLink', { required: isOnline })}
              error={isOnline && errors.location?.meetingLink ? t('events.validation.locationRequired') : undefined}
              fullWidth
            />
          </div>
        ) : (
          <>
            <div>
              <Input
                label={t('events.form.locationName')}
                {...register('location.name', { required: !isOnline })}
                error={!isOnline && errors.location?.name ? t('events.validation.locationRequired') : undefined}
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label={t('events.form.street')}
                {...register('location.address.street', { required: !isOnline })}
                error={!isOnline && errors.location?.address?.street ? t('events.validation.locationRequired') : undefined}
                fullWidth
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Input
                  label={t('events.form.city')}
                  {...register('location.address.city', { required: !isOnline })}
                  error={!isOnline && errors.location?.address?.city ? t('events.validation.locationRequired') : undefined}
                  fullWidth
                />
              </div>
              <div>
                <Input
                  label={t('events.form.state')}
                  {...register('location.address.state')}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Input
                  label={t('events.form.postalCode')}
                  {...register('location.address.postalCode', { required: !isOnline })}
                  error={!isOnline && errors.location?.address?.postalCode ? t('events.validation.locationRequired') : undefined}
                  fullWidth
                />
              </div>
              <div>
                <Input
                  label={t('events.form.country')}
                  {...register('location.address.country', { required: !isOnline })}
                  error={!isOnline && errors.location?.address?.country ? t('events.validation.locationRequired') : undefined}
                  fullWidth
                />
              </div>
            </div>
          </>
        )}
      </div>
    </EventSection>
  );
};

export default LocationSection; 