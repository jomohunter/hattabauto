import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  createProductValidation,
  updateProductValidation,
  searchValidation
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', searchValidation, getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, searchValidation, getAdminProducts);
router.post(
  '/admin',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  createProductValidation,
  createProduct
);
router.put(
  '/admin/:id',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  updateProductValidation,
  updateProduct
);
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteProduct);

export default router; 