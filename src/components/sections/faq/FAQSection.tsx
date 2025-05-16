'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/i18n/language-context';
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { BsQuestionCircle } from 'react-icons/bs';
import { AiOutlineGlobal } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { RiLockPasswordLine, RiComputerLine } from 'react-icons/ri';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
}

const FAQSection: React.FC = () => {
  const { t } = useLanguage();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular questions - show a mix from different categories
  const popularQuestions: string[] = [
    'what-is',
    'createAccount',
    'pricing',
    'dataUse', 
    'browserSupport'
  ];

  const getFullId = (id: string): string => {
    // Convert short IDs to full IDs for popular questions
    if (id === 'createAccount') return 'create-account';
    if (id === 'pricing') return 'pricing';
    if (id === 'dataUse') return 'data-use';
    if (id === 'browserSupport') return 'browser-support';
    return id;
  };

  const faqCategories: FAQCategory[] = [
    {
      id: 'general',
      title: t('faq.categories.general'),
      icon: <BsQuestionCircle className="h-5 w-5" />,
      faqs: [
        {
          id: 'what-is',
          question: t('faq.general.whatIs.question'),
          answer: t('faq.general.whatIs.answer'),
        },
        {
          id: 'how-it-works',
          question: t('faq.general.howItWorks.question'),
          answer: t('faq.general.howItWorks.answer'),
        },
        {
          id: 'get-started',
          question: t('faq.general.getStarted.question'),
          answer: t('faq.general.getStarted.answer'),
        },
        {
          id: 'difference-competitors',
          question: t('faq.general.differenceCompetitors.question'),
          answer: t('faq.general.differenceCompetitors.answer'),
        },
        {
          id: 'mobile-friendly',
          question: t('faq.general.mobileFriendly.question'),
          answer: t('faq.general.mobileFriendly.answer'),
        },
      ],
    },
    {
      id: 'account',
      title: t('faq.categories.account'),
      icon: <RiLockPasswordLine className="h-5 w-5" />,
      faqs: [
        {
          id: 'create-account',
          question: t('faq.account.createAccount.question'),
          answer: t('faq.account.createAccount.answer'),
        },
        {
          id: 'change-password',
          question: t('faq.account.changePassword.question'),
          answer: t('faq.account.changePassword.answer'),
        },
        {
          id: 'delete-account',
          question: t('faq.account.deleteAccount.question'),
          answer: t('faq.account.deleteAccount.answer'),
        },
        {
          id: 'edit-profile',
          question: t('faq.account.editProfile.question'),
          answer: t('faq.account.editProfile.answer'),
        },
        {
          id: 'notifications',
          question: t('faq.account.notifications.question'),
          answer: t('faq.account.notifications.answer'),
        },
      ],
    },
    {
      id: 'billing',
      title: t('faq.categories.billing'),
      icon: <AiOutlineGlobal className="h-5 w-5" />,
      faqs: [
        {
          id: 'pricing',
          question: t('faq.billing.pricing.question'),
          answer: t('faq.billing.pricing.answer'),
        },
        {
          id: 'payment-methods',
          question: t('faq.billing.paymentMethods.question'),
          answer: t('faq.billing.paymentMethods.answer'),
        },
        {
          id: 'refunds',
          question: t('faq.billing.refunds.question'),
          answer: t('faq.billing.refunds.answer'),
        },
        {
          id: 'cancel-subscription',
          question: t('faq.billing.cancelSubscription.question'),
          answer: t('faq.billing.cancelSubscription.answer'),
        },
        {
          id: 'upgrade-account',
          question: t('faq.billing.upgradeAccount.question'),
          answer: t('faq.billing.upgradeAccount.answer'),
        },
      ],
    },
    {
      id: 'privacy',
      title: t('faq.categories.privacy'),
      icon: <RiLockPasswordLine className="h-5 w-5" />,
      faqs: [
        {
          id: 'data-use',
          question: t('faq.privacy.dataUse.question'),
          answer: t('faq.privacy.dataUse.answer'),
        },
        {
          id: 'data-share',
          question: t('faq.privacy.dataShare.question'),
          answer: t('faq.privacy.dataShare.answer'),
        },
        {
          id: 'your-rights',
          question: t('faq.privacy.yourRights.question'),
          answer: t('faq.privacy.yourRights.answer'),
        },
        {
          id: 'account-security',
          question: t('faq.privacy.accountSecurity.question'),
          answer: t('faq.privacy.accountSecurity.answer'),
        },
      ],
    },
    {
      id: 'events',
      title: t('faq.categories.events'),
      icon: <FaRegCalendarAlt className="h-5 w-5" />,
      faqs: [
        {
          id: 'create-event',
          question: t('faq.events.createEvent.question'),
          answer: t('faq.events.createEvent.answer'),
        },
        {
          id: 'edit-event',
          question: t('faq.events.editEvent.question'),
          answer: t('faq.events.editEvent.answer'),
        },
        {
          id: 'cancel-event',
          question: t('faq.events.cancelEvent.question'),
          answer: t('faq.events.cancelEvent.answer'),
        },
      ],
    },
    {
      id: 'technical',
      title: t('faq.categories.technical'),
      icon: <RiComputerLine className="h-5 w-5" />,
      faqs: [
        {
          id: 'browser-support',
          question: t('faq.technical.browserSupport.question'),
          answer: t('faq.technical.browserSupport.answer'),
        },
        {
          id: 'app-requirements',
          question: t('faq.technical.appRequirements.question'),
          answer: t('faq.technical.appRequirements.answer'),
        },
        {
          id: 'troubleshooting',
          question: t('faq.technical.troubleshooting.question'),
          answer: t('faq.technical.troubleshooting.answer'),
        },
      ],
    },
  ];

  const toggleFAQ = (faqId: string) => {
    if (expandedFAQ === faqId) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(faqId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const performSearch = () => {
    const query = searchQuery.toLowerCase();
    const results: FAQItem[] = [];
    
    faqCategories.forEach(category => {
      category.faqs.forEach(faq => {
        if (
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        ) {
          results.push(faq);
        }
      });
    });
    
    setSearchResults(results);
    setIsSearching(true);
  };

  // Get popular FAQs
  const getPopularFAQs = (): FAQItem[] => {
    const faqs: FAQItem[] = [];
    
    popularQuestions.forEach(id => {
      const fullId = getFullId(id);
      for (const category of faqCategories) {
        const faq = category.faqs.find(faq => faq.id === fullId);
        if (faq) {
          faqs.push(faq);
          break;
        }
      }
    });
    
    return faqs;
  };

  const renderFAQItem = (faq: FAQItem, index: number) => (
    <div 
      key={`${faq.id}-${index}`} 
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
        onClick={() => toggleFAQ(faq.id)}
        aria-expanded={expandedFAQ === faq.id}
      >
        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
        {expandedFAQ === faq.id ? (
          <FiChevronUp className="h-5 w-5 text-[var(--sage-green)]" />
        ) : (
          <FiChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expandedFAQ === faq.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
        </div>
      </div>
    </div>
  );

  const getCurrentCategoryFAQs = () => {
    return faqCategories.find(category => category.id === activeCategory)?.faqs || [];
  };

  const popularFAQs = getPopularFAQs();

  return (
    <section className="py-12 px-4 sm:py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-[var(--sage-green)] focus-within:ring-2 focus-within:ring-[var(--sage-green)] focus-within:ring-opacity-40 transition-all">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('faq.search.placeholder')}
              className="flex-grow py-3 pl-6 pr-12 focus:outline-none text-gray-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[var(--sage-green)] hover:bg-[var(--dark-sage-green)] text-white p-3 transition-colors"
              aria-label={t('faq.search.button')}
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Popular Questions Section (only show if not searching) */}
      {!isSearching && (
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <HiOutlineLightBulb className="h-6 w-6 text-[var(--sage-green)] mr-2" />
            <h2 className="text-2xl font-semibold text-center">{t('faq.popularQuestions')}</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {popularFAQs.map((faq, index) => renderFAQItem(faq, index))}
          </div>
        </div>
      )}

      {/* Search Results (only show when searching) */}
      {isSearching && (
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{t('faq.search.results')}</h2>
            <button 
              onClick={clearSearch}
              className="text-[var(--sage-green)] hover:text-[var(--dark-sage-green)] flex items-center"
            >
              <FiX className="h-4 w-4 mr-1" /> {t('faq.search.clear')}
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-4">
              {searchResults.map((faq, index) => renderFAQItem(faq, index))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
              <BsQuestionCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-2">{t('faq.search.noResults')}</p>
            </div>
          )}
        </div>
      )}

      {/* Only show categories and regular faqs when not searching */}
      {!isSearching && (
        <>
          {/* Category Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  className={`flex items-center px-5 py-3 rounded-full mb-2 transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[var(--sage-green)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto space-y-4">
            {getCurrentCategoryFAQs().map((faq, index) => renderFAQItem(faq, index))}
          </div>
        </>
      )}

      {/* Still Have Questions */}
      <div className="mt-16 bg-gradient-to-r from-[var(--sage-green)] to-[var(--cognac)] rounded-xl p-8 text-center text-white shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{t('faq.stillHaveQuestions.title')}</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          {t('faq.stillHaveQuestions.description')}
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-white text-[var(--sage-green)] font-medium rounded-md hover:bg-gray-100 transition-colors shadow-sm"
        >
          {t('faq.stillHaveQuestions.button')}
        </a>
      </div>
    </section>
  );
};

export default FAQSection; 