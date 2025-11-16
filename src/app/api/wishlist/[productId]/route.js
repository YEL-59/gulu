/**
 * Wishlist Item API Routes
 * DELETE: Remove item from wishlist
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getUserWishlist, saveUserWishlist } from '@/lib/storage/cart-wishlist-storage';

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { productId } = await params;
    const userId = session.user.id;
    let userWishlist = getUserWishlist(userId);

    // Remove item from wishlist
    userWishlist = userWishlist.filter(item => item.productId !== productId);

    // Save wishlist
    saveUserWishlist(userId, userWishlist);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wishlist: userWishlist,
        message: 'Item removed from wishlist successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to remove item from wishlist' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

