'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, Users } from 'lucide-react';

type ContentItem = {
  label: string;
  value: string;
  isTranslated?: boolean;
  isAddress?: boolean;
};

type ContactCard = {
  id: string;
  icon: React.ComponentType<{ size: number; className: string }>;
  title: string;
  content: ContentItem[];
  color: string;
  gradient: string;
};

export default function ContactInfo() {
  const { t } = useLanguage();

  const contactCards: ContactCard[] = [
    {
      id: 'email',
      icon: Mail,
      title: 'contact.info.emailUs',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      content: [
        { label: 'contact.info.generalInquiries', value: 'info@zafo.com' },
        { label: 'contact.info.supportInquiries', value: 'support@zafo.com' }
      ]
    },
    {
      id: 'phone',
      icon: Phone,
      title: 'contact.info.callUs',
      color: 'from-[var(--sage-green)] to-emerald-500',
      gradient: 'from-[var(--sage-green)]/20 to-emerald-500/20',
      content: [
        { label: 'contact.info.customerService', value: '+1 (800) 555-0123' },
        { label: 'contact.info.businessHours', value: 'contact.info.businessHoursValue', isTranslated: true }
      ]
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'contact.info.visitUs',
      color: 'from-[var(--cognac)] to-orange-500',
      gradient: 'from-[var(--cognac)]/20 to-orange-500/20',
      content: [
        { label: 'contact.info.headquarters', value: 'contact.info.address', isTranslated: true, isAddress: true }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
              <MessageSquare size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('contact.info.badge')}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
            >
              {t('contact.info.title')}
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
              {t('contact.info.description')}
            </motion.p>
          </motion.div>
          
          {/* Contact Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {contactCards.map((card) => (
              <motion.div 
                key={card.id} 
                variants={itemVariants}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-[var(--sage)]/20"
                whileHover={{ 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Header with gradient */}
                <div className={`h-32 bg-gradient-to-br ${card.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-6 right-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon size={32} className="text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[var(--black)] mb-6 group-hover:text-[var(--sage-green)] transition-colors">
                    {t(card.title)}
                  </h3>

                  <div className="space-y-6">
                    {card.content.map((item, index) => (
                      <div key={index} className="border-l-4 border-[var(--sage)] pl-4">
                        <p className="text-[var(--black)]/70 font-medium mb-2 text-sm">
                          {t(item.label)}
                        </p>
                        {item.isAddress ? (
                          <address className="text-[var(--black)] not-italic font-semibold">
                            {t(item.value).split('\n').map((line, idx) => (
                              <span key={idx} className="block mb-1">
                                {line}
                              </span>
                            ))}
                          </address>
                        ) : item.isTranslated ? (
                          <p className="text-[var(--black)] font-semibold">
                            {t(item.value)}
                          </p>
                        ) : (
                          <a 
                            href={card.id === 'email' ? `mailto:${item.value}` : card.id === 'phone' ? `tel:${item.value.replace(/[^0-9+]/g, '')}` : '#'} 
                            className="text-[var(--sage-green)] hover:text-[var(--cognac)] hover:underline font-semibold transition-colors"
                          >
                            {item.value}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--sage)]/20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-[var(--black)] mb-6">
                    {t('contact.info.additionalTitle')}
                  </h3>
                  <div className="space-y-6 text-lg text-[var(--black)]/80 leading-relaxed">
                    <p>{t('contact.info.additionalDescription1')}</p>
                    <p>{t('contact.info.additionalDescription2')}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[var(--sage-green)] to-emerald-500 rounded-xl">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--black)]">
                        {t('contact.info.responseTime')}
                      </p>
                      <p className="text-[var(--black)]/70">
                        {t('contact.info.responseTimeValue')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[var(--cognac)] to-orange-500 rounded-xl">
                      <Users size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--black)]">
                        {t('contact.info.supportTeam')}
                      </p>
                      <p className="text-[var(--black)]/70">
                        {t('contact.info.supportTeamValue')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 