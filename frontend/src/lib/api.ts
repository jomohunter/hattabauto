import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ImportRequest,
  CreateImportRequestDTO,
  AuthResponse,
  LoginDTO,
  ProductsResponse,
  ImportRequestsResponse,
  SearchParams,
  ApiError,
  Order,
  CreateOrderDTO,
  OrdersResponse
} from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
        window.location.href = '/admin/login';
      }
    }
    
    // Show error toast for user-facing errors
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },
};

// Products API
export const productsApi = {
  getProducts: async (params?: SearchParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>('/products', { params });
    return data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/products/categories');
    return data;
  },

  // Admin endpoints
  getAdminProducts: async (params?: SearchParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>('/products/admin/all', { params });
    return data;
  },

  createProduct: async (productData: CreateProductDTO, image?: File): Promise<Product> => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      const value = productData[key as keyof CreateProductDTO];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    if (image) {
      formData.append('image', image);
    }

    const { data } = await api.post<Product>('/products/admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  updateProduct: async (id: string, productData: UpdateProductDTO, image?: File): Promise<Product> => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      const value = productData[key as keyof UpdateProductDTO];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    if (image) {
      formData.append('image', image);
    }

    const { data } = await api.put<Product>(`/products/admin/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/admin/${id}`);
  },
};

// Import Requests API
export const importRequestsApi = {
  createImportRequest: async (requestData: CreateImportRequestDTO): Promise<ImportRequest> => {
    const { data } = await api.post<{ message: string; request: ImportRequest }>('/import-requests', requestData);
    return data.request;
  },

  // Admin endpoints
  getImportRequests: async (params?: { page?: number; limit?: number; status?: string; q?: string }): Promise<ImportRequestsResponse> => {
    const { data } = await api.get<ImportRequestsResponse>('/import-requests/admin', { params });
    return data;
  },

  getImportRequest: async (id: string): Promise<ImportRequest> => {
    const { data } = await api.get<ImportRequest>(`/import-requests/admin/${id}`);
    return data;
  },

  updateImportRequestStatus: async (id: string, status: ImportRequest['status']): Promise<ImportRequest> => {
    const { data } = await api.put<ImportRequest>(`/import-requests/admin/${id}/status`, { status });
    return data;
  },

  updateRequestStatus: async (id: string, status: ImportRequest['status']): Promise<ImportRequest> => {
    const { data } = await api.put<ImportRequest>(`/import-requests/admin/${id}/status`, { status });
    return data;
  },
};

// Orders API
export const ordersApi = {
  createOrder: async (orderData: CreateOrderDTO): Promise<Order> => {
    const { data } = await api.post<{ message: string; order: Order }>('/orders', orderData);
    return data.order;
  },

  // Admin endpoints
  getOrders: async (params?: { page?: number; limit?: number; status?: string }): Promise<OrdersResponse> => {
    const { data } = await api.get<OrdersResponse>('/orders', { params });
    return data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const { data } = await api.patch<{ message: string; order: Order }>(`/orders/${id}/status`, { status });
    return data.order;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    const { data } = await api.get('/health');
    return data;
  },
};

export default api; 