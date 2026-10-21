import { prisma } from '../config/prisma.js';

export const wishlistRepository = {
  async findByUser(userId) {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: String(userId) },
      select: { productId: true }
    });
    return items.map((item) => item.productId);
  },

  async toggle(userId, productId) {
    const uId = String(userId);
    const pId = String(productId);

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: uId,
          productId: pId
        }
      }
    });

    let isWishlisted = false;
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id }
      });
      isWishlisted = false;
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: uId,
          productId: pId
        }
      });
      isWishlisted = true;
    }

    const updatedList = await this.findByUser(uId);
    return {
      isWishlisted,
      wishlist: updatedList
    };
  }
};
