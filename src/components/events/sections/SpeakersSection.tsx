'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { User, Plus, X, Upload, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import Textarea from '../../ui/textarea';
import Button from '../../ui/Button';
import { EventFormData } from '../EventFormTypes';
import { renderImageSource, validateImage } from '../../../utils/imageUtils';

interface SpeakersSectionProps {
  defaultOpen?: boolean;
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { control, register, watch, setValue, formState: { errors } } = useFormContext<EventFormData>();
  
  // State for upload errors
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({});
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'speakers',
  });
  
  const speakers = watch('speakers');
  
  const isEmpty = !speakers || speakers.length === 0;
  const isCompleted = speakers && speakers.length > 0 && 
    speakers.every(speaker => speaker.name && speaker.about);
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleAddSpeaker = () => {
    append({ name: '', about: '', role: '' });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate the image
    const error = validateImage(file, 2); // 2MB max for speaker images
    if (error) {
      setImageErrors(prev => ({ ...prev, [index]: error }));
      return;
    }
    
    // Clear error and set image
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
    
    // Update the speaker image
    const updatedSpeakers = [...speakers];
    updatedSpeakers[index] = {
      ...updatedSpeakers[index],
      image: file
    };
    setValue('speakers', updatedSpeakers);
  };
  
  const removeSpeakerImage = (index: number) => {
    const updatedSpeakers = [...speakers];
    updatedSpeakers[index] = {
      ...updatedSpeakers[index],
      image: undefined
    };
    setValue('speakers', updatedSpeakers);
    
    // Clear any error
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };
  
  return (
    <EventSection
      title={t('events.speakers')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-6">
          {speakers && speakers.length > 0 ? (
            speakers.map((speaker, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-[var(--cognac)] rounded-lg">
                <div className="flex-shrink-0">
                  {speaker.image ? (
                    <img 
                      src={renderImageSource(speaker.image)}
                      alt={speaker.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-[rgba(83,94,75,0.1)] rounded-full">
                      <User size={24} className="text-[var(--sage-green)]" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-medium text-lg">{speaker.name}</h4>
                  {speaker.role && <p className="text-sm text-gray-600 mb-2">{speaker.role}</p>}
                  <p className="text-sm whitespace-pre-line">{speaker.about}</p>
                </div>
              </div>
            ))
          ) : null}
        </div>
      }
    >
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border border-[var(--cognac)] rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">{t('events.form.speaker')} #{index + 1}</h4>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1 rounded-full text-red-500 hover:bg-red-50"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Input
                    label={t('events.form.speakerName')}
                    {...register(`speakers.${index}.name` as const, { required: true })}
                    error={errors.speakers?.[index]?.name ? t('events.validation.speakerNameRequired') : undefined}
                    fullWidth
                  />
                </div>
                <div>
                  <Input
                    label={t('events.form.speakerRole')}
                    {...register(`speakers.${index}.role` as const)}
                    fullWidth
                  />
                </div>
              </div>
              
              <div>
                <Textarea
                  label={t('events.form.speakerAbout')}
                  {...register(`speakers.${index}.about` as const, { required: true })}
                  error={errors.speakers?.[index]?.about ? t('events.validation.speakerAboutRequired') : undefined}
                  rows={3}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  {t('events.form.speakerImage')}
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id={`speaker-image-${index}`}
                    onChange={(e) => handleImageChange(e, index)}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor={`speaker-image-${index}`}
                    className="flex items-center px-3 py-2 border border-[var(--cognac)] rounded-md cursor-pointer hover:bg-[rgba(83,94,75,0.05)]"
                  >
                    <Upload size={16} className="mr-1.5 text-[var(--sage-green)]" />
                    {t('events.form.uploadImage')}
                  </label>
                  {speakers[index]?.image && (
                    <div className="ml-3 relative w-12 h-12">
                      <img
                        src={renderImageSource(speakers[index].image)}
                        alt={speakers[index].name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                        onClick={() => removeSpeakerImage(index)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
                
                {imageErrors[index] && (
                  <div className="mt-2 text-red-600 flex items-start">
                    <AlertCircle size={16} className="mr-1.5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{imageErrors[index]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSpeaker}
            className="flex items-center"
          >
            <Plus size={16} className="mr-1.5" />
            {t('events.form.addSpeaker')}
          </Button>
        </div>
      </div>
    </EventSection>
  );
};

export default SpeakersSection; 