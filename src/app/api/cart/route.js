/**
 * Cart API Routes
 * GET: Get user's cart
 * POST: Add item to cart
 * DELETE: Clear entire cart
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getUserCart, saveUserCart } from '@/lib/storage/cart-wishlist-storage';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    const userCart = getUserCart(userId);

    return new Response(
      JSON.stringify({ items: userCart }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching cart:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch cart' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { productId, quantity, product } = body;

    // Validate input
    if (!productId || !product) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productId and product' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const qty = Number(quantity) || 1;
    if (isNaN(qty) || qty < 1) {
      return new Response(
        JSON.stringify({ error: 'Invalid quantity' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    let userCart = carts.get(userId) || [];

    // Check if item already exists in cart
    const existingItemIndex = userCart.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Update quantity
      userCart[existingItemIndex].quantity += qty;
    } else {
      // Add new item
      userCart.push({
        id: `${productId}-${Date.now()}`, // Unique cart item ID
        productId: productId,
        quantity: qty,
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
        addedAt: new Date().toISOString(),
      });
    }

    // Save cart
    saveUserCart(userId, userCart);

    return new Response(
      JSON.stringify({ 
        success: true, 
        cart: userCart,
        message: 'Item added to cart successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add item to cart' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    saveUserCart(userId, []);

    return new Response(
      JSON.stringify({ 
        success: true, 
        cart: [],
        message: 'Cart cleared successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error clearing cart:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to clear cart' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

