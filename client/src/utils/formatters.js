export const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const calculateDays = (start, end) => {
  if (!start || !end) return 1;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

export const calculateRentalCost = (dailyRate, days = 1, securityDeposit = 0) => {
  const rate = Number(dailyRate) || 0;
  const numDays = Math.max(1, Number(days) || 1);
  const baseCost = rate * numDays;
  const serviceFee = Math.round(baseCost * 0.075 * 100) / 100; // 7.5% platform fee
  const deposit = Number(securityDeposit) || 0;
  const total = Math.round((baseCost + serviceFee) * 100) / 100;
  
  return {
    dailyRate: rate,
    days: numDays,
    baseCost,
    serviceFee,
    securityDeposit: deposit,
    total,
    grandTotalWithDeposit: Math.round((total + deposit) * 100) / 100
  };
};

export const getStatusBadgeStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Approved'
      };
    case 'active':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Active Rental'
      };
    case 'pending':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Pending Approval'
      };
    case 'completed':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: 'Returned & Completed'
      };
    case 'rejected':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'Declined'
      };
    case 'available':
      return {
        bg: 'bg-teal-50 text-teal-700 border-teal-200',
        dot: 'bg-teal-500',
        label: 'Available Now'
      };
    case 'rented':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        label: 'Currently Rented'
      };
    case 'unavailable':
      return {
        bg: 'bg-gray-100 text-gray-500 border-gray-200',
        dot: 'bg-gray-400',
        label: 'Unavailable'
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        label: status || 'Unknown'
      };
  }
};

// Check if two date ranges [startA, endA] and [startB, endB] overlap
export const doDatesOverlap = (startA, endA, startB, endB) => {
  if (!startA || !endA || !startB || !endB) return false;
  const sA = new Date(startA).setHours(0, 0, 0, 0);
  const eA = new Date(endA).setHours(23, 59, 59, 999);
  const sB = new Date(startB).setHours(0, 0, 0, 0);
  const eB = new Date(endB).setHours(23, 59, 59, 999);
  return sA <= eB && eA >= sB;
};

// Calculate available stock for a product during a given date window [startDate, endDate]
export const calculateProductAvailability = (product, bookings = [], startDate = null, endDate = null, excludeBookingId = null) => {
  if (!product) {
    return {
      totalQuantity: 1,
      bookedCount: 0,
      availableQuantity: 0,
      isAvailable: false,
      conflictingBookings: []
    };
  }

  const totalQuantity = Math.max(1, Number(product.totalQuantity) || 1);

  if (!startDate || !endDate) {
    // Check currently active rentals
    const activeRentals = bookings.filter((b) =>
      String(b.productId) === String(product.id) &&
      (b.status === 'active' || b.status === 'approved') &&
      b.id !== excludeBookingId
    );
    const availableQuantity = Math.max(0, totalQuantity - activeRentals.length);
    return {
      totalQuantity,
      bookedCount: activeRentals.length,
      availableQuantity,
      isAvailable: availableQuantity > 0 && product.availability !== 'unavailable',
      conflictingBookings: activeRentals,
    };
  }

  // Check approved or active rentals that overlap with [startDate, endDate]
  const conflictingBookings = bookings.filter((b) =>
    String(b.productId) === String(product.id) &&
    (b.status === 'approved' || b.status === 'active') &&
    b.id !== excludeBookingId &&
    doDatesOverlap(startDate, endDate, b.startDate, b.endDate)
  );

  const bookedCount = conflictingBookings.length;
  const availableQuantity = Math.max(0, totalQuantity - bookedCount);
  const isAvailable = availableQuantity > 0 && product.availability !== 'unavailable';

  return {
    totalQuantity,
    bookedCount,
    availableQuantity,
    isAvailable,
    conflictingBookings,
  };
};
