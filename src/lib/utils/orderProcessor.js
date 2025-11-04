/**
 * Order processing utilities
 * Handles creating orders and automatically generating purchase records
 */

import { createPurchaseRecord } from "./resellerPurchases";
import { getProductWithSellerInfo } from "./productSellerMapping";

/**
 * Process an order and create purchase records for reseller products
 * @param {Object} orderData - Order data from checkout
 * @param {Array} cartItems - Cart items
 * @returns {Object} { order: Object, purchaseRecords: Array }
 */
export function processOrder(orderData, cartItems) {
  const orderId = generateOrderId();
  const orderDate = new Date().toISOString();

  // Create order object
  const order = {
    id: orderId,
    orderDate: formatDate(new Date()),
    estimatedDelivery: formatDate(addDays(new Date(), 10)),
    status: "pending",
    items: cartItems.map((item) => ({
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity || 1,
    })),
    customer: orderData.billing
      ? `${orderData.billing.firstName} ${orderData.billing.lastName}`
      : "Customer",
    billing: orderData.billing,
    shipping: orderData.shipping,
    paymentMethod: orderData.paymentMethod,
    note: orderData.note,
    createdAt: orderDate,
  };

  // Create purchase records for products sold by resellers
  const purchaseRecords = [];
  
  cartItems.forEach((cartItem) => {
    const productInfo = getProductWithSellerInfo(cartItem.id);
    
    if (productInfo && productInfo.isReseller && productInfo.wholesaler) {
      const purchaseRecord = createPurchaseRecord({
        orderId: orderId,
        productId: cartItem.id,
        resellerId: productInfo.seller.id,
        wholesalerId: productInfo.wholesaler.id,
        productName: cartItem.name,
        quantity: cartItem.quantity || 1,
        resellerPrice: cartItem.price,
        wholesalerPrice: productInfo.wholesalePrice || calculateWholesalePrice(cartItem.price),
      });

      purchaseRecords.push(purchaseRecord);
    }
  });

  return {
    order,
    purchaseRecords,
  };
}

/**
 * Generate a unique order ID
 * @returns {string} Order ID
 */
function generateOrderId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Add days to a date
 * @param {Date} date - Date object
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculate wholesale price (fallback)
 */
function calculateWholesalePrice(resellerPrice) {
  return Math.round(resellerPrice * 0.7 * 100) / 100;
}
