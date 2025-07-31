'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Keyboard, Volume2, Image as ImageIcon, Palette, Type, Navigation, FileText, AlertTriangle, UserCheck, Bath, HandHeart, Headphones, Brain, Dog, Building, BarChart3, TestTube, GraduationCap, BookOpen, Mail, Phone, FileEdit, ExternalLink } from 'lucide-react';

export default function AccessibilityContent() {
  const { t } = useLanguage();

  const features = [
    { id: 'keyboard', icon: Keyboard, color: 'from-[var(--sage-green)] to-emerald-500' },
    { id: 'screenReaders', icon: Volume2, color: 'from-[var(--cognac)] to-orange-500' },
    { id: 'altText', icon: ImageIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'contrast', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'text', icon: Type, color: 'from-indigo-500 to-purple-500' },
    { id: 'navigation', icon: Navigation, color: 'from-teal-500 to-cyan-500' },
    { id: 'forms', icon: FileText, color: 'from-orange-500 to-red-500' },
    { id: 'patterns', icon: AlertTriangle, color: 'from-red-500 to-pink-500' }
  ];

  const eventInfo = [
    { id: 'wheelchair', icon: UserCheck, color: 'from-[var(--sage-green)] to-emerald-500' },
    { id: 'restrooms', icon: Bath, color: 'from-[var(--cognac)] to-orange-500' },
    { id: 'interpretation', icon: HandHeart, color: 'from-blue-500 to-cyan-500' },
    { id: 'listening', icon: Headphones, color: 'from-purple-500 to-pink-500' },
    { id: 'sensory', icon: Brain, color: 'from-indigo-500 to-purple-500' },
    { id: 'service', icon: Dog, color: 'from-teal-500 to-cyan-500' },
    { id: 'venue', icon: Building, color: 'from-orange-500 to-red-500' }
  ];

  const improvements = [
    { id: 'audits', icon: BarChart3, color: 'from-[var(--sage-green)] to-emerald-500' },
    { id: 'testing', icon: TestTube, color: 'from-[var(--cognac)] to-orange-500' },
    { id: 'training', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
    { id: 'standards', icon: BookOpen, color: 'from-purple-500 to-pink-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <>
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-[var(--taupe)] to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
              >
                {t('accessibility.features.title')}
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-24 h-1 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] mx-auto mb-8"
              ></motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl max-w-4xl mx-auto text-[var(--black)]/80 leading-relaxed"
              >
                {t('accessibility.intro.paragraph')}
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature) => (
                <motion.div 
                  key={feature.id}
                  variants={itemVariants}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--black)] mb-2">
                        {t(`accessibility.features.${feature.id}.title`)}
                      </h3>
                      <p className="text-sm text-[var(--black)]/70 leading-relaxed">
                        {t(`accessibility.features.${feature.id}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Event Information Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--sage)] via-white to-[var(--taupe)] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-[var(--black)] mb-6">
                  {t('accessibility.eventInfo.title')}
                </h2>
                <p className="text-xl text-[var(--black)]/80 leading-relaxed mb-8">
                  {t('accessibility.eventInfo.description')}
                </p>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--sage)]/20">
                  <h3 className="text-xl font-semibold text-[var(--black)] mb-4">
                    {t('accessibility.eventInfo.commitment.title')}
                  </h3>
                  <p className="text-[var(--black)]/80 leading-relaxed">
                    {t('accessibility.eventInfo.commitment.description')}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1536560035542-1326fab3a507?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                    alt={t('accessibility.eventInfo.imageAlt')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                  />
                  
                  {/* Overlay with accessibility info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                      <h4 className="text-lg font-bold text-[var(--black)] mb-2">
                        {t('accessibility.eventInfo.overlay.title')}
                      </h4>
                      <p className="text-[var(--black)]/80 text-sm">
                        {t('accessibility.eventInfo.overlay.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {eventInfo.map((info) => (
                <motion.div 
                  key={info.id}
                  variants={itemVariants}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[var(--black)] font-medium leading-relaxed">
                        {t(`accessibility.eventInfo.${info.id}`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Improvements Section */}
      <section className="py-20 bg-gradient-to-br from-white via-[var(--taupe)] to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
              >
                {t('accessibility.improvements.title')}
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-24 h-1 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] mx-auto mb-8"
              ></motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl max-w-4xl mx-auto text-[var(--black)]/80 leading-relaxed"
              >
                {t('accessibility.improvements.description')}
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {improvements.map((item) => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--black)] text-xl mb-3">
                        {t(`accessibility.improvements.${item.id}.title`)}
                      </h3>
                      <p className="text-[var(--black)]/80 leading-relaxed">
                        {t(`accessibility.improvements.${item.id}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Feedback Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--sage)] via-white to-[var(--taupe)] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[var(--sage)]/20"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-8 text-center"
              >
                {t('accessibility.feedback.title')}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-[var(--black)]/80 mb-8 text-center leading-relaxed"
              >
                {t('accessibility.feedback.description')}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 p-4 bg-[var(--taupe)]/50 rounded-2xl">
                  <div className="p-3 bg-gradient-to-br from-[var(--sage-green)] to-emerald-500 rounded-xl">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[var(--black)] font-semibold">
                      {t('accessibility.feedback.email')}:
                    </p>
                    <a href="mailto:accessibility@zafo.com" className="text-[var(--sage-green)] hover:underline font-medium">
                      accessibility@zafo.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-[var(--taupe)]/50 rounded-2xl">
                  <div className="p-3 bg-gradient-to-br from-[var(--cognac)] to-orange-500 rounded-xl">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[var(--black)] font-semibold">
                      {t('accessibility.feedback.phone')}:
                    </p>
                    <a href="tel:+18005550123" className="text-[var(--sage-green)] hover:underline font-medium">
                      +1 (800) 555-0123
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-[var(--taupe)]/50 rounded-2xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <FileEdit size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[var(--black)] font-semibold">
                      {t('accessibility.feedback.form')}:
                    </p>
                    <Link href="/contact" className="text-[var(--sage-green)] hover:underline font-medium">
                      {t('accessibility.feedback.contactLink')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-[var(--black)]/70 italic mb-8">
                {t('accessibility.statement.updated')}: {t('accessibility.statement.date')}
              </p>
              
              <div className="flex justify-center">
                <a 
                  href="https://www.w3.org/WAI/WCAG21/quickref/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--sage-green)] to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t('accessibility.statement.learnMore')}
                  <ExternalLink size={20} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
} 