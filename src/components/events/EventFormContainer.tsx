'use client';

import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../i18n/language-context';
import Button from '../ui/Button';
import { Save, ArrowLeft } from 'lucide-react';
import eventService, { Event } from '../../services/event-service';
import { EventFormData } from './EventFormTypes';
import BasicInfoSection from './sections/BasicInfoSection';
import DateTimeSection from './sections/DateTimeSection';
import LocationSection from './sections/LocationSection';
import SpeakersSection from './sections/SpeakersSection';
import ImagesSection from './sections/ImagesSection';
import PricingSection from './sections/PricingSection';
import DetailsSection from './sections/DetailsSection';
import AdditionalInfoSection from './sections/AdditionalInfoSection';
import SEOSection from './sections/SEOSection';
import { processImageForUpload } from '../../utils/imageUtils';

interface EventFormContainerProps {
  event?: Event;
  isEdit?: boolean;
}
const EventFormContainer: React.FC<EventFormContainerProps> = ({ event, isEdit = false }) => {
  const { t } = useLanguage();
  const router = useRouter();
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // Form setup with react-hook-form
  const methods = useForm<EventFormData>({
    defaultValues: {
      title: '',
      smallDescription: '',
      aboutEvent: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      category: 'conference',
      capacity: 50,
      isOnline: false,
      location: {
        name: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        meetingLink: '',
      },
      isFree: true,
      price: {
        amount: 0,
        currency: 'EUR',
      },
      tags: [],
      isPublic: true,
      refundPolicy: '',
      eventIncludes: '',
      ageRange: {},
      arriveBy: '',
      deliverBy: '',
      speakers: [],
      additionalFields: [],
      seo: {
        metaTitle: '',
        metaDescription: '',
        ogImage: undefined
      }
    }
  });
  
  // Track form dirty state
  useEffect(() => {
    const subscription = methods.watch(() => {
      if (!isDirty) setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [methods, isDirty]);
  
  // Warn users about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !successMessage) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, successMessage]);
  
  // For edit mode, populate form with existing event data
  useEffect(() => {
    if (event && isEdit) {
      // Format dates for form inputs
      const startDateTime = new Date(event.startDate);
      const endDateTime = new Date(event.endDate);
      
      const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
      };
      
      const formatTimeForInput = (date: Date) => {
        return date.toTimeString().slice(0, 5);
      };
      
      // Reset form with event data
      methods.reset({
        title: event.title,
        smallDescription: event.smallDescription,
        aboutEvent: event.aboutEvent,
        startDate: formatDateForInput(startDateTime),
        startTime: formatTimeForInput(startDateTime),
        endDate: formatDateForInput(endDateTime),
        endTime: formatTimeForInput(endDateTime),
        category: event.category,
        capacity: event.capacity,
        registrationDeadline: event.registrationDeadline 
          ? formatDateForInput(new Date(event.registrationDeadline)) 
          : undefined,
        isOnline: event.location.online,
        location: {
          name: event.location.name,
          address: event.location.address,
          meetingLink: event.location.meetingLink,
        },
        isFree: event.price.isFree,
        price: {
          amount: event.price.amount,
          currency: event.price.currency,
        },
        tags: event.tags || [],
        isPublic: event.isPublic,
        coverImage: event.coverImage,
        galleryImages: event.galleryImages,
        refundPolicy: event.refundPolicy || '',
        eventIncludes: event.eventIncludes || '',
        ageRange: event.ageRange || {},
        arriveBy: event.arriveBy || '',
        deliverBy: event.deliverBy || '',
        speakers: event.speakers || [],
        additionalFields: event.additionalFields || [],
        seo: event.seo
      });
    }
  }, [event, isEdit, methods]);
  
  // Handle form submission
  const onSubmit = async (data: EventFormData, saveAsDraft = false) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Combine date and time fields
      const startDate = new Date(`${data.startDate}T${data.startTime}:00`);
      const endDate = new Date(`${data.endDate}T${data.endTime}:00`);
      
      // Validate dates
      if (startDate >= endDate) {
        setError(t('events.validation.startBeforeEnd'));
        setIsSubmitting(false);
        return;
      }
      
      // Process image files
      let coverImageBase64: string | undefined = undefined;
      const galleryImagesBase64: string[] = [];
      
      // Process cover image
      if (data.coverImage) {
        if (data.coverImage instanceof File) {
          try {
            coverImageBase64 = await processImageForUpload(data.coverImage);
          } catch (error) {
            console.error('Error processing cover image:', error);
            setError(t('events.validation.imageProcessingError'));
            setIsSubmitting(false);
            return;
          }
        } else if (typeof data.coverImage === 'string' && !data.coverImage.startsWith('blob:')) {
          // Only keep the string if it's not a blob URL (meaning it's an existing image URL)
          coverImageBase64 = data.coverImage;
        }
      }
      
      // Process gallery images
      if (data.galleryImages && data.galleryImages.length > 0) {
        for (const image of data.galleryImages) {
          if (image instanceof File) {
            try {
              const base64 = await processImageForUpload(image);
              galleryImagesBase64.push(base64);
            } catch (error) {
              console.error('Error processing gallery image:', error);
              // Continue with other images if one fails
            }
          } else if (typeof image === 'string' && !image.startsWith('blob:')) {
            // Only keep strings that aren't blob URLs
            galleryImagesBase64.push(image);
          }
        }
      }
      
      // Process speaker images
      const processedSpeakers = await Promise.all(
        (data.speakers || []).map(async (speaker) => {
          if (speaker.image instanceof File) {
            try {
              const base64 = await processImageForUpload(speaker.image);
              return { ...speaker, image: base64 };
            } catch (error) {
              console.error('Error processing speaker image:', error);
              return { ...speaker, image: undefined };
            }
          } else if (typeof speaker.image === 'string' && !speaker.image.startsWith('blob:')) {
            // Keep the existing image URL
            return speaker;
          } else {
            // Remove any blob URLs
            return { ...speaker, image: undefined };
          }
        })
      );
      
      // Process SEO OG Image
      let ogImageBase64: string | undefined = undefined;
      if (data.seo?.ogImageFile) {
        try {
          ogImageBase64 = await processImageForUpload(data.seo.ogImageFile);
        } catch (error) {
          console.error('Error processing OG image:', error);
          // Continue without OG image if processing fails
        }
      } else if (typeof data.seo?.ogImage === 'string' && !data.seo.ogImage.startsWith('blob:')) {
        // Keep existing OG image URL
        ogImageBase64 = data.seo.ogImage;
      }
      
      // Prepare event data
      const eventData = {
        title: data.title,
        smallDescription: data.smallDescription,
        aboutEvent: data.aboutEvent,
        startDate,
        endDate,
        category: data.category as 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other',
        capacity: data.capacity,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : undefined,
        location: {
          name: data.location.name,
          address: data.location.address,
          online: data.isOnline,
          meetingLink: data.isOnline ? data.location.meetingLink : undefined,
        },
        price: {
          amount: data.isFree ? 0 : data.price.amount,
          currency: data.price.currency,
          isFree: data.isFree,
        },
        tags: data.tags.filter(tag => tag.trim() !== ''),
        isPublic: data.isPublic,
        status: saveAsDraft ? 'draft' : 'published',
        refundPolicy: data.refundPolicy,
        eventIncludes: data.eventIncludes,
        ageRange: data.ageRange,
        arriveBy: data.arriveBy,
        deliverBy: data.deliverBy,
        speakers: processedSpeakers,
        additionalFields: data.additionalFields,
        seo: {
          metaTitle: data.seo?.metaTitle || '',
          metaDescription: data.seo?.metaDescription || '',
          ogImage: ogImageBase64
        },
        coverImage: coverImageBase64,
        galleryImages: galleryImagesBase64,
      };
      
      // Create or update event
      let response;
      if (isEdit && event) {
        response = await eventService.updateEvent(event._id, eventData as Partial<Event>);
      } else {
        response = await eventService.createEvent({
          ...eventData,
          organizer: ''
        } as unknown as Event);
      }
      
      // Handle response
      if (response.success) {
        setSuccessMessage(isEdit 
          ? t('events.updateSuccess') 
          : t('events.createSuccess'));
        
        // Reset dirty state after successful submission
        setIsDirty(false);
        
        // Redirect after successful creation/update
        setTimeout(() => {
          router.push('/organizer');
        }, 2000);
      } else {
        setError(response.message || t('common.error'));
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--sage-green)]">
          {isEdit ? t('events.edit') : t('events.create')}
        </h2>
        
        <div className="flex space-x-2">
  
          <Button 
            variant="outline" 
            onClick={() => router.push('/organizer')}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            {t('events.cancel')}
          </Button>
        </div>
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Success message display */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {/* Loading indicator */}
      {isSubmitting && (
        <div className="mb-6 bg-blue-50 border border-blue-300 text-blue-700 px-4 py-3 rounded flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('events.processing')}
        </div>
      )}
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => onSubmit(data, false))}>
          <div className="space-y-4">
            <BasicInfoSection defaultOpen={!isEdit} />
            <DateTimeSection />
            <LocationSection />
            <DetailsSection />
            <SpeakersSection />
            <ImagesSection />
            <PricingSection />
            <AdditionalInfoSection />
            <SEOSection />
          </div>
          
          {/* Form actions */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="mb-4 text-sm text-gray-600">
              <strong>Remember:</strong> Your changes will not be saved until you click one of the buttons below. You can navigate between sections and make edits without losing your changes.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="flex items-center"
              >
                <Save size={16} className="mr-1.5" />
                {isEdit ? `${t('events.update')} ${t('events.event')}` : `${t('events.publish')} ${t('events.event')}`}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => methods.handleSubmit((data) => onSubmit(data, true))()}
              >
                {t('events.saveAsDraft')}
              </Button>
              
              {isEdit && (
                <Button
                  type="button"
                  variant="danger"
                  className="ml-auto"
                  onClick={() => {
                    if (window.confirm(t('events.deleteConfirm'))) {
                      // Handle delete logic
                      if (event) {
                        eventService.deleteEvent(event._id).then(() => {
                          router.push('/organizer');
                        });
                      }
                    }
                  }}
                >
                  {t('events.delete')}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EventFormContainer; 