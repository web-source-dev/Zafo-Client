'use client';

import { useLanguage } from '@/i18n/language-context';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Globe, Shield, Award, Users, Zap, Star } from 'lucide-react';

export default function AboutValues() {
  const { t } = useLanguage();

  const valueCards = [
    {
      id: 'innovation',
      icon: Zap,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'community',
      icon: Heart,
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
      color: 'from-[var(--cognac)] to-orange-500',
      gradient: 'from-[var(--cognac)]/20 to-orange-500/20'
    },
    {
      id: 'accessibility',
      icon: Globe,
      imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
      color: 'from-[var(--sage-green)] to-emerald-500',
      gradient: 'from-[var(--sage-green)]/20 to-emerald-500/20'
    },
    {
      id: 'experience',
      icon: Star,
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  const corePrinciples = [
    {
      icon: Shield,
      title: 'about.values.principle1.title',
      description: 'about.values.principle1.description'
    },
    {
      icon: Users,
      title: 'about.values.principle2.title',
      description: 'about.values.principle2.description'
    },
    {
      icon: Award,
      title: 'about.values.principle3.title',
      description: 'about.values.principle3.description'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--taupe)] via-white to-[var(--sage)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-72 h-72 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
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
              <Sparkles size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('about.values.badge')}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
            >
            {t('about.values.title')}
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] mx-auto mb-8"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl max-w-4xl mx-auto text-[var(--black)]/80 leading-relaxed"
            >
            {t('about.values.description')}
            </motion.p>
        </motion.div>
        
          {/* Core Values Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20"
        >
          {valueCards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-[var(--sage)]/20"
            >
                <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={card.imageUrl}
                  alt={t(`about.values.${card.id}.imageAlt`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} via-transparent to-transparent`}></div>
                  
                  {/* Icon overlay */}
                  <div className="absolute top-6 right-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon size={32} className="text-white" />
                    </div>
                  </div>
              </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[var(--black)] mb-4 group-hover:text-[var(--sage-green)] transition-colors">
                  {t(`about.values.${card.id}.title`)}
                </h3>
                  <p className="text-[var(--black)]/80 text-lg leading-relaxed">
                  {t(`about.values.${card.id}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

          {/* Core Principles Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--sage)]/20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[var(--black)] mb-4">
                  {t('about.values.principlesTitle')}
                </h3>
                <p className="text-xl text-[var(--black)]/80 max-w-3xl mx-auto">
                  {t('about.values.principlesDescription')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {corePrinciples.map((principle, index) => (
        <motion.div
                    key={index}
          initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="text-center group"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-br from-[var(--sage-green)] to-[var(--cognac)] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <principle.icon size={32} className="text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-[var(--black)] mb-3">
                      {t(principle.title)}
                    </h4>
                    <p className="text-[var(--black)]/80 leading-relaxed">
                      {t(principle.description)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Commitment Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-3xl p-8 md:p-12 text-white shadow-2xl"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center mb-6"
              >
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Award size={40} className="text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
            {t('about.values.commitment.title')}
          </h3>
              
              <div className="space-y-6 text-lg md:text-xl opacity-90 leading-relaxed">
                <p>{t('about.values.commitment.description1')}</p>
                <p>{t('about.values.commitment.description2')}</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-10"
              >
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <Star size={20} className="text-white mr-2" />
                  <span className="font-semibold">{t('about.values.commitment.badge')}</span>
                </div>
              </motion.div>
            </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
} 