'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/language-context';
import { 
  FiFileText, 
  FiShield, 
  FiInfo, 
  FiCheckCircle, 
  FiGlobe, 
  FiAlertTriangle,
  FiPlusCircle,
  FiMinusCircle,
  FiMail,
  FiArrowRight,
  FiExternalLink
} from 'react-icons/fi';
import { 
  FaGavel, 
  FaBalanceScale, 
  FaUserShield, 
  FaHandshake, 
  FaCookieBite,
  FaShieldAlt
} from 'react-icons/fa';

const LegalSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('documents');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const legalDocuments = [
    {
      id: 'terms',
      title: t('legal.documents.terms.title'),
      description: t('legal.documents.terms.description'),
      icon: <FiFileText className="h-10 w-10 text-[var(--sage-green)]" />,
      link: '/terms',
      updatedDate: t('legal.documents.terms.updatedDate'),
    },
    {
      id: 'privacy',
      title: t('legal.documents.privacy.title'),
      description: t('legal.documents.privacy.description'),
      icon: <FiShield className="h-10 w-10 text-[var(--sage-green)]" />,
      link: '/privacy',
      updatedDate: t('legal.documents.privacy.updatedDate'),
    },
    {
      id: 'cookies',
      title: t('legal.documents.cookies.title'),
      description: t('legal.documents.cookies.description'),
      icon: <FaCookieBite className="h-10 w-10 text-[var(--sage-green)]" />,
      link: '/cookies',
      updatedDate: t('legal.documents.cookies.updatedDate'),
    },
    {
      id: 'gdpr',
      title: t('legal.documents.gdpr.title'),
      description: t('legal.documents.gdpr.description'),
      icon: <FaUserShield className="h-10 w-10 text-[var(--sage-green)]" />,
      link: '/gdpr',
      updatedDate: t('legal.documents.gdpr.updatedDate'),
    },
    {
      id: 'accessibility',
      title: t('legal.documents.accessibility.title'),
      description: t('legal.documents.accessibility.description'),
      icon: <FaHandshake className="h-10 w-10 text-[var(--sage-green)]" />,
      link: '/accessibility-statement',
      updatedDate: t('legal.documents.accessibility.updatedDate'),
    },
    {
      id: 'copyright',
      title: t('legal.documents.copyright.title'),
      description: t('legal.documents.copyright.description'),
      icon: <FaGavel className="h-10 w-10 text-[var(--sage-green)]" />,
      link: '/copyright',
      updatedDate: t('legal.documents.copyright.updatedDate'),
    },
  ];

  const legalFaqs = [
    {
      id: 'data-collection',
      question: t('legal.faqs.dataCollection.question'),
      answer: t('legal.faqs.dataCollection.answer'),
    },
    {
      id: 'data-rights',
      question: t('legal.faqs.dataRights.question'),
      answer: t('legal.faqs.dataRights.answer'),
    },
    {
      id: 'cookie-policy',
      question: t('legal.faqs.cookiePolicy.question'),
      answer: t('legal.faqs.cookiePolicy.answer'),
    },
    {
      id: 'gdpr-compliance',
      question: t('legal.faqs.gdprCompliance.question'),
      answer: t('legal.faqs.gdprCompliance.answer'),
    },
    {
      id: 'account-deletion',
      question: t('legal.faqs.accountDeletion.question'),
      answer: t('legal.faqs.accountDeletion.answer'),
    },
  ];

  const toggleFaq = (faqId: string) => {
    if (expandedFaq === faqId) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(faqId);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-lg text-gray-600">
          {t('legal.introduction')}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8 overflow-x-auto">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              <div className="flex items-center">
                <FiFileText className="mr-2 h-5 w-5" />
                {t('legal.tabs.documents')}
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'faqs'
                  ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('faqs')}
            >
              <div className="flex items-center">
                <FiInfo className="mr-2 h-5 w-5" />
                {t('legal.tabs.faqs')}
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'compliance'
                  ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('compliance')}
            >
              <div className="flex items-center">
                <FiCheckCircle className="mr-2 h-5 w-5" />
                {t('legal.tabs.compliance')}
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('contact')}
            >
              <div className="flex items-center">
                <FiMail className="mr-2 h-5 w-5" />
                {t('legal.tabs.contact')}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Legal Documents Tab */}
      {activeTab === 'documents' && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('legal.documentsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalDocuments.map((doc) => (
              <Link 
                key={doc.id} 
                href={doc.link}
                className="block p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 group"
              >
                <div className="mb-4 flex-shrink-0 bg-[var(--sage-green)]/10 p-3 rounded-full inline-block group-hover:bg-[var(--sage-green)]/20 transition-colors">{doc.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--sage-green)] transition-colors">{doc.title}</h3>
                <p className="text-gray-600 mb-4">{doc.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--sage-green)] font-medium flex items-center group-hover:gap-1 transition-all">
                    {t('legal.readMore')} <FiArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-sm text-gray-500">
                    {doc.updatedDate}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('legal.faqsTitle')}</h2>
          <div className="space-y-4">
            {legalFaqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-medium text-gray-900 text-left">{faq.question}</span>
                  <div className={`p-2 rounded-full ${expandedFaq === faq.id ? 'bg-[var(--sage-green)]/10' : ''}`}>
                    {expandedFaq === faq.id ? (
                      <FiMinusCircle className="h-5 w-5 text-[var(--sage-green)]" />
                    ) : (
                      <FiPlusCircle className="h-5 w-5 text-[var(--sage-green)]" />
                    )}
                  </div>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 animate-fadeIn">
                    <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('legal.complianceTitle')}</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer">
                <div className="bg-[var(--sage-green)]/10 rounded-full p-4 mb-4">
                  <FaUserShield className="h-10 w-10 text-[var(--sage-green)]" />
                </div>
                <span className="text-lg font-medium text-center">{t('legal.compliance.gdpr')}</span>
              </div>
              <div className="flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer">
                <div className="bg-[var(--sage-green)]/10 rounded-full p-4 mb-4">
                  <FaCookieBite className="h-10 w-10 text-[var(--sage-green)]" />
                </div>
                <span className="text-lg font-medium text-center">{t('legal.compliance.cookieLaw')}</span>
              </div>
              <div className="flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer">
                <div className="bg-[var(--sage-green)]/10 rounded-full p-4 mb-4">
                  <FaBalanceScale className="h-10 w-10 text-[var(--sage-green)]" />
                </div>
                <span className="text-lg font-medium text-center">{t('legal.compliance.ccpa')}</span>
              </div>
              <div className="flex flex-col items-center p-4 hover:scale-105 transition-transform cursor-pointer">
                <div className="bg-[var(--sage-green)]/10 rounded-full p-4 mb-4">
                  <FiGlobe className="h-10 w-10 text-[var(--sage-green)]" />
                </div>
                <span className="text-lg font-medium text-center">{t('legal.compliance.accessibility')}</span>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">{t('legal.compliance.statement')}</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {t('legal.compliance.description')}
              </p>
              <a
                href="/legal/compliance"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[var(--sage-green)] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                {t('legal.compliance.viewDetails')}
                <FiExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('legal.contactTitle')}</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[var(--sage-green)]/10 rounded-full p-4">
                <FiMail className="h-10 w-10 text-[var(--sage-green)]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">{t('legal.contact.title')}</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {t('legal.contact.description')}
            </p>
            
            <div className="max-w-xl mx-auto border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-inner">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <FaShieldAlt className="h-5 w-5 text-[var(--sage-green)] mr-2" />
                  <h4 className="font-medium">{t('legal.contact.dataProtection.title')}</h4>
                </div>
                <p className="text-gray-600 mb-2">{t('legal.contact.dataProtection.description')}</p>
                <a href="mailto:dpo@zafo.com" className="text-[var(--sage-green)] font-medium hover:underline inline-flex items-center">
                  dpo@zafo.com <FiExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              
              <div className="mb-6 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <FaGavel className="h-5 w-5 text-[var(--sage-green)] mr-2" />
                  <h4 className="font-medium">{t('legal.contact.legalDepartment.title')}</h4>
                </div>
                <p className="text-gray-600 mb-2">{t('legal.contact.legalDepartment.description')}</p>
                <a href="mailto:legal@zafo.com" className="text-[var(--sage-green)] font-medium hover:underline inline-flex items-center">
                  legal@zafo.com <FiExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <FiFileText className="h-5 w-5 text-[var(--sage-green)] mr-2" />
                  <h4 className="font-medium">{t('legal.contact.address.title')}</h4>
                </div>
                <p className="text-gray-600 whitespace-pre-line mb-2">
                  {t('legal.contact.address.value')}
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--sage-green)] text-white rounded-md hover:bg-opacity-90 transition-colors shadow-sm hover:shadow"
              >
                {t('legal.contact.contactForm')}
                <FiArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Additional Legal Information */}
      <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">{t('legal.additionalInfo.title')}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FiInfo className="mr-2 h-5 w-5 text-[var(--sage-green)]" />
              {t('legal.additionalInfo.company.title')}
            </h3>
            <p className="text-gray-600">
              {t('legal.additionalInfo.company.description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FiMail className="mr-2 h-5 w-5 text-[var(--sage-green)]" />
              {t('legal.additionalInfo.contact.title')}
            </h3>
            <p className="text-gray-600">
              {t('legal.additionalInfo.contact.description')}
            </p>
            <a 
              href="/contact" 
              className="text-[var(--sage-green)] hover:underline mt-2 inline-flex items-center"
            >
              {t('legal.additionalInfo.contact.link')}
              <FiArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FiAlertTriangle className="mr-2 h-5 w-5 text-[var(--sage-green)]" />
              {t('legal.additionalInfo.updates.title')}
            </h3>
            <p className="text-gray-600">
              {t('legal.additionalInfo.updates.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalSection; 