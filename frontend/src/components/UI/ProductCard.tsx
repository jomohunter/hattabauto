'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice, getImageUrl, truncateText } from '@/lib/utils';
import BuyNowModal from './BuyNowModal';
import { t } from '@/i18n';

interface ProductCardProps {
  product: Product;
  showAdminInfo?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAdminInfo = false }) => {
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover object-center hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-product.jpg';
            }}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            <Link 
              href={`/products/${product.id}`}
              className="hover:text-primary-600 transition-colors duration-200"
            >
              {product.name}
            </Link>
          </h3>
          {showAdminInfo && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.isActive ? t('product.card.active') : t('product.card.inactive')}
            </span>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {truncateText(product.description, 80)}
          </p>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(Number(product.price))}
          </span>
          <span className="text-sm text-gray-500">
            {t('product.card.quantity', { quantity: product.quantity })}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.brand && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {product.brand}
            </span>
          )}
          {product.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {product.category}
            </span>
          )}
        </div>
        
        {product.partNumber && (
          <p className="text-xs text-gray-500 mb-3">
            {t('product.card.partNumber', { partNumber: product.partNumber })}
          </p>
        )}
        
        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 text-center"
          >
            {t('product.card.viewDetails')}
          </Link>
          
          {product.quantity > 0 ? (
            <button
              onClick={() => setIsBuyNowModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {t('product.card.buyNow')}
            </button>
          ) : (
            <span className="px-3 py-2 text-xs text-red-600 font-medium bg-red-50 rounded-lg">
              {t('product.card.outOfStock')}
            </span>
          )}
        </div>
      </div>
      
      {/* Buy Now Modal */}
      <BuyNowModal
        product={product}
        isOpen={isBuyNowModalOpen}
        onClose={() => setIsBuyNowModalOpen(false)}
      />
    </div>
  );
};

export default ProductCard; 