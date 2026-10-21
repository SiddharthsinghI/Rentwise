import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, formatDateTime, doDatesOverlap } from '../../utils/formatters';
import { Check, X, RotateCcw, Calendar, User, Mail, MessageSquare, MapPin, AlertTriangle } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useProducts } from '../../hooks/useProducts';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';

export const BookingRequestRow = ({ booking }) => {
  const { updateStatus, bookings } = useBookings();
  const { products } = useProducts();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [vendorFeedback, setVendorFeedback] = useState('Equipment inspected, all components returned in excellent condition.');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) return null;

  // Check inventory stock and date conflicts with already approved/active bookings
  const product = products.find((p) => String(p.id) === String(booking.productId));
  const displayImage = booking.productImage || product?.images?.[0] || FALLBACK_IMAGE;
  const totalStock = Math.max(1, Number(product?.totalQuantity) || 1);

  const conflictingBookings = bookings.filter((b) =>
    String(b.productId) === String(booking.productId) &&
    (b.status === 'approved' || b.status === 'active') &&
    String(b.id) !== String(booking.id) &&
    doDatesOverlap(booking.startDate, booking.endDate, b.startDate, b.endDate)
  );

  const isStockExhausted = conflictingBookings.length >= totalStock;

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await updateStatus(booking.id, 'approved');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartRental = async () => {
    setIsProcessing(true);
    try {
      await updateStatus(booking.id, 'active');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    setIsProcessing(true);
    try {
      await updateStatus(booking.id, 'rejected', rejectReason || 'Equipment unavailable during requested dates.');
      setRejectModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReturn = async () => {
    setIsProcessing(true);
    try {
      await updateStatus(booking.id, 'completed', vendorFeedback);
      setReturnModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-soft hover:shadow-card transition-all flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
        {/* Left: Product & Customer */}
        <div className="flex items-start gap-4">
          <img
            src={displayImage}
            alt={booking.productName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover flex-shrink-0 bg-slate-100 border border-slate-100"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                #{booking.id}
              </span>
              <Badge status={booking.status} size="sm" />
            </div>

            <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
              {booking.productName}
            </h4>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <div className="flex items-center gap-1 text-slate-800 font-semibold">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span>{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.customerEmail}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(booking.startDate)} → {formatDate(booking.endDate)} ({booking.totalDays}d)</span>
              </div>
            </div>

            {booking.customerNotes && (
              <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 max-w-xl">
                <MessageSquare className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="italic line-clamp-1">"{booking.customerNotes}"</span>
              </div>
            )}

            {/* Inventory Conflict Warning if another booking was already approved for overlapping dates */}
            {booking.status === 'pending' && isStockExhausted && (
              <div className="flex items-start gap-2 text-xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200 max-w-xl">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    Inventory Conflict ({totalStock} unit{totalStock > 1 ? 's' : ''} in stock):
                  </span>
                  <span className="text-[11px] text-rose-700 leading-snug block mt-0.5">
                    All {totalStock} unit(s) are already reserved for overlapping dates in approved booking{' '}
                    <strong>#{conflictingBookings[0]?.id}</strong> ({formatDate(conflictingBookings[0]?.startDate)} → {formatDate(conflictingBookings[0]?.endDate)}).
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Revenue & Action Buttons */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="text-left lg:text-right">
            <span className="text-xs text-slate-400 block font-medium">Rental Revenue</span>
            <span className="text-lg font-extrabold text-brand-700">
              {formatCurrency(booking.baseCost)}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Gross: {formatCurrency(booking.totalPrice)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {booking.status === 'pending' && (
              <>
                {isStockExhausted ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={true}
                    className="opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                    title={`Cannot accept: All ${totalStock} unit(s) reserved for overlapping dates`}
                  >
                    Stock Full
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Check}
                    onClick={handleAccept}
                    isLoading={isProcessing}
                  >
                    Accept
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  icon={X}
                  onClick={() => {
                    if (isStockExhausted) {
                      setRejectReason(`Equipment already reserved by another customer for overlapping dates (${formatDate(conflictingBookings[0]?.startDate)} - ${formatDate(conflictingBookings[0]?.endDate)}).`);
                    }
                    setRejectModalOpen(true);
                  }}
                  disabled={isProcessing}
                  className="text-rose-600 hover:text-rose-700 hover:border-rose-300"
                >
                  Decline
                </Button>
              </>
            )}

            {booking.status === 'approved' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartRental}
                isLoading={isProcessing}
              >
                Mark Dispatched / Active
              </Button>
            )}

            {booking.status === 'active' && (
              <Button
                variant="accent"
                size="sm"
                icon={RotateCcw}
                onClick={() => setReturnModalOpen(true)}
                isLoading={isProcessing}
              >
                Mark Returned
              </Button>
            )}

            {booking.status === 'completed' && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                ✓ Rental Settled & Returned
              </span>
            )}

            {booking.status === 'rejected' && (
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                Declined
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reject Booking Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Booking Request"
        subtitle={`Request #${booking.id} from ${booking.customerName}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please let the renter know why their booking is being declined:
          </p>
          <textarea
            rows="3"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="E.g., Equipment scheduled for routine sensor cleaning or already reserved offline..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmReject} isLoading={isProcessing}>
              Confirm Decline
            </Button>
          </div>
        </div>
      </Modal>

      {/* Return & Inspection Modal */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Mark Equipment as Returned"
        subtitle={`Complete rental #${booking.id} and return to available inventory`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Confirm that <strong>{booking.productName}</strong> was returned and verified. This will release the security deposit back to <strong>{booking.customerName}</strong> and mark the gear as Available in the marketplace.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Renter Feedback / Return Inspection Note
            </label>
            <textarea
              rows="2"
              value={vendorFeedback}
              onChange={(e) => setVendorFeedback(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setReturnModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleConfirmReturn} isLoading={isProcessing}>
              Confirm Return & Settle
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
