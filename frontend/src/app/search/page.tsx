'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import ProductCard from '@/components/UI/ProductCard';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Product, ProductsResponse, SearchParams } from '@/types';
import { productsApi } from '@/lib/api';
import { debounce } from '@/lib/utils';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentSearch = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || '';

  const debouncedUpdateURL = debounce((params: SearchParams) => {
    const urlParams = new URLSearchParams();
    
    if (params.q) urlParams.set('q', params.q);
    if (params.category) urlParams.set('category', params.category);
    if (params.page && params.page > 1) urlParams.set('page', params.page.toString());
    
    const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : '';
    router.push(`/search${newUrl}`);
  }, 300);

  const loadProducts = async (params: SearchParams = {}) => {
    try {
      setIsLoading(true);
      const response = await productsApi.getProducts({
        q: params.q || currentSearch,
        category: params.category || currentCategory,
        page: params.page || currentPage,
        limit: 12
      });
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productsApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    setSearchQuery(currentSearch);
    loadProducts();
    loadCategories();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams: SearchParams = { 
      q: searchQuery.trim(), 
      category: currentCategory, 
      page: 1 
    };
    debouncedUpdateURL(newParams);
  };

  const handleCategoryChange = (category: string) => {
    const newParams: SearchParams = { 
      q: currentSearch, 
      category: category === currentCategory ? '' : category,
      page: 1 
    };
    debouncedUpdateURL(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams: SearchParams = { 
      q: currentSearch, 
      category: currentCategory, 
      page 
    };
    debouncedUpdateURL(newParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    debouncedUpdateURL({});
  };

  const hasActiveFilters = currentSearch || currentCategory;

  return (
    <Layout showSearch={false}>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
              Search Results
              {currentSearch && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  for "{currentSearch}"
                </span>
              )}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  placeholder="Search for car parts..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-r-lg font-medium transition-colors duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-x-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={currentCategory === category}
                            onChange={() => handleCategoryChange(category)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-600">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Results Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  {isLoading ? (
                    <span>Searching...</span>
                  ) : (
                    <span>
                      {pagination?.total || 0} product{(pagination?.total || 0) !== 1 ? 's' : ''} found
                      {currentSearch && ` for "${currentSearch}"`}
                      {currentCategory && ` in "${currentCategory}"`}
                    </span>
                  )}
                </div>
                
                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Search Results */}
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {currentSearch ? (
                          <>
                            We couldn't find any products matching "<strong>{currentSearch}</strong>".
                            <br />
                            Try searching with different keywords or browse our categories.
                          </>
                        ) : (
                          'Enter a search term to find products.'
                        )}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                          >
                            Clear search
                          </button>
                        )}
                        <a
                          href="/import-request"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Request specific part
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= pagination.pages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing{' '}
                            <span className="font-medium">
                              {(currentPage - 1) * (pagination.limit || 12) + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * (pagination.limit || 12), pagination.total)}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">{pagination.total}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage <= 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                              const page = i + Math.max(1, currentPage - 2);
                              if (page > pagination.pages) return null;
                              return (
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
                              );
                            })}
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage >= pagination.pages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage; 