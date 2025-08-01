'use client';

import { useLanguage } from '@/i18n/language-context';

export default function PrivacyContent() {
  const { t } = useLanguage();

  // Define arrays locally since the translation system returns strings
  const personalDataItems = [
    'privacy.content.section1.personalData.item1',
    'privacy.content.section1.personalData.item2',
    'privacy.content.section1.personalData.item3',
    'privacy.content.section1.personalData.item4',
    'privacy.content.section1.personalData.item5',
    'privacy.content.section1.personalData.item6',
    'privacy.content.section1.personalData.item7',
    'privacy.content.section1.personalData.item8'
  ];

  const automaticallyCollectedItems = [
    'privacy.content.section1.automaticallyCollected.item1',
    'privacy.content.section1.automaticallyCollected.item2',
    'privacy.content.section1.automaticallyCollected.item3',
    'privacy.content.section1.automaticallyCollected.item4',
    'privacy.content.section1.automaticallyCollected.item5',
    'privacy.content.section1.automaticallyCollected.item6',
    'privacy.content.section1.automaticallyCollected.item7',
    'privacy.content.section1.automaticallyCollected.item8'
  ];

  const usageItems = [
    'privacy.content.section2.item1',
    'privacy.content.section2.item2',
    'privacy.content.section2.item3',
    'privacy.content.section2.item4',
    'privacy.content.section2.item5',
    'privacy.content.section2.item6',
    'privacy.content.section2.item7',
    'privacy.content.section2.item8',
    'privacy.content.section2.item9',
    'privacy.content.section2.item10',
    'privacy.content.section2.item11',
    'privacy.content.section2.item12',
    'privacy.content.section2.item13'
  ];

  const privacyRightsItems = [
    'privacy.content.section8.item1',
    'privacy.content.section8.item2',
    'privacy.content.section8.item3',
    'privacy.content.section8.item4',
    'privacy.content.section8.item5',
    'privacy.content.section8.item6'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p>
              {t('privacy.content.intro')}
            </p>
            
            <p>
              {t('privacy.content.readCarefully')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section1.title')}</h2>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section1.personalData.title')}</h3>
            
            <p>
              {t('privacy.content.section1.personalData.description')}
            </p>
            
            <ul className="list-disc ml-6 mb-6">
              {personalDataItems.map((itemKey, index) => (
                <li key={index}>{t(itemKey)}</li>
              ))}
            </ul>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section1.automaticallyCollected.title')}</h3>
            
            <p>
              {t('privacy.content.section1.automaticallyCollected.description')}
            </p>
            
            <ul className="list-disc ml-6 mb-6">
              {automaticallyCollectedItems.map((itemKey, index) => (
                <li key={index}>{t(itemKey)}</li>
              ))}
            </ul>
            
            <p>
              {t('privacy.content.section1.automaticallyCollected.additional')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section2.title')}</h2>
            
            <p>
              {t('privacy.content.section2.description')}
            </p>
            
            <ul className="list-disc ml-6 mb-6">
              {usageItems.map((itemKey, index) => (
                <li key={index}>{t(itemKey)}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section3.title')}</h2>
            
            <p>
              {t('privacy.content.section3.description')}
            </p>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section3.serviceProviders.title')}</h3>
            
            <p>
              {t('privacy.content.section3.serviceProviders.description')}
            </p>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section3.eventOrganizers.title')}</h3>
            
            <p>
              {t('privacy.content.section3.eventOrganizers.description')}
            </p>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section3.businessTransfers.title')}</h3>
            
            <p>
              {t('privacy.content.section3.businessTransfers.description')}
            </p>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section3.withConsent.title')}</h3>
            
            <p>
              {t('privacy.content.section3.withConsent.description')}
            </p>
            
            <h3 className="text-xl font-semibold text-[var(--sage-green)] mt-6 mb-3">{t('privacy.content.section3.legalRequirements.title')}</h3>
            
            <p>
              {t('privacy.content.section3.legalRequirements.description')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section4.title')}</h2>
            
            <p>
              {t('privacy.content.section4.description1')}
            </p>
            
            <p>
              {t('privacy.content.section4.description2')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section5.title')}</h2>
            
            <p>
              {t('privacy.content.section5.description')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section6.title')}</h2>
            
            <p>
              {t('privacy.content.section6.description')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section7.title')}</h2>
            
            <p>
              {t('privacy.content.section7.description')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section8.title')}</h2>
            
            <p>
              {t('privacy.content.section8.description')}
            </p>
            
            <ul className="list-disc ml-6 mb-6">
              {privacyRightsItems.map((itemKey, index) => (
                <li key={index}>{t(itemKey)}</li>
              ))}
            </ul>
            
            <p>
              {t('privacy.content.section8.contact')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section9.title')}</h2>
            
            <p>
              {t('privacy.content.section9.description1')}
            </p>
            
            <p>
              {t('privacy.content.section9.description2')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('privacy.content.section10.title')}</h2>
            
            <p>
              {t('privacy.content.section10.description')} <a href="/contact" className="text-[var(--sage-green)] hover:underline">{t('footer.contact')}</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 