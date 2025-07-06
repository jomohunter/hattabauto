'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import BuyNowModal from '@/components/UI/BuyNowModal';
import { Product } from '@/types';
import { productsApi } from '@/lib/api';
import { formatPrice, getImageUrl, formatDateShort } from '@/lib/utils';
import { ArrowLeftIcon, CubeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productsApi.getProduct(productId);
        setProduct(response);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Product not found');
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, router]);

  const handleImageError = () => {
    setImageError(true);
  };



  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-900">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image */}
            <div className="flex flex-col-reverse">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <Image
                  src={imageError ? '/images/placeholder-product.jpg' : getImageUrl(product.image)}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-cover object-center rounded-lg"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">{formatPrice(Number(product.price))}</p>
              </div>

              {/* Reviews placeholder */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className="text-yellow-400 h-5 w-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="sr-only">5 out of 5 stars</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="text-base text-gray-700 space-y-6">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available for this product.</p>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  {product.brand && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Brand</dt>
                      <dd className="mt-1 text-sm text-gray-900">{product.brand}</dd>
                    </div>
                  )}
                  {product.category && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                    </div>
                  )}
                  {product.partNumber && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Part Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{product.partNumber}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Availability</dt>
                    <dd className="mt-1 text-sm">
                      {product.quantity > 0 ? (
                        <span className="text-green-600 font-medium">
                          In Stock ({product.quantity} available)
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDateShort(product.updatedAt)}</dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col space-y-4">
                {product.quantity > 0 ? (
                  <button
                    onClick={() => setIsBuyNowModalOpen(true)}
                    className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Buy Now - Cash on Delivery
                  </button>
                ) : (
                  <div className="w-full bg-red-50 border border-red-200 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-red-600">
                    Out of Stock
                  </div>
                )}
                
                <Link
                  href="/import-request"
                  className="w-full bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CubeIcon className="h-5 w-5 mr-2" />
                  Request Similar Part
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Authentic Parts:</span> All our products are sourced from authorized dealers
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Fast Import:</span> Quick processing and delivery worldwide
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Expert Support:</span> Our team is here to help you find the right parts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Buy Now Modal */}
      {product && (
        <BuyNowModal
          product={product}
          isOpen={isBuyNowModalOpen}
          onClose={() => setIsBuyNowModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default ProductDetailPage; 