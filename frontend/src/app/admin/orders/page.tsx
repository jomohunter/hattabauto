'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Order, OrdersResponse } from '@/types';
import { ordersApi } from '@/lib/api';
import { formatDateShort, getStatusColor, getStatusText } from '@/lib/utils';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrdersResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async (page = 1, status = '') => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getOrders({
        page,
        limit: 10,
        status: status || undefined
      });
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentPage, selectedStatus);
  }, [currentPage, selectedStatus]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      await ordersApi.updateOrderStatus(orderId, newStatus);
      
      // Update the order in the local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      toast.success(`Order status updated to ${getStatusText(newStatus)}`);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'PENDING':
        return 'PROCESSING';
      case 'PROCESSING':
        return 'COMPLETED';
      default:
        return currentStatus;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'PROCESSING':
        return <TruckIcon className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
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

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Cash on Delivery Orders
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage all cash-on-delivery orders and update their status
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => handleStatusFilter('')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedStatus === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => handleStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedStatus === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter('PROCESSING')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedStatus === 'PROCESSING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => handleStatusFilter('COMPLETED')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedStatus === 'COMPLETED'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Orders List */}
          <div className="mt-6">
            {orders.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <li key={order.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {order.productName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Customer: {order.customerName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Phone: {order.phone}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {order.quantity}
                              </p>
                              <p className="text-sm text-gray-500">
                                Order Date: {formatDateShort(order.createdAt)}
                              </p>
                            </div>
                            
                            <div className="ml-4 flex items-center space-x-4">
                              {/* Status */}
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(order.status)}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2">
                                {order.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                                    disabled={isUpdating}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                  >
                                    <TruckIcon className="h-3 w-3 mr-1" />
                                    Start Processing
                                  </button>
                                )}
                                
                                {order.status === 'PROCESSING' && (
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                                    disabled={isUpdating}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    Mark Delivered
                                  </button>
                                )}

                                {/* View Details Button */}
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  <EyeIcon className="h-3 w-3 mr-1" />
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ClockIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  {selectedStatus ? `No ${selectedStatus.toLowerCase()} orders` : 'No orders have been placed yet'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedOrder(null)}></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Order Details
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Product</h4>
                    <p className="text-gray-600">{selectedOrder.productName}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Information</h4>
                    <p className="text-gray-600">Name: {selectedOrder.customerName}</p>
                    <p className="text-gray-600">Phone: {selectedOrder.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Delivery Address</h4>
                    <p className="text-gray-600">{selectedOrder.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Order Details</h4>
                    <p className="text-gray-600">Quantity: {selectedOrder.quantity}</p>
                    <p className="text-gray-600">Status: {getStatusText(selectedOrder.status)}</p>
                    <p className="text-gray-600">Order Date: {formatDateShort(selectedOrder.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminOrdersPage; 