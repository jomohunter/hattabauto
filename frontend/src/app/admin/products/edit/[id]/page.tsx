'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Product, UpdateProductDTO } from '@/types';
import { productsApi } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { ArrowLeftIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<UpdateProductDTO>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: '',
    brand: '',
    partNumber: '',
    isActive: true
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    if (id) {
      loadProduct();
    }
  }, [user, id, router]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const productData = await productsApi.getProduct(id as string);
      setProduct(productData);
      setFormData({
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        quantity: productData.quantity,
        category: productData.category || '',
        brand: productData.brand || '',
        partNumber: productData.partNumber || '',
        isActive: productData.isActive
      });
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.partNumber?.trim()) {
      toast.error('Name and Part Number are required');
      return;
    }

    if ((formData.price || 0) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if ((formData.quantity || 0) < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }

    setIsSubmitting(true);

    try {
      await productsApi.updateProduct(id as string, formData, selectedImage || undefined);
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div>Redirecting...</div>;
  }

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
            <p className="text-gray-600 mb-8">The product you're trying to edit doesn't exist.</p>
            <button
              onClick={() => router.push('/admin/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/products')}
              className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-600">Update product information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="partNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Part Number *
                    </label>
                    <input
                      type="text"
                      id="partNumber"
                      name="partNumber"
                      value={formData.partNumber || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category & Brand</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (visible to customers)
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Image</h3>
                
                {/* Current Image */}
                {product.image && !imagePreview && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <div className="relative">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* New Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProductPage; 