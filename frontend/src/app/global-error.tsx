'use client';

import React from 'react';
import Link from 'next/link';

const GlobalErrorPage: React.FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-red-200 mb-4">⚠️</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Something went wrong!
              </h2>
              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left text-sm text-gray-500 bg-gray-100 p-4 rounded-md">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
                  {error.digest && (
                    <p className="mt-2 text-xs">Error ID: {error.digest}</p>
                  )}
                </details>
              )}
            </div>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                Try Again
              </button>
              
              <div className="text-sm text-gray-500">
                <Link href="/" className="text-primary-600 hover:text-primary-700">
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalErrorPage; 