import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuthContext } from './AuthContext';
import { useToastContext } from './ToastContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToastContext();

  const fetchBookings = useCallback(async () => {
    if (!currentUser) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData) => {
    try {
      const created = await bookingService.create(bookingData);
      setBookings((prev) => [created, ...prev]);
      toast.success('Rental request submitted to vendor!');
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking request');
      throw err;
    }
  };

  const updateStatus = async (id, newStatus, note = '') => {
    try {
      const updated = await bookingService.updateStatus(id, newStatus, note);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      
      if (newStatus === 'approved') {
        toast.success(`Booking #${id} approved!`);
      } else if (newStatus === 'rejected') {
        toast.warning(`Booking #${id} was declined.`);
      } else if (newStatus === 'completed') {
        toast.success(`Rental marked as returned & completed.`);
      } else if (newStatus === 'active') {
        toast.info(`Rental marked as active.`);
      } else {
        toast.info(`Booking status updated to ${newStatus}.`);
      }
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update booking status');
      throw err;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        fetchBookings,
        createBooking,
        updateStatus
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};
