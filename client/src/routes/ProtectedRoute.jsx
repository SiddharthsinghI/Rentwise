import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Authenticating session..." size="lg" />
      </div>
    );
  }

  // Unauthenticated users are redirected to /login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based route guard
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // If a vendor tries to access a customer-only route, redirect to vendor dashboard
    if (currentUser.role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    // If a customer tries to access a vendor-only route, redirect to customer dashboard
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};
