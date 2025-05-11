'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TagIcon } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import EventSection from './EventSection';
import Input from '../../ui/Input';
import Textarea from '../../ui/textarea';
import { EventFormData } from '../EventFormTypes';

interface BasicInfoSectionProps {
  defaultOpen?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ defaultOpen = false }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(defaultOpen);
  const { register, watch, formState: { errors } } = useFormContext<EventFormData>();
  
  const title = watch('title');
  const smallDescription = watch('smallDescription');
  const category = watch('category');
  
  const isEmpty = !title && !smallDescription && !category;
  const isCompleted = !!title && !!smallDescription && !!category;
  
  // Toggle edit mode without saving data
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const getCategoryLabel = (categoryValue: string): string => {
    const categories: Record<string, string> = {
      'conference': t('events.categories.conference'),
      'workshop': t('events.categories.workshop'),
      'seminar': t('events.categories.seminar'),
      'networking': t('events.categories.networking'),
      'social': t('events.categories.social'),
      'other': t('events.categories.other')
    };
    
    return categories[categoryValue] || categoryValue;
  };
  
  return (
    <EventSection
      title={t('events.basicInfo')}
      isEditing={isEditing}
      isEmpty={isEmpty}
      isCompleted={isCompleted}
      onEditToggle={handleEditToggle}
      preview={
        <div className="space-y-4">
          {title && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.title')}</h4>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
          )}
          
          {smallDescription && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.smallDescription')}</h4>
              <p className="text-base whitespace-pre-line">{smallDescription}</p>
            </div>
          )}
          
          {category && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">{t('events.form.category')}</h4>
              <div className="flex items-center mt-1">
                <TagIcon size={16} className="mr-1.5 text-[var(--sage-green)]" />
                <span className="text-base">{getCategoryLabel(category)}</span>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Input
            label={t('events.form.title')}
            {...register('title', { required: true })}
            error={errors.title ? t('events.validation.titleRequired') : undefined}
            fullWidth
          />
        </div>
        
        <div>
          <Textarea
            label={t('events.form.smallDescription')}
            {...register('smallDescription', { required: true })}
            error={errors.smallDescription ? t('events.validation.descriptionRequired') : undefined}
            rows={4}
            fullWidth
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            {t('events.form.category')}
          </label>
          <select
            {...register('category', { required: true })}
            className="border border-[var(--cognac)] rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-[rgba(83,94,75,0.2)] focus:border-[var(--sage-green)]"
          >
            <option value="">{t('common.select')}</option>
            <option value="conference">{t('events.categories.conference')}</option>
            <option value="workshop">{t('events.categories.workshop')}</option>
            <option value="seminar">{t('events.categories.seminar')}</option>
            <option value="networking">{t('events.categories.networking')}</option>
            <option value="social">{t('events.categories.social')}</option>
            <option value="other">{t('events.categories.other')}</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{t('events.validation.categoryRequired')}</p>
          )}
        </div>
      </div>
    </EventSection>
  );
};

export default BasicInfoSection; 