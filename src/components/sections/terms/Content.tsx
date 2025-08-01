'use client';

import { useLanguage } from '@/i18n/language-context';

export default function TermsContent() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p>
              {t('terms.content.intro')}
            </p>
            
            <p>
              {t('terms.content.acceptance')}
            </p>
            
            <p>
              <strong>{t('terms.content.agreement')}</strong>
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section1.title')}</h2>
            
            <p>
              {t('terms.content.section1.age')}
            </p>
            
            <p>
              {t('terms.content.section1.security')}
            </p>
            
            <p>
              {t('terms.content.section1.responsibility')}
            </p>
            
            <p>
              {t('terms.content.section1.illegal')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section2.title')}</h2>
            
            <p>
              {t('terms.content.section2.platform')}
            </p>
            
            <p>
              {t('terms.content.section2.purchases')}
            </p>
            
            <p>
              {t('terms.content.section2.responsibility')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section3.title')}</h2>
            
            <p>
              {t('terms.content.section3.modifications')}
            </p>
            
            <p>
              {t('terms.content.section3.continuation')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section4.title')}</h2>
            
            <p>
              {t('terms.content.section4.reference')} <a href="/privacy" className="text-[var(--sage-green)] hover:underline">{t('footer.privacy')}</a>.
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section5.title')}</h2>
            
            <p>
              {t('terms.content.section5.content')}
            </p>
            
            <p>
              {t('terms.content.section5.warranty')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section6.title')}</h2>
            
            <p>
              {t('terms.content.section6.notification')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section7.title')}</h2>
            
            <p>
              {t('terms.content.section7.liability')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section8.title')}</h2>
            
            <p>
              {t('terms.content.section8.law')}
            </p>
            
            <p>
              {t('terms.content.section8.waiver')}
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--sage-green)] mt-8 mb-4">{t('terms.content.section9.title')}</h2>
            
            <p>
              {t('terms.content.section9.contact')} <a href="/contact" className="text-[var(--sage-green)] hover:underline">{t('footer.contact')}</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 