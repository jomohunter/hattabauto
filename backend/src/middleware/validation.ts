import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Auth validation rules
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// Product validation rules
export const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Product name is required and must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Brand must be less than 100 characters'),
  body('partNumber')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Part number is required and must be less than 50 characters'),
  handleValidationErrors
];

export const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Product name must be less than 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Brand must be less than 100 characters'),
  body('partNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Part number must be less than 50 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors
];

// Import request validation rules
export const createImportRequestValidation = [
  body('customerName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name is required and must be less than 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Valid phone number is required'),
  body('carMake')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Car make is required and must be less than 50 characters'),
  body('carModel')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Car model is required and must be less than 50 characters'),
  body('carYear')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Valid car year is required'),
  body('partName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Part name is required and must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  handleValidationErrors
];

// Search validation rules
export const searchValidation = [
  query('q')
    .optional()
    .trim()
    .custom((value) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value.length < 1 || value.length > 100) {
          throw new Error('Search query must be between 1 and 100 characters');
        }
      }
      return true;
    }),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be less than 100 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
]; 