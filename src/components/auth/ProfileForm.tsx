'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';

// Profile form validation schema
const getProfileSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(1, t('auth.firstNameRequired')),
  lastName: z.string().min(1, t('auth.lastNameRequired'))
});

// Profile form data type
type ProfileFormData = z.infer<ReturnType<typeof getProfileSchema>>;

const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const profileSchema = getProfileSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccess(null);

    try {
      const response = await updateProfile(data);

      if (response.success) {
        setSuccess(t('auth.profileUpdated'));
      } else {
        setServerError(response.message || 'Profile update failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {serverError}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <Input
          label={t('auth.email')}
          value={user?.email || ''}
          disabled
          fullWidth
          helperText={t('auth.emailCannotBeChanged')}
        />

        <Input
          label={t('auth.firstName')}
          fullWidth
          error={errors.firstName?.message}
          {...register('firstName')}
        />

        <Input
          label={t('auth.lastName')}
          fullWidth
          error={errors.lastName?.message}
          {...register('lastName')}
        />

        <div className="mt-2">
          <div className="text-sm text-black mb-2">
            {t('auth.userRole')}: <span className="font-medium capitalize">{user?.role}</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting || !isDirty}
        >
          {t('profile.updateProfile')}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm; 