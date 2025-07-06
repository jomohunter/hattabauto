'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Product, CreateOrderDTO } from '@/types';
import { ordersApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { t } from '@/i18n';

interface BuyNowModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ product, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: '',
    quantity: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.address.trim() || !formData.phone.trim()) {
      toast.error(t('product.order.validation.fillAllFields'));
      return;
    }

    if (formData.quantity < 1) {
      toast.error(t('product.order.validation.quantityMin'));
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData: CreateOrderDTO = {
        productId: product.id,
        productName: product.name,
        customerName: formData.customerName.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        quantity: formData.quantity
      };

      await ordersApi.createOrder(orderData);
      
      toast.success(t('product.order.validation.success'));
      onClose();
      
      // Reset form
      setFormData({
        customerName: '',
        address: '',
        phone: '',
        quantity: 1
      });
    } catch (error) {
      console.error('Error creating order:', error);
      // Error is already handled by the API interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t('product.order.title')}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
              <p className="text-lg font-bold text-primary-600">{formatPrice(Number(product.price))}</p>
              {product.partNumber && (
                <p className="text-sm text-gray-500 mt-1">Part #: {product.partNumber}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">{t('product.order.productInfo.available', { quantity: product.quantity })}</p>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.order.form.quantity')}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={product.quantity}
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('product.order.form.quantityPlaceholder')}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{t('product.order.form.maxAvailable', { quantity: product.quantity })}</p>
              </div>

              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.order.form.fullName')}
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('product.order.form.fullNamePlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.order.form.phoneNumber')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('product.order.form.phonePlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product.order.form.deliveryAddress')}
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('product.order.form.addressPlaceholder')}
                  required
                />
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
                <p className="font-medium mb-1">{t('product.order.terms.title')}</p>
                <ul className="space-y-1">
                  <li>{t('product.order.terms.payment')}</li>
                  <li>{t('product.order.terms.delivery')}</li>
                  <li>{t('product.order.terms.contact')}</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('product.order.buttons.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('product.order.buttons.placingOrder') : t('product.order.buttons.placeOrder')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal; 