import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

const FaqPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('faq.title', 'Frequently Asked Questions')}</h1>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="what-is-rgscreens">
          <AccordionTrigger className="text-left">
            {t('faq.what.question')}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400">
            {t('faq.what.answer')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-source">
          <AccordionTrigger className="text-left">
            {t('faq.data.question')}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400">
            {t('faq.data.answer')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="leagues-covered">
          <AccordionTrigger className="text-left">
            {t('faq.leagues.question')}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400">
            {t('faq.leagues.answer')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger className="text-left">
            {t('faq.features.question')}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400">
            {t('faq.features.answer')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mobile">
          <AccordionTrigger className="text-left">
            {t('faq.mobile.question')}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400">
            {t('faq.mobile.answer')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger className="text-left">
            {t('faq.contact.question')}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400">
            {t('faq.contact.answer')} <a href="mailto:rgscreens.contact@gmail.com" className="text-gray-200 hover:underline">rgscreens.contact@gmail.com</a>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FaqPage; 