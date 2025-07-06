'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import ProductCard from '@/components/UI/ProductCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Product } from '@/types';
import { productsApi } from '@/lib/api';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { t } from '@/i18n';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await productsApi.getProducts({ limit: 8 });
        setFeaturedProducts(response.products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{t('home.hero.title')}</span>{' '}
                  <span className="block text-primary-600 xl:inline">{t('home.hero.subtitle')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t('home.hero.description')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      {t('home.hero.browseProducts')}
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/import-request"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      {t('home.hero.requestImport')}
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gray-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-600">Car Parts & Components</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              {t('home.features.title')}
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">{t('home.features.authenticParts.title')}</h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.authenticParts.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">{t('home.features.fastImport.title')}</h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.fastImport.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 109.5 9.5A9.5 9.5 0 0012 2.5zM8 12l2.5 2.5L16 8" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">{t('home.features.expertSupport.title')}</h3>
                <p className="mt-2 text-base text-gray-500">
                  {t('home.features.expertSupport.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {t('home.featuredProducts.title')}
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                {t('home.featuredProducts.subtitle')}
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              {t('home.featuredProducts.viewAllProducts')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('home.featuredProducts.noProducts')}</p>
              <Link
                href="/import-request"
                className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('home.featuredProducts.requestSpecificPart')}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">{t('home.cta.title')}</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            {t('home.cta.description')}
          </p>
          <Link
            href="/import-request"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto transition-colors duration-200"
          >
            {t('home.cta.submitRequest')}
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 