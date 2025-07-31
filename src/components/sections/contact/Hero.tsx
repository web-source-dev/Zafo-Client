'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactHero() {
  const { t } = useLanguage();
  
  const contactMethods = [
    {
      icon: Mail,
      label: 'contact.hero.email',
      value: 'info@zafo.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      label: 'contact.hero.phone',
      value: '+1 (800) 555-0123',
      color: 'from-[var(--sage-green)] to-emerald-500'
    },
    {
      icon: MapPin,
      label: 'contact.hero.location',
      value: 'San Francisco, CA',
      color: 'from-[var(--cognac)] to-orange-500'
    }
  ];
  
  return (
    <section className="bg-gradient-to-br from-[var(--taupe)] via-white to-[var(--sage)] py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--sage-green)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--cognac)]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[var(--sage-green)]/5 to-[var(--cognac)]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <MessageCircle size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('contact.hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--black)] mb-6 leading-tight"
            >
              {t('contact.hero.title')}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] mx-auto mb-8"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl md:text-2xl max-w-4xl mx-auto text-[var(--black)]/80 leading-relaxed mb-12"
            >
              {t('contact.hero.description')}
            </motion.p>
          </motion.div>
          
          {/* Contact Methods */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${method.color} group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--black)]/60 font-medium">
                      {t(method.label)}
                    </p>
                    <p className="text-lg font-semibold text-[var(--black)]">
                      {method.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-[var(--black)] mb-6">
                  {t('contact.hero.subtitle')}
                </h2>
                <div className="space-y-6 text-lg text-[var(--black)]/80 leading-relaxed">
                  <p>{t('contact.hero.paragraph1')}</p>
                  <p>{t('contact.hero.paragraph2')}</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--sage)]/20">
                  <div className="text-3xl font-bold text-[var(--sage-green)] mb-2">24/7</div>
                  <div className="text-sm text-[var(--black)]/70 font-medium">
                    {t('contact.hero.supportHours')}
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--sage)]/20">
                  <div className="text-3xl font-bold text-[var(--cognac)] mb-2">&lt;2h</div>
                  <div className="text-sm text-[var(--black)]/70 font-medium">
                    {t('contact.hero.responseTime')}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1470&auto=format&fit=crop"
                  alt={t('contact.hero.imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
                
                {/* Overlay with contact info */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h4 className="text-xl font-bold text-[var(--black)] mb-3">
                      {t('contact.hero.ctaTitle')}
                    </h4>
                    <p className="text-[var(--black)]/80 text-lg leading-relaxed mb-4">
                      {t('contact.hero.ctaDescription')}
                    </p>
                    <div className="flex items-center gap-2 text-[var(--sage-green)] font-semibold">
                      <MessageCircle size={20} />
                      <span>{t('contact.hero.ctaButton')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-[var(--sage)]/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[var(--sage-green)] rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-[var(--black)]">
                    {t('contact.hero.liveIndicator')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 