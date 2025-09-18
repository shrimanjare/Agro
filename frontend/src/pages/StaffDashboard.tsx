import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle,
  FileText,
  ShoppingCart,
  Calendar,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const StaffDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
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

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate new invoice for customer',
      icon: FileText,
      color: 'bg-green-600',
      link: '/invoices/create'
    },
    {
      title: 'Add Customer',
      description: 'Register new customer',
      icon: Users,
      color: 'bg-blue-600',
      link: '/customers'
    },
    {
      title: 'View Products',
      description: 'Browse product inventory',
      icon: Package,
      color: 'bg-purple-600',
      link: '/products'
    },
    {
      title: 'Recent Invoices',
      description: 'View recent transactions',
      icon: ShoppingCart,
      color: 'bg-orange-600',
      link: '/invoices'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage daily operations and customer transactions</p>
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

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.link} className="block">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className={`${action.color} p-2 rounded-lg w-fit mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{action.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </Link>
            );
          })}
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

export default StaffDashboard;