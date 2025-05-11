'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';

// Registration form validation schema
const getRegisterSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(1, t('auth.firstNameRequired')),
  lastName: z.string().min(1, t('auth.lastNameRequired')),
  email: z.string().email(t('auth.emailRequired')),
  password: z.string().min(6, t('auth.passwordRequired')),
  confirmPassword: z.string().min(6, t('auth.passwordRequired'))
})
.refine((data) => data.password === data.confirmPassword, {
  message: t('auth.passwordsNotMatch'),
  path: ['confirmPassword']
});

// Registration form data type
type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;

interface RegisterFormProps {
  redirectUrl?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ redirectUrl = '/login' }) => {
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerSchema = getRegisterSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccess(null);

    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...registerData } = data;

    try {
      const response = await registerUser(registerData);

      if (response.success) {
        setSuccess(t('auth.registrationSuccess'));
        // Redirect after a short delay
        setTimeout(() => {
          router.push(redirectUrl);
        }, 2000);
      } else {
        setServerError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
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

        <div className="flex space-x-4">
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
        </div>

        <Input
          label={t('auth.email')}
          type="email"
          fullWidth
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('auth.password')}
          type="password"
          fullWidth
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label={t('auth.confirmPassword')}
          type="password"
          fullWidth
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {t('common.signUp')}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            {t('auth.haveAccount')}{' '}
            <a href="/login" className="text-[var(--sage-green)] hover:text-[#424b3c] font-medium">
              {t('common.signIn')}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 