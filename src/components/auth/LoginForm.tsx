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

// Login form validation schema
const getLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.emailRequired')),
  password: z.string().min(6, t('auth.passwordRequired'))
});

// Login form data type
type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;

interface LoginFormProps {
  redirectUrl?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectUrl = '/' }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginSchema = getLoginSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await login(data);

      if (response.success) {
        router.push(redirectUrl);
      } else {
        setServerError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('auth.signInAccount') || 'Sign In to Your Account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.signInDescription') || 'Welcome back! Please sign in to your account.'}
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
            fullWidth
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="flex items-center justify-end">
          <a href="/forgot-password" className="text-sm text-[var(--sage-green)] hover:text-[#424b3c] transition-colors">
            {t('auth.forgotPassword') || 'Forgot Password?'}
          </a>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (t('auth.signingIn') || 'Signing In...') 
            : (t('common.signIn') || 'Sign In')
          }
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('auth.noAccount') || "Don't have an account?"}{' '}
          <a href="/register" className="font-medium text-[var(--sage-green)] hover:text-[#424b3c] transition-colors">
            {t('common.signUp') || 'Sign Up'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 