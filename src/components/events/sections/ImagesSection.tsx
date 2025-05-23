'use client';

import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon, Upload, X, Plus, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Button from '../../ui/Button';
import { EventFormData } from '../EventFormTypes';
import { renderImageSource, validateImage } from '../../../utils/imageUtils';
import Image from 'next/image';
import { useAuth } from '../../../auth/auth-context';
import { canAddGalleryImages } from '../../../utils/subscriptionUtils';
import SubscriptionUpgrade from '../../ui/SubscriptionUpgrade';

interface ImagesSectionProps {
  defaultOpen?: boolean;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const { subscription, subscribedPlan } = useAuth();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { watch, setValue, formState: { errors } } = useFormContext<EventFormData>();
  
  // Refs for file inputs
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  
  // State for validation errors
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [galleryImageError, setGalleryImageError] = useState<string | null>(null);
  
  // Get form values
  const coverImage = watch('coverImage');
  const galleryImages = watch('galleryImages') || [];
  
  const isEmpty = !coverImage && (!galleryImages || galleryImages.length === 0);
  const isCompleted = !!coverImage;
  
  // Check if user can add gallery images
  const galleryImagesCheck = canAddGalleryImages(subscription, subscribedPlan);
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate image before setting
    const error = validateImage(file);
    if (error) {
      setCoverImageError(error);
      return;
    }
    
    setCoverImageError(null);
    setValue('coverImage', file);
  };
  
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validate all images
    let hasError = false;
    for (let i = 0; i < files.length; i++) {
      const error = validateImage(files[i]);
      if (error) {
        setGalleryImageError(`One or more images are invalid: ${error}`);
        hasError = true;
        break;
      }
    }
    
    if (!hasError) {
      setGalleryImageError(null);
      const newImages = Array.from(files);
      setValue('galleryImages', [...galleryImages, ...newImages]);
    }
  };
  
  // Helper function to trigger the gallery file input click
  const handleGalleryInputClick = () => {
    if (galleryImageInputRef.current) {
      galleryImageInputRef.current.click();
    }
  };
  
  const removeCoverImage = () => {
    setValue('coverImage', undefined);
    setCoverImageError(null);
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };
  
  const removeGalleryImage = (index: number) => {
    const newGalleryImages = [...galleryImages];
    newGalleryImages.splice(index, 1);
    setValue('galleryImages', newGalleryImages);
  };
  
  return (
    <EventSection
      title={t('events.images')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-6">
          {coverImage && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{t('events.form.coverImage')}</h4>
              <div className="relative">
                <Image
                  src={renderImageSource(coverImage)}
                  alt={t('events.form.coverImage')}
                  className="w-full h-64 object-cover rounded-lg"
                  width={256}
                  height={256}
                />
              </div>
            </div>
          )}
          
          {galleryImages && galleryImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{t('events.form.galleryImages')}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={renderImageSource(image)}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      width={256}
                      height={256}
                    />
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
          <h4 className="text-sm font-medium text-black mb-2">{t('events.form.coverImage')}</h4>
          <div className="border-2 border-dashed border-[var(--cognac)] rounded-lg p-6 text-center">
            <input
              type="file"
              ref={coverImageInputRef}
              id="cover-image"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
            
            {coverImage ? (
              <div className="relative">
                <Image
                  src={renderImageSource(coverImage)}
                  alt={t('events.form.coverImage')}
                  className="max-h-64 mx-auto object-contain rounded-lg"
                  width={256}
                  height={256}
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => coverImageInputRef.current?.click()}
                className="cursor-pointer py-8"
              >
                <ImageIcon size={48} className="mx-auto mb-4 text-[var(--sage-green)]" />
                <p className="text-gray-600 mb-2">{t('events.form.dragDropImage')}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="inline-flex items-center"
                >
                  <Upload size={16} className="mr-1.5" />
                  {t('events.form.browse')}
                </Button>
              </div>
            )}
          </div>
          
          {coverImageError && (
            <div className="mt-2 text-red-600 flex items-start">
              <AlertCircle size={16} className="mr-1.5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{coverImageError}</p>
            </div>
          )}
          
          {errors.coverImage && (
            <p className="mt-1 text-sm text-red-600">{t('events.validation.coverImageRequired')}</p>
          )}
        </div>
        
        {!galleryImagesCheck.allowed && (
          <div className="mt-6 mb-2">
            <SubscriptionUpgrade
              message={galleryImagesCheck.message || "Gallery images require a subscription plan"}
              requiredPlan={galleryImagesCheck.requiredPlan}
            />
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-black mb-2">{t('events.form.galleryImages')}</h4>
          <div className="border-2 border-dashed border-[var(--cognac)] rounded-lg p-6">
            <input
              type="file"
              ref={galleryImageInputRef}
              id="gallery-images"
              accept="image/*"
              multiple
              onChange={handleGalleryImageChange}
              className="hidden"
              disabled={!galleryImagesCheck.allowed}
            />
            
            <div className="flex justify-center mb-4">
              {!galleryImagesCheck.allowed ? (
                <div className="flex items-center">
                  <span className="text-[var(--cognac)] mr-2">
                    Subscription required for gallery images
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={true}
                    className="flex items-center opacity-50"
                  >
                    <Plus size={16} className="mr-1.5" />
                    {t('events.form.addImages')}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGalleryInputClick}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-1.5" />
                  {t('events.form.addImages')}
                </Button>
              )}
            </div>
            
            {galleryImageError && (
              <div className="mb-4 text-red-600 flex items-start">
                <AlertCircle size={16} className="mr-1.5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{galleryImageError}</p>
              </div>
            )}
            
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={renderImageSource(image)}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      width={128}
                      height={128}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">{t('events.form.noGalleryImages')}</p>
            )}
          </div>
        </div>
      </div>
    </EventSection>
  );
};

export default ImagesSection; 