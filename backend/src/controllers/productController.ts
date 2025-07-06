import { Response } from 'express';
import { AuthenticatedRequest, CreateProductDTO, UpdateProductDTO } from '../types';
import prisma from '../config/database';
import fs from 'fs';
import path from 'path';

// Get all products (public)
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.q as string;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { partNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product by ID (public)
export const getProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products for admin (includes inactive)
export const getAdminProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.q as string;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { partNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create product (admin only)
export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const productData: CreateProductDTO = req.body;
    const imageFile = req.file;

    const data: any = {
      ...productData,
      quantity: productData.quantity ? parseInt(productData.quantity as any) : 0,
      price: productData.price ? parseFloat(productData.price as any) : 0,
      isActive: true
    };

    if (imageFile) {
      data.image = `/uploads/${imageFile.filename}`;
    }

    const product = await prisma.product.create({
      data
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product (admin only)
export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateProductDTO = req.body;
    const imageFile = req.file;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const data: any = { ...updateData };

    if (updateData.price) {
      data.price = parseFloat(updateData.price.toString());
    }

    if (imageFile) {
      // Delete old image if exists
      if (existingProduct.image) {
        const oldImagePath = path.join(process.cwd(), 'uploads', path.basename(existingProduct.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      data.image = `/uploads/${imageFile.filename}`;
    }

    const product = await prisma.product.update({
      where: { id },
      data
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(process.cwd(), 'uploads', path.basename(product.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product categories (public)
export const getCategories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { not: null }
      },
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories
      .map(p => p.category)
      .filter(Boolean)
      .sort();

    res.json(categoryList);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 