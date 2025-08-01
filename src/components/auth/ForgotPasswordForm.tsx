'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/i18n/language-context';
import authService from '@/services/auth-service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ForgotPasswordFormProps {
  redirectUrl?: string;
}

export default function ForgotPasswordForm({}: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: t('auth.emailRequired') || 'Email is required' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: t('auth.forgotPasswordSuccess') || 'Password reset email sent successfully. Please check your inbox.' 
        });
        setEmail('');
      } else {
        setMessage({ 
          type: 'error', 
          text: response.message || t('auth.forgotPasswordError') || 'Failed to send reset email' 
        });
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setMessage({ 
        type: 'error', 
        text: t('auth.forgotPasswordError') || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">

        <h2 className="text-2xl font-bold text-gray-900">
          {t('auth.forgotPassword') || 'Forgot Password'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.forgotPasswordDescription') || 'Enter your email address and we\'ll send you a link to reset your password.'}
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.email') || 'Email Address'}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder') || 'Enter your email address'}
            required
            disabled={isLoading}
            fullWidth
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading 
            ? (t('auth.sending') || 'Sending...') 
            : (t('auth.sendResetLink') || 'Send Reset Link')
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