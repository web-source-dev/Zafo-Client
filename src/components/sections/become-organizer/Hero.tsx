'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

export default function BecomeOrganizerHero() {
  const { t } = useLanguage();
  
  const stats = [
    { icon: Users, value: '10,000+', label: 'becomeOrganizer.hero.stats.organizers' },
    { icon: Calendar, value: '50,000+', label: 'becomeOrganizer.hero.stats.events' },
    { icon: DollarSign, value: '2M+', label: 'becomeOrganizer.hero.stats.revenue' },
    { icon: TrendingUp, value: '99%', label: 'becomeOrganizer.hero.stats.satisfaction' }
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
                {t('becomeOrganizer.hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--black)] mb-6 leading-tight"
            >
              {t('becomeOrganizer.hero.title')}
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
              {t('becomeOrganizer.hero.description')}
            </motion.p>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
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
                  <div className="text-2xl font-bold text-[var(--black)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--black)]/70 font-medium">
                    {t(stat.label)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 