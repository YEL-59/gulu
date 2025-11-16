/**
 * Wishlist API Routes
 * GET: Get user's wishlist
 * POST: Add item to wishlist
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getUserWishlist, saveUserWishlist } from '@/lib/storage/cart-wishlist-storage';

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
    const userWishlist = getUserWishlist(userId);

    return new Response(
      JSON.stringify({ items: userWishlist }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch wishlist' }),
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
    const { productId, product } = body;

    // Validate input
    if (!productId || !product) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productId and product' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    let userWishlist = getUserWishlist(userId);

    // Check if item already exists
    const exists = userWishlist.some(item => item.productId === productId);
    if (exists) {
      return new Response(
        JSON.stringify({ error: 'Item already in wishlist' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add new item
    userWishlist.push({
      id: `${productId}-${Date.now()}`,
      productId: productId,
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
      addedAt: new Date().toISOString(),
    });

    // Save wishlist
    saveUserWishlist(userId, userWishlist);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wishlist: userWishlist,
        message: 'Item added to wishlist successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add item to wishlist' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

