/**
 * Wishlist API utility functions
 * Handles all wishlist-related API calls
 */

const API_BASE = '/api/wishlist';

/**
 * Get user's wishlist from server
 */
export async function getWishlist() {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to view your wishlist');
      }
      throw new Error('Failed to load wishlist');
    }

    const data = await response.json();
    return { success: true, items: data.items || [], error: null };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return { success: false, items: [], error: error.message };
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(product) {
  try {
    // Validate product data
    if (!product || !product.id) {
      throw new Error('Invalid product data');
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name || 'Unknown Product',
          price: Number(product.price) || 0,
          originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
          image: product.image || '/placeholder-image.png',
          brand: product.brand,
          sellerId: product.sellerId,
          category: product.category,
          inStock: product.inStock !== false,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to add items to wishlist');
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid request');
      }
      if (response.status === 409) {
        throw new Error('Item already in wishlist');
      }
      throw new Error('Failed to add item to wishlist');
    }

    const data = await response.json();
    return { success: true, wishlist: data.wishlist || [], error: null };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, wishlist: [], error: error.message };
  }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(productId) {
  try {
    if (!productId) {
      throw new Error('Invalid product ID');
    }

    const response = await fetch(`${API_BASE}/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to remove items from wishlist');
      }
      if (response.status === 404) {
        throw new Error('Item not found in wishlist');
      }
      throw new Error('Failed to remove item from wishlist');
    }

    const data = await response.json();
    return { success: true, wishlist: data.wishlist || [], error: null };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, wishlist: [], error: error.message };
  }
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(productId) {
  try {
    if (!productId) return false;

    const response = await fetch(`${API_BASE}/check/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isWishlisted || false;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

