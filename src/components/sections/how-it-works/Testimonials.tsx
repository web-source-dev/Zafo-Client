'use client';

import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function HowItWorksTestimonials() {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'howItWorks.testimonials.testimonial1.role',
      content: 'howItWorks.testimonials.testimonial1.content',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'howItWorks.testimonials.testimonial2.role',
      content: 'howItWorks.testimonials.testimonial2.content',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emma Rodriguez',
      role: 'howItWorks.testimonials.testimonial3.role',
      content: 'howItWorks.testimonials.testimonial3.content',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--black)] mb-6">
              {t('howItWorks.testimonials.title')}
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-3xl mx-auto">
              {t('howItWorks.testimonials.description')}
            </p>
          </motion.div>
          
          {/* Testimonials Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--taupe)] to-[var(--sage)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[var(--sage)]/20"
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <Quote size={24} className="text-[var(--sage-green)]" />
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex justify-center mb-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-[var(--black)]/80 text-center leading-relaxed mb-6 italic">
                  "{t(testimonial.content)}"
                </p>
                
                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-[var(--black)]">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-[var(--black)]/70">
                      {t(testimonial.role)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Final CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-3xl p-12 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {t('howItWorks.testimonials.cta.title')}
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {t('howItWorks.testimonials.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[var(--sage-green)] px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  {t('howItWorks.testimonials.cta.button1')}
                </button>
                <button className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[var(--sage-green)] transition-all duration-300 transform hover:scale-105">
                  {t('howItWorks.testimonials.cta.button2')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 