'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, Mail } from 'lucide-react';

export default function ContactMap() {
  const { t, currentLanguage } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Google Maps, Mapbox, etc.
    if (mapRef.current) {
      const mapElement = mapRef.current;
      
      // Styling the placeholder map with a better placeholder image
      mapElement.style.backgroundImage = 'url("https://images.unsplash.com/photo-1589825743148-3c8a2dd01018?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3")';
      mapElement.style.backgroundSize = 'cover';
      mapElement.style.backgroundPosition = 'center';
      
      // Add a pin marker element to the map
      const markerElement = document.createElement('div');
      markerElement.className = 'absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-bounce';
      markerElement.innerHTML = `
        <div class="relative">
          <div class="absolute inset-0 bg-[var(--sage-green)] rounded-full animate-ping opacity-75"></div>
          <div class="relative bg-[var(--sage-green)] rounded-full p-2 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-8 h-8">
              <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `;

      // Add a semi-transparent overlay with location name
      const overlayElement = document.createElement('div');
      overlayElement.className = 'absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center';
      
      // Use proper translation for headquarters label
      const headquartersLabel = currentLanguage === 'en' ? 'Zafo Headquarters' : 'Zafo Hauptsitz';
      
      overlayElement.innerHTML = `
        <div class="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl border border-[var(--sage)]/20">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-[var(--sage-green)] to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-[var(--black)] mb-2">${headquartersLabel}</h3>
            <p class="text-[var(--black)]/80 text-sm">${t('contact.info.address').split('\n')[0]}</p>
          </div>
        </div>
      `;
      
      mapElement.appendChild(markerElement);
      mapElement.appendChild(overlayElement);
      
      // Make map clickable to show directions
      mapElement.style.cursor = 'pointer';
      mapElement.onclick = () => {
        window.open('https://maps.google.com/?q=San+Francisco+CA', '_blank');
      };
    }
  }, [t, currentLanguage]);
  
  const locationInfo = [
    {
      icon: Clock,
      label: 'contact.map.hours',
      value: 'contact.map.hoursValue',
      color: 'from-[var(--sage-green)] to-emerald-500'
    },
    {
      icon: Phone,
      label: 'contact.map.phone',
      value: '+1 (800) 555-0123',
      color: 'from-[var(--cognac)] to-orange-500'
    },
    {
      icon: Mail,
      label: 'contact.map.email',
      value: 'info@zafo.com',
      color: 'from-blue-500 to-cyan-500'
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-white via-[var(--sage)] to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <MapPin size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('contact.map.badge')}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
            >
              {t('contact.map.title')}
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
              {t('contact.map.description')}
            </motion.p>
          </motion.div>
          
          {/* Map and Info Grid */}
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Map */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <motion.div 
                ref={mapRef} 
                className="h-[500px] w-full rounded-3xl shadow-2xl relative overflow-hidden border-4 border-white"
                aria-label={t('contact.info.address')}
                whileHover={{ 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                  borderColor: 'var(--sage-green)',
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-center"
              >
                <button 
                  onClick={() => window.open('https://maps.google.com/?q=San+Francisco+CA', '_blank')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--sage-green)] to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Navigation size={20} />
                  {t('contact.map.directions')}
                </button>
              </motion.div>
            </motion.div>
            
            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--sage)]/20">
                <h3 className="text-2xl font-bold text-[var(--black)] mb-6">
                  {t('contact.map.locationInfo')}
                </h3>
                
                <div className="space-y-6">
                  {locationInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--black)]/60 font-medium">
                          {t(info.label)}
                        </p>
                        <p className="text-[var(--black)] font-semibold">
                          {info.value.includes('@') || info.value.includes('+') ? (
                            <a 
                              href={info.value.includes('@') ? `mailto:${info.value}` : `tel:${info.value.replace(/[^0-9+]/g, '')}`}
                              className="text-[var(--sage-green)] hover:text-[var(--cognac)] hover:underline transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            t(info.value)
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Quick Contact Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="bg-gradient-to-br from-[var(--sage-green)] to-emerald-500 rounded-3xl p-8 text-white shadow-xl"
              >
                <h4 className="text-xl font-bold mb-4">
                  {t('contact.map.quickContact')}
                </h4>
                <p className="text-white/90 mb-6 leading-relaxed">
                  {t('contact.map.quickContactDescription')}
                </p>
                <button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 font-semibold hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t('contact.map.contactUs')}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 