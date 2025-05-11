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
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {serverError}
          </div>
        )}

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

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="/forgot-password" className="text-[var(--sage-green)] hover:text-[#424b3c]">
              {t('auth.forgotPassword')}
            </a>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {t('common.signIn')}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            {t('auth.noAccount')}{' '}
            <a href="/register" className="text-[var(--sage-green)] hover:text-[#424b3c] font-medium">
              {t('common.signUp')}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 