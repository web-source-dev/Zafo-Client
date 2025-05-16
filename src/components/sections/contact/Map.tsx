'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

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
      markerElement.className = 'absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-bounce';
      markerElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--sage-green)" class="w-8 h-8">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      `;

      // Add a semi-transparent overlay with location name
      const overlayElement = document.createElement('div');
      overlayElement.className = 'absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center';
      
      // Use proper translation for headquarters label
      const headquartersLabel = currentLanguage === 'en' ? 'Zafo Headquarters' : 'Zafo Hauptsitz';
      
      overlayElement.innerHTML = `
        <div class="bg-white bg-opacity-90 px-6 py-4 rounded-lg shadow-lg">
          <p class="text-[var(--sage-green)] font-medium text-lg">${headquartersLabel}</p>
          <p class="text-gray-600 text-sm mt-1">${t('contact.info.address').split('\n')[0]}</p>
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
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--sage-green)] mb-12">
            {t('contact.map.title')}
          </h2>
          <motion.div 
            ref={mapRef} 
            className="h-[450px] w-full rounded-xl shadow-xl relative overflow-hidden border-4 border-white"
            aria-label={t('contact.info.address')}
            whileHover={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
              borderColor: 'var(--sage)' 
            }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-700 text-base font-medium flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--sage-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('contact.map.directions')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 