import { Router } from 'express';
import {
  createImportRequest,
  getImportRequests,
  updateImportRequestStatus,
  getImportRequest
} from '../controllers/importRequestController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { createImportRequestValidation, searchValidation } from '../middleware/validation';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Public route
router.post('/', createImportRequestValidation, createImportRequest);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, searchValidation, getImportRequests);
router.get('/admin/:id', authenticateToken, requireAdmin, getImportRequest);
router.put(
  '/admin/:id/status',
  authenticateToken,
  requireAdmin,
  [
    body('status')
      .isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'])
      .withMessage('Invalid status'),
    handleValidationErrors
  ],
  updateImportRequestStatus
);

export default router; 