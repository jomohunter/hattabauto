'use client';

import React from 'react';
import { t } from '@/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout/Layout';

const TestI18nPage: React.FC = () => {
  const { currentLocale, direction } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8" dir={direction}>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Internationalization Test Page
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Language Settings</h2>
          <div className="space-y-2">
            <p><strong>Current Locale:</strong> {currentLocale}</p>
            <p><strong>Direction:</strong> {direction}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Translations</h2>
            <div className="space-y-2">
              <p><strong>Home:</strong> {t('navigation.home')}</p>
              <p><strong>Products:</strong> {t('navigation.products')}</p>
              <p><strong>Import Request:</strong> {t('navigation.importRequest')}</p>
              <p><strong>Search:</strong> {t('navigation.search')}</p>
              <p><strong>Admin Panel:</strong> {t('navigation.adminPanel')}</p>
              <p><strong>Logout:</strong> {t('navigation.logout')}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Footer Translations</h2>
            <div className="space-y-2">
              <p><strong>Quick Links:</strong> {t('footer.quickLinks')}</p>
              <p><strong>Contact:</strong> {t('footer.contact')}</p>
              <p><strong>Email:</strong> {t('footer.email')}</p>
              <p><strong>Phone:</strong> {t('footer.phone')}</p>
              <p><strong>Copyright:</strong> {t('footer.copyright')}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Home Page Translations</h2>
            <div className="space-y-2">
              <p><strong>Hero Title:</strong> {t('home.hero.title')}</p>
              <p><strong>Hero Subtitle:</strong> {t('home.hero.subtitle')}</p>
              <p><strong>CTA:</strong> {t('home.hero.cta')}</p>
              <p><strong>Features Title:</strong> {t('home.features.title')}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Common Translations</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {t('common.loading')}</p>
              <p><strong>Error:</strong> {t('common.error')}</p>
              <p><strong>Success:</strong> {t('common.success')}</p>
              <p><strong>Cancel:</strong> {t('common.cancel')}</p>
              <p><strong>Save:</strong> {t('common.save')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Long Text Test</h2>
          <p className="text-gray-600 leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TestI18nPage; 