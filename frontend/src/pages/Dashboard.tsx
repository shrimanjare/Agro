import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle,
  IndianRupee,
  FileText,
  ShoppingCart,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardStats {
  todaysSales: { totalSales: number; totalInvoices: number };
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  monthlySales: { totalSales: number; totalInvoices: number };
  recentInvoices: any[];
  lowStockProducts: any[];
}

interface SalesData {
  salesData: any[];
  period: string;
}

interface TopProducts {
  topProducts: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesChart, setSalesChart] = useState<SalesData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, salesRes, productsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/sales-chart?period=7d'),
        api.get('/dashboard/top-products?limit=5')
      ]);

      setStats(statsRes.data);
      setSalesChart(salesRes.data);
      setTopProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: formatCurrency(stats?.todaysSales.totalSales || 0),
      subtitle: `${stats?.todaysSales.totalInvoices || 0} invoices`,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/invoices'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers.toLocaleString() || '0',
      subtitle: 'Active customers',
      icon: Users,
      color: 'bg-blue-500',
      link: '/customers'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts.toLocaleString() || '0',
      subtitle: 'In inventory',
      icon: Package,
      color: 'bg-purple-500',
      link: '/products'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockCount.toLocaleString() || '0',
      subtitle: 'Need attention',
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/products?lowStock=true'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/invoices/create"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link} className="block">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{card.subtitle}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Trend (Last 7 Days)</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChart?.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="_id.day" 
                  stroke="#6B7280"
                />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h3>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts?.topProducts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="_id" 
                  stroke="#6B7280"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="totalQuantity" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
            <Link to="/invoices" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentInvoices.map((invoice) => (
              <div key={invoice._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(invoice.grandTotal)}</p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    invoice.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : invoice.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {invoice.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
            {(!stats?.recentInvoices || stats.recentInvoices.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent invoices</p>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alert</h3>
            <Link to="/products?lowStock=true" className="text-red-600 dark:text-red-400 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.lowStockProducts.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600 dark:text-red-400">{product.stock} left</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min: {product.lowStockThreshold}</p>
                </div>
              </div>
            ))}
            {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">All products are in stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;