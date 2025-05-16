'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../i18n/language-context';
import LanguageSwitcher from './LanguageSwitcher';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '/about' },
        { name: t('footer.contact'), href: '/contact' },
        { name: t('footer.accessibility'), href: '/accessibility' },
        { name: t('footer.impact'), href: '/impact' },
        { name: t('footer.investors'), href: '/investors' },
        { name: t('footer.plans'), href: '/plans' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { name: t('footer.help'), href: '/help' },
        { name: t('footer.faq'), href: '/faq' },
        { name: t('footer.legal'), href: '/legal' },

      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { name: t('footer.blog'), href: '/blog' },
        { name: t('footer.privacy'), href: '/privacy' },
        { name: t('footer.terms'), href: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '/icons/facebook.svg', href: 'https://facebook.com' },
    { name: 'Twitter', icon: '/icons/twitter.svg', href: 'https://twitter.com' },
    { name: 'Instagram', icon: '/icons/instagram.svg', href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: '/icons/linkedin.svg', href: 'https://linkedin.com' },
    { name: 'YouTube', icon: '/icons/youtube.svg', href: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt={t('common.appName')} 
                width={150} 
                height={45} 
                className="h-10 w-auto" 
              />
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              {t('footer.description')}
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[var(--sage-green)] transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <Image 
                    src={social.icon} 
                    alt={social.name} 
                    width={24} 
                    height={24} 
                    className="h-6 w-6" 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 hover:text-[var(--sage-green)] text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} {t('common.appName')}. {t('footer.copyright')}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <LanguageSwitcher variant="minimal" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 