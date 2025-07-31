'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';
import Button from '../ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, User, LogOut, Home, Calendar, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Helper function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Helper function to get active styles
  const getActiveStyles = (href: string) => {
    const isActive = isActiveLink(href);
    return isActive 
      ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' 
      : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10';
  };

  return (
    <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold text-[var(--black)] group-hover:text-[var(--sage-green)] transition-colors">
                {t('common.appName')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <Link 
              href="/" 
              className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/')}`}
            >
              <div className="flex items-center space-x-2">
                <Home size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/') ? 'text-[var(--sage-green)]' : ''}`} />
                <span>{t('common.home')}</span>
              </div>
            </Link>

            <Link 
              href="/events" 
              className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/events')}`}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/events') ? 'text-[var(--sage-green)]' : ''}`} />
                <span>Events</span>
              </div>
            </Link>

            {isAuthenticated && !isOrganizer && !isAdmin && (
              <Link 
                href="/dashboard" 
                className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/dashboard')}`}
              >
                <div className="flex items-center space-x-2">
                  <Settings size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/dashboard') ? 'text-[var(--sage-green)]' : ''}`} />
                  <span>{t('common.dashboard')}</span>
                </div>
              </Link>
            )}
            
            {isOrganizer && !isAdmin && (
              <Link 
                href="/organizer" 
                className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/organizer')}`}
              >
                <div className="flex items-center space-x-2">
                  <Settings size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/organizer') ? 'text-[var(--sage-green)]' : ''}`} />
                  <span>{t('organizer.dashboard')}</span>
                </div>
              </Link>
            )}

            {isAdmin && (
              <Link 
                href="/admin" 
                className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/admin')}`}
              >
                <div className="flex items-center space-x-2">
                  <Settings size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/admin') ? 'text-[var(--sage-green)]' : ''}`} />
                  <span>{t('admin.dashboard')}</span>
                </div>
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons and Language Switcher */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <LanguageSwitcher variant="minimal" />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[var(--sage)]/10 px-3 py-2 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--black)]">
                    Hi, {user?.firstName}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut size={14} />
                  <span>{t('common.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hover:bg-[var(--sage)]/10 transition-all duration-200">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    {t('common.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <LanguageSwitcher variant="minimal" className="mr-3" />
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:ring-offset-2 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <Menu size={24} className="transform transition-transform duration-200" />
              ) : (
                <X size={24} className="transform transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white border-t border-[var(--sage)]/20">
          <Link 
            href="/" 
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={20} className={isActiveLink('/') ? 'text-[var(--sage-green)]' : ''} />
            <span>{t('common.home')}</span>
          </Link>

          <Link 
            href="/events" 
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/events') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Calendar size={20} className={isActiveLink('/events') ? 'text-[var(--sage-green)]' : ''} />
            <span>Events</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                href="/profile" 
                className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/profile') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} className={isActiveLink('/profile') ? 'text-[var(--sage-green)]' : ''} />
                <span>{t('common.profile')}</span>
              </Link>

              {isOrganizer && (
                <Link 
                  href="/organizer" 
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/organizer') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={20} className={isActiveLink('/organizer') ? 'text-[var(--sage-green)]' : ''} />
                  <span>{t('organizer.dashboard')}</span>
                </Link>
              )}

              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/admin') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={20} className={isActiveLink('/admin') ? 'text-[var(--sage-green)]' : ''} />
                  <span>{t('admin.dashboard')}</span>
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut size={20} />
                <span>{t('common.logout')}</span>
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div className="pt-4 space-y-3">
              <Link 
                href="/login" 
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-base font-medium text-[var(--black)] border border-[var(--sage)] hover:bg-[var(--sage)]/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.login')}
              </Link>
              <Link 
                href="/register" 
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 