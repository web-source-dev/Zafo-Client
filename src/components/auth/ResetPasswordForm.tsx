'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n/language-context';
import authService from '@/services/auth-service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage({ type: 'error', text: t('auth.invalidResetToken') || 'Invalid reset token' });
      return;
    }

    if (!formData.newPassword) {
      setMessage({ type: 'error', text: t('auth.newPasswordRequired') || 'New password is required' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('auth.passwordMinLength') || 'Password must be at least 6 characters' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t('auth.passwordsDoNotMatch') || 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await authService.resetPassword(token, formData.newPassword);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: t('auth.resetPasswordSuccess') || 'Password reset successfully! Redirecting to login...' 
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: response.message || t('auth.resetPasswordError') || 'Failed to reset password' 
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ 
        type: 'error', 
        text: t('auth.resetPasswordError') || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.invalidResetLink') || 'Invalid Reset Link'}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('auth.invalidResetLinkDescription') || 'This password reset link is invalid or has expired.'}
          </p>
          <Link 
            href="/forgot-password" 
            className="inline-flex items-center text-sm text-[var(--sage-green)] hover:text-[#424b3c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('auth.requestNewReset') || 'Request New Reset Link'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--sage-green)]/10 mb-4">
          <Lock className="h-6 w-6 text-[var(--sage-green)]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('auth.resetPassword') || 'Reset Password'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.resetPasswordDescription') || 'Enter your new password below.'}
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.newPassword') || 'New Password'}
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder={t('auth.newPasswordPlaceholder') || 'Enter your new password'}
              required
              disabled={isLoading}
              fullWidth
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.confirmPassword') || 'Confirm Password'}
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your new password'}
              required
              disabled={isLoading}
              fullWidth
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading 
            ? (t('auth.resetting') || 'Resetting...') 
            : (t('auth.resetPassword') || 'Reset Password')
          }
        </Button>
      </form>

      <div className="text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm text-[var(--sage-green)] hover:text-[#424b3c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('auth.backToLogin') || 'Back to Login'}
        </Link>
      </div>
    </div>
  );
} 