import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('terms.title', 'Terms & Conditions')}</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.introduction.title', '1. Introduction')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('terms.introduction.content')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.usage.title', '2. Use of Service')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('terms.usage.content')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.intellectual.title', '4. Intellectual Property')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('terms.intellectual.content')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.liability.title', '5. Limitation of Liability')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('terms.liability.content')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('terms.contact.title', '6. Contact Information')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('terms.contact.content')} <a href="mailto:rgscreens.contact@gmail.com" className="text-gray-200 hover:underline">rgscreens.contact@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage; 