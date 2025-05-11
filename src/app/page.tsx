'use client';

import Navbar from '../components/common/Navbar';
import { useAuth } from '../auth/auth-context';
import { useLanguage } from '../i18n/language-context';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen bg-[var(--taupe)]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[var(--sage-green)] sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t('home.welcome')}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-black">
            {t('home.subheading')}
          </p>
        </div>

        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-[var(--sage-green)]">
              {t('home.features')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-black">
              {t('home.featuresSubheading')}
            </p>
          </div>
          <div className="border-t border-[var(--cognac)]">
            <dl>
              <div className="bg-[var(--taupe)] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--sage-green)]">{t('home.userRoles')}</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {t('home.userRolesDescription')}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--sage-green)]">{t('home.jwtAuth')}</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {t('home.jwtAuthDescription')}
                </dd>
              </div>
              <div className="bg-[var(--taupe)] px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--sage-green)]">{t('home.protectedRoutes')}</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {t('home.protectedRoutesDescription')}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--sage-green)]">{t('home.formValidation')}</dt>
                <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                  {t('home.formValidationDescription')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {isAuthenticated && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--sage-green)]">
              {t('home.welcomeBack', { name: user?.firstName || '' })}
            </h2>
            <p className="mt-2 text-black">
              {t('home.loggedInAs', { role: user?.role || '' })}
            </p>
            <div className="mt-6 inline-block">
              <a
                href="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--sage-green)] hover:bg-[#424b3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--sage-green)]"
              >
                {t('home.viewProfile')}
              </a>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-8 text-center">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--sage-green)] hover:bg-[#424b3c]"
              >
                {t('common.signIn')}
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[var(--sage-green)] bg-white hover:bg-[#f2f3ed]"
              >
                {t('common.register')}
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
