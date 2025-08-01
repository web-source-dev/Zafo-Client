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

import LoadingScreen from '../ui/LoadingScreen';

interface EventFormContainerProps {
  event?: Event;
  isEdit?: boolean;
}
// Helper function to convert File to base64 string
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const EventFormContainer: React.FC<EventFormContainerProps> = ({ event, isEdit = false }) => {
  const { t } = useLanguage();
  const router = useRouter();
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // Event creation limits
  const [limitCheck, setLimitCheck] = useState<{ allowed: boolean; message?: string; requiredPlan?: string }>({ 
    allowed: true 
  });

  useEffect(() => {
    setLimitCheck({
      allowed: true,
    });
  }, []);
  

  
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
      category: 'other',
      capacity: 1,
      isOnline: false,
      location: {
        name: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        }
      },
      price: {
        amount: 0,
        currency: 'EUR'
      },
      tags: [],
      isPublic: true,
      refundPolicy: '',
      eventIncludes: '',
      ageRange: {},
      arriveBy: '',
      speakers: [],
      additionalFields: []
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

      });
    }
  }, [event, isEdit, methods]);
  
  // Handle form submission
  const onSubmit = async (data: EventFormData, saveAsDraft = false) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Process images if needed
      const processedData = { ...data };
      
      if (data.coverImage instanceof File) {
        processedData.coverImage = await fileToBase64(data.coverImage);
      }
      
      if (data.galleryImages) {
        processedData.galleryImages = await Promise.all(
          data.galleryImages.map(async (image) => {
            if (image instanceof File) {
              return await fileToBase64(image);
            }
            return image;
          })
        );
      }
      
      if (data.speakers) {
        processedData.speakers = await Promise.all(
          data.speakers.map(async (speaker) => {
            if (speaker.image instanceof File) {
              return {
                ...speaker,
                image: await fileToBase64(speaker.image)
              };
            }
            return speaker;
          })
        );
      }
      // Combine date and time
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      
      // Determine status based on context
      let status = saveAsDraft ? 'draft' : data.isFree ? 'published' : 'pending_payment';
      
      // For existing events, preserve payment status
      if (isEdit && event?.isPaid) {
        // If the event is already paid, keep its current status
        status = event.status;
      }
      
      // Prepare final data
      const eventData = {
        ...processedData,
        startDate: startDateTime,
        endDate: endDateTime,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : undefined,
        status: status,
        location: {
          name: data.location.name,
          address: data.location.address,
          online: data.isOnline,
          meetingLink: data.isOnline ? data.location.meetingLink : undefined,
          coordinates: undefined
        },
        price: {
          amount: data.price.amount,
          currency: data.price.currency,
          isFree: data.isFree,
          platformFee: data.isFree ? 0 : data.price.calculatedAmount || calculatePlatformFee(data)
        },
        speakers: data.speakers?.map(speaker => ({
          name: speaker.name,
          about: speaker.about,
          role: speaker.role,
          image: typeof speaker.image === 'string' ? speaker.image : undefined
        })) || [],
        organizer: event?.organizer || undefined
      } as const;
      
      // If editing a paid event, preserve payment information
      if (isEdit && event?.isPaid) {
        Object.assign(eventData, {
          isPaid: true,
          paidAt: event.paidAt,
          paymentId: event.paymentId
        });
      }
      
      // Submit to API
      const response = isEdit
        ? await eventService.updateEvent(event!._id, eventData as unknown as Partial<Event>)
        : await eventService.createEvent(eventData as unknown as Omit<Event, '_id' | 'slug' | 'createdAt' | 'updatedAt'>);
      
      if (response.success && !saveAsDraft && !data.isFree && response.data) {
        // Check if the event is already paid
        if (isEdit && (response.data as unknown as { isPaid: boolean }).isPaid) {
          // If already paid, just show success
          setSuccessMessage(t('events.paymentSuccess'));
          setIsSubmitting(false);
          
          // Redirect to event list after a short delay
          setTimeout(() => {
            router.push('/organizer/events');
          }, 1500);
          return;
        }
        
        // Redirect to payment page with event ID
        router.push(`/payment/create/${response.data._id}`);
        return;
      }
      
      if (response.success) {
        router.push('/organizer/events');
      } else {
        setError(response.message || t('events.submitError'));
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
        <LoadingScreen />
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
          </div>
          
          {/* Form actions */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="mb-4 text-sm text-gray-600">
              <strong>Remember:</strong> Your changes will not be saved until you click one of the buttons below. You can navigate between sections and make edits without losing your changes.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || (!isEdit && !limitCheck.allowed)}
                isLoading={isSubmitting}
                className="flex items-center"
              >
                <Save size={16} className="mr-1.5" />
                {isEdit ? `${t('events.update')} ${t('events.event')}` : `${t('events.publish')} ${t('events.event')}`}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting || (!isEdit && !limitCheck.allowed)}
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

// Helper function to calculate platform fee if not already set
const calculatePlatformFee = (data: EventFormData): number => {
  if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) return 350;
  
  const start = new Date(`${data.startDate}T${data.startTime}`);
  const end = new Date(`${data.endDate}T${data.endTime}`);
  
  // Calculate duration in milliseconds and convert to hours
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.max(0, durationMs / (1000 * 60 * 60));
  
  // For events up to 1 day (24h): 350 CHF
  // For events of 1 day or more: 675 CHF
  return durationHours <= 24 ? 350 : 675;
};

export default EventFormContainer; 