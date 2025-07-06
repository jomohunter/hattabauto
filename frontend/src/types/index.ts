export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  quantity: number;
  price: number;
  category?: string;
  brand?: string;
  partNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  brand?: string;
  partNumber?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  isActive?: boolean;
}

export interface ImportRequest {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  carMake: string;
  carModel: string;
  carYear: number;
  partName: string;
  description?: string;
  quantity?: number;
  additionalNotes?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportRequestDTO {
  customerName: string;
  email: string;
  phone?: string;
  carMake: string;
  carModel: string;
  carYear: number;
  partName: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export interface ImportRequestsResponse {
  requests: ImportRequest[];
  pagination: PaginationInfo;
}

export interface SearchParams {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  address: string;
  phone: string;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDTO {
  productId: string;
  productName: string;
  customerName: string;
  address: string;
  phone: string;
  quantity: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationInfo;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
} 