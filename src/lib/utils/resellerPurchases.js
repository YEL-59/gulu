/**
 * Utility functions for managing reseller purchases from wholesalers
 */

/**
 * Creates a purchase record when a reseller receives an order for a product from a wholesaler
 * @param {Object} params
 * @param {string} params.orderId - The order ID from the buyer
 * @param {string} params.productId - The product ID
 * @param {string} params.resellerId - The reseller ID
 * @param {string} params.wholesalerId - The wholesaler ID
 * @param {string} params.productName - The product name
 * @param {number} params.quantity - Quantity ordered
 * @param {number} params.resellerPrice - Price the reseller sold at
 * @param {number} params.wholesalerPrice - Price the reseller needs to pay to wholesaler
 * @returns {Object} Purchase record
 */
export function createPurchaseRecord({
  orderId,
  productId,
  resellerId,
  wholesalerId,
  productName,
  quantity,
  resellerPrice,
  wholesalerPrice,
}) {
  return {
    id: `rp-${Date.now()}`,
    resellerId,
    orderId,
    productId,
    wholesalerId,
    productName,
    quantity,
    resellerPrice,
    wholesalerPrice,
    status: "pending",
    createdAt: new Date().toISOString(),
    orderDate: new Date().toISOString(),
  };
}

/**
 * Checks if a reseller has pending purchases that block withdrawals
 * @param {Array} purchases - Array of purchase records
 * @returns {Object} { hasPending: boolean, totalAmount: number, count: number }
 */
export function checkPendingPurchases(purchases = []) {
  const pending = purchases.filter((p) => p.status === "pending");
  const totalAmount = pending.reduce((sum, p) => {
    return sum + (p.wholesalerPrice || 0) * (p.quantity || 0);
  }, 0);

  return {
    hasPending: pending.length > 0,
    totalAmount,
    count: pending.length,
    purchases: pending,
  };
}

/**
 * Checks if withdrawal is allowed based on pending purchases
 * @param {number} availableBalance - Available balance for withdrawal
 * @param {Array} purchases - Array of purchase records
 * @returns {Object} { allowed: boolean, reason: string, netAvailable: number }
 */
export function canWithdraw(availableBalance, purchases = []) {
  const pending = checkPendingPurchases(purchases);

  if (pending.hasPending) {
    const netAvailable = Math.max(0, availableBalance - pending.totalAmount);
    return {
      allowed: false,
      reason: `You have ${pending.count} pending purchase(s) totaling $${pending.totalAmount.toFixed(2)}. You must purchase these products from wholesalers before withdrawing.`,
      netAvailable,
      pendingCount: pending.count,
      pendingAmount: pending.totalAmount,
    };
  }

  if (availableBalance <= 0) {
    return {
      allowed: false,
      reason: "No funds available for withdrawal",
      netAvailable: 0,
    };
  }

  return {
    allowed: true,
    reason: null,
    netAvailable: availableBalance,
  };
}

/**
 * Marks a purchase as completed
 * @param {string} purchaseId - The purchase ID to mark as completed
 * @param {Array} purchases - Array of purchase records
 * @returns {Array} Updated purchases array
 */
export function completePurchase(purchaseId, purchases = []) {
  return purchases.map((p) =>
    p.id === purchaseId ? { ...p, status: "completed", completedAt: new Date().toISOString() } : p
  );
}
