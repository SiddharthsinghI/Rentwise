import { prisma } from '../config/prisma.js';

const mapProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    pricePerDay: Number(p.pricePerDay),
    securityDeposit: Number(p.securityDeposit),
    totalQuantity: Number(p.totalQuantity),
    rating: Number(p.rating),
    reviewsCount: Number(p.reviewsCount),
    images: Array.isArray(p.images) ? p.images : [],
    features: Array.isArray(p.features) ? p.features : [],
    specs: p.specs && typeof p.specs === 'object' ? p.specs : {},
    inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  };
};

export const productRepository = {
  async findAll(params = {}) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      availability,
      sortBy = 'featured',
      vendorId
    } = params;

    const where = {};

    if (vendorId) {
      where.vendorId = String(vendorId);
    }

    if (category && category !== 'all') {
      where.category = {
        equals: category.toLowerCase().trim()
      };
    }

    if (availability && availability !== 'all') {
      where.availability = availability;
    }

    if ((minPrice !== undefined && minPrice !== null && minPrice !== '') ||
        (maxPrice !== undefined && maxPrice !== null && maxPrice !== '')) {
      where.pricePerDay = {};
      if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        where.pricePerDay.gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        where.pricePerDay.lte = Number(maxPrice);
      }
    }

    let orderBy = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy = { pricePerDay: 'asc' };
        break;
      case 'price-desc':
        orderBy = { pricePerDay: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewsCount: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: Array.isArray(orderBy) ? orderBy : [orderBy]
    });

    let list = products.map(mapProduct);

    // Filter by search query across name, brand, description, category, inclusions, features
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const qWords = q.split(/\s+/).filter(Boolean);

      list = list.filter((p) => {
        const fullText = [
          p.name,
          p.category,
          p.description,
          p.specs?.brand,
          p.specs?.model,
          p.location,
          ...(p.features || []),
          ...(p.inclusions || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return fullText.includes(q) || qWords.every((w) => fullText.includes(w));
      });
    }

    return list;
  },

  async findById(id) {
    if (!id) return null;
    const product = await prisma.product.findUnique({
      where: { id: String(id) }
    });
    return mapProduct(product);
  },

  async findByVendor(vendorId) {
    const products = await prisma.product.findMany({
      where: { vendorId: String(vendorId) },
      orderBy: { createdAt: 'desc' }
    });
    return products.map(mapProduct);
  },

  async create(data) {
    const id = data.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const images = Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'];

    const newProduct = await prisma.product.create({
      data: {
        id,
        name: data.name.trim(),
        category: data.category.toLowerCase().trim(),
        vendorId: String(data.vendorId),
        pricePerDay: Number(data.pricePerDay),
        securityDeposit: Number(data.securityDeposit) || 0,
        totalQuantity: Math.max(1, Number(data.totalQuantity) || 1),
        availability: data.availability || 'available',
        condition: data.condition || 'Like New',
        rating: 5.0,
        reviewsCount: 0,
        featured: Boolean(data.featured),
        popular: Boolean(data.popular),
        images,
        description: data.description.trim(),
        features: Array.isArray(data.features) ? data.features : [],
        specs: data.specs && typeof data.specs === 'object' ? data.specs : {},
        location: data.location || 'United States',
        inclusions: Array.isArray(data.inclusions) ? data.inclusions : []
      }
    });

    return mapProduct(newProduct);
  },

  async update(id, updates) {
    const safeData = {};
    if (updates.name !== undefined) safeData.name = updates.name.trim();
    if (updates.category !== undefined) safeData.category = updates.category.toLowerCase().trim();
    if (updates.pricePerDay !== undefined) safeData.pricePerDay = Number(updates.pricePerDay);
    if (updates.securityDeposit !== undefined) safeData.securityDeposit = Number(updates.securityDeposit);
    if (updates.totalQuantity !== undefined) safeData.totalQuantity = Math.max(1, Number(updates.totalQuantity) || 1);
    if (updates.availability !== undefined) safeData.availability = updates.availability;
    if (updates.condition !== undefined) safeData.condition = updates.condition;
    if (updates.description !== undefined) safeData.description = updates.description.trim();
    if (updates.location !== undefined) safeData.location = updates.location.trim();
    if (updates.images !== undefined) safeData.images = updates.images;
    if (updates.features !== undefined) safeData.features = updates.features;
    if (updates.specs !== undefined) safeData.specs = updates.specs;
    if (updates.inclusions !== undefined) safeData.inclusions = updates.inclusions;
    if (updates.featured !== undefined) safeData.featured = Boolean(updates.featured);
    if (updates.popular !== undefined) safeData.popular = Boolean(updates.popular);
    if (updates.rating !== undefined) safeData.rating = Number(updates.rating);
    if (updates.reviewsCount !== undefined) safeData.reviewsCount = Number(updates.reviewsCount);

    try {
      const updated = await prisma.product.update({
        where: { id: String(id) },
        data: safeData
      });
      return mapProduct(updated);
    } catch (err) {
      if (err.code === 'P2025') return null;
      throw err;
    }
  },

  async delete(id) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.wishlistItem.deleteMany({ where: { productId: String(id) } });
        await tx.booking.deleteMany({ where: { productId: String(id) } });
        await tx.product.delete({ where: { id: String(id) } });
      });
      return true;
    } catch (err) {
      if (err.code === 'P2025') return false;
      throw err;
    }
  }
};
