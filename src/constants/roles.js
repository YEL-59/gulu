// User roles for the B2B marketplace
export const USER_ROLES = {
  ADMIN: 'admin',
  WHOLESALER: 'wholesaler',
  RESELLER: 'reseller',
  CUSTOMER: 'customer'
}

// Role permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'manage_products',
    'manage_orders',
    'view_analytics',
    'manage_payments',
    'manage_disputes',
    'system_settings'
  ],
  [USER_ROLES.WHOLESALER]: [
    'create_products',
    'manage_own_products',
    'view_own_orders',
    'manage_inventory',
    'view_own_analytics',
    'manage_own_profile'
  ],
  [USER_ROLES.RESELLER]: [
    'create_storefront',
    'manage_own_storefront',
    'browse_products',
    'place_orders',
    'view_own_orders',
    'manage_own_profile'
  ],
  [USER_ROLES.CUSTOMER]: [
    'browse_products',
    'place_orders',
    'view_own_orders',
    'manage_own_profile'
  ]
}

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
}

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed'
}

// Product categories (can be expanded)
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME_GARDEN: 'home_garden',
  HEALTH_BEAUTY: 'health_beauty',
  SPORTS_OUTDOORS: 'sports_outdoors',
  AUTOMOTIVE: 'automotive',
  BOOKS_MEDIA: 'books_media',
  TOYS_GAMES: 'toys_games',
  FOOD_BEVERAGES: 'food_beverages',
  INDUSTRIAL: 'industrial'
}
