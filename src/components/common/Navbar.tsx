'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../auth/auth-context';
import { useLanguage } from '../../i18n/language-context';
import Button from '../ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  Calendar, 
  Settings, 
  ChevronDown,
  BookOpen,
  Info,
  Contact,
  Crown,
  Users,
  BarChart3,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsDropdownOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
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

  // Get role display name
  const getRoleDisplayName = () => {
    if (isAdmin) return t('role.admin') || 'Administrator';
    if (isOrganizer) return t('role.organizer') || 'Organizer';
    return t('role.user') || 'User';
  };

  // Get role icon
  const getRoleIcon = () => {
    if (isAdmin) return <Crown size={16} className="text-yellow-600" />;
    if (isOrganizer) return <Users size={16} className="text-blue-600" />;
    return <User size={16} className="text-gray-600" />;
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

            <Link 
              href="/about" 
              className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/about')}`}
            >
              <div className="flex items-center space-x-2">
                <Info size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/about') ? 'text-[var(--sage-green)]' : ''}`} />
                <span>About</span>
              </div>
            </Link>

            <Link 
              href="/blog" 
              className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/blog')}`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/blog') ? 'text-[var(--sage-green)]' : ''}`} />
                <span>Blog</span>
              </div>
            </Link>

            <Link 
              href="/contact" 
              className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${getActiveStyles('/contact')}`}
            >
              <div className="flex items-center space-x-2">
                <Contact size={16} className={`group-hover:scale-110 transition-transform ${isActiveLink('/contact') ? 'text-[var(--sage-green)]' : ''}`} />
                <span>Contact</span>
              </div>
            </Link>

            </div>
              
          {/* Desktop Auth Buttons and Language Switcher */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <LanguageSwitcher variant="minimal" />
            
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 bg-[var(--sage)]/10 px-4 py-2 rounded-lg hover:bg-[var(--sage)]/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[var(--black)]">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      {getRoleIcon()}
                      <span>{getRoleDisplayName()}</span>
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user?.firstName?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[var(--black)]">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-sm text-gray-600 truncate">{user?.email}</div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            {getRoleIcon()}
                            <span>{getRoleDisplayName()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                                         {/* Menu Items */}
                     <div className="py-1">
                       {isAdmin && (
                         <button
                           onClick={() => handleNavigation('/admin')}
                           className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                         >
                           <Settings size={16} />
                           <span>{t('admin.dashboard')}</span>
                         </button>
                       )}

                       {isOrganizer && !isAdmin && (
                         <button
                           onClick={() => handleNavigation('/organizer')}
                           className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                         >
                           <Settings size={16} />
                           <span>{t('organizer.dashboard')}</span>
                         </button>
                       )}

                       {!isOrganizer && !isAdmin && (
                         <button
                           onClick={() => handleNavigation('/dashboard')}
                           className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                         >
                           <BarChart3 size={16} />
                           <span>{t('common.dashboard')}</span>
                         </button>
                       )}

                       <div className="border-t border-gray-100 my-1"></div>

                       <button
                         onClick={handleLogout}
                         className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                       >
                         <LogOut size={16} />
                         <span>{t('common.logout')}</span>
                       </button>
                     </div>
                  </div>
                )}
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

          <Link 
            href="/about" 
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/about') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Info size={20} className={isActiveLink('/about') ? 'text-[var(--sage-green)]' : ''} />
            <span>About</span>
          </Link>

          <Link 
            href="/blog" 
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/blog') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <BookOpen size={20} className={isActiveLink('/blog') ? 'text-[var(--sage-green)]' : ''} />
            <span>Blog</span>
          </Link>

          <Link 
            href="/contact" 
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/contact') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Contact size={20} className={isActiveLink('/contact') ? 'text-[var(--sage-green)]' : ''} />
            <span>Contact</span>
          </Link>

          {isAuthenticated && (
            <>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--black)]">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      {getRoleIcon()}
                      <span>{getRoleDisplayName()}</span>
                    </div>
                  </div>
                </div>
              </div>
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

              {!isOrganizer && !isAdmin && (
                <Link 
                  href="/dashboard" 
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 ${isActiveLink('/dashboard') ? 'text-[var(--sage-green)] border-b-2 border-[var(--sage-green)]' : 'text-[var(--black)] hover:text-[var(--sage-green)] hover:bg-[var(--sage)]/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 size={20} className={isActiveLink('/dashboard') ? 'text-[var(--sage-green)]' : ''} />
                  <span>{t('common.dashboard')}</span>
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