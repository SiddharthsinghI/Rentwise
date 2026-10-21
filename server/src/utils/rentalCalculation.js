/**
 * Rental math & date verification utilities matching RentWise domain specifications
 */

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
  const baseCost = Math.round(rate * numDays * 100) / 100;
  const serviceFee = Math.round(baseCost * 0.075 * 100) / 100; // 7.5% platform fee
  const deposit = Number(securityDeposit) || 0;
  const total = Math.round((baseCost + serviceFee) * 100) / 100;

  return {
    dailyRate: rate,
    days: numDays,
    baseCost,
    serviceFee,
    securityDeposit: deposit,
    totalPrice: total,
    grandTotalWithDeposit: Math.round((total + deposit) * 100) / 100
  };
};

/**
 * Checks if two date ranges [startA, endA] and [startB, endB] overlap
 */
export const doDatesOverlap = (startA, endA, startB, endB) => {
  if (!startA || !endA || !startB || !endB) return false;
  const sA = new Date(startA).setHours(0, 0, 0, 0);
  const eA = new Date(endA).setHours(23, 59, 59, 999);
  const sB = new Date(startB).setHours(0, 0, 0, 0);
  const eB = new Date(endB).setHours(23, 59, 59, 999);
  return sA <= eB && eA >= sB;
};
