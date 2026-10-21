import { apiClient } from './apiClient';

export const bookingService = {
  // Get all bookings for the authenticated user from MySQL
  async getAll(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.customerId) searchParams.set('customerId', params.customerId);
    if (params.vendorId) searchParams.set('vendorId', params.vendorId);
    if (params.status) searchParams.set('status', params.status);

    const qs = searchParams.toString();
    const endpoint = qs ? `/bookings?${qs}` : '/bookings';
    return apiClient.get(endpoint);
  },

  // Get bookings for a customer
  async getByCustomer(customerId) {
    return apiClient.get(`/bookings?customerId=${customerId}`);
  },

  // Get bookings for a vendor
  async getByVendor(vendorId) {
    return apiClient.get(`/bookings?vendorId=${vendorId}`);
  },

  // Get single booking by ID
  async getById(id) {
    return apiClient.get(`/bookings/${id}`);
  },

  // Create a new rental booking request (Customer action)
  async create(data) {
    const payload = {
      productId: data.productId,
      startDate: data.startDate,
      endDate: data.endDate,
      customerNotes: data.customerNotes || '',
      destination: data.destination || 'Customer Address'
    };

    return apiClient.post('/bookings', payload);
  },

  // Update booking status (Vendor approve/reject/complete; Customer cancel)
  async updateStatus(id, newStatus, reasonOrFeedback = '') {
    return apiClient.patch(`/bookings/${id}/status`, {
      status: newStatus,
      reasonOrFeedback
    });
  }
};
