'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success state
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formFields = [
    { id: 'name', type: 'text', required: true, label: 'contact.form.yourName', placeholder: 'contact.form.namePlaceholder', value: formData.name },
    { id: 'email', type: 'email', required: true, label: 'contact.form.yourEmail', placeholder: 'contact.form.emailPlaceholder', value: formData.email },
    { id: 'subject', type: 'text', required: true, label: 'contact.form.subject', placeholder: 'contact.form.subjectPlaceholder', value: formData.subject }
  ];

  return (
    <section className="py-20 bg-[var(--taupe)]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-center text-[var(--sage-green)] mb-8">
            {t('contact.form.title')}
          </h2>
          
          {submitSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
            >
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold text-green-700 mb-4">{t('contact.form.success.title')}</h3>
              <p className="text-lg text-gray-700 mb-6">
                {t('contact.form.success.message')}
              </p>
              <Button 
                variant="primary" 
                onClick={() => setSubmitSuccess(false)}
              >
                {t('contact.form.success.button')}
              </Button>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.slice(0, 2).map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-gray-700 font-medium mb-2">
                      {t(field.label)} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required={field.required}
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={field.value}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] transition-all"
                      placeholder={t(field.placeholder)}
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                  {t('contact.form.subject')} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] transition-all"
                  placeholder={t('contact.form.subjectPlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  {t('contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] transition-all"
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>
              
              {submitError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
                >
                  {submitError}
                </motion.div>
              )}
              
              <motion.div 
                className="flex justify-center mt-8"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="px-10 py-3 rounded-md"
                >
                  {isSubmitting ? t('contact.form.sending') : t('contact.form.button')}
                </Button>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </section>
  );
} 