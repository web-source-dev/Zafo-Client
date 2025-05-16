'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/i18n/language-context';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiSearch, 
  FiX,
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiMessageCircle
} from 'react-icons/fi';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaTools, 
  FaShieldAlt, 
  FaQuestionCircle, 
  FaHeadset,
  FaExclamationTriangle,
  FaPlayCircle
} from 'react-icons/fa';

interface HelpArticle {
  id: string;
  title: string;
  featured?: boolean;
}
const HelpSection: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('articles');
  
  const helpCategories = useMemo(() => [
    {
      id: 'account',
      title: t('help.categories.account.title'),
      icon: <FaUser className="text-[var(--sage-green)]" />,
      articles: [
        { id: 'create-account', title: t('help.categories.account.articles.createAccount'), featured: true },
        { id: 'update-profile', title: t('help.categories.account.articles.updateProfile') },
        { id: 'change-password', title: t('help.categories.account.articles.changePassword') },
        { id: 'manage-notifications', title: t('help.categories.account.articles.manageNotifications') },
        { id: 'delete-account', title: t('help.categories.account.articles.deleteAccount') },
      ],
    },
    {
      id: 'events',
      title: t('help.categories.events.title'),
      icon: <FaCalendarAlt className="text-[var(--sage-green)]" />,
      articles: [
        { id: 'find-events', title: t('help.categories.events.articles.findEvents'), featured: true },
        { id: 'register-event', title: t('help.categories.events.articles.registerEvent') },
        { id: 'create-event', title: t('help.categories.events.articles.createEvent') },
        { id: 'manage-attendees', title: t('help.categories.events.articles.manageAttendees') },
        { id: 'event-settings', title: t('help.categories.events.articles.eventSettings') },
        { id: 'share-events', title: t('help.categories.events.articles.shareEvents') },
      ],
    },
    {
      id: 'payments',
      title: t('help.categories.payments.title'),
      icon: <FaCreditCard className="text-[var(--sage-green)]" />,
      articles: [
        { id: 'payment-methods', title: t('help.categories.payments.articles.paymentMethods') },
        { id: 'refunds', title: t('help.categories.payments.articles.refunds'), featured: true },
        { id: 'invoices', title: t('help.categories.payments.articles.invoices') },
        { id: 'subscription', title: t('help.categories.payments.articles.subscription') },
        { id: 'pricing-plans', title: t('help.categories.payments.articles.pricingPlans') },
      ],
    },
    {
      id: 'privacy',
      title: t('help.categories.privacy.title'),
      icon: <FaShieldAlt className="text-[var(--sage-green)]" />,
      articles: [
        { id: 'data-privacy', title: t('help.categories.privacy.articles.dataPrivacy'), featured: true },
        { id: 'cookie-settings', title: t('help.categories.privacy.articles.cookieSettings') },
        { id: 'gdpr-compliance', title: t('help.categories.privacy.articles.gdprCompliance') },
        { id: 'account-security', title: t('help.categories.privacy.articles.accountSecurity') },
      ],
    },
    {
      id: 'troubleshooting',
      title: t('help.categories.troubleshooting.title'),
      icon: <FaTools className="text-[var(--sage-green)]" />,
      articles: [
        { id: 'common-issues', title: t('help.categories.troubleshooting.articles.commonIssues'), featured: true },
        { id: 'login-problems', title: t('help.categories.troubleshooting.articles.loginProblems') },
        { id: 'app-performance', title: t('help.categories.troubleshooting.articles.appPerformance') },
        { id: 'browser-compatibility', title: t('help.categories.troubleshooting.articles.browserCompatibility') },
        { id: 'contact-support', title: t('help.categories.troubleshooting.articles.contactSupport') },
      ],
    },
    {
      id: 'getting-started',
      title: t('help.categories.gettingStarted.title'),
      icon: <FaQuestionCircle className="text-[var(--sage-green)]" />,
      articles: [
        { id: 'platform-overview', title: t('help.categories.gettingStarted.articles.platformOverview'), featured: true },
        { id: 'quick-start-guide', title: t('help.categories.gettingStarted.articles.quickStartGuide') },
        { id: 'user-roles', title: t('help.categories.gettingStarted.articles.userRoles') },
        { id: 'mobile-app', title: t('help.categories.gettingStarted.articles.mobileApp') },
      ],
    },
  ], [t]);

  const videoTutorials = [
    {
      id: 'account-setup',
      title: t('help.videos.accountSetup.title'),
      thumbnail: '/images/tutorials/account-setup.jpg',
      duration: '3:45',
      description: t('help.videos.accountSetup.description'),
    },
    {
      id: 'create-first-event',
      title: t('help.videos.createFirstEvent.title'),
      thumbnail: '/images/tutorials/create-event.jpg',
      duration: '5:12',
      description: t('help.videos.createFirstEvent.description'),
    },
    {
      id: 'registration-process',
      title: t('help.videos.registrationProcess.title'),
      thumbnail: '/images/tutorials/registration-process.jpg',
      duration: '2:50',
      description: t('help.videos.registrationProcess.description'),
    },
    {
      id: 'mobile-app-guide',
      title: t('help.videos.mobileAppGuide.title'),
      thumbnail: '/images/tutorials/mobile-app.jpg',
      duration: '4:30',
      description: t('help.videos.mobileAppGuide.description'),
    },
  ];

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const performSearch = useCallback(() => {
    // Search in all categories and articles
    const results: HelpArticle[] = [];
    helpCategories.forEach(category => {
      category.articles.forEach(article => {
        if (article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({
            ...article,
            id: `${category.id}/${article.id}`, // Include category in ID for linking
          });
        }
      });
    });
    setSearchResults(results);
  }, [searchQuery, helpCategories]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, performSearch]);

  const getFeaturedArticles = (): HelpArticle[] => {
    const featured: HelpArticle[] = [];
    helpCategories.forEach(category => {
      category.articles.forEach(article => {
        if (article.featured) {
          featured.push({
            ...article,
            id: `${category.id}/${article.id}`, // Include category in ID for linking
          });
        }
      });
    });
    return featured;
  };

  const renderArticleLink = (article: HelpArticle) => {
    const [categoryId, articleId] = article.id.includes('/') 
      ? article.id.split('/')
      : [expandedCategory, article.id];
      
    return (
      <a
        key={article.id}
        href={`/help/${categoryId}/${articleId}`}
        className="block py-4 text-gray-700 hover:text-[var(--sage-green)] transition-colors"
      >
        {article.title}
      </a>
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-[var(--sage-green)] focus:border-[var(--sage-green)] text-gray-900"
            placeholder={t('help.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {t('help.search.results')} ({searchResults.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {searchResults.length > 0 ? (
                searchResults.map(article => (
                  <div key={article.id} className="px-6 py-4">
                    {renderArticleLink(article)}
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('help.search.noResults')}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {t('help.search.noResultsDescription')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      {!isSearching && (
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8 overflow-x-auto">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('articles')}
              >
                <div className="flex items-center">
                  <FiBookOpen className="mr-2 h-5 w-5" />
                  {t('help.tabs.articles')}
                </div>
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('videos')}
              >
                <div className="flex items-center">
                  <FiVideo className="mr-2 h-5 w-5" />
                  {t('help.tabs.videos')}
                </div>
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'guides'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('guides')}
              >
                <div className="flex items-center">
                  <FiFileText className="mr-2 h-5 w-5" />
                  {t('help.tabs.guides')}
                </div>
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'support'
                    ? 'border-[var(--sage-green)] text-[var(--sage-green)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('support')}
              >
                <div className="flex items-center">
                  <FiMessageCircle className="mr-2 h-5 w-5" />
                  {t('help.tabs.support')}
                </div>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Popular Articles Section */}
      {!isSearching && activeTab === 'articles' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('help.popularArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedArticles().map((article) => (
              <a
                key={article.id}
                href={`/help/${article.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-[var(--sage-green)]">
                  {article.title}
                </h3>
                <div className="flex items-center text-[var(--sage-green)]">
                  <span className="text-sm">{t('help.readArticle')}</span>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Video Tutorials Section */}
      {!isSearching && activeTab === 'videos' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('help.videoTutorials')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoTutorials.map((video) => (
              <div
                key={video.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    {/* Placeholder for video thumbnail */}
                    <span className="text-gray-400">No thumbnail available</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <FaPlayCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  <a
                    href={`/help/videos/${video.id}`}
                    className="text-[var(--sage-green)] text-sm font-medium hover:underline"
                  >
                    {t('help.watchNow')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Step-by-step Guides */}
      {!isSearching && activeTab === 'guides' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('help.guides')}</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">{t('help.guides')}</h3>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--sage-green)] text-white font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {t('help.guides.step1.title')}
                    </h4>
                    <p className="text-gray-600">
                      {t('help.guides.step1.description')}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--sage-green)] text-white font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {t('help.guides.step2.title')}
                    </h4>
                    <p className="text-gray-600">
                      {t('help.guides.step2.description')}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--sage-green)] text-white font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {t('help.guides.step3.title')}
                    </h4>
                    <p className="text-gray-600">
                      {t('help.guides.step3.description')}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--sage-green)] text-white font-bold">
                    4
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {t('help.guides.step4.title')}
                    </h4>
                    <p className="text-gray-600">
                      {t('help.guides.step4.description')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <a 
                  href="/help/guides/getting-started" 
                  className="inline-block px-6 py-3 bg-[var(--sage-green)] text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  {t('help.guides.viewAll')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Direct Support Section */}
      {!isSearching && activeTab === 'support' && (
        <div className="mb-12 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[var(--sage-green)]/10 rounded-full p-4">
                <FaHeadset className="h-10 w-10 text-[var(--sage-green)]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">{t('help.contactSupport.title')}</h2>
            <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
              {t('help.contactSupport.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <h3 className="font-medium mb-2">{t('help.contactSupport.channels.email.title')}</h3>
                <p className="text-gray-600 mb-3">{t('help.contactSupport.channels.email.description')}</p>
                <a href="mailto:support@zafo.com" className="text-[var(--sage-green)] font-medium hover:underline">
                  support@zafo.com
                </a>
              </div>
              
              <div className="text-center p-4">
                <h3 className="font-medium mb-2">{t('help.contactSupport.channels.chat.title')}</h3>
                <p className="text-gray-600 mb-3">{t('help.contactSupport.channels.chat.description')}</p>
                <button className="text-[var(--sage-green)] font-medium hover:underline">
                  {t('help.contactSupport.channels.chat.button')}
                </button>
              </div>
              
              <div className="text-center p-4">
                <h3 className="font-medium mb-2">{t('help.contactSupport.channels.phone.title')}</h3>
                <p className="text-gray-600 mb-3">{t('help.contactSupport.channels.phone.description')}</p>
                <a href="tel:+1234567890" className="text-[var(--sage-green)] font-medium hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-[var(--sage-green)] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                {t('help.contactSupport.button')}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Help Categories */}
      {!isSearching && activeTab === 'articles' && (
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('help.allCategories')}</h2>
          {helpCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--sage-green)]/10 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="ml-4 text-xl font-medium text-gray-900">{category.title}</h3>
                </div>
                {expandedCategory === category.id ? (
                  <FiChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedCategory === category.id && (
                <div className="px-6 py-4 divide-y divide-gray-200">
                  {category.articles.map((article) => renderArticleLink(article))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Additional Help Options */}
      {!isSearching && activeTab === 'articles' && (
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">{t('help.additionalResources.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-[var(--sage-green)]/10 flex items-center justify-center">
                <FiBookOpen className="h-8 w-8 text-[var(--sage-green)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('help.additionalResources.documentation.title')}</h3>
              <p className="text-gray-600 mb-4">{t('help.additionalResources.documentation.description')}</p>
              <a href="/docs" className="text-[var(--sage-green)] font-medium hover:underline">
                {t('help.additionalResources.documentation.link')}
              </a>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-[var(--sage-green)]/10 flex items-center justify-center">
                <FiVideo className="h-8 w-8 text-[var(--sage-green)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('help.additionalResources.webinars.title')}</h3>
              <p className="text-gray-600 mb-4">{t('help.additionalResources.webinars.description')}</p>
              <a href="/webinars" className="text-[var(--sage-green)] font-medium hover:underline">
                {t('help.additionalResources.webinars.link')}
              </a>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-[var(--sage-green)]/10 flex items-center justify-center">
                <FiMessageCircle className="h-8 w-8 text-[var(--sage-green)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('help.additionalResources.community.title')}</h3>
              <p className="text-gray-600 mb-4">{t('help.additionalResources.community.description')}</p>
              <a href="/community" className="text-[var(--sage-green)] font-medium hover:underline">
                {t('help.additionalResources.community.link')}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HelpSection; 