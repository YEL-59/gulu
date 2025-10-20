'use client'

import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import { useCart, useWishlist } from '@/context/store'

export default function WishlistPage() {
  const { items: wishlistItems, removeItem: removeFromWishlist, moveAllToCart } = useWishlist()
  const { addItem: addToCart } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlistItems.length} items in your wishlist</p>
        </div>

        {wishlistItems.some(item => item.inStock) && (
          <Button onClick={moveAllToCart} className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Move All to Cart
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you love for later by clicking the heart icon.</p>
          <Button>Start Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />

              {/* Wishlist Actions */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              {product.inStock && (
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => addToCart(product, 1)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              )}

              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <span className="bg-white px-3 py-1 rounded text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recently Viewed */}
      {wishlistItems.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Add recently viewed products here */}
          </div>
        </div>
      )}
    </div>
  )
}




