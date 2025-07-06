'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import { productsApi, importRequestsApi, ordersApi } from '@/lib/api';
import { Product, ImportRequest, Order } from '@/types';
import { t } from '@/i18n';

const AdminDashboardPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentRequests, setRecentRequests] = useState<ImportRequest[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Wait for authentication to be determined
    if (user === null && !isLoading) {
      router.push('/admin/login');
      return;
    }

    if (user && user.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    if (user && user.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [user, router, isLoading]);

  const loadDashboardData = async () => {
    try {
      // Load products
      const productsResponse = await productsApi.getProducts({ limit: 5 });
      setRecentProducts(productsResponse.products);
      setStats(prev => ({ ...prev, totalProducts: productsResponse.pagination.total }));

      // Load import requests
      const requestsResponse = await importRequestsApi.getImportRequests({ limit: 5 });
      setRecentRequests(requestsResponse.requests);
      const pendingCount = requestsResponse.requests.filter(req => req.status === 'PENDING').length;
      setStats(prev => ({ 
        ...prev, 
        totalRequests: requestsResponse.pagination.total,
        pendingRequests: pendingCount
      }));

      // Load orders
      const ordersResponse = await ordersApi.getOrders({ limit: 5 });
      setRecentOrders(ordersResponse.orders);
      const pendingOrdersCount = ordersResponse.orders.filter(order => order.status === 'PENDING').length;
      setStats(prev => ({ 
        ...prev, 
        totalOrders: ordersResponse.pagination.total,
        pendingOrders: pendingOrdersCount
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">{t('admin.checkingAuth')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <div>Redirecting...</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {t('admin.dashboard.title')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('admin.dashboard.welcome', { email: user.email })}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={handleLogout}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('admin.dashboard.logout')}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.dashboard.stats.totalProducts')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2 1 1 0 100-2h-3a1 1 0 100 2v1H7V3a1 1 0 10-2 0h-3a1 1 0 100 2 2 2 0 012 2v1a2 2 0 00-2 2v6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.dashboard.stats.importRequests')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalRequests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.dashboard.stats.pendingRequests')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingRequests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.dashboard.stats.cashOnDelivery')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {t('admin.dashboard.quickActions.title')}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/products/add"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {t('admin.dashboard.quickActions.addProduct')}
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/products"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {t('admin.dashboard.quickActions.viewProducts')}
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/import-requests"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {t('admin.dashboard.quickActions.viewRequests')}
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/orders"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {t('admin.dashboard.quickActions.viewOrders')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage; 