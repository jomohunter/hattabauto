import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  brand?: string;
  partNumber: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  isActive?: boolean;
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

export interface CreateOrderDTO {
  productId: string;
  productName: string;
  customerName: string;
  address: string;
  phone: string;
  quantity: number;
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

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
} 