import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Private
router.get('/', authenticate, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      sortBy = 'name',
      sortOrder = 'asc',
      lowStock
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { hsn: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    let query = Product.find(filter).sort(sort);

    // Apply low stock filter if requested
    if (lowStock === 'true') {
      const products = await Product.find(filter);
      const lowStockProducts = products.filter(product => product.stock <= product.lowStockThreshold);
      const total = lowStockProducts.length;
      const startIndex = (page - 1) * limit;
      const paginatedProducts = lowStockProducts.slice(startIndex, startIndex + parseInt(limit));
      
      return res.json({
        products: paginatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: startIndex + parseInt(limit) < total,
          hasPrev: page > 1
        }
      });
    }

    // Regular pagination
    const total = await Product.countDocuments(filter);
    const products = await query
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').isIn(['Pesticide', 'Fertilizer', 'Seed', 'Tool', 'Other']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('hsn').notEmpty().withMessage('HSN code is required'),
  body('gstRate').isIn([0, 5, 12, 18, 28]).withMessage('Invalid GST rate')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', authenticate, [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('category').optional().isIn(['Pesticide', 'Fertilizer', 'Seed', 'Tool', 'Other']).withMessage('Invalid category'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('gstRate').optional().isIn([0, 5, 12, 18, 28]).withMessage('Invalid GST rate')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/categories/list
// @desc    Get product categories
// @access  Private
router.get('/categories/list', authenticate, async (req, res) => {
  const categories = ['Pesticide', 'Fertilizer', 'Seed', 'Tool', 'Other'];
  res.json({ categories });
});

// @route   POST /api/products/:id/update-stock
// @desc    Update product stock
// @access  Private
router.post('/:id/update-stock', authenticate, [
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  body('operation').isIn(['add', 'subtract']).withMessage('Operation must be add or subtract')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { quantity, operation } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (operation === 'add') {
      product.stock += quantity;
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.stock -= quantity;
    }

    await product.save();

    res.json({
      message: 'Stock updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
});

export default router;