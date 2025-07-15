'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { UserPlus, X, User } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import Textarea from '../../ui/textarea';
import Button from '../../ui/Button';
import { EventFormData } from '../EventFormTypes';

interface SpeakersSectionProps {
  defaultOpen?: boolean;
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { control, register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'speakers',
  });
  
  const speakers = watch('speakers') || [];
  
  const isEmpty = !speakers || speakers.length === 0;
  const isCompleted = speakers.length > 0 && speakers.every(s => s.name && s.about);
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  // Add new speaker
  const handleAddSpeaker = () => {
    append({ name: '', about: '', role: '' });
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('events.validation.imageTooLarge'));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(t('events.validation.invalidImageType'));
        return;
      }
      
      // Update speaker image
      const updatedSpeakers = [...speakers];
      updatedSpeakers[index] = {
        ...updatedSpeakers[index],
        image: file
      };
      control._formValues.speakers = updatedSpeakers;
    }
  };
  
  // Remove speaker image
  const removeSpeakerImage = (index: number) => {
    const updatedSpeakers = [...speakers];
    updatedSpeakers[index] = {
      ...updatedSpeakers[index],
      image: undefined
    };
    control._formValues.speakers = updatedSpeakers;
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
          {speakers.map((speaker, index) => (
            <div key={index} className="border border-[var(--cognac)] rounded-lg p-4">
              <div className="flex items-start">
                {speaker.image ? (
                  <img
                    src={typeof speaker.image === 'string' ? speaker.image : URL.createObjectURL(speaker.image)}
                    alt={speaker.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--sage)] flex items-center justify-center">
                    <User size={24} className="text-black" />
                  </div>
                )}
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-[var(--sage-green)]">{speaker.name}</h4>
                  {speaker.role && (
                    <p className="text-sm text-gray-500">{speaker.role}</p>
                  )}
                  <p className="mt-2 text-sm whitespace-pre-line">{speaker.about}</p>
                </div>
              </div>
            </div>
          ))}
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
                  helperText={t('events.form.speakerRoleHelp')}
                  fullWidth
                />
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
                {speakers[index]?.image ? (
                  <div className="flex items-center space-x-4">
                    <img
                      src={typeof speakers[index].image === 'string' 
                        ? speakers[index].image 
                        : URL.createObjectURL(speakers[index].image as File)
                      }
                      alt={speakers[index].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeSpeakerImage(index)}
                    >
                      {t('common.remove')}
                    </Button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="mt-1"
                  />
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {t('events.form.speakerImageHelp')}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {fields.length === 0 && (
          <div className="text-center py-8 border border-dashed border-[var(--cognac)] rounded-lg">
            <UserPlus size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 mb-2">{t('events.form.noSpeakers')}</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSpeaker}
              className="inline-flex items-center"
            >
              <UserPlus size={16} className="mr-1.5" />
              {t('events.form.addFirstSpeaker')}
            </Button>
          </div>
        )}
        
        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSpeaker}
            className="w-full flex items-center justify-center"
          >
            <UserPlus size={16} className="mr-1.5" />
            {t('events.form.addAnotherSpeaker')}
          </Button>
        )}
      </div>
    </EventSection>
  );
};

export default SpeakersSection; 