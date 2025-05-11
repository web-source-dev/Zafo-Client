'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/language-context';
import { useAuth } from '../../../auth/auth-context';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Using the user data from context, with fallbacks
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '', // Default value since it might not exist on user
    notificationPreference: 'email', // Default value
    language: 'en' // Default value
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setIsSubmitting(true);
    
    // In a real app, you would update the user profile via API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--sage-green)]">
        {t('settings.title')}
      </h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t('settings.profile_information')}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.first_name')}
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.last_name')}
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.email')}
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.phone')}
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.notification_preference')}
                </label>
                <Select
                  name="notificationPreference"
                  value={formData.notificationPreference}
                  onChange={handleChange}
                  options={[
                    { value: 'email', label: t('settings.email') },
                    { value: 'sms', label: t('settings.sms') },
                    { value: 'both', label: t('settings.both') },
                    { value: 'none', label: t('settings.none') }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.language')}
                </label>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  options={[
                    { value: 'en', label: t('settings.english') },
                    { value: 'de', label: t('settings.german') }
                  ]}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {showSuccessMessage && (
                <div className="text-green-600 text-sm">
                  {t('settings.success_message')}
                </div>
              )}
              <div className="flex">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                >
                  {t('settings.cancel')}
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {t('settings.save')}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.security')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{t('settings.change_password')}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('settings.change_password_description')}
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                >
                  {t('settings.update_password')}
                </Button>
              </div>
              
              <div className="pt-4 border-t border-[var(--cognac)]">
                <h3 className="font-medium">{t('settings.two_factor')}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('settings.two_factor_description')}
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                >
                  {t('settings.enable_two_factor')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.danger_zone')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-medium text-red-600">{t('settings.delete_account')}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('settings.delete_account_description')}
                </p>
                <Button
                  variant="danger"
                  className="mt-3"
                >
                  {t('settings.delete_account')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 