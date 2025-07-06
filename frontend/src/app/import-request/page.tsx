'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout/Layout';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { CreateImportRequestDTO } from '@/types';
import { importRequestsApi } from '@/lib/api';
import { isValidEmail, isValidPhoneNumber, getCurrentYear } from '@/lib/utils';
import { DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { t } from '@/i18n';

const ImportRequestPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateImportRequestDTO>();

  const onSubmit = async (data: CreateImportRequestDTO) => {
    try {
      setIsSubmitting(true);
      await importRequestsApi.createImportRequest(data);
      setIsSubmitted(true);
      toast.success(t('importRequest.form.success'));
      reset();
    } catch (error) {
      console.error('Error submitting import request:', error);
      toast.error(t('importRequest.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your import request. Our team will review your requirements and contact you within 24-48 hours with a quote and availability information.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Submit Another Request
              </button>
              <br />
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <DocumentTextIcon className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {t('importRequest.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('importRequest.subtitle')}
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Authentic Parts</h3>
              <p className="text-gray-600">We source only genuine parts from authorized dealers worldwide.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600">We'll get back to you within 24-48 hours with availability and pricing.</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Best prices guaranteed with transparent import costs.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.customerName')} *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      {...register('customerName', {
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.email')} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        validate: (value) => isValidEmail(value) || 'Please enter a valid email address'
                      })}
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.phone')} (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone', {
                        validate: (value) => !value || isValidPhoneNumber(value) || 'Please enter a valid phone number'
                      })}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="carMake" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.carMake')} *
                    </label>
                    <input
                      id="carMake"
                      type="text"
                      {...register('carMake', {
                        required: 'Car make is required'
                      })}
                      className="form-input"
                      placeholder="e.g., Toyota, Honda, BMW"
                    />
                    {errors.carMake && (
                      <p className="mt-1 text-sm text-red-600">{errors.carMake.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.carModel')} *
                    </label>
                    <input
                      id="carModel"
                      type="text"
                      {...register('carModel', {
                        required: 'Car model is required'
                      })}
                      className="form-input"
                      placeholder="e.g., Camry, Civic, X5"
                    />
                    {errors.carModel && (
                      <p className="mt-1 text-sm text-red-600">{errors.carModel.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="carYear" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.carYear')} *
                    </label>
                    <input
                      id="carYear"
                      type="number"
                      min="1900"
                      max={getCurrentYear() + 1}
                      {...register('carYear', {
                        required: 'Car year is required',
                        min: { value: 1900, message: 'Year must be 1900 or later' },
                        max: { value: getCurrentYear() + 1, message: `Year cannot be later than ${getCurrentYear() + 1}` }
                      })}
                      className="form-input"
                      placeholder="e.g., 2020"
                    />
                    {errors.carYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.carYear.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Part Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Part Information</h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="partName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.partName')} *
                    </label>
                    <input
                      id="partName"
                      type="text"
                      {...register('partName', {
                        required: 'Part name is required'
                      })}
                      className="form-input"
                      placeholder="e.g., Brake Pads, Air Filter, Timing Belt"
                    />
                    {errors.partName && (
                      <p className="mt-1 text-sm text-red-600">{errors.partName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('importRequest.form.description')}
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      {...register('description')}
                      className="form-textarea"
                      placeholder="Provide additional details about the part you need, such as specific specifications, OEM part numbers, or any other relevant information that would help us source the correct part."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    t('importRequest.form.submit')
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How long does the import process take?</h3>
                <p className="text-gray-600">
                  Typically 7-21 days depending on the part availability and shipping method. We'll provide an estimated timeline when we quote.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Do you provide warranties?</h3>
                <p className="text-gray-600">
                  Yes, all imported parts come with manufacturer warranties. We also provide additional import guarantees for peace of mind.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">What are the payment terms?</h3>
                <p className="text-gray-600">
                  We typically require 50% upfront with the balance due upon delivery. We accept various payment methods including bank transfers and credit cards.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can you help with installation?</h3>
                <p className="text-gray-600">
                  While we focus on importing, we can recommend trusted mechanics and service centers in your area for installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImportRequestPage; 