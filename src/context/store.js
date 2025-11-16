'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import * as cartAPI from '@/lib/api/cart'
import * as wishlistAPI from '@/lib/api/wishlist'

const CartContext = createContext(null)
const WishlistContext = createContext(null)

export function StoreProvider({ children }) {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [cartLoading, setCartLoading] = useState(true)
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [cartError, setCartError] = useState(null)
  const [wishlistError, setWishlistError] = useState(null)

  // Fetch cart from API on mount and when session changes
  useEffect(() => {
    const fetchCart = async () => {
      if (status === 'loading') return // Wait for session to load
      
      if (!session) {
        // No session - clear cart
        setCart([])
        setCartLoading(false)
        return
      }

      setCartLoading(true)
      setCartError(null)
      
      const result = await cartAPI.getCart()
      
      if (result.success) {
        // Transform API response to match component expectations
        const transformedItems = result.items.map(item => ({
          id: item.productId, // Use productId as id for components
          cartItemId: item.id, // Keep cart item ID for API calls
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
          size: item.product.size,
          color: item.product.color,
          quantity: item.quantity,
        }))
        setCart(transformedItems)
      } else {
        setCartError(result.error)
        setCart([])
      }
      
      setCartLoading(false)
    }

    fetchCart()
  }, [session, status])

  // Fetch wishlist from API on mount and when session changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === 'loading') return // Wait for session to load
      
      if (!session) {
        // No session - clear wishlist
        setWishlist([])
        setWishlistLoading(false)
        return
      }

      setWishlistLoading(true)
      setWishlistError(null)
      
      const result = await wishlistAPI.getWishlist()
      
      if (result.success) {
        // Transform API response to match component expectations
        const transformedItems = result.items.map(item => ({
          id: item.productId,
          wishlistItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
        }))
        setWishlist(transformedItems)
      } else {
        setWishlistError(result.error)
        setWishlist([])
      }
      
      setWishlistLoading(false)
    }

    fetchWishlist()
  }, [session, status])

  // Add item to cart via API
  const addItem = async (product, qty = 1) => {
    // Validate product and quantity
    if (!product || !product.id) {
      console.error('Cannot add item: Invalid product data')
      setCartError('Invalid product data')
      return
    }
    
    const quantity = Number(qty)
    if (isNaN(quantity) || quantity < 1) {
      console.error('Cannot add item: Invalid quantity')
      setCartError('Invalid quantity')
      return
    }

    // Check if user is authenticated
    if (!session) {
      setCartError('Please sign in to add items to cart')
      return
    }

    try {
      setCartError(null)
      const result = await cartAPI.addToCart(product, quantity)
      
      if (result.success) {
        // Transform and update cart
        const transformedItems = result.cart.map(item => ({
          id: item.productId,
          cartItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
          size: item.product.size,
          color: item.product.color,
          quantity: item.quantity,
        }))
        setCart(transformedItems)
      } else {
        setCartError(result.error)
      }
    } catch (error) {
      console.error('Error adding item to cart:', error)
      setCartError(error.message || 'Failed to add item to cart')
  }
  }

  // Update quantity via API
  const updateQuantity = async (id, qtyOrDelta, { mode = 'set' } = {}) => {
    if (!id) {
      console.error('Cannot update quantity: Invalid item ID')
      return
    }

    const qty = Number(qtyOrDelta)
    if (isNaN(qty)) {
      console.error('Cannot update quantity: Invalid quantity value')
      return
    }

    if (!session) {
      setCartError('Please sign in to update cart')
      return
    }

    try {
      // Find the cart item ID from the product ID
      const cartItem = cart.find(item => item.id === id)
      if (!cartItem || !cartItem.cartItemId) {
        console.error('Cart item not found')
        return
      }

      setCartError(null)
      const result = await cartAPI.updateCartItem(cartItem.cartItemId, qty, mode)
      
      if (result.success) {
        // Transform and update cart
        const transformedItems = result.cart.map(item => ({
          id: item.productId,
          cartItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
          size: item.product.size,
          color: item.product.color,
          quantity: item.quantity,
        }))
        setCart(transformedItems)
      } else {
        setCartError(result.error)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      setCartError(error.message || 'Failed to update quantity')
    }
  }

  // Remove item via API
  const removeItem = async (id) => {
    if (!id) {
      console.error('Cannot remove item: Invalid item ID')
      return
    }

    if (!session) {
      setCartError('Please sign in to remove items from cart')
      return
    }
    
    try {
      // Find the cart item ID from the product ID
      const cartItem = cart.find(item => item.id === id)
      if (!cartItem || !cartItem.cartItemId) {
        console.error('Cart item not found')
        return
      }

      setCartError(null)
      const result = await cartAPI.removeFromCart(cartItem.cartItemId)
      
      if (result.success) {
        // Transform and update cart
        const transformedItems = result.cart.map(item => ({
          id: item.productId,
          cartItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
          size: item.product.size,
          color: item.product.color,
          quantity: item.quantity,
        }))
        setCart(transformedItems)
      } else {
        setCartError(result.error)
      }
    } catch (error) {
      console.error('Error removing item:', error)
      setCartError(error.message || 'Failed to remove item')
    }
  }
  
  // Clear cart via API
  const clearCart = async () => {
    if (!session) {
      setCartError('Please sign in to clear cart')
      return
    }

    try {
      setCartError(null)
      const result = await cartAPI.clearCart()
      
      if (result.success) {
        setCart([])
      } else {
        setCartError(result.error)
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      setCartError(error.message || 'Failed to clear cart')
    }
  }
  
  // Calculate subtotal
  const subtotal = useMemo(() => {
    if (!Array.isArray(cart)) return 0
    return cart.reduce((sum, it) => {
      if (!it) return sum
      const price = Number(it.price) || 0
      const quantity = Number(it.quantity) || 0
      return sum + (price * quantity)
    }, 0)
  }, [cart])

  // Check if product is wishlisted
  const isWishlisted = (id) => {
    if (!id || !Array.isArray(wishlist)) return false
    return wishlist.some((w) => w && w.id === id)
  }
  
  // Add to wishlist via API
  const addWishlistItem = async (product) => {
    if (!product || !product.id) {
      console.error('Cannot add to wishlist: Invalid product data')
      setWishlistError('Invalid product data')
      return
    }

    if (!session) {
      setWishlistError('Please sign in to add items to wishlist')
      return
    }
    
    try {
      setWishlistError(null)
      const result = await wishlistAPI.addToWishlist(product)
      
      if (result.success) {
        // Transform and update wishlist
        const transformedItems = result.wishlist.map(item => ({
          id: item.productId,
          wishlistItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
        }))
        setWishlist(transformedItems)
      } else {
        setWishlistError(result.error)
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      setWishlistError(error.message || 'Failed to add to wishlist')
    }
  }
  
  // Remove from wishlist via API
  const removeWishlistItem = async (id) => {
    if (!id) {
      console.error('Cannot remove from wishlist: Invalid item ID')
      return
    }

    if (!session) {
      setWishlistError('Please sign in to remove items from wishlist')
      return
    }
    
    try {
      setWishlistError(null)
      const result = await wishlistAPI.removeFromWishlist(id)
      
      if (result.success) {
        // Transform and update wishlist
        const transformedItems = result.wishlist.map(item => ({
          id: item.productId,
          wishlistItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
        }))
        setWishlist(transformedItems)
      } else {
        setWishlistError(result.error)
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      setWishlistError(error.message || 'Failed to remove from wishlist')
    }
  }

  // Move all wishlist items to cart
  const moveAllToCart = async () => {
    if (!session) {
      setCartError('Please sign in to move items to cart')
      return
    }

    try {
      setCartError(null)
      const inStockItems = wishlist.filter((p) => p && p.inStock !== false)
      
      // Add each item to cart
      for (const item of inStockItems) {
        const product = {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          brand: item.brand,
          sellerId: item.sellerId,
          category: item.category,
          inStock: item.inStock,
        }
        await cartAPI.addToCart(product, 1)
      }
      
      // Refresh cart after adding all items
      const cartResult = await cartAPI.getCart()
      if (cartResult.success) {
        const transformedItems = cartResult.items.map(item => ({
          id: item.productId,
          cartItemId: item.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.image,
          brand: item.product.brand,
          sellerId: item.product.sellerId,
          category: item.product.category,
          inStock: item.product.inStock,
          size: item.product.size,
          color: item.product.color,
          quantity: item.quantity,
        }))
        setCart(transformedItems)
      }
    } catch (error) {
      console.error('Error moving items to cart:', error)
      setCartError(error.message || 'Failed to move items to cart')
    }
  }

  const cartValue = { 
    items: cart, 
    addItem, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    subtotal,
    itemCount: cart.length,
    totalQuantity: useMemo(() => cart.reduce((sum, item) => sum + (item.quantity || 1), 0), [cart]),
    loading: cartLoading,
    error: cartError,
  }
  
  const wishlistValue = { 
    items: wishlist, 
    addItem: addWishlistItem, 
    removeItem: removeWishlistItem, 
    isWishlisted, 
    moveAllToCart,
    itemCount: wishlist.length,
    loading: wishlistLoading,
    error: wishlistError,
  }

  return (
    <CartContext.Provider value={cartValue}>
      <WishlistContext.Provider value={wishlistValue}>{children}</WishlistContext.Provider>
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    console.warn('useCart must be used within StoreProvider')
    // Return safe defaults to prevent crashes
    return {
      items: [],
      addItem: () => {},
      updateQuantity: () => {},
      removeItem: () => {},
      clearCart: () => {},
      subtotal: 0,
      itemCount: 0,
      totalQuantity: 0,
      loading: false,
      error: null,
    }
  }
  return context
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    console.warn('useWishlist must be used within StoreProvider')
    // Return safe defaults to prevent crashes
    return {
      items: [],
      addItem: () => {},
      removeItem: () => {},
      isWishlisted: () => false,
      moveAllToCart: () => {},
      itemCount: 0,
      loading: false,
      error: null,
    }
  }
  return context
}
