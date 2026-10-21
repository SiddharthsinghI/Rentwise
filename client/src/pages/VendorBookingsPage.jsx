import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { BookingRequestRow } from '../components/vendor/BookingRequestRow';
import { EmptyState } from '../components/common/EmptyState';
import { Calendar, Sparkles } from 'lucide-react';

export const VendorBookingsPage = () => {
  const { currentUser, isVendor } = useAuth();
  const { bookings } = useBookings();
  const [statusFilter, setStatusFilter] = useState('all');

  if (!isVendor) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // Filter vendor's bookings
  const vendorBookings = bookings.filter((b) => b.vendorId === currentUser.id);

  const pendingList = vendorBookings.filter((b) => b.status === 'pending');
  const activeList = vendorBookings.filter((b) => b.status === 'active' || b.status === 'approved');
  const completedList = vendorBookings.filter((b) => b.status === 'completed');
  const rejectedList = vendorBookings.filter((b) => b.status === 'rejected');

  let displayed = vendorBookings;
  if (statusFilter === 'pending') displayed = pendingList;
  if (statusFilter === 'active') displayed = activeList;
  if (statusFilter === 'completed') displayed = completedList;
  if (statusFilter === 'rejected') displayed = rejectedList;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Dispatch & Returns Control
          </span>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming rental requests, verify checkouts, and settle returned equipment.
          </p>
        </div>

        {pendingList.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{pendingList.length} Action Required</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Requests', count: vendorBookings.length },
          { id: 'pending', label: 'Pending Approval', count: pendingList.length, highlight: pendingList.length > 0 },
          { id: 'active', label: 'Approved & Active', count: activeList.length },
          { id: 'completed', label: 'Returned / Completed', count: completedList.length },
          { id: 'rejected', label: 'Declined', count: rejectedList.length },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                tab.highlight && !isActive
                  ? 'bg-amber-500 text-white font-bold animate-pulse'
                  : isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600 font-semibold'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No bookings under this status"
            description="You don't have any rental bookings matching the selected status filter."
          />
        ) : (
          displayed.map((booking) => (
            <BookingRequestRow key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
};
