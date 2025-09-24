import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Minus, 
  Search, 
  User, 
  Package,
  Calculator,
  FileText,
  Scan
} from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
  category: string;
  hsn: string;
}

interface Customer {
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
}

interface InvoiceItem {
  product: string;
  productName: string;
  quantity: number;
  price: number;
  gstRate: number;
  hsn: string;
  total: number;
}

interface InvoiceForm {
  customer: string;
  items: InvoiceItem[];
  discount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  paidAmount: number;
  notes: string;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalTax: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    grandTotal: 0
  });

  const { register, control, handleSubmit, watch, setValue, reset } = useForm<InvoiceForm>({
    defaultValues: {
      items: [],
      discount: 0,
      paymentMethod: 'cash',
      paidAmount: 0,
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedDiscount = watch('discount');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [watchedItems, watchedDiscount]);

  useEffect(() => {
    if (productSearch) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.hsn.includes(productSearch)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [productSearch, products]);

  useEffect(() => {
    if (customerSearch) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch) ||
        customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [customerSearch, customers]);

  const fetchData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/customers?limit=100')
      ]);
      setProducts(productsRes.data.products);
      setCustomers(customersRes.data.customers);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;

    watchedItems.forEach(item => {
      if (item.quantity && item.price) {
        const itemTotal = item.quantity * item.price;
        const taxAmount = (itemTotal * item.gstRate) / 100;
        subtotal += itemTotal;
        totalTax += taxAmount;
      }
    });

    const afterDiscount = subtotal - (watchedDiscount || 0);
    const cgst = totalTax / 2; // Assuming intra-state
    const sgst = totalTax / 2;
    const igst = 0; // Set to totalTax if interstate
    const beforeRoundOff = afterDiscount + totalTax;
    const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
    const grandTotal = Math.round(beforeRoundOff);

    setTotals({
      subtotal,
      totalTax,
      cgst,
      sgst,
      igst,
      grandTotal: Math.max(0, grandTotal)
    });

    setValue('paidAmount', Math.max(0, grandTotal));
  };

  const addProduct = (product: Product) => {
    const existingIndex = fields.findIndex(item => item.product === product._id);
    
    if (existingIndex >= 0) {
      const currentQuantity = watchedItems[existingIndex]?.quantity || 0;
      setValue(`items.${existingIndex}.quantity`, currentQuantity + 1);
    } else {
      append({
        product: product._id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        gstRate: product.gstRate,
        hsn: product.hsn,
        total: product.price
      });
    }
    
    setProductSearch('');
    setFilteredProducts([]);
    setShowProductSearch(false);
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setValue('customer', customer._id);
    setCustomerSearch('');
    setFilteredCustomers([]);
    setShowCustomerSearch(false);
  };

  const onSubmit = async (data: InvoiceForm) => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (fields.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/invoices', {
        customer: data.customer,
        items: data.items.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        discount: data.discount,
        paymentMethod: data.paymentMethod,
        paidAmount: data.paidAmount,
        notes: data.notes
      });

      toast.success('Invoice created successfully!');
      navigate(`/invoices/${response.data.invoice._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate a new GST-compliant invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Details</h3>
            </div>
            
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.phone}</p>
                  {selectedCustomer.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
                  )}
                  {selectedCustomer.gstNumber && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">GST: {selectedCustomer.gstNumber}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setValue('customer', '');
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customer by name, phone, or email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onFocus={() => setShowCustomerSearch(true)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                
                {showCustomerSearch && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.map(customer => (
                      <button
                        key={customer._id}
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{customer.phone}</p>
                        {customer.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Products</h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan Barcode
              </button>
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search products by name, category, or HSN..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowProductSearch(true)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              
              {showProductSearch && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.category} • HSN: {product.hsn} • Stock: {product.stock} {product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">GST: {product.gstRate}%</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Items */}
            <div className="space-y-3">
              {fields.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items added yet</p>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{field.productName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(field.price)} • GST: {field.gstRate}% • HSN: {field.hsn}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentQuantity = watchedItems[index]?.quantity || 1;
                          if (currentQuantity > 1) {
                            setValue(`items.${index}.quantity`, currentQuantity - 1);
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <input
                        type="number"
                        min="1"
                        {...register(`items.${index}.quantity`, { 
                          required: true, 
                          min: 1,
                          valueAsNumber: true 
                        })}
                        className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      
                      <button
                        type="button"
                        onClick={() => {
                          const currentQuantity = watchedItems[index]?.quantity || 1;
                          setValue(`items.${index}.quantity`, currentQuantity + 1);
                        }}
                        className="p-1 text-gray-500 hover:text-green-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right min-w-[80px]">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency((watchedItems[index]?.quantity || 1) * field.price)}
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Invoice Summary */}
        <div className="space-y-6">
          {/* Totals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Summary</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totals.subtotal)}</span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Discount:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('discount', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">CGST:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totals.cgst)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">SGST:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totals.sgst)}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Grand Total:</span>
                  <span className="text-green-600">{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  {...register('paymentMethod')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Paid Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('paidAmount', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || !selectedCustomer || fields.length === 0}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Invoice
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedCustomer(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear All
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;