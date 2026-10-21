import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, calculateDays, calculateRentalCost, formatDate, calculateProductAvailability } from '../../utils/formatters';
import { validateBookingDates } from '../../utils/validators';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../hooks/useToast';
import { Calendar, ShieldCheck, Heart, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const RentalCalculator = ({ product }) => {
  const { currentUser, isVendor } = useAuth();
  const navigate = useNavigate();
  const { createBooking, bookings } = useBookings();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const toast = useToast();

  // Default dates: tomorrow to +3 days
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextThreeDays = new Date();
  nextThreeDays.setDate(nextThreeDays.getDate() + 4);

  const formatDateValue = (d) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDateValue(tomorrow));
  const [endDate, setEndDate] = useState(formatDateValue(nextThreeDays));
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dateErrors, setDateErrors] = useState({});

  if (!product) return null;

  const isSaved = isWishlisted(product.id);
  const days = calculateDays(startDate, endDate);
  const pricing = calculateRentalCost(product.pricePerDay, days, product.securityDeposit);

  // Check inventory stock and date availability against active & approved bookings
  const availability = calculateProductAvailability(product, bookings, startDate, endDate);
  const { totalQuantity, bookedCount, availableQuantity, isAvailable, conflictingBookings } = availability;

  const handleDateChange = (type, val) => {
    if (type === 'start') {
      setStartDate(val);
      const validation = validateBookingDates(val, endDate);
      setDateErrors(validation.errors);
    } else {
      setEndDate(val);
      const validation = validateBookingDates(startDate, val);
      setDateErrors(validation.errors);
    }
  };

  const handleOpenBooking = () => {
    const validation = validateBookingDates(startDate, endDate);
    if (!validation.isValid) {
      setDateErrors(validation.errors);
      toast.error('Please select valid rental dates.');
      return;
    }

    if (!isAvailable) {
      toast.error(
        `All ${totalQuantity} unit(s) are already booked for these dates (${conflictingBookings[0]?.startDate} to ${conflictingBookings[0]?.endDate}). Please choose different dates.`
      );
      return;
    }

    if (!currentUser) {
      toast.info('Please sign in to place a rental booking request.');
      navigate('/login');
      return;
    }

    if (isVendor) {
      toast.error('Vendors cannot rent equipment. Please sign in with a Customer account.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      await createBooking({
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        customerId: currentUser?.id || 'cust-1',
        customerName: currentUser?.name || 'Customer',
        customerEmail: currentUser?.email || 'customer@example.com',
        vendorId: product.vendorId,
        vendorName: product.specs?.brand || 'Vendor',
        startDate,
        endDate,
        dailyRate: product.pricePerDay,
        securityDeposit: product.securityDeposit,
        customerNotes,
        destination: currentUser?.location || 'Pickup / Direct Delivery'
      });
      setShowConfirmModal(false);
      setCustomerNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-card relative">
      {/* Top Daily Rate Heading */}
      <div className="flex items-baseline justify-between pb-5 border-b border-slate-100">
        <div>
          <span className="text-3xl font-extrabold text-navy-950 font-sans">
            {formatCurrency(product.pricePerDay)}
          </span>
          <span className="text-sm font-semibold text-slate-500 ml-1.5">/ day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200" title="Total inventory owned by vendor">
            {totalQuantity} {totalQuantity === 1 ? 'unit' : 'units'} in stock
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/60">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Instant Request</span>
          </div>
        </div>
      </div>

      {/* Date Pickers */}
      <div className="my-5 space-y-3">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          Rental Duration
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 mb-1">
              Start Date
            </span>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                min={formatDateValue(new Date())}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className={`w-full px-3 py-2.5 text-xs font-semibold rounded-xl border ${
                  dateErrors.startDate ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>
            {dateErrors.startDate && (
              <p className="text-[11px] text-rose-500 mt-1">{dateErrors.startDate}</p>
            )}
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-500 mb-1">
              End Date
            </span>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                min={startDate || formatDateValue(new Date())}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className={`w-full px-3 py-2.5 text-xs font-semibold rounded-xl border ${
                  dateErrors.endDate ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>
            {dateErrors.endDate && (
              <p className="text-[11px] text-rose-500 mt-1">{dateErrors.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <span className="font-medium">Calculated Duration:</span>
          <span className="font-bold text-brand-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
            {days} {days === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* Live Inventory & Availability Status for Chosen Dates */}
        {!isAvailable ? (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Unavailable for Selected Dates</span>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              All <strong>{totalQuantity} unit{totalQuantity > 1 ? 's' : ''}</strong> {totalQuantity > 1 ? 'are' : 'is'} already reserved between{' '}
              <strong>{formatDate(conflictingBookings[0]?.startDate)}</strong> and{' '}
              <strong>{formatDate(conflictingBookings[0]?.endDate)}</strong>. Please pick different rental dates.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2.5 rounded-2xl border border-emerald-200">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Available for chosen dates</span>
            </span>
            <span className="font-semibold text-emerald-700 text-[11px]">
              {availableQuantity} of {totalQuantity} unit{totalQuantity > 1 ? 's' : ''} free
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Price Breakdown */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>{formatCurrency(product.pricePerDay)} × {days} {days === 1 ? 'day' : 'days'}</span>
          <span className="font-semibold text-slate-900">{formatCurrency(pricing.baseCost)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span className="flex items-center gap-1">
            <span>Platform Service Fee</span>
            <span className="text-[10px] text-slate-400">(7.5%)</span>
          </span>
          <span className="font-semibold text-slate-900">{formatCurrency(pricing.serviceFee)}</span>
        </div>

        {pricing.securityDeposit > 0 && (
          <div className="flex justify-between text-slate-500 italic">
            <span>Refundable Security Deposit</span>
            <span className="font-medium">{formatCurrency(pricing.securityDeposit)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
          <span className="font-bold text-slate-900">Total Rental Cost</span>
          <div className="text-right">
            <span className="text-xl font-extrabold text-brand-700">
              {formatCurrency(pricing.total)}
            </span>
            {pricing.securityDeposit > 0 && (
              <p className="text-[10px] text-slate-400 font-normal">
                +{formatCurrency(pricing.securityDeposit)} refundable deposit
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3">
        {isVendor ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Vendor Account Active</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Vendors cannot place rental requests. To book equipment, please sign in with a Customer account.
            </p>
          </div>
        ) : !isAvailable ? (
          <div className="space-y-2">
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-sm font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              disabled={true}
            >
              Unavailable for Selected Dates
            </Button>
            <p className="text-[11px] text-center text-slate-500">
              Choose different start/end dates above to find an open rental window.
            </p>
          </div>
        ) : product.availability !== 'available' ? (
          <Button
            variant="secondary"
            size="lg"
            className="w-full text-sm font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            disabled={true}
          >
            Currently Unavailable (In Maintenance)
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-md shadow-brand-600/20"
            onClick={handleOpenBooking}
          >
            Request to Rent
          </Button>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id, product.name)}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      {/* Trust & Guarantee */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500">
        <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <span className="leading-snug">
          Protected by <strong>RentWise SafeGear Guarantee</strong>. Inspected & damage protection included.
        </span>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Rental Request"
        subtitle={`Review details for "${product.name}"`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-16 h-16 rounded-xl object-cover bg-slate-100"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{product.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatDate(startDate)} → {formatDate(endDate)} ({days} {days === 1 ? 'day' : 'days'})
              </p>
              <p className="text-xs font-bold text-brand-700 mt-1">
                Total: {formatCurrency(pricing.total)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Add a note for the vendor (Optional)
            </label>
            <textarea
              rows="3"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="E.g., I'll be using this for a short commercial film shoot on Saturday morning..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl text-xs text-teal-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Simulated Instant Booking Request</span>
            </div>
            <p className="text-teal-700 leading-relaxed">
              In this Phase 1 demo, your request will be immediately added to the vendor's <strong>Booking Management</strong> screen, where you can accept or decline it.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmBooking} isLoading={isSubmitting}>
              Send Booking Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
