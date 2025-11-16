/**
 * Cart API utility functions
 * Handles all cart-related API calls
 */

const API_BASE = '/api/cart';

/**
 * Get user's cart from server
 */
export async function getCart() {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to view your cart');
      }
      throw new Error('Failed to load cart');
    }

    const data = await response.json();
    return { success: true, items: data.items || [], error: null };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { success: false, items: [], error: error.message };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(product, quantity = 1) {
  try {
    // Validate product data
    if (!product || !product.id) {
      throw new Error('Invalid product data');
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
      throw new Error('Invalid quantity');
    }

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: product.id,
        quantity: quantityNum,
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
          size: product.size,
          color: product.color,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to add items to cart');
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid request');
      }
      throw new Error('Failed to add item to cart');
    }

    const data = await response.json();
    return { success: true, cart: data.cart || [], error: null };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, cart: [], error: error.message };
  }
}

/**
 * Update item quantity in cart
 */
export async function updateCartItem(itemId, quantity, mode = 'set') {
  try {
    if (!itemId) {
      throw new Error('Invalid item ID');
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
      throw new Error('Invalid quantity');
    }

    const response = await fetch(`${API_BASE}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        quantity: quantityNum,
        mode, // 'set' or 'delta'
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to update cart');
      }
      if (response.status === 404) {
        throw new Error('Item not found in cart');
      }
      throw new Error('Failed to update cart item');
    }

    const data = await response.json();
    return { success: true, cart: data.cart || [], error: null };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, cart: [], error: error.message };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId) {
  try {
    if (!itemId) {
      throw new Error('Invalid item ID');
    }

    const response = await fetch(`${API_BASE}/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to remove items from cart');
      }
      if (response.status === 404) {
        throw new Error('Item not found in cart');
      }
      throw new Error('Failed to remove item from cart');
    }

    const data = await response.json();
    return { success: true, cart: data.cart || [], error: null };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, cart: [], error: error.message };
  }
}

/**
 * Clear entire cart
 */
export async function clearCart() {
  try {
    const response = await fetch(API_BASE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Please sign in to clear cart');
      }
      throw new Error('Failed to clear cart');
    }

    return { success: true, cart: [], error: null };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, cart: [], error: error.message };
  }
}

