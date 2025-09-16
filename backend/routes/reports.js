import express from 'express';
import XLSX from 'xlsx';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/sales
// @desc    Get sales report with filters
// @access  Private
router.get('/sales', authenticate, async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      productId,
      category,
      customerId,
      paymentStatus,
      format = 'json'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (customerId) {
      filter.customer = customerId;
    }

    // Get invoices
    let query = Invoice.find(filter)
      .populate('customer', 'name phone email')
      .populate('createdBy', 'name')
      .sort({ invoiceDate: -1 });

    const invoices = await query;

    // Filter by product or category if specified
    let filteredInvoices = invoices;
    if (productId || category) {
      filteredInvoices = invoices.filter(invoice => {
        return invoice.items.some(item => {
          if (productId) {
            return item.product.toString() === productId;
          }
          if (category) {
            // This would require populating product details
            return true; // Simplified for now
          }
          return true;
        });
      });
    }

    // Calculate summary
    const summary = {
      totalInvoices: filteredInvoices.length,
      totalSales: filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
      totalTax: filteredInvoices.reduce((sum, inv) => sum + inv.totalTax, 0),
      paidAmount: filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
      dueAmount: filteredInvoices.reduce((sum, inv) => sum + inv.dueAmount, 0)
    };

    if (format === 'excel') {
      // Generate Excel file
      const workbook = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ['Sales Report Summary'],
        ['Period', `${startDate || 'All'} to ${endDate || 'All'}`],
        ['Total Invoices', summary.totalInvoices],
        ['Total Sales', summary.totalSales],
        ['Total Tax', summary.totalTax],
        ['Paid Amount', summary.paidAmount],
        ['Due Amount', summary.dueAmount],
        [''],
        ['Invoice Details'],
        ['Invoice No', 'Date', 'Customer', 'Phone', 'Total', 'Tax', 'Paid', 'Due', 'Status']
      ];

      filteredInvoices.forEach(invoice => {
        summaryData.push([
          invoice.invoiceNumber,
          invoice.invoiceDate.toDateString(),
          invoice.customer.name,
          invoice.customer.phone,
          invoice.grandTotal,
          invoice.totalTax,
          invoice.paidAmount,
          invoice.dueAmount,
          invoice.paymentStatus
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="sales-report.xlsx"'
      });

      return res.send(buffer);
    }

    res.json({
      invoices: filteredInvoices,
      summary
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/reports/gst-summary
// @desc    Get GST summary report
// @access  Private
router.get('/gst-summary', authenticate, async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    // Build filter object
    const filter = {};
    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const gstSummary = await Invoice.aggregate([
      { $match: filter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.gstRate',
          totalTaxableValue: { 
            $sum: { 
              $multiply: ['$items.price', '$items.quantity'] 
            }
          },
          totalTaxAmount: { $sum: '$items.taxAmount' },
          invoiceCount: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          gstRate: '$_id',
          totalTaxableValue: 1,
          totalTaxAmount: 1,
          invoiceCount: { $size: '$invoiceCount' }
        }
      },
      { $sort: { gstRate: 1 } }
    ]);

    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      
      const gstData = [
        ['GST Summary Report'],
        ['Period', `${startDate || 'All'} to ${endDate || 'All'}`],
        [''],
        ['GST Rate', 'Taxable Value', 'Tax Amount', 'Invoice Count']
      ];

      gstSummary.forEach(item => {
        gstData.push([
          `${item.gstRate}%`,
          item.totalTaxableValue,
          item.totalTaxAmount,
          item.invoiceCount
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(gstData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'GST Summary');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="gst-summary.xlsx"'
      });

      return res.send(buffer);
    }

    res.json({ gstSummary });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/reports/stock
// @desc    Get stock report
// @access  Private
router.get('/stock', authenticate, async (req, res, next) => {
  try {
    const { category, lowStock, format = 'json' } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    let products = await Product.find(filter).sort({ name: 1 });

    // Filter low stock if requested
    if (lowStock === 'true') {
      products = products.filter(product => 
        product.stock <= product.lowStockThreshold
      );
    }

    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      
      const stockData = [
        ['Stock Report'],
        ['Generated on', new Date().toDateString()],
        [''],
        ['Product Name', 'Category', 'Current Stock', 'Low Stock Threshold', 'Price', 'HSN', 'GST Rate', 'Status']
      ];

      products.forEach(product => {
        stockData.push([
          product.name,
          product.category,
          product.stock,
          product.lowStockThreshold,
          product.price,
          product.hsn,
          `${product.gstRate}%`,
          product.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(stockData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Report');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="stock-report.xlsx"'
      });

      return res.send(buffer);
    }

    res.json({
      products,
      summary: {
        totalProducts: products.length,
        lowStockCount: products.filter(p => p.stock <= p.lowStockThreshold).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;