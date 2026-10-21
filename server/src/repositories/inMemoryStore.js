import { SEED_USERS, SEED_PRODUCTS, SEED_BOOKINGS } from './seedData.js';

class InMemoryStore {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.bookings = new Map();
    this.seed();
  }

  seed() {
    this.users.clear();
    this.products.clear();
    this.bookings.clear();

    SEED_USERS.forEach((u) => {
      this.users.set(String(u.id), JSON.parse(JSON.stringify(u)));
    });

    SEED_PRODUCTS.forEach((p) => {
      this.products.set(String(p.id), JSON.parse(JSON.stringify(p)));
    });

    SEED_BOOKINGS.forEach((b) => {
      this.bookings.set(String(b.id), JSON.parse(JSON.stringify(b)));
    });
  }

  reset() {
    this.seed();
  }
}

export const inMemoryStore = new InMemoryStore();
