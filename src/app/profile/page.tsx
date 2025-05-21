'use client';

import React from 'react';
import ProfileForm from '../../components/auth/ProfileForm';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--taupe)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-[var(--sage-green)]">{t('profile.userProfile')}</h2>
            <p className="mt-1 max-w-2xl text-sm text-black">
              {t('profile.personalInfo')}
            </p>
          </div>
          <div className="border-t border-[var(--cognac)] px-4 py-5 sm:px-6">
            <ProfileForm />
          </div>
        </div>

        {/* Role-based information */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-[var(--sage-green)]">
              {t('profile.roleInfo')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-black">
              {t('profile.roleDetails')}
            </p>
          </div>
          <div className="border-t border-[var(--cognac)] px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-[var(--cognac)]">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--sage-green)]">{t('admin.role')}</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2 capitalize">
                  {user?.role}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--sage-green)]">{t('profile.permissions')}</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {user?.role === 'admin' && (
                    <div className="text-[var(--sage-green)]">
                      {t('profile.adminPermissions')}
                    </div>
                  )}
                  {user?.role === 'organizer' && (
                    <div className="text-[var(--sage-green)]">
                      {t('profile.organizerPermissions')}
                    </div>
                  )}
                  {user?.role === 'user' && (
                    <div>
                      {t('profile.userPermissions')}
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 