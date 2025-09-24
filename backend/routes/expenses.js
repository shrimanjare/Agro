import express from 'express';
import { body, validationResult } from 'express-validator';
import Expense from '../models/Expense.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses with filtering and pagination
// @access  Private/Admin
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .populate('createdBy', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      expenses,
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

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private/Admin
router.post('/', authenticate, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').isIn(['Rent', 'Salary', 'Electricity', 'Internet', 'Maintenance', 'Marketing', 'Other']).withMessage('Invalid category'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const expense = new Expense({
      ...req.body,
      createdBy: req.user._id
    });

    await expense.save();

    const populatedExpense = await Expense.findById(expense._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      message: 'Expense created successfully',
      expense: populatedExpense
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private/Admin
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private/Admin
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/expenses/summary
// @desc    Get expense summary
// @access  Private/Admin
router.get('/summary', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      summary,
      totalExpenses: totalExpenses[0]?.total || 0
    });
  } catch (error) {
    next(error);
  }
});

export default router;