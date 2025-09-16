import puppeteer from 'puppeteer';
import numberToWords from 'number-to-words';

export const generateInvoicePDF = async (invoice) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .invoice-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 20px;
            }
            .company-name {
                font-size: 28px;
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 10px;
            }
            .invoice-title {
                font-size: 24px;
                color: #666;
                margin-bottom: 10px;
            }
            .invoice-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
            }
            .invoice-info, .customer-info {
                width: 45%;
            }
            .invoice-info h3, .customer-info h3 {
                color: #4CAF50;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            .info-row {
                display: flex;
                margin-bottom: 5px;
            }
            .info-label {
                font-weight: bold;
                width: 120px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .items-table th, .items-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .items-table th {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
            }
            .items-table tbody tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .text-right {
                text-align: right;
            }
            .text-center {
                text-align: center;
            }
            .totals-section {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 30px;
            }
            .totals-table {
                border-collapse: collapse;
                width: 400px;
            }
            .totals-table td {
                border: 1px solid #ddd;
                padding: 8px 12px;
            }
            .totals-table .total-label {
                background-color: #f5f5f5;
                font-weight: bold;
                width: 200px;
            }
            .totals-table .grand-total {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
                font-size: 16px;
            }
            .amount-in-words {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 30px;
                font-style: italic;
            }
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 12px;
            }
            .gst-section {
                margin-top: 20px;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 5px;
            }
            .gst-title {
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="invoice-header">
            <div class="company-name">AGRO PESTICIDES SHOP</div>
            <div>123 Agricultural Street, Farming District, State - 123456</div>
            <div>Phone: +91-9876543210 | Email: info@agropesticides.com</div>
            <div>GSTIN: 12ABCDE1234F1Z5</div>
            <div class="invoice-title">TAX INVOICE</div>
        </div>

        <div class="invoice-details">
            <div class="invoice-info">
                <h3>Invoice Details</h3>
                <div class="info-row">
                    <span class="info-label">Invoice No:</span>
                    <span>${invoice.invoiceNumber}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span>${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment:</span>
                    <span>${invoice.paymentMethod.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span>${invoice.paymentStatus.toUpperCase()}</span>
                </div>
            </div>
            
            <div class="customer-info">
                <h3>Bill To</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span>${invoice.customer.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span>${invoice.customer.phone}</span>
                </div>
                ${invoice.customer.email ? `
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span>${invoice.customer.email}</span>
                </div>
                ` : ''}
                ${invoice.customer.gstNumber ? `
                <div class="info-row">
                    <span class="info-label">GST No:</span>
                    <span>${invoice.customer.gstNumber}</span>
                </div>
                ` : ''}
                ${invoice.customer.address && invoice.customer.address.street ? `
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span>${invoice.customer.address.street}, ${invoice.customer.address.city || ''}, ${invoice.customer.address.state || ''} - ${invoice.customer.address.pincode || ''}</span>
                </div>
                ` : ''}
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Sr.</th>
                    <th>Product Name</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Rate</th>
                    <th class="text-center">GST%</th>
                    <th class="text-right">Tax Amt</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map((item, index) => `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${item.productName}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">₹${item.price.toFixed(2)}</td>
                    <td class="text-center">${item.gstRate}%</td>
                    <td class="text-right">₹${item.taxAmount.toFixed(2)}</td>
                    <td class="text-right">₹${item.totalAmount.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td class="total-label">Subtotal</td>
                    <td class="text-right">₹${invoice.subtotal.toFixed(2)}</td>
                </tr>
                ${invoice.cgst > 0 ? `
                <tr>
                    <td class="total-label">CGST</td>
                    <td class="text-right">₹${invoice.cgst.toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="total-label">SGST</td>
                    <td class="text-right">₹${invoice.sgst.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${invoice.igst > 0 ? `
                <tr>
                    <td class="total-label">IGST</td>
                    <td class="text-right">₹${invoice.igst.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${invoice.discount > 0 ? `
                <tr>
                    <td class="total-label">Discount</td>
                    <td class="text-right">-₹${invoice.discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${Math.abs(invoice.roundOff) > 0.01 ? `
                <tr>
                    <td class="total-label">Round Off</td>
                    <td class="text-right">${invoice.roundOff >= 0 ? '+' : ''}₹${invoice.roundOff.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr class="grand-total">
                    <td class="total-label">Grand Total</td>
                    <td class="text-right">₹${invoice.grandTotal.toFixed(2)}</td>
                </tr>
            </table>
        </div>

        <div class="amount-in-words">
            <strong>Amount in Words:</strong> ${numberToWords.toWords(invoice.grandTotal).replace(/\b\w/g, l => l.toUpperCase())} Rupees Only
        </div>

        ${invoice.notes ? `
        <div class="gst-section">
            <div class="gst-title">Notes:</div>
            <div>${invoice.notes}</div>
        </div>
        ` : ''}

        <div class="gst-section">
            <div class="gst-title">Terms & Conditions:</div>
            <div>1. All disputes are subject to local jurisdiction only.</div>
            <div>2. Goods once sold will not be taken back.</div>
            <div>3. Payment due within 30 days of invoice date.</div>
        </div>

        <div class="footer">
            <div>Thank you for your business!</div>
            <div>This is a computer generated invoice and does not require signature.</div>
        </div>
    </body>
    </html>
    `;

    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    return pdf;
  } finally {
    await browser.close();
  }
};