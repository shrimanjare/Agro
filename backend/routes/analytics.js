import express from 'express';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Expense from '../models/Expense.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/profit-loss
// @desc    Get profit and loss analysis
// @access  Private/Admin
router.get('/profit-loss', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { startDate, endDate, period = 'monthly' } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get revenue from invoices
    const revenue = await Invoice.aggregate([
      { $match: { ...dateFilter, paymentStatus: { $in: ['paid', 'partial'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grandTotal' },
          totalInvoices: { $sum: 1 }
        }
      }
    ]);

    // Get expenses
    const expenseFilter = {};
    if (startDate && endDate) {
      expenseFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = revenue[0]?.totalRevenue || 0;
    const totalExpenses = expenses[0]?.totalExpenses || 0;
    const profit = totalRevenue - totalExpenses;

    // Monthly breakdown
    let groupBy;
    switch (period) {
      case 'daily':
        groupBy = {
          day: { $dayOfMonth: '$invoiceDate' },
          month: { $month: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
        break;
      case 'weekly':
        groupBy = {
          week: { $week: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
        break;
      default:
        groupBy = {
          month: { $month: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
    }

    const monthlyData = await Invoice.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$grandTotal' },
          invoices: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      summary: {
        totalRevenue,
        totalExpenses,
        profit,
        profitMargin: totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0
      },
      monthlyData
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/top-customers
// @desc    Get top customers by purchase amount
// @access  Private/Admin
router.get('/top-customers', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const topCustomers = await Invoice.aggregate([
      {
        $group: {
          _id: '$customer',
          totalPurchases: { $sum: '$grandTotal' },
          totalInvoices: { $sum: 1 },
          lastPurchase: { $max: '$invoiceDate' }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      { $unwind: '$customerInfo' },
      { $sort: { totalPurchases: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({ topCustomers });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/inventory-value
// @desc    Get inventory valuation
// @access  Private/Admin
router.get('/inventory-value', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const inventoryValue = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    const overallValue = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalProducts: { $sum: 1 }
        }
      }
    ]);

    res.json({
      categoryWise: inventoryValue,
      overall: overallValue[0] || { totalValue: 0, totalProducts: 0 }
    });
  } catch (error) {
    next(error);
  }
});

export default router;