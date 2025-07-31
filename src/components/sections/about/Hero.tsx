'use client';

import Image from 'next/image';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Sparkles, Users, Calendar, MapPin, Star } from 'lucide-react';

export default function AboutHero() {
  const { t } = useLanguage();
  
  const stats = [
    { icon: Users, value: '50K+', label: 'about.hero.stats.users' },
    { icon: Calendar, value: '10K+', label: 'about.hero.stats.events' },
    { icon: MapPin, value: '500+', label: 'about.hero.stats.cities' },
    { icon: Star, value: '4.9', label: 'about.hero.stats.rating' }
  ];
  
  return (
    <section className="relative bg-gradient-to-br from-[var(--taupe)] via-white to-[var(--sage)] py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--sage-green)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--cognac)]/10 rounded-full blur-3xl"></div>
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
              <Sparkles size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('about.hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--black)] mb-6 leading-tight"
            >
            {t('about.hero.title')}
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
            {t('about.hero.description')}
            </motion.p>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <stat.icon size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[var(--black)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--black)]/70 font-medium">
                    {t(stat.label)}
                  </div>
        </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Hero Image Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt={t('about.hero.imageAlt')}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
          />
              
              {/* Overlay with content */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--black)] mb-4">
                    {t('about.hero.visionTitle')}
                  </h3>
                  <p className="text-[var(--black)]/80 text-lg leading-relaxed">
                    {t('about.hero.visionDescription')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-[var(--sage)]/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[var(--sage-green)] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-[var(--black)]">
                  {t('about.hero.liveIndicator')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 