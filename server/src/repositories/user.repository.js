import { prisma } from '../config/prisma.js';

export const userRepository = {
  async findById(id) {
    if (!id) return null;
    const user = await prisma.user.findUnique({
      where: { id: String(id) }
    });
    if (!user) return null;
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  },

  async findByEmail(email) {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalized }
    });
    if (!user) return null;
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  },

  async create(data) {
    const id = data.id || `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const name = data.name.trim();
    const email = data.email.toLowerCase().trim();
    const role = data.role || 'customer';

    const newUser = await prisma.user.create({
      data: {
        id,
        name,
        email,
        passwordHash: data.passwordHash,
        role,
        avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        businessName: role === 'vendor' ? (data.businessName || `${name}'s Gear`) : null,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        rating: 5.0,
        reviewsCount: 0,
        verified: true,
        responseTime: role === 'vendor' ? (data.responseTime || '< 30 mins') : null
      }
    });

    return {
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString()
    };
  },

  async update(id, updates) {
    const safeData = {};
    if (updates.name !== undefined) safeData.name = updates.name.trim();
    if (updates.phone !== undefined) safeData.phone = updates.phone.trim();
    if (updates.location !== undefined) safeData.location = updates.location.trim();
    if (updates.bio !== undefined) safeData.bio = updates.bio.trim();
    if (updates.businessName !== undefined) safeData.businessName = updates.businessName.trim();
    if (updates.avatar !== undefined) safeData.avatar = updates.avatar.trim();
    if (updates.rating !== undefined) safeData.rating = Number(updates.rating);
    if (updates.reviewsCount !== undefined) safeData.reviewsCount = Number(updates.reviewsCount);
    if (updates.verified !== undefined) safeData.verified = Boolean(updates.verified);
    if (updates.responseTime !== undefined) safeData.responseTime = updates.responseTime;

    try {
      const updated = await prisma.user.update({
        where: { id: String(id) },
        data: safeData
      });
      return {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString()
      };
    } catch (err) {
      if (err.code === 'P2025') {
        return null; // Record to update not found
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      await prisma.user.delete({
        where: { id: String(id) }
      });
      return true;
    } catch (err) {
      if (err.code === 'P2025') return false;
      throw err;
    }
  },

  async findAll() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString()
    }));
  }
};
