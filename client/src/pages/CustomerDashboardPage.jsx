import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useProducts';
import { BookingCard } from '../components/customer/BookingCard';
import { ProductCard } from '../components/marketplace/ProductCard';
import { StatCard } from '../components/vendor/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatters';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Heart,
  DollarSign,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CustomerDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { bookings } = useBookings();
  const { wishlist } = useWishlist();
  const { products } = useProducts();

  const activeTab = searchParams.get('tab') || 'all';

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  // Filter bookings for this customer
  const customerBookings = bookings.filter((b) => b.customerId === currentUser?.id);
  const activeRentals = customerBookings.filter((b) => b.status === 'active');
  const upcomingRentals = customerBookings.filter((b) => b.status === 'approved' || b.status === 'pending');
  const completedRentals = customerBookings.filter((b) => b.status === 'completed');
  const totalSpent = customerBookings
    .filter((b) => b.status === 'completed' || b.status === 'active')
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  // Filtered list based on active tab
  let displayedBookings = customerBookings;
  if (activeTab === 'active') displayedBookings = activeRentals;
  if (activeTab === 'upcoming') displayedBookings = upcomingRentals;
  if (activeTab === 'history') displayedBookings = completedRentals;

  // Wishlist products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Renter Account
          </span>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your ongoing rentals, upcoming equipment bookings, and saved gear.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
        >
          <span>Find More Gear</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Rentals"
          value={activeRentals.length}
          subvalue="Gear currently with you"
          icon={Package}
          color="teal"
        />
        <StatCard
          title="Upcoming Bookings"
          value={upcomingRentals.length}
          subvalue="Approved or awaiting vendor"
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Rental History"
          value={completedRentals.length}
          subvalue="Completed & returned gear"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          subvalue="Across completed rentals"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Bookings', count: customerBookings.length },
          { id: 'active', label: 'Active Rentals', count: activeRentals.length },
          { id: 'upcoming', label: 'Upcoming', count: upcomingRentals.length },
          { id: 'history', label: 'Rental History', count: completedRentals.length },
          { id: 'wishlist', label: 'Saved Wishlist', count: wishlistedProducts.length, icon: Heart },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab.icon && <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />}
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 font-semibold'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'wishlist' ? (
        <div>
          {wishlistedProducts.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your Wishlist is Empty"
              description="Save your favorite cameras, laptops, consoles, or tools by clicking the heart icon on any product."
              actionLabel="Explore Marketplace"
              onAction={() => (window.location.href = '/marketplace')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No bookings in this category"
              description="You don't have any bookings matching this filter state. Explore the marketplace to reserve gear."
              actionLabel="Browse Available Gear"
              onAction={() => (window.location.href = '/marketplace')}
            />
          ) : (
            displayedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
