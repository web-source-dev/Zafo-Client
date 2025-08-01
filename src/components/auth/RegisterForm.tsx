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

type AccountType = 'user' | 'organizer';

const RegisterForm: React.FC<RegisterFormProps> = ({ redirectUrl = '/login' }) => {
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('user');

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

    // Remove confirmPassword from data sent to API and add role
    const { confirmPassword, ...registerData } = data;
    const userData = {
      ...registerData,
      role: accountType
    };

    try {
      const response = await registerUser(userData);

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
    <div className="space-y-6">
      {/* Account Type Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setAccountType('user')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            accountType === 'user'
              ? 'bg-white text-[var(--sage-green)] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('auth.userAccount') || 'User Account'}
        </button>
        <button
          type="button"
          onClick={() => setAccountType('organizer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            accountType === 'organizer'
              ? 'bg-white text-[var(--sage-green)] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {t('auth.organizerAccount') || 'Organizer Account'}
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {accountType === 'user' 
            ? (t('auth.createUserAccount') || 'Create User Account')
            : (t('auth.createOrganizerAccount') || 'Create Organizer Account')
          }
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {accountType === 'user'
            ? (t('auth.createUserAccountDescription') || 'Join us and start exploring amazing events!')
            : (t('auth.createOrganizerAccountDescription') || 'Start creating and managing your own events!')
          }
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="text-sm">{serverError}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <p className="text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.firstName') || 'First Name'}
            </label>
            <Input
              id="firstName"
              placeholder={t('auth.firstNamePlaceholder') || 'Enter your first name'}
              fullWidth
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.lastName') || 'Last Name'}
            </label>
            <Input
              id="lastName"
              placeholder={t('auth.lastNamePlaceholder') || 'Enter your last name'}
              fullWidth
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.email') || 'Email Address'}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.emailPlaceholder') || 'Enter your email address'}
            fullWidth
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.password') || 'Password'}
          </label>
          <Input
            id="password"
            type="password"
            placeholder={t('auth.passwordPlaceholder') || 'Create a password'}
            fullWidth
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.confirmPassword') || 'Confirm Password'}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your password'}
            fullWidth
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (t('auth.creatingAccount') || 'Creating Account...') 
            : (t('common.signUp') || 'Sign Up')
          }
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('auth.haveAccount') || 'Already have an account?'}{' '}
          <a href="/login" className="font-medium text-[var(--sage-green)] hover:text-[#424b3c] transition-colors">
            {t('common.signIn') || 'Sign In'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 