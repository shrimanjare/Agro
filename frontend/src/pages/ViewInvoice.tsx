import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  Share2, 
  Edit, 
  ArrowLeft,
  FileText,
  User,
  Calendar,
  CreditCard,
  Package
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    gstNumber?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
  };
  items: Array<{
    _id: string;
    productName: string;
    quantity: number;
    price: number;
    gstRate: number;
    taxAmount: number;
    totalAmount: number;
  }>;
  subtotal: number;
  totalTax: number;
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
  roundOff: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAmount: number;
  dueAmount: number;
  invoiceDate: string;
  notes?: string;
  createdBy: {
    name: string;
  };
}

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}`);
      setInvoice(response.data.invoice);
    } catch (error) {
      toast.error('Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice?.invoiceNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await api.get(`/invoices/${id}/excel`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice?.invoiceNumber}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      toast.error('Failed to download Excel file');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const shareInvoice = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice?.invoiceNumber}`,
          text: `Invoice for ${invoice?.customer.name} - ₹${invoice?.grandTotal}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Invoice link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Invoice Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The invoice you're looking for doesn't exist.</p>
        <Link
          to="/invoices"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/invoices"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Created on {formatDate(invoice.invoiceDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={shareInvoice}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button
            onClick={printInvoice}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <div className="relative group">
            <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={downloadPDF}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Download PDF
              </button>
              <button
                onClick={downloadExcel}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">AGRO PESTICIDES SHOP</h2>
              <p className="opacity-90">123 Agricultural Street, Farming District</p>
              <p className="opacity-90">Phone: +91-9876543210 | Email: info@agropesticides.com</p>
              <p className="opacity-90">GSTIN: 12ABCDE1234F1Z5</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold">TAX INVOICE</h3>
              <p className="opacity-90">#{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Details & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Invoice Details</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoice No:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(invoice.invoiceDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{invoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : invoice.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {invoice.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Bill To</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{invoice.customer.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.customer.phone}</p>
                {invoice.customer.email && (
                  <p className="text-gray-600 dark:text-gray-400">{invoice.customer.email}</p>
                )}
                {invoice.customer.gstNumber && (
                  <p className="text-gray-600 dark:text-gray-400">GST: {invoice.customer.gstNumber}</p>
                )}
                {invoice.customer.address && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {[
                      invoice.customer.address.street,
                      invoice.customer.address.city,
                      invoice.customer.address.state,
                      invoice.customer.address.pincode
                    ].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Package className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Items</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sr.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      GST%
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tax Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items.map((item, index) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-center">
                        {item.gstRate}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(item.taxAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-full max-w-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
                </div>
                
                {invoice.cgst > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">CGST:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">SGST:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.sgst)}</span>
                    </div>
                  </>
                )}
                
                {invoice.igst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">IGST:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.igst)}</span>
                  </div>
                )}
                
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                
                {Math.abs(invoice.roundOff) > 0.01 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Round Off:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {invoice.roundOff >= 0 ? '+' : ''}{formatCurrency(invoice.roundOff)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Grand Total:</span>
                    <span className="text-green-600">{formatCurrency(invoice.grandTotal)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Paid Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.paidAmount)}</span>
                  </div>
                  {invoice.dueAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Due Amount:</span>
                      <span className="font-medium text-red-600">{formatCurrency(invoice.dueAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes:</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Thank you for your business!</p>
            <p>Created by: {invoice.createdBy.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;