import express from 'express';
import { body, validationResult } from 'express-validator';
import Customer from '../models/Customer.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers with filtering and pagination
// @access  Private
router.get('/', authenticate, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      customers,
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

// @route   GET /api/customers/:id
// @desc    Get single customer
// @access  Private
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private
router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Customer name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('gstNumber').optional().isLength({ min: 15, max: 15 }).withMessage('GST number must be 15 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const customer = new Customer(req.body);
    await customer.save();

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', authenticate, [
  body('name').optional().notEmpty().withMessage('Customer name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('gstNumber').optional().isLength({ min: 15, max: 15 }).withMessage('GST number must be 15 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer (soft delete)
// @access  Private
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;