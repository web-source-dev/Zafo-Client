'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Target, Heart, Globe, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function AboutMission() {
  const { t } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 * index,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const missionValues = [
    { 
      icon: Target, 
      title: 'about.mission.value1.title', 
      desc: 'about.mission.value1.description',
      color: 'from-[var(--sage-green)] to-emerald-500'
    },
    { 
      icon: Heart, 
      title: 'about.mission.value2.title', 
      desc: 'about.mission.value2.description',
      color: 'from-[var(--cognac)] to-orange-500'
    },
    { 
      icon: Globe, 
      title: 'about.mission.value3.title', 
      desc: 'about.mission.value3.description',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Lightbulb, 
      title: 'about.mission.value4.title', 
      desc: 'about.mission.value4.description',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const achievements = [
    'about.mission.achievement1',
    'about.mission.achievement2',
    'about.mission.achievement3',
    'about.mission.achievement4'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-[var(--taupe)] to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <Target size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('about.mission.badge')}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
          >
            {t('about.mission.title')}
          </motion.h2>
          
          <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] mx-auto mb-8"
            ></motion.div>
          </motion.div>
          
          {/* Mission Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Column - Mission Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold text-[var(--black)] mb-6">
                  {t('about.mission.subtitle')}
                </h3>
                <div className="space-y-6 text-lg text-[var(--black)]/80 leading-relaxed">
                  <p>{t('about.mission.paragraph1')}</p>
                  <p>{t('about.mission.paragraph2')}</p>
                </div>
              </div>
              
              {/* Achievements List */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--sage)]/20">
                <h4 className="text-xl font-semibold text-[var(--black)] mb-4">
                  {t('about.mission.achievementsTitle')}
                </h4>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle size={20} className="text-[var(--sage-green)] flex-shrink-0" />
                      <span className="text-[var(--black)]/80">{t(achievement)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Mission Image */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt={t('about.mission.imageAlt')}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
                
                {/* Overlay with mission statement */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/70 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                    <h4 className="text-xl font-bold text-[var(--black)] mb-3">
                      {t('about.mission.quoteTitle')}
                    </h4>
                    <p className="text-[var(--black)]/80 italic text-lg leading-relaxed">
                      "{t('about.mission.quote')}"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[var(--sage)]/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--sage-green)]">2020</div>
                  <div className="text-sm text-[var(--black)]/70">{t('about.mission.founded')}</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Mission Values Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {missionValues.map((value, index) => (
              <motion.div 
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${value.color} group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--black)] mb-4 group-hover:text-[var(--sage-green)] transition-colors">
                      {t(value.title)}
                    </h3>
                    <p className="text-[var(--black)]/80 text-lg leading-relaxed">
                  {t(value.desc)}
                </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">
                {t('about.mission.ctaTitle')}
              </h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                {t('about.mission.ctaDescription')}
              </p>
              <button className="inline-flex items-center bg-white text-[var(--sage-green)] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[var(--sage)] transition-all duration-200 transform hover:scale-105 shadow-lg">
                {t('about.mission.ctaButton')}
                <ArrowRight size={20} className="ml-2" />
              </button>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 