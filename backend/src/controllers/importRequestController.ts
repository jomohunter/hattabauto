import { Response } from 'express';
import { AuthenticatedRequest, CreateImportRequestDTO } from '../types';
import prisma from '../config/database';

// Create import request (public)
export const createImportRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestData: CreateImportRequestDTO = req.body;

    const importRequest = await prisma.importRequest.create({
      data: requestData
    });

    res.status(201).json({
      message: 'Import request submitted successfully',
      request: importRequest
    });
  } catch (error) {
    console.error('Create import request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all import requests (admin only)
export const getImportRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.importRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.importRequest.count({ where })
    ]);

    res.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get import requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update import request status (admin only)
export const updateImportRequestStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const importRequest = await prisma.importRequest.findUnique({
      where: { id }
    });

    if (!importRequest) {
      return res.status(404).json({ error: 'Import request not found' });
    }

    const updatedRequest = await prisma.importRequest.update({
      where: { id },
      data: { status }
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error('Update import request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single import request (admin only)
export const getImportRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const importRequest = await prisma.importRequest.findUnique({
      where: { id }
    });

    if (!importRequest) {
      return res.status(404).json({ error: 'Import request not found' });
    }

    res.json(importRequest);
  } catch (error) {
    console.error('Get import request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 