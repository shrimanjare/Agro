import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'customer';
  allowedRoles?: ('admin' | 'staff' | 'customer')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role permissions
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'staff' ? '/staff/dashboard' : 
                         '/customer/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    const dashboardPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'staff' ? '/staff/dashboard' : 
                         '/customer/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;