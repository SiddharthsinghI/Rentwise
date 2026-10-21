import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LandingPage } from '../pages/LandingPage';
import { MarketplacePage } from '../pages/MarketplacePage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CustomerDashboardPage } from '../pages/CustomerDashboardPage';
import { VendorDashboardPage } from '../pages/VendorDashboardPage';
import { VendorListingsPage } from '../pages/VendorListingsPage';
import { VendorBookingsPage } from '../pages/VendorBookingsPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Home Route — Protected: directs unauthenticated users to /login */}
        <Route
          index
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* Public Browsing Routes */}
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="customer" element={<Navigate to="/customer/dashboard" replace />} />

        {/* Shared Authenticated Profile Route */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Vendor Protected Routes */}
        <Route
          path="vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/listings"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vendor/bookings"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="vendor" element={<Navigate to="/vendor/dashboard" replace />} />

        {/* Authentication Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
