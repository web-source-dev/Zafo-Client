'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusCircle, MessageCircle, Clock, AlertTriangle, Plus, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import Textarea from '../../ui/textarea';
import Button from '../../ui/Button';
import { EventFormData } from '../EventFormTypes';

interface AdditionalInfoSectionProps {
  defaultOpen?: boolean;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { control, register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalFields',
  });
  
  const additionalFields = watch('additionalFields') || [];
  const ageRangeMin = watch('ageRange.min');
  const ageRangeMax = watch('ageRange.max');
  const arriveBy = watch('arriveBy');
  const deliverBy = watch('deliverBy');
  
  const isEmpty = !arriveBy && !deliverBy && 
    (!ageRangeMin && !ageRangeMax) && 
    (!additionalFields || additionalFields.length === 0);
    
  const isCompleted = false; // These are all optional fields
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleAddField = () => {
    append({ title: '', content: '' });
  };
  
  return (
    <EventSection
      title={t('events.form.sections.additionalInfo')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-6">
          {(ageRangeMin || ageRangeMax) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.ageRange')}</h4>
              <div className="flex items-center mt-1">
                <AlertTriangle size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">
                  {ageRangeMin && ageRangeMax 
                    ? t('events.form.preview.minMaxAge', { min: String(ageRangeMin), max: String(ageRangeMax) })
                    : ageRangeMin 
                      ? t('events.form.preview.minAge', { min: String(ageRangeMin) })
                      : ageRangeMax 
                        ? t('events.form.preview.maxAge', { max: String(ageRangeMax) })
                        : t('events.form.preview.noAgeRestriction')}
                </span>
              </div>
            </div>
          )}
          
          {arriveBy && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.arriveBy')}</h4>
              <div className="flex items-center mt-1">
                <Clock size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{arriveBy}</span>
              </div>
            </div>
          )}
          
          {deliverBy && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.deliverBy')}</h4>
              <div className="flex items-center mt-1">
                <Clock size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{deliverBy}</span>
              </div>
            </div>
          )}
          
          {additionalFields && additionalFields.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.additionalInfoTitle')}</h4>
              <div className="mt-2 space-y-4">
                {additionalFields.map((field, index) => (
                  <div key={index} className="border border-[var(--cognac)] rounded-lg p-3">
                    <h5 className="font-medium text-[var(--sage-green)]">{field.title}</h5>
                    <div className="mt-1 whitespace-pre-line">{field.content}</div>
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
          <h4 className="text-sm font-medium text-black mb-3">{t('events.form.ageRange')}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                label={t('events.form.minAge')}
                type="number"
                min="0"
                {...register('ageRange.min', { 
                  valueAsNumber: true,
                  min: 0
                })}
                fullWidth
              />
            </div>
            <div>
              <Input
                label={t('events.form.maxAge')}
                type="number"
                min="0"
                {...register('ageRange.max', { 
                  valueAsNumber: true,
                  min: 0
                })}
                fullWidth
              />
            </div>
          </div>
        </div>
        
        <div>
          <Input
            label={t('events.form.arriveBy')}
            {...register('arriveBy')}
            helperText={t('events.form.arriveByHelp')}
            fullWidth
          />
        </div>
        
        <div>
          <Input
            label={t('events.form.deliverBy')}
            {...register('deliverBy')}
            helperText={t('events.form.deliverByHelp')}
            fullWidth
          />
        </div>
        
        <div className="border-t border-[var(--cognac)] pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-black">{t('events.form.additionalInfoTitle')}</h4>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddField}
                className="flex items-center"
              >
                <Plus size={16} className="mr-1.5" />
                {t('events.form.addNewField')}
              </Button>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-[var(--cognac)] rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">{t('events.form.field')} #{index + 1}</h5>
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
                      label={t('events.form.fieldTitle')}
                      {...register(`additionalFields.${index}.title` as const, { required: true })}
                      error={errors.additionalFields?.[index]?.title ? t('events.validation.requiredField') : undefined}
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      label={t('events.form.fieldValue')}
                      {...register(`additionalFields.${index}.content` as const, { required: true })}
                      error={errors.additionalFields?.[index]?.content ? t('events.validation.requiredField') : undefined}
                      rows={3}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {fields.length === 0 && (
              <div className="text-center py-8 border border-dashed border-[var(--cognac)] rounded-lg">
                <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 mb-2">{t('events.form.additionalInfoDescription')}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddField}
                  className="inline-flex items-center"
                >
                  <PlusCircle size={16} className="mr-1.5" />
                  {t('events.form.addNewField')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </EventSection>
  );
};

export default AdditionalInfoSection; 