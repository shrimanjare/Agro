import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import QuickBilling from './pages/QuickBilling';

// Role-based redirect component
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'staff':
      return <Navigate to="/staff/dashboard" replace />;
    case 'customer':
      return <Navigate to="/customer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Role-based Dashboard Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/staff/dashboard" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><StaffDashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/customer/dashboard" element={
                <ProtectedRoute requiredRole="customer">
                  <Layout><CustomerDashboard /></Layout>
                </ProtectedRoute>
              } />

              {/* Protected Routes */}
              <Route path="/products" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><Products /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><Customers /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><Invoices /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices/create" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><CreateInvoice /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices/:id" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><ViewInvoice /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/quick-billing" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><QuickBilling /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Layout><Reports /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><Users /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout><Settings /></Layout>
                </ProtectedRoute>
              } />

              {/* Root redirect */}
              <Route path="/" element={<RoleBasedRedirect />} />
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* Fallback */}
              <Route path="*" element={<RoleBasedRedirect />} />
            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
