'use client';

import React from 'react';
import { useLanguage } from '../../i18n/language-context';
import Button from '../ui/Button';
import { Event } from '../../services/event-service';
import Image from 'next/image';
interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ 
  event, 
  isOpen, 
  onClose,
  onEdit
}) => {
  const { t } = useLanguage();
  
  if (!isOpen || !event) return null;
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };
  
  // Format time
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get event category translation
  const getCategoryTranslation = (category: string): string => {
    return t(`events.categories.${category}`);
  };
  
  // Get event status translation
  const getStatusTranslation = (status: string): string => {
    return t(`events.status.${status}`);
  };
  
  // Get localized content
  const getLocalizedContent = (content: string | undefined): string => {
    if (!content) return '';
    return content;
  };
  
  // Get event title
  const eventTitle = getLocalizedContent(event.title);
  const eventSmallDescription = getLocalizedContent(event.smallDescription);
  const eventAbout = getLocalizedContent(event.aboutEvent);
  const eventRefundPolicy = event.refundPolicy ? getLocalizedContent(event.refundPolicy) : undefined;
  const eventIncludes = event.eventIncludes ? getLocalizedContent(event.eventIncludes) : undefined;
  const eventArriveBy = event.arriveBy ? getLocalizedContent(event.arriveBy) : undefined;
  const eventDeliverBy = event.deliverBy ? getLocalizedContent(event.deliverBy) : undefined;
  const locationName = event.location.name ? getLocalizedContent(event.location.name) : '';
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-start p-6 border-b border-[var(--cognac)]">
          <h2 className="text-xl font-bold text-[var(--sage-green)]">
            {eventTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Event details */}
        <div className="p-6">
          {/* Cover image */}
          {event.coverImage && (
            <div className="mb-6">
              <Image 
                src={event.coverImage} 
                alt={eventTitle} 
                className="w-full h-64 object-cover rounded-lg"
                width={300}
                height={150}
              />
            </div>
          )}
          
          {/* Basic info section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${event.status === 'published' ? 'bg-[var(--sage)] text-black' : 
                    event.status === 'draft' ? 'bg-[var(--cognac)] text-black' : 
                    'bg-[var(--taupe)] text-black'}`}>
                  {getStatusTranslation(event.status)}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-[var(--sage-green)] text-white">
                  {getCategoryTranslation(event.category)}
                </span>
              </div>
              
              {onEdit && (
                <Button 
                  size="sm" 
                  onClick={() => onEdit(event._id)}
                >
                  {t('common.edit')}
                </Button>
              )}
            </div>
            
            {/* Small description */}
            <div className="mb-4">
              <p className="text-lg font-medium text-black">{eventSmallDescription}</p>
            </div>
            
            <div className="bg-[rgba(83,94,75,0.05)] p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--sage-green)]">{t('events.form.startDate')}</p>
                  <p className="text-black">{formatDate(event.startDate)}, {formatTime(event.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--sage-green)]">{t('events.form.endDate')}</p>
                  <p className="text-black">{formatDate(event.endDate)}, {formatTime(event.endDate)}</p>
                </div>
              </div>
            </div>
            
            {/* About this event */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.aboutEvent')}</h3>
              <div className="prose max-w-none">
                <p className="text-black whitespace-pre-line">{eventAbout}</p>
              </div>
            </div>
          </div>
          
          {/* Location section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.location')}</h3>
            
            {event.location.online ? (
              <div>
                <p className="text-sm font-medium">{t('events.form.isOnline')}</p>
                {event.location.meetingLink && (
                  <a 
                    href={event.location.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--sage-green)] underline"
                  >
                    {event.location.meetingLink}
                  </a>
                )}
              </div>
            ) : (
              <div className="text-black">
                <p className="font-medium">{locationName}</p>
                <p>{event.location.address.street}</p>
                <p>{event.location.address.postalCode} {event.location.address.city}</p>
                <p>{event.location.address.country}</p>
              </div>
            )}
          </div>
          
          {/* Speakers section */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.speakers')}</h3>
              
              <div className="space-y-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="border border-[var(--cognac)] rounded-lg p-4 flex">
                    {speaker.image && (
                      <div className="mr-4">
                        <Image 
                          src={speaker.image} 
                          alt={speaker.name} 
                          className="w-20 h-20 object-cover rounded-full"
                          width={300}
                          height={150}
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-black">{speaker.name}</h4>
                      {speaker.role && <p className="text-sm text-gray-600 mb-2">{speaker.role}</p>}
                      <p className="text-sm whitespace-pre-line text-black">{getLocalizedContent(speaker.about)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Price section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.pricing')}</h3>
            
            {event.price.isFree ? (
              <p className="text-black">{t('events.form.free')}</p>
            ) : (
              <p className="text-black">{event.price.amount} {event.price.currency}</p>
            )}
          </div>
          
          {/* What this event includes */}
          {eventIncludes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.eventIncludes')}</h3>
              <p className="text-black whitespace-pre-line">{eventIncludes}</p>
            </div>
          )}
          
          {/* Age range */}
          {event.ageRange && (event.ageRange.min || event.ageRange.max) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.ageRange')}</h3>
              <p className="text-black">
                {event.ageRange.min && event.ageRange.max 
                  ? `${event.ageRange.min} - ${event.ageRange.max} ${t('events.years')}` 
                  : event.ageRange.min 
                    ? `${t('events.minAge')}: ${event.ageRange.min} ${t('events.years')}` 
                    : `${t('events.maxAge')}: ${event.ageRange.max} ${t('events.years')}`}
              </p>
            </div>
          )}
          
          {/* Arrive by */}
          {eventArriveBy && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.arriveBy')}</h3>
              <p className="text-black">{eventArriveBy}</p>
            </div>
          )}
          
          {/* Delivered by name */}
          {eventDeliverBy && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.deliverBy')}</h3>
              <p className="text-black">{eventDeliverBy}</p>
            </div>
          )}
          
          {/* Refund policy */}
          {eventRefundPolicy && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.refundPolicy')}</h3>
              <p className="text-black whitespace-pre-line">{eventRefundPolicy}</p>
            </div>
          )}
          
          {/* Additional fields */}
          {event.additionalFields && event.additionalFields.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.additionalInfo')}</h3>
              
              <div className="space-y-4">
                {event.additionalFields.map((field, index) => (
                  <div key={index} className="border border-[var(--cognac)] rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">{getLocalizedContent(field.title)}</h4>
                    <p className="text-sm whitespace-pre-line text-black">{getLocalizedContent(field.content)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Gallery section - if available */}
          {event.galleryImages && event.galleryImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.form.galleryImages')}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.galleryImages.map((imageUrl, index) => (
                  <Image 
                    key={index}
                    src={imageUrl} 
                    alt={`${eventTitle} - ${index + 1}`}
                    className="w-full border border-[var(--cognac)] h-40 object-cover rounded-lg"
                    width={300}
                    height={150}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Tags - if available */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--sage-green)] mb-2">{t('events.form.tags')}</h3>
              
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-[rgba(83,94,75,0.1)] text-[var(--sage-green)] px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with close button */}
        <div className="p-6 border-t border-[var(--cognac)] bg-gray-50">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal; 