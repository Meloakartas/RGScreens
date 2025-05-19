import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-8 border-t bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} RGScreens. {t('footer.allRightsReserved')}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="mailto:rgscreens.contact@gmail.com"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              rgscreens.contact@gmail.com
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link
              to="/terms"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              {t('footer.terms')}
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link
              to="/faq"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              {t('footer.faq')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 