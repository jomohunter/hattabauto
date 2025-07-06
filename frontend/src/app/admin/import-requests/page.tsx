'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import { importRequestsApi } from '@/lib/api';
import { ImportRequest } from '@/types';

const AdminImportRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ImportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    loadRequests();
  }, [user, router, filter]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await importRequestsApi.getImportRequests({ 
        status: filter === 'ALL' ? undefined : filter,
        q: searchTerm || undefined
      });
      setRequests(response.requests);
    } catch (error) {
      console.error('Error loading import requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED') => {
    try {
      await importRequestsApi.updateRequestStatus(requestId, newStatus);
      loadRequests(); // Reload the list
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleSearch = () => {
    loadRequests();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              Import Requests Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer import requests
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="ALL">All Requests</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by part name, customer..."
                  className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadRequests}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading requests...</p>
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{request.partName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Customer</p>
                            <p className="text-sm text-gray-900">{request.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Contact</p>
                            <p className="text-sm text-gray-900">{request.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-sm text-gray-900">{request.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Vehicle</p>
                            <p className="text-sm text-gray-900">{request.carMake} {request.carModel} ({request.carYear})</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Quantity</p>
                            <p className="text-sm text-gray-900">{request.quantity || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Submitted</p>
                            <p className="text-sm text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {request.additionalNotes && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                            <p className="text-sm text-gray-900 mt-1">{request.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'PROCESSING')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Start Processing
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'PROCESSING' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </button>
                      )}
                      {(request.status === 'COMPLETED' || request.status === 'REJECTED') && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'PENDING')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No import requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminImportRequestsPage; 