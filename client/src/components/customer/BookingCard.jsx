import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime, doDatesOverlap } from '../../utils/formatters';
import { Calendar, User, MapPin, AlertCircle, FileText, X, AlertTriangle } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useProducts } from '../../hooks/useProducts';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';

export const BookingCard = ({ booking }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const { updateStatus, bookings } = useBookings();
  const { products } = useProducts();

  if (!booking) return null;

  // Check if dates are now taken by another customer's approved booking
  const product = products.find((p) => String(p.id) === String(booking.productId));
  const displayImage = booking.productImage || product?.images?.[0] || FALLBACK_IMAGE;
  const totalStock = Math.max(1, Number(product?.totalQuantity) || 1);

  const conflictingBookings = bookings.filter((b) =>
    String(b.productId) === String(booking.productId) &&
    (b.status === 'approved' || b.status === 'active') &&
    String(b.id) !== String(booking.id) &&
    doDatesOverlap(booking.startDate, booking.endDate, b.startDate, b.endDate)
  );

  const isUnavailableNow = booking.status === 'pending' && conflictingBookings.length >= totalStock;

  const handleCancelBooking = async () => {
    setIsCanceling(true);
    try {
      await updateStatus(booking.id, 'rejected', 'Canceled by customer prior to dispatch');
      setShowCancelConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCanceling(false);
    }
  };

  const isPending = booking.status === 'pending';

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
        {/* Left: Product & Dates */}
        <div className="flex items-start gap-4">
          <img
            src={displayImage}
            alt={booking.productName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 bg-slate-100 border border-slate-100"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-400">
                #{booking.id}
              </span>
              <Badge status={booking.status} size="sm" />
            </div>

            <Link
              to={`/products/${booking.productId}`}
              className="font-bold text-base text-slate-900 hover:text-brand-600 transition-colors block line-clamp-1"
            >
              {booking.productName}
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>
                  {formatDate(booking.startDate)} — {formatDate(booking.endDate)} ({booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Owner: <strong>{booking.vendorName}</strong></span>
              </div>
            </div>

            {booking.destination && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{booking.destination}</span>
              </div>
            )}

            {isUnavailableNow && (
              <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mt-1">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Dates no longer available:</span>
                  <span className="text-[11px] text-amber-700 leading-snug block mt-0.5">
                    Another customer's request was accepted for overlapping dates. You can cancel this request and select different dates.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cost & Actions */}
        <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Price</span>
            <span className="text-lg font-extrabold text-navy-950 font-sans">
              {formatCurrency(booking.totalPrice)}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {formatCurrency(booking.dailyRate)}/day
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Details
            </Button>
            {isPending && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Rental Booking #${booking.id}`}
        subtitle={`Created on ${formatDateTime(booking.createdAt)}`}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={displayImage}
              alt={booking.productName}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="w-16 h-16 rounded-xl object-cover bg-slate-100"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{booking.productName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Owner: {booking.vendorName}</p>
              <div className="mt-1">
                <Badge status={booking.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2 text-xs">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Payment & Period Summary
            </h5>
            <div className="flex justify-between text-slate-600">
              <span>Rental Period</span>
              <span className="font-semibold text-slate-800">
                {formatDate(booking.startDate)} → {formatDate(booking.endDate)} ({booking.totalDays} days)
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Daily Rate</span>
              <span className="font-semibold text-slate-800">{formatCurrency(booking.dailyRate)} / day</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Base Subtotal</span>
              <span className="font-semibold text-slate-800">{formatCurrency(booking.baseCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Service Fee</span>
              <span className="font-semibold text-slate-800">{formatCurrency(booking.serviceFee)}</span>
            </div>
            {booking.securityDeposit > 0 && (
              <div className="flex justify-between text-slate-500 italic">
                <span>Refundable Deposit</span>
                <span className="font-medium text-slate-700">{formatCurrency(booking.securityDeposit)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Amount Paid</span>
              <span className="text-brand-700">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>

          {/* Notes or vendor feedback */}
          {booking.customerNotes && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Your Booking Note:</span>
              <p className="text-slate-600 leading-relaxed italic">"{booking.customerNotes}"</p>
            </div>
          )}

          {booking.vendorFeedback && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-800">
              <span className="font-bold block mb-1">Vendor Inspection Feedback:</span>
              <p className="leading-relaxed">"{booking.vendorFeedback}"</p>
            </div>
          )}

          {booking.rejectionReason && (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-xs text-rose-800">
              <span className="font-bold block mb-1">Decline / Cancellation Note:</span>
              <p className="leading-relaxed">{booking.rejectionReason}</p>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <Button variant="primary" onClick={() => setShowDetails(false)}>
              Close Details
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Confirm Modal */}
      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title="Cancel Booking Request?"
        subtitle="This will withdraw your rental request."
        maxWidth="max-w-md"
      >
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to cancel booking <strong>#{booking.id}</strong> for {booking.productName}?
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => setShowCancelConfirm(false)} disabled={isCanceling}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancelBooking} isLoading={isCanceling}>
            Yes, Cancel Request
          </Button>
        </div>
      </Modal>
    </>
  );
};
