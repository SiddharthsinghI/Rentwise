import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_BOOKINGS } from '../data/mockBookings';
import { DEMO_USERS } from '../data/mockUsers';

const KEYS = {
  PRODUCTS: 'rentwise_products_v1',
  BOOKINGS: 'rentwise_bookings_v1',
  USERS: 'rentwise_users_v1',
  CURRENT_USER_ID: 'rentwise_current_user_id_v1',
  WISHLIST: 'rentwise_wishlist_v1',
};

// Safe localStorage wrapper
export const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (key === KEYS.PRODUCTS && Array.isArray(parsed)) {
      return parsed.map((p) => ({
        ...p,
        totalQuantity: Number(p.totalQuantity) || 1
      }));
    }
    return parsed;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
};

// Initialize seed data if not present
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    setStorageItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    setStorageItem(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    setStorageItem(KEYS.USERS, DEMO_USERS);
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER_ID)) {
    setStorageItem(KEYS.CURRENT_USER_ID, 'cust-1'); // Default to Alex Rivera
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    // Seed with a couple wishlist items
    setStorageItem(KEYS.WISHLIST, {
      'cust-1': ['prod-2', 'prod-9', 'prod-18'],
      'cust-2': ['prod-1', 'prod-5']
    });
  }
};

export const resetStorageToDefaults = () => {
  setStorageItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setStorageItem(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setStorageItem(KEYS.USERS, DEMO_USERS);
  setStorageItem(KEYS.CURRENT_USER_ID, 'cust-1');
  setStorageItem(KEYS.WISHLIST, {
    'cust-1': ['prod-2', 'prod-9', 'prod-18'],
    'cust-2': ['prod-1', 'prod-5']
  });
};

export { KEYS };
