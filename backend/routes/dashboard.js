import express from 'express';
import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    // Today's sales
    const todaysSales = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$grandTotal' },
          totalInvoices: { $sum: 1 }
        }
      }
    ]);

    // Total customers
    const totalCustomers = await Customer.countDocuments({ isActive: true });

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Low stock products
    const products = await Product.find({ isActive: true });
    const lowStockProducts = products.filter(product => 
      product.stock <= product.lowStockThreshold
    );

    // This month's sales
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlySales = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$grandTotal' },
          totalInvoices: { $sum: 1 }
        }
      }
    ]);

    // Recent invoices
    const recentInvoices = await Invoice.find()
      .populate('customer', 'name phone')
      .sort({ invoiceDate: -1 })
      .limit(5);

    res.json({
      todaysSales: todaysSales[0] || { totalSales: 0, totalInvoices: 0 },
      totalCustomers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      monthlySales: monthlySales[0] || { totalSales: 0, totalInvoices: 0 },
      recentInvoices,
      lowStockProducts: lowStockProducts.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/sales-chart
// @desc    Get sales chart data (last 7 days)
// @access  Private
router.get('/sales-chart', authenticate, async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    const today = new Date();
    let startDate;
    let groupBy;

    switch (period) {
      case '7d':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          day: { $dayOfMonth: '$invoiceDate' },
          month: { $month: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
        break;
      case '30d':
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          day: { $dayOfMonth: '$invoiceDate' },
          month: { $month: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
        break;
      case '12m':
        startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupBy = {
          month: { $month: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
        break;
      default:
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          day: { $dayOfMonth: '$invoiceDate' },
          month: { $month: '$invoiceDate' },
          year: { $year: '$invoiceDate' }
        };
    }

    const salesData = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: '$grandTotal' },
          totalInvoices: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({ salesData, period });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/top-products
// @desc    Get top selling products
// @access  Private
router.get('/top-products', authenticate, async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Invoice.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: { $sum: '$items.totalAmount' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({ topProducts });
  } catch (error) {
    next(error);
  }
});

export default router;