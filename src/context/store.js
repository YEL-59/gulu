'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const WishlistContext = createContext(null)

function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function saveToStorage(key, value) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // ignore storage errors
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => loadFromStorage('cart', []))
  const [wishlist, setWishlist] = useState(() => loadFromStorage('wishlist', []))

  useEffect(() => saveToStorage('cart', cart), [cart])
  useEffect(() => saveToStorage('wishlist', wishlist), [wishlist])

  const addItem = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === product.id)
      if (idx === -1) return [...prev, { ...product, quantity: qty }]
      const next = [...prev]
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty }
      return next
    })
  }

  const updateQuantity = (id, qtyOrDelta, { mode = 'set' } = {}) => {
    setCart((prev) => {
      return prev.map((it) => {
        if (it.id !== id) return it
        const nextQty = mode === 'delta' ? it.quantity + qtyOrDelta : qtyOrDelta
        return { ...it, quantity: Math.max(1, nextQty) }
      })
    })
  }

  const removeItem = (id) => setCart((prev) => prev.filter((it) => it.id !== id))
  const clearCart = () => setCart([])
  const subtotal = useMemo(() => cart.reduce((sum, it) => sum + it.price * it.quantity, 0), [cart])

  const isWishlisted = (id) => wishlist.some((w) => w.id === id)
  const addWishlistItem = (product) => setWishlist((prev) => (isWishlisted(product.id) ? prev : [...prev, product]))
  const removeWishlistItem = (id) => setWishlist((prev) => prev.filter((w) => w.id !== id))

  const moveAllToCart = () => {
    setCart((prev) => {
      const copy = [...prev]
      wishlist.filter((p) => p.inStock !== false).forEach((p) => {
        const idx = copy.findIndex((it) => it.id === p.id)
        if (idx === -1) copy.push({ ...p, quantity: 1 })
      })
      return copy
    })
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
  }
  const wishlistValue = { 
    items: wishlist, 
    addItem: addWishlistItem, 
    removeItem: removeWishlistItem, 
    isWishlisted, 
    moveAllToCart,
    itemCount: wishlist.length,
  }

  return (
    <CartContext.Provider value={cartValue}>
      <WishlistContext.Provider value={wishlistValue}>{children}</WishlistContext.Provider>
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
export const useWishlist = () => useContext(WishlistContext)