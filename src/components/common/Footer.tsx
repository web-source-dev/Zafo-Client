'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../i18n/language-context';
import LanguageSwitcher from './LanguageSwitcher';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '/about' },
        { name: t('footer.contact'), href: '/contact' },
        { name: t('footer.blog'), href: '/blog' },
        { name: t('footer.faq'), href: '/faq' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { name: t('footer.accessibility'), href: '/accessibility' },
        { name: t('footer.privacy'), href: '/privacy' },
        { name: t('footer.terms'), href: '/terms' }, 
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-700' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="relative bg-[var(--taupe)] border-t border-[var(--sage)]/20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-2xl font-bold text-[var(--black)] group-hover:text-[var(--sage-green)] transition-colors">
                {t('common.appName')}
              </span>
            </Link>
            
            <p className="text-[var(--black)]/70 text-base leading-relaxed mb-8">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-[var(--black)]/70">
                <Mail size={16} className="text-[var(--sage-green)]" />
                <span className="text-sm">hello@zafo.com</span>
              </div>
              <div className="flex items-center space-x-3 text-[var(--black)]/70">
                <Phone size={16} className="text-[var(--sage-green)]" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-[var(--black)]/70">
                <MapPin size={16} className="text-[var(--sage-green)]" />
                <span className="text-sm">123 Event Street, City, Country</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 ${social.color}`}
                >
                  <social.icon size={18} className="text-[var(--black)]/60" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title} className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-[var(--black)] mb-6 relative">
                {column.title}
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)]"></div>
              </h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center text-[var(--black)]/70 hover:text-[var(--sage-green)] text-sm transition-all duration-200"
                    >
                      <ArrowRight size={12} className="mr-2 hidden group-hover:block transform group-hover:translate-x-1 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-[var(--sage)]/20 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6">
            <p className="text-[var(--black)]/60 text-sm">
              &copy; {currentYear} {t('common.appName')}. {t('footer.copyright')}
            </p>
            <div className="flex space-x-4 text-sm">
              <Link href="/privacy" className="text-[var(--black)]/60 hover:text-[var(--sage-green)] transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-[var(--black)]/60 hover:text-[var(--sage-green)] transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher variant="minimal" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 