/**
 * Check if product is in wishlist
 * GET: Check wishlist status
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getUserWishlist } from '@/lib/storage/cart-wishlist-storage';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ isWishlisted: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { productId } = await params;
    const userId = session.user.id;
    const userWishlist = getUserWishlist(userId);

    const isWishlisted = userWishlist.some(item => item.productId === productId);

    return new Response(
      JSON.stringify({ isWishlisted }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return new Response(
      JSON.stringify({ isWishlisted: false }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

