'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Button from '../../ui/Button';
import Image from 'next/image';
import { EventFormData } from '../EventFormTypes';

interface ImagesSectionProps {
  defaultOpen?: boolean;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { watch, setValue, formState: { errors } } = useFormContext<EventFormData>();
  
  const coverImage = watch('coverImage');
  const galleryImages = watch('galleryImages') || [];
  
  const isEmpty = !coverImage && (!galleryImages || galleryImages.length === 0);
  const isCompleted = !!coverImage;
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue('coverImage', file);
    }
  };
  
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const currentImages = galleryImages || [];
      setValue('galleryImages', [...currentImages, file]);
    }
  };
  
  const handleGalleryInputClick = () => {
    // Reset the input value to allow selecting the same file again
    const input = document.getElementById('gallery-image-input') as HTMLInputElement;
    if (input) input.value = '';
  };
  
  const removeCoverImage = () => {
    setValue('coverImage', undefined);
  };
  
  const removeGalleryImage = (index: number) => {
    const newImages = [...galleryImages];
    newImages.splice(index, 1);
    setValue('galleryImages', newImages);
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
              <div className="relative w-full h-48">
                <Image
                  src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)}
                  alt={t('events.form.coverImage')}
                  className="rounded-lg object-cover"
                  fill
                />
              </div>
            </div>
          )}
          
          {galleryImages && galleryImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{t('events.form.galleryImages')}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`${t('events.form.galleryImage')} ${index + 1}`}
                      className="rounded-lg object-cover"
                      fill
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
          <h4 className="text-sm font-medium text-black mb-3">{t('events.form.coverImage')}</h4>
          {coverImage ? (
            <div className="relative">
              <div className="relative w-full h-48 mb-2">
                <Image
                  src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)}
                  alt={t('events.form.coverImage')}
                  className="rounded-lg object-cover"
                  fill
                />
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={removeCoverImage}
                className="absolute top-2 right-2"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center justify-center h-48 border-2 border-[var(--cognac)] border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus size={32} className="text-[var(--sage-green)] mb-2" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{t('events.form.clickToUpload')}</span>
                  </p>
                  <p className="text-xs text-gray-500">{t('events.form.imageTypes')}</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </label>
            </div>
          )}
        </div>
        
        <div className="border-t border-[var(--cognac)] pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-black">{t('events.form.galleryImages')}</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`${t('events.form.galleryImage')} ${index + 1}`}
                  className="rounded-lg object-cover"
                  fill
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center justify-center aspect-square">
              <label className="w-full h-full flex flex-col items-center justify-center border-2 border-[var(--cognac)] border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center p-4">
                  <ImagePlus size={24} className="text-[var(--sage-green)] mb-2" />
                  <p className="text-xs text-center text-gray-500">{t('events.form.addToGallery')}</p>
                </div>
                <input
                  id="gallery-image-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleGalleryImageChange}
                  onClick={handleGalleryInputClick}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </EventSection>
  );
};

export default ImagesSection; 