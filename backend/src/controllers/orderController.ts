import { Request, Response } from 'express';
import { CreateOrderDTO } from '../types';
import prisma from '../config/database';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { productId, productName, customerName, address, phone, quantity = 1 }: CreateOrderDTO = req.body;

    // Validate required fields
    if (!productId || !productName || !customerName || !address || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'productId, productName, customerName, address, and phone are required'
      });
    }

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true
      }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The specified product does not exist or is not available'
      });
    }

    // Check if product is in stock
    if (product.quantity <= 0) {
      return res.status(400).json({
        error: 'Product out of stock',
        message: 'This product is currently out of stock'
      });
    }

    // Check if requested quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({
        error: 'Insufficient stock',
        message: `Only ${product.quantity} items available in stock`
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        productId,
        productName,
        customerName,
        address,
        phone,
        quantity,
        status: 'PENDING'
      }
    });

    // Update product quantity (decrease by requested quantity)
    await prisma.product.update({
      where: { id: productId },
      data: { quantity: product.quantity - quantity }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        productId: order.productId,
        productName: order.productName,
        customerName: order.customerName,
        address: order.address,
        phone: order.phone,
        quantity: order.quantity,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create order'
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = status ? { status: status as string } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.order.count({ where })
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The specified order does not exist'
      });
    }

    res.json(order);

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Missing status',
        message: 'Status is required'
      });
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: PENDING, PROCESSING, COMPLETED, CANCELLED'
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update order status'
    });
  }
}; 