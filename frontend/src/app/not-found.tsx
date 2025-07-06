'use client';

import React from 'react';
import Link from 'next/link';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/products" className="text-primary-600 hover:text-primary-700">
              Browse Products
            </Link>
            {' • '}
            <Link href="/import-request" className="text-primary-600 hover:text-primary-700">
              Request Import
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 