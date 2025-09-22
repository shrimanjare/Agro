import express from 'express';
import { body, validationResult } from 'express-validator';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import XLSX from 'xlsx';
import numberToWords from 'number-to-words';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { authenticate } from '../middleware/auth.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { sendInvoiceWhatsApp } from '../utils/whatsappService.js';
import { sendInvoiceEmail } from '../utils/emailService.js';

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get all invoices with filtering and pagination
// @access  Private
router.get('/', authenticate, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      startDate,
      endDate,
      sortBy = 'invoiceDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.paymentStatus = status;
    }

    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .populate('customer', 'name phone email')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      invoices,
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

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('createdBy', 'name')
      .populate('items.product');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ invoice });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
router.post('/', authenticate, [
  body('customer').notEmpty().withMessage('Customer is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').notEmpty().withMessage('Product is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').isIn(['cash', 'card', 'upi', 'bank_transfer']).withMessage('Invalid payment method')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { customer, items, discount = 0, paymentMethod, paidAmount = 0, notes } = req.body;

    // Validate customer exists
    const customerDoc = await Customer.findById(customer);
    if (!customerDoc) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    // Process items and calculate totals
    const processedItems = [];
    let subtotal = 0;
    let totalTax = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      const taxAmount = (itemTotal * product.gstRate) / 100;
      const totalAmount = itemTotal + taxAmount;

      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        gstRate: product.gstRate,
        taxAmount,
        totalAmount
      });

      subtotal += itemTotal;
      totalTax += taxAmount;

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate GST breakdown (assuming same state for CGST/SGST)
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;
    const igst = 0; // Set to totalTax if interstate

    // Calculate grand total
    const beforeRoundOff = subtotal + totalTax - discount;
    const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
    const grandTotal = Math.round(beforeRoundOff);

    // Create invoice
    const invoice = new Invoice({
      customer,
      items: processedItems,
      subtotal,
      totalTax,
      cgst,
      sgst,
      igst,
      discount,
      roundOff,
      grandTotal,
      paymentMethod,
      paymentStatus: paidAmount >= grandTotal ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid',
      paidAmount,
      dueAmount: grandTotal - paidAmount,
      notes,
      createdBy: req.user._id
    });

    await invoice.save();

    // Update customer total purchases
    customerDoc.totalPurchases += grandTotal;
    await customerDoc.save();

    // Populate invoice for response
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('customer')
      .populate('createdBy', 'name');

    // Send invoice via WhatsApp and Email (async, don't wait)
    try {
      const pdfBuffer = await generateInvoicePDF(populatedInvoice);
      
      // Send WhatsApp message
      if (populatedInvoice.customer.phone) {
        sendInvoiceWhatsApp(
          populatedInvoice.customer.phone,
          populatedInvoice.invoiceNumber,
          populatedInvoice.grandTotal,
          null // PDF URL would go here if hosted
        ).catch(err => console.error('WhatsApp send failed:', err));
      }
      
      // Send Email
      if (populatedInvoice.customer.email) {
        sendInvoiceEmail(
          populatedInvoice.customer.email,
          populatedInvoice.customer.name,
          populatedInvoice.invoiceNumber,
          populatedInvoice.grandTotal,
          pdfBuffer
        ).catch(err => console.error('Email send failed:', err));
      }
    } catch (error) {
      console.error('Failed to send invoice notifications:', error);
    }
    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: populatedInvoice
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/invoices/:id/pdf
// @desc    Generate and download invoice PDF
// @access  Private
router.get('/:id/pdf', authenticate, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('createdBy', 'name');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const pdfBuffer = await generateInvoicePDF(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/invoices/:id/excel
// @desc    Export invoice to Excel
// @access  Private
router.get('/:id/excel', authenticate, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('createdBy', 'name');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Invoice details worksheet
    const invoiceData = [
      ['Invoice Number', invoice.invoiceNumber],
      ['Date', invoice.invoiceDate.toDateString()],
      ['Customer', invoice.customer.name],
      ['Phone', invoice.customer.phone],
      ['Email', invoice.customer.email || ''],
      [''],
      ['Items:'],
      ['Product', 'Quantity', 'Price', 'GST Rate', 'Tax Amount', 'Total']
    ];

    invoice.items.forEach(item => {
      invoiceData.push([
        item.productName,
        item.quantity,
        item.price,
        `${item.gstRate}%`,
        item.taxAmount,
        item.totalAmount
      ]);
    });

    invoiceData.push(
      [''],
      ['Subtotal', invoice.subtotal],
      ['CGST', invoice.cgst],
      ['SGST', invoice.sgst],
      ['IGST', invoice.igst],
      ['Discount', invoice.discount],
      ['Round Off', invoice.roundOff],
      ['Grand Total', invoice.grandTotal]
    );

    const worksheet = XLSX.utils.aoa_to_sheet(invoiceData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.xlsx"`
    });

    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/invoices/:id/payment
// @desc    Update invoice payment
// @access  Private
router.put('/:id/payment', authenticate, [
  body('paidAmount').isFloat({ min: 0 }).withMessage('Paid amount must be a positive number'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'upi', 'bank_transfer']).withMessage('Invalid payment method')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { paidAmount, paymentMethod } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.paidAmount = paidAmount;
    invoice.dueAmount = invoice.grandTotal - paidAmount;
    
    if (paidAmount >= invoice.grandTotal) {
      invoice.paymentStatus = 'paid';
    } else if (paidAmount > 0) {
      invoice.paymentStatus = 'partial';
    } else {
      invoice.paymentStatus = 'unpaid';
    }

    if (paymentMethod) {
      invoice.paymentMethod = paymentMethod;
    }

    await invoice.save();

    res.json({
      message: 'Payment updated successfully',
      invoice
    });
  } catch (error) {
    next(error);
  }
});

export default router;