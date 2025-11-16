/**
 * Shared in-memory storage for cart and wishlist
 * 
 * NOTE: This is temporary storage for development.
 * In production, replace this with Prisma database calls.
 * 
 * To migrate to database:
 * 1. Create Prisma schema for Cart and Wishlist models
 * 2. Replace Map operations with Prisma queries
 * 3. See docs/API_MIGRATION_GUIDE.md for details
 */

// Temporary in-memory storage
export const carts = new Map(); // userId -> cart items array
export const wishlists = new Map(); // userId -> wishlist items array

/**
 * Helper to get user cart
 */
export function getUserCart(userId) {
  return carts.get(userId) || [];
}

/**
 * Helper to save user cart
 */
export function saveUserCart(userId, cartItems) {
  carts.set(userId, cartItems);
}

/**
 * Helper to get user wishlist
 */
export function getUserWishlist(userId) {
  return wishlists.get(userId) || [];
}

/**
 * Helper to save user wishlist
 */
export function saveUserWishlist(userId, wishlistItems) {
  wishlists.set(userId, wishlistItems);
}

