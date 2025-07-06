'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSearch = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showSearch={showSearch} />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 