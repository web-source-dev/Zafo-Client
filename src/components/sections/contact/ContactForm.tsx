'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/i18n/language-context';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, MessageSquare, User, Mail, FileText } from 'lucide-react';

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
    { 
      id: 'name', 
      type: 'text', 
      required: true, 
      label: 'contact.form.yourName', 
      placeholder: 'contact.form.namePlaceholder', 
      value: formData.name,
      icon: User
    },
    { 
      id: 'email', 
      type: 'email', 
      required: true, 
      label: 'contact.form.yourEmail', 
      placeholder: 'contact.form.emailPlaceholder', 
      value: formData.email,
      icon: Mail
    },
    { 
      id: 'subject', 
      type: 'text', 
      required: true, 
      label: 'contact.form.subject', 
      placeholder: 'contact.form.subjectPlaceholder', 
      value: formData.subject,
      icon: FileText
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--sage)] via-white to-[var(--taupe)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--sage-green)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-[var(--cognac)]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
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
              <Send size={28} className="text-[var(--sage-green)]" />
              <span className="text-[var(--sage-green)] font-semibold text-lg">
                {t('contact.form.badge')}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[var(--black)] mb-6"
            >
              {t('contact.form.title')}
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
              className="text-xl max-w-3xl mx-auto text-[var(--black)]/80 leading-relaxed"
            >
              {t('contact.form.description')}
            </motion.p>
          </motion.div>
          
          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-[var(--sage)]/20 overflow-hidden"
          >
            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--black)] mb-4">
                  {t('contact.form.success.title')}
                </h3>
                <p className="text-xl text-[var(--black)]/80 mb-8 leading-relaxed">
                  {t('contact.form.success.message')}
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => setSubmitSuccess(false)}
                  className="px-8 py-3 rounded-xl"
                >
                  {t('contact.form.success.button')}
                </Button>
              </motion.div>
            ) : (
              <div className="p-8 md:p-12">
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formFields.slice(0, 2).map((field) => (
                      <motion.div 
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="group"
                      >
                        <label htmlFor={field.id} className="block text-[var(--black)] font-semibold mb-3 flex items-center gap-2">
                          <field.icon size={20} className="text-[var(--sage-green)]" />
                          {t(field.label)} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required={field.required}
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            value={field.value}
                            onChange={handleChange}
                            className="w-full px-6 py-4 border-2 border-[var(--sage)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--sage-green)]/20 focus:border-[var(--sage-green)] transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-[var(--sage-green)]/50"
                            placeholder={t(field.placeholder)}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Subject */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="group"
                  >
                    <label htmlFor="subject" className="block text-[var(--black)] font-semibold mb-3 flex items-center gap-2">
                      <FileText size={20} className="text-[var(--sage-green)]" />
                      {t('contact.form.subject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-[var(--sage)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--sage-green)]/20 focus:border-[var(--sage-green)] transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-[var(--sage-green)]/50"
                      placeholder={t('contact.form.subjectPlaceholder')}
                    />
                  </motion.div>
                  
                  {/* Message */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="group"
                  >
                    <label htmlFor="message" className="block text-[var(--black)] font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare size={20} className="text-[var(--sage-green)]" />
                      {t('contact.form.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={8}
                      className="w-full px-6 py-4 border-2 border-[var(--sage)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--sage-green)]/20 focus:border-[var(--sage-green)] transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-[var(--sage-green)]/50 resize-none"
                      placeholder={t('contact.form.messagePlaceholder')}
                    ></textarea>
                  </motion.div>
                  
                  {/* Error Message */}
                  {submitError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-3"
                    >
                      <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
                      <p className="text-red-700 font-medium">{submitError}</p>
                    </motion.div>
                  )}
                  
                  {/* Submit Button */}
                  <motion.div 
                    className="flex justify-center pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="px-12 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {t('contact.form.sending')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send size={20} />
                          {t('contact.form.button')}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 