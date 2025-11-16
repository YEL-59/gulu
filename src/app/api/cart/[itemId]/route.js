/**
 * Cart Item API Routes
 * PUT: Update item quantity
 * DELETE: Remove specific item from cart
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getUserCart, saveUserCart } from '@/lib/storage/cart-wishlist-storage';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { itemId } = await params;
    const body = await req.json();
    const { quantity, mode = 'set' } = body;

    // Validate input
    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return new Response(
        JSON.stringify({ error: 'Invalid quantity' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    let userCart = getUserCart(userId);

    // Find item in cart
    const itemIndex = userCart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Item not found in cart' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update quantity
    if (mode === 'delta') {
      userCart[itemIndex].quantity = Math.max(1, userCart[itemIndex].quantity + qty);
    } else {
      userCart[itemIndex].quantity = qty;
    }

    // Save cart
    saveUserCart(userId, userCart);

    return new Response(
      JSON.stringify({ 
        success: true, 
        cart: userCart,
        message: 'Cart item updated successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating cart item:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update cart item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { itemId } = await params;
    const userId = session.user.id;
    let userCart = getUserCart(userId);

    // Remove item from cart
    userCart = userCart.filter(item => item.id !== itemId);

    // Save cart
    saveUserCart(userId, userCart);

    return new Response(
      JSON.stringify({ 
        success: true, 
        cart: userCart,
        message: 'Item removed from cart successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error removing cart item:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to remove cart item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

