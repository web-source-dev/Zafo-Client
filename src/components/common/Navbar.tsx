'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';
import Button from '../ui/Button';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-[var(--sage-green)]">
                {t('common.appName')}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-[var(--sage-green)] hover:border-[var(--sage)]"
              >
                {t('common.home')}
              </Link>

              {isAuthenticated && (
                <Link 
                  href="/profile" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-[var(--sage-green)] hover:border-[var(--sage)]"
                >
                  {t('common.profile')}
                </Link>
              )}

              {isOrganizer && !isAdmin && (
                <Link 
                  href="/organizer" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-[var(--sage-green)] hover:border-[var(--sage)]"
                >
                  {t('organizer.dashboard')}
                </Link>
              )}

              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-[var(--sage-green)] hover:border-[var(--sage)]"
                >
                  {t('admin.dashboard')}
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons and Language Switcher */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <LanguageSwitcher variant="minimal" />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-black">
                  Hi, {user?.firstName}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    {t('common.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <LanguageSwitcher variant="minimal" className="mr-2" />
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--sage-green)]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
            >
              {t('common.home')}
            </Link>

            {isAuthenticated && (
              <>
                <Link 
                  href="/profile" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
                >
                  {t('common.profile')}
                </Link>

                {isOrganizer && (
                  <Link 
                    href="/organizer" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
                  >
                    {t('organizer.dashboard')}
                  </Link>
                )}

                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
                  >
                    {t('admin.dashboard')}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
                >
                  {t('common.logout')}
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link 
                  href="/login" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
                >
                  {t('common.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:text-[var(--sage-green)] hover:bg-[#f2f3ed] hover:border-[var(--sage)]"
                >
                  {t('common.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 