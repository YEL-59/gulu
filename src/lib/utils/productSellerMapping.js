/**
 * Utility to map products to their wholesalers and resellers
 * This handles the complete cycle: User → Reseller → Wholesaler
 */

import productsData from "@/lib/data/products.json";
import sellersData from "@/lib/data/sellers.json";

/**
 * Get the wholesaler for a product
 * If product is sold by a reseller, find the wholesaler that supplies it
 * @param {Object} product - Product object
 * @returns {Object|null} Wholesaler seller object
 */
export function getWholesalerForProduct(product) {
  if (!product) return null;

  // If product has direct sellerId, check if it's a wholesaler
  if (product.sellerId) {
    const seller = sellersData.find((s) => s.id === product.sellerId);
    if (seller && seller.type === "wholesaler") {
      return seller;
    }
    // If seller is reseller, find wholesaler by brand/aliases
    if (seller && seller.type === "reseller") {
      return findWholesalerByBrand(product.brand);
    }
  }

  // Find wholesaler by brand if no direct sellerId
  return findWholesalerByBrand(product.brand);
}

/**
 * Find wholesaler by brand name or aliases
 * @param {string} brand - Brand name
 * @returns {Object|null} Wholesaler seller object
 */
function findWholesalerByBrand(brand) {
  if (!brand) return getDefaultWholesaler();

  const brandLower = brand.toLowerCase();

  // Find wholesaler that has this brand in aliases or matches brand
  const wholesaler = sellersData.find((s) => {
    if (s.type !== "wholesaler") return false;
    const sellerName = (s.name || "").toLowerCase();
    const aliases = Array.isArray(s.aliases) ? s.aliases.map((a) => (a || "").toLowerCase()) : [];
    return sellerName === brandLower || aliases.includes(brandLower);
  });

  return wholesaler || getDefaultWholesaler();
}

/**
 * Get default wholesaler
 * @returns {Object|null} Default wholesaler
 */
function getDefaultWholesaler() {
  return sellersData.find((s) => s.isDefault && s.type === "wholesaler") || null;
}

/**
 * Get the seller (reseller or wholesaler) for a product
 * @param {Object} product - Product object
 * @returns {Object|null} Seller object
 */
export function getSellerForProduct(product) {
  if (!product) return null;

  if (product.sellerId) {
    const seller = sellersData.find((s) => s.id === product.sellerId);
    if (seller) return seller;
  }

  // Find by brand
  const brand = (product.brand || "").toLowerCase();
  return (
    sellersData.find((s) => s.name.toLowerCase() === brand) ||
    sellersData.find((s) => (s.aliases || []).includes(brand)) ||
    getDefaultWholesaler()
  );
}

/**
 * Calculate wholesale price (typically 60-75% of reseller price)
 * @param {number} resellerPrice - Price reseller sells at
 * @param {number} margin - Profit margin (default 0.3 = 30%, so wholesale = 70%)
 * @returns {number} Wholesale price
 */
export function calculateWholesalePrice(resellerPrice, margin = 0.3) {
  return Math.round(resellerPrice * (1 - margin) * 100) / 100;
}

/**
 * Check if product is sold by a reseller
 * @param {Object} product - Product object
 * @returns {boolean}
 */
export function isSoldByReseller(product) {
  if (!product || !product.sellerId) return false;
  const seller = sellersData.find((s) => s.id === product.sellerId);
  return seller && seller.type === "reseller";
}

/**
 * Get product with seller and wholesaler information
 * @param {string} productId - Product ID
 * @returns {Object|null} Product with seller info
 */
export function getProductWithSellerInfo(productId) {
  const product = productsData.find((p) => p.id === productId);
  if (!product) return null;

  const seller = getSellerForProduct(product);
  const wholesaler = getWholesalerForProduct(product);
  const isReseller = seller && seller.type === "reseller";
  const wholesalePrice = isReseller ? calculateWholesalePrice(product.price) : null;

  return {
    ...product,
    seller,
    wholesaler,
    isReseller,
    wholesalePrice,
  };
}
