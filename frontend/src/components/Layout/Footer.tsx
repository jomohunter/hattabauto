'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/i18n';
import LanguageSelector from '@/components/LanguageSelector';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { direction } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t border-gray-200" dir={direction}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Hattab Auto
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/import-request" 
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {t('navigation.importRequest')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {t('common.search')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <span className="font-medium">{t('footer.email')}</span>
                <br />
                <a 
                  href="mailto:info@hattabauto.com" 
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  info@hattabauto.com
                </a>
              </li>
              <li>
                <span className="font-medium">{t('footer.phone')}</span>
                <br />
                <a 
                  href="tel:+1234567890" 
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  +1 (234) 567-8900
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              {t('footer.copyright').replace('2025', currentYear.toString())}
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <LanguageSelector />
              <div className="flex space-x-6">
                <Link 
                  href="/privacy" 
                  className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {t('footer.privacyPolicy')}
                </Link>
                <Link 
                  href="/terms" 
                  className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {t('footer.termsOfService')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 