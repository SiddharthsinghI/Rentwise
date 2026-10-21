import { apiClient } from './apiClient';

export const productService = {
  // Get all products with optional filters and sorting from MySQL via Express API
  async getAll(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.search && params.search.trim()) {
      searchParams.set('search', params.search.trim());
    }
    if (params.category && params.category !== 'all') {
      searchParams.set('category', params.category);
    }
    if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') {
      searchParams.set('minPrice', params.minPrice);
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') {
      searchParams.set('maxPrice', params.maxPrice);
    }
    if (params.availability && params.availability !== 'all') {
      searchParams.set('availability', params.availability);
    }
    if (params.sortBy) {
      searchParams.set('sortBy', params.sortBy);
    }
    if (params.vendorId) {
      searchParams.set('vendorId', params.vendorId);
    }

    const qs = searchParams.toString();
    const endpoint = qs ? `/products?${qs}` : '/products';
    return apiClient.get(endpoint);
  },

  // Get single product by ID
  async getById(id) {
    return apiClient.get(`/products/${id}`);
  },

  // Create a new equipment listing (Vendor action)
  async create(data) {
    const payload = {
      name: data.name?.trim(),
      category: data.category,
      pricePerDay: Number(data.pricePerDay),
      securityDeposit: Number(data.securityDeposit) || 0,
      totalQuantity: Math.max(1, Number(data.totalQuantity) || 1),
      availability: data.availability || 'available',
      condition: data.condition || 'Like New',
      description: data.description?.trim(),
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : [data.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'],
      features: Array.isArray(data.features) ? data.features : [
        'Tested & cleaned before every rental dispatch',
        'Includes original standard accessories',
        '24/7 technical customer support'
      ],
      specs: data.specs || {
        brand: data.brand || 'Professional Grade',
        weight: data.weight || 'Standard'
      },
      location: data.location || 'Los Angeles, CA',
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : ['Main Unit', 'Power Cable / Battery', 'Protective Padded Bag']
    };

    return apiClient.post('/products', payload);
  },

  // Update existing product
  async update(id, data) {
    const payload = { ...data };
    if (payload.pricePerDay !== undefined) payload.pricePerDay = Number(payload.pricePerDay);
    if (payload.securityDeposit !== undefined) payload.securityDeposit = Number(payload.securityDeposit);
    if (payload.totalQuantity !== undefined) payload.totalQuantity = Math.max(1, Number(payload.totalQuantity) || 1);
    if (payload.imageUrl) {
      payload.images = [payload.imageUrl];
      delete payload.imageUrl;
    }

    return apiClient.patch(`/products/${id}`, payload);
  },

  // Delete product
  async delete(id) {
    return apiClient.delete(`/products/${id}`);
  },

  // Get products listed by specific vendor
  async getByVendor(vendorId) {
    return apiClient.get(`/products?vendorId=${vendorId}`);
  }
};
