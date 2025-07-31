'use client';

import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Accessibility, Heart, Users, Shield } from 'lucide-react';

export default function AccessibilityHero() {
  const { t } = useLanguage();
  
  const accessibilityStats = [
    {
      icon: Users,
      value: '100%',
      label: 'accessibility.hero.stats.inclusive',
      color: 'from-[var(--sage-green)] to-emerald-500'
    },
    {
      icon: Shield,
      value: 'WCAG 2.1',
      label: 'accessibility.hero.stats.compliant',
      color: 'from-[var(--cognac)] to-orange-500'
    },
    {
      icon: Heart,
      value: '24/7',
      label: 'accessibility.hero.stats.support',
      color: 'from-blue-500 to-cyan-500'
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
              <Accessibility size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('accessibility.hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--black)] mb-6 leading-tight"
            >
              {t('accessibility.hero.title')}
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
              {t('accessibility.hero.description')}
            </motion.p>
          </motion.div>
          
          {/* Accessibility Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {accessibilityStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--black)] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--black)]/70 font-medium">
                      {t(stat.label)}
                    </div>
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
                  {t('accessibility.hero.subtitle')}
                </h2>
                <div className="space-y-6 text-lg text-[var(--black)]/80 leading-relaxed">
                  <p>{t('accessibility.hero.paragraph1')}</p>
                  <p>{t('accessibility.hero.paragraph2')}</p>
                </div>
              </div>
              
              {/* Commitment Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--sage)]/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[var(--sage-green)] to-emerald-500 rounded-lg">
                      <Heart size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-[var(--black)]">
                      {t('accessibility.hero.commitment.title')}
                    </h3>
                  </div>
                  <p className="text-[var(--black)]/80">
                    {t('accessibility.hero.commitment.description')}
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--sage)]/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[var(--cognac)] to-orange-500 rounded-lg">
                      <Shield size={20} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-[var(--black)]">
                      {t('accessibility.hero.standards.title')}
                    </h3>
                  </div>
                  <p className="text-[var(--black)]/80">
                    {t('accessibility.hero.standards.description')}
                  </p>
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
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt={t('accessibility.hero.imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
                
                {/* Overlay with accessibility info */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h4 className="text-xl font-bold text-[var(--black)] mb-3">
                      {t('accessibility.hero.ctaTitle')}
                    </h4>
                    <p className="text-[var(--black)]/80 text-lg leading-relaxed mb-4">
                      {t('accessibility.hero.ctaDescription')}
                    </p>
                    <div className="flex items-center gap-2 text-[var(--sage-green)] font-semibold">
                      <Accessibility size={20} />
                      <span>{t('accessibility.hero.ctaButton')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-[var(--sage)]/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[var(--sage-green)] rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-[var(--black)]">
                    {t('accessibility.hero.complianceBadge')}
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