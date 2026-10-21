import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useBookings } from '../hooks/useBookings';
import { analyticsService } from '../services/analyticsService';
import { StatCard } from '../components/vendor/StatCard';
import { AnalyticsCharts } from '../components/vendor/AnalyticsCharts';
import { BookingRequestRow } from '../components/vendor/BookingRequestRow';
import { AddEditProductModal } from '../components/vendor/AddEditProductModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatters';
import {
  Package,
  Calendar,
  Clock,
  DollarSign,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const VendorDashboardPage = () => {
  const { currentUser, isVendor } = useAuth();
  const { products, addProduct } = useProducts();
  const { bookings } = useBookings();
  const [showAddModal, setShowAddModal] = useState(false);

  // If viewing as customer, redirect to customer dashboard
  if (!isVendor) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // Calculate analytics for this vendor
  const stats = analyticsService.getVendorStats(currentUser.id, products, bookings);
  const vendorBookings = bookings.filter((b) => b.vendorId === currentUser.id);
  const pendingRequests = vendorBookings.filter((b) => b.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Vendor Operations Center
          </span>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Vendor Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.businessName || 'Equipment Management'} • Real-time rental revenue & booking operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/vendor/listings">
            <Button variant="outline" size="md">
              Manage Listings
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={() => setShowAddModal(true)}
          >
            Add Equipment
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          subvalue="Gear in catalog"
          icon={Package}
          color="teal"
          trend="+2 added this month"
          trendPositive={true}
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          subvalue="Currently in renters' hands"
          icon={Clock}
          color="purple"
          trend="Utilization 42%"
          trendPositive={true}
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingBookings}
          subvalue={stats.pendingBookings > 0 ? 'Requires your approval' : 'All caught up'}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Rental Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subvalue="Gross earnings"
          icon={DollarSign}
          color="emerald"
          trend="+18.4% vs last month"
          trendPositive={true}
        />
      </div>

      {/* Analytics Charts Section */}
      <AnalyticsCharts
        monthlyData={stats.monthlyData}
        categoryData={stats.categoryData}
      />

      {/* Recent Booking Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Booking Requests & Actions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accept new reservations or mark returned equipment
            </p>
          </div>
          <Link
            to="/vendor/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View All ({vendorBookings.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {vendorBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No booking requests yet"
            description="When renters request gear, their reservation requests will appear here for your review."
          />
        ) : (
          <div className="space-y-3">
            {vendorBookings.slice(0, 4).map((booking) => (
              <BookingRequestRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddEditProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addProduct}
        vendorId={currentUser.id}
      />
    </div>
  );
};
