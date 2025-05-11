'use client';

import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, Image, Upload, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import Textarea from '../../ui/textarea';
import { EventFormData } from '../EventFormTypes';
import { renderImageSource, validateImage } from '../../../utils/imageUtils';

interface SEOSectionProps {
  defaultOpen?: boolean;
}

const SEOSection: React.FC<SEOSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, setValue, formState: { errors } } = useFormContext<EventFormData>();
  
  const metaTitle = watch('seo.metaTitle');
  const metaDescription = watch('seo.metaDescription');
  const ogImage = watch('seo.ogImage');
  
  const isEmpty = !metaTitle && !metaDescription && !ogImage;
  const isCompleted = !!metaTitle && !!metaDescription;
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const ogImageInputRef = useRef<HTMLInputElement>(null);
  const [ogImageError, setOgImageError] = useState<string | null>(null);
  
  const handleOGImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate the image
    const error = validateImage(file, 2); // 2MB max for OG images
    if (error) {
      setOgImageError(error);
      return;
    }
    
    // Clear error and set image
    setOgImageError(null);
    
    // Create a preview URL and set to state
    const imageUrl = URL.createObjectURL(file);
    setValue('seo.ogImage', imageUrl);
    
    // Store the file in a FormData to be processed on submission
    setValue('seo.ogImageFile', file);
  };
  
  const removeOGImage = () => {
    setValue('seo.ogImage', undefined);
    setValue('seo.ogImageFile', undefined);
    setOgImageError(null);
    if (ogImageInputRef.current) {
      ogImageInputRef.current.value = '';
    }
  };
  
  return (
    <EventSection
      title={t('events.seo')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-4">
          {metaTitle && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.metaTitle')}</h4>
              <div className="flex items-center mt-1">
                <Search size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base font-medium">{metaTitle}</span>
              </div>
            </div>
          )}
          
          {metaDescription && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.metaDescription')}</h4>
              <p className="mt-1 ml-6 text-sm text-gray-700">{metaDescription}</p>
            </div>
          )}
          
          {ogImage && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.ogImage')}</h4>
              <div className="mt-2">
                <img
                  src={ogImage}
                  alt={t('events.form.ogImage')}
                  className="max-w-xs h-auto rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Input
            label={t('events.form.metaTitle')}
            {...register('seo.metaTitle')}
            helperText={t('events.form.metaTitleHelp')}
            fullWidth
          />
        </div>
        
        <div>
          <Textarea
            label={t('events.form.metaDescription')}
            {...register('seo.metaDescription')}
            rows={3}
            helperText={t('events.form.metaDescriptionHelp')}
            fullWidth
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            {t('events.form.ogImage')}
          </label>
          <div className="border-2 border-dashed border-[var(--cognac)] rounded-lg p-4 text-center">
            <input
              type="file"
              ref={ogImageInputRef}
              id="og-image"
              accept="image/*"
              onChange={handleOGImageChange}
              className="hidden"
            />
            
            {ogImage ? (
              <div className="relative">
                <img
                  src={ogImage}
                  alt={t('events.form.ogImage')}
                  className="max-h-48 mx-auto object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeOGImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => ogImageInputRef.current?.click()}
                className="cursor-pointer py-6"
              >
                <Image size={32} className="mx-auto mb-2 text-[var(--sage-green)]" />
                <p className="text-gray-600 mb-2">{t('events.form.ogImageHelp')}</p>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-[var(--sage-green)] text-[var(--sage-green)] text-sm rounded-md hover:bg-[rgba(83,94,75,0.1)]"
                >
                  <Upload size={14} className="mr-1.5" />
                  {t('events.form.uploadImage')}
                </button>
              </div>
            )}
          </div>
          
          {ogImageError && (
            <div className="mt-2 text-red-600 flex items-start">
              <AlertCircle size={16} className="mr-1.5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{ogImageError}</p>
            </div>
          )}
          
          <p className="mt-1 text-xs text-gray-500">{t('events.form.ogImageDescription')}</p>
        </div>
      </div>
    </EventSection>
  );
};

export default SEOSection; 