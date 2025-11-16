# Cart & Wishlist System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Flow](#data-flow)
4. [Core Components](#core-components)
5. [Error Handling Strategy](#error-handling-strategy)
6. [Storage Management](#storage-management)
7. [Usage Examples](#usage-examples)
8. [Edge Cases & Validations](#edge-cases--validations)
9. [Future API Integration](#future-api-integration)

---

## Overview

The Cart & Wishlist system is a client-side state management solution built with React Context API. It provides a robust, error-resistant shopping experience with persistent storage using localStorage. The system handles product management, quantity updates, and checkout preparation with comprehensive error handling.

### Key Features
- ✅ Persistent cart and wishlist storage
- ✅ Real-time quantity management
- ✅ Comprehensive error handling
- ✅ Data validation at every step
- ✅ Graceful degradation on errors
- ✅ Safe defaults for missing data
- ✅ Production-ready error messages

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    StoreProvider                        │
│  ┌──────────────────┐      ┌──────────────────┐         │
│  │  CartContext     │      │ WishlistContext  │         │
│  │  - items[]       │      │  - items[]       │         │
│  │  - addItem()     │      │  - addItem()     │         │
│  │  - updateQty()   │      │  - removeItem()  │         │
│  │  - removeItem()  │      │  - isWishlisted()│         │
│  │  - subtotal      │      │  - moveAllToCart()│        │
│  └──────────────────┘      └──────────────────┘         │
│           │                         │                   │
│           └─────────┬───────────────┘                   │
│                     │                                   │
│              localStorage                               │
│         (cart, wishlist)                                │
└─────────────────────────────────────────────────────────┘
           │                    │
           ▼                    ▼
    ┌──────────┐        ┌──────────┐
    │ CartPage │        │Wishlist  │
    │          │        │  Page    │
    └──────────┘        └──────────┘
           │                    │
           ▼                    ▼
    ┌──────────┐        ┌──────────┐
    │Product   │        │Product   │
    │Page      │        │Card      │
    └──────────┘        └──────────┘
```

### Technology Stack
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/JSX

---

## Data Flow

### Adding Item to Cart

```
User Action (Add to Cart)
    │
    ▼
ProductCard/ProductPage
    │
    ▼
Validate Product Data
    ├─ Check product exists
    ├─ Check product.id exists
    ├─ Validate price (number, >= 0)
    ├─ Check stock availability
    └─ Validate quantity (>= 1)
    │
    ▼
useCart().addItem(product, quantity)
    │
    ▼
Store Context - addItem()
    ├─ Validate product & quantity
    ├─ Check if item exists in cart
    ├─ Update or add item
    └─ Trigger localStorage save
    │
    ▼
localStorage.setItem('cart', JSON.stringify(cart))
    │
    ▼
UI Updates (Cart count, subtotal, etc.)
```

### Removing Item from Cart

```
User Action (Remove Item)
    │
    ▼
CartPage - removeItem(item.id)
    │
    ▼
Validate item ID
    │
    ▼
useCart().removeItem(id)
    │
    ▼
Store Context - removeItem()
    ├─ Validate ID exists
    ├─ Filter out item from cart
    └─ Trigger localStorage save
    │
    ▼
UI Updates
```

---

## Core Components

### 1. Store Context (`src/context/store.js`)

The central state management hub for cart and wishlist operations.

#### Key Functions

##### `loadFromStorage(key, fallback)`
```javascript
// Purpose: Safely load data from localStorage
// Error Handling:
// - Checks if window is defined (SSR safety)
// - Validates JSON parsing
// - Ensures returned data is an array
// - Returns fallback on any error
```

**Logic Flow:**
1. Check if running in browser (`typeof window !== 'undefined'`)
2. Try to get item from localStorage
3. Parse JSON safely
4. Validate it's an array
5. Return fallback if any step fails

##### `saveToStorage(key, value)`
```javascript
// Purpose: Safely save data to localStorage
// Error Handling:
// - Checks if window is defined
// - Validates value is an array before saving
// - Handles quota exceeded errors
// - Logs warnings instead of crashing
```

**Logic Flow:**
1. Check if running in browser
2. Validate value is an array
3. Try to stringify and save
4. Catch and log errors (don't crash)

##### `addItem(product, qty = 1)`
```javascript
// Purpose: Add product to cart or update quantity
// Validations:
// - Product exists and has ID
// - Quantity is valid number >= 1
// - Product price is valid
```

**Logic Flow:**
1. Validate product has required fields (id)
2. Validate quantity (number, >= 1)
3. Check if product already in cart
4. If exists: Update quantity (add to existing)
5. If new: Add to cart array
6. Update state (triggers localStorage save)

##### `updateQuantity(id, qtyOrDelta, { mode = 'set' })`
```javascript
// Purpose: Update item quantity in cart
// Modes:
// - 'set': Set absolute quantity
// - 'delta': Add/subtract from current quantity
// Validations:
// - ID exists
// - Quantity is valid number
// - Minimum quantity is 1
```

**Logic Flow:**
1. Validate ID exists
2. Validate quantity is a number
3. Find item in cart by ID
4. Calculate new quantity based on mode
5. Ensure quantity >= 1
6. Update item in cart array
7. Update state

##### `subtotal` (Computed)
```javascript
// Purpose: Calculate total price of all cart items
// Error Handling:
// - Handles missing/null items
// - Handles invalid prices/quantities
// - Returns 0 if cart is empty or invalid
```

**Calculation:**
```javascript
cart.reduce((sum, item) => {
  if (!item) return sum;  // Skip invalid items
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  return sum + (price * quantity);
}, 0)
```

#### Context Safety

Both `useCart()` and `useWishlist()` hooks return safe defaults if context is not available:

```javascript
// Prevents crashes if used outside StoreProvider
if (!context) {
  return {
    items: [],
    addItem: () => {},
    // ... other safe defaults
  }
}
```

---

### 2. Cart Page (`src/app/store/cart/page.jsx`)

Displays cart items, allows quantity updates, and proceeds to checkout.

#### Key Features

##### Empty Cart Handling
```javascript
// Shows empty state message
// Disables checkout button
// Validates before proceeding
```

##### Quantity Updates
```javascript
// Three ways to update:
// 1. Decrease button (-)
// 2. Direct input (with validation)
// 3. Increase button (+)

// All updates:
// - Validate input is number
// - Ensure >= 1
// - Handle NaN/empty values
// - Wrap in try-catch
```

##### Checkout Validation
```javascript
// Before proceeding:
// 1. Check cart is not empty
// 2. Validate all items have required fields
// 3. Save to localStorage safely
// 4. Handle errors gracefully
```

#### Error Handling

**Image Loading:**
```javascript
<img 
  src={itemImage} 
  onError={(e) => {
    e.target.src = '/placeholder-image.png';
  }}
/>
```

**Price Calculations:**
```javascript
// Always use Number() conversion
// Provide fallback values (|| 0)
// Use toFixed(2) for display
const itemPrice = Number(item.price) || 0;
const itemQuantity = Number(item.quantity) || 1;
const itemSubtotal = itemPrice * itemQuantity;
```

---

### 3. Wishlist Page (`src/app/store/wishlist/page.jsx`)

Displays wishlist items with options to add to cart or remove.

#### Key Features

##### Safe Item Filtering
```javascript
// Filters out invalid items before rendering
const safeWishlistItems = Array.isArray(wishlistItems) 
  ? wishlistItems.filter(item => item && item.id) 
  : [];
```

##### Move All to Cart
```javascript
// Only moves in-stock items
// Prevents duplicates
// Handles errors gracefully
```

##### Stock Validation
```javascript
// Checks before adding to cart
// Shows out-of-stock overlay
// Disables add-to-cart for out-of-stock items
```

---

### 4. Product Page (`src/app/store/product/[slug]/page.jsx`)

Product detail page with add to cart, buy now, and wishlist functionality.

#### Key Handlers

##### `handleAddToCart()`
```javascript
// Validations:
// 1. Product exists and has ID
// 2. Quantity is valid (>= 1)
// 3. Product is in stock
// 4. Price is valid number

// Process:
// 1. Validate all inputs
// 2. Prepare product data with fallbacks
// 3. Add to cart
// 4. Show success message
// 5. Handle errors
```

##### `handleBuyNow()`
```javascript
// Similar to addToCart but:
// 1. Also saves to checkoutCart in localStorage
// 2. Calculates totals (subtotal, shipping, tax)
// 3. Redirects to billing page
// 4. Handles localStorage errors
```

##### `handleAddToWishlist()`
```javascript
// Toggles wishlist state
// Validates product exists
// Handles errors gracefully
```

#### Quantity Input Safety

```javascript
// onChange: Validates as user types
// onBlur: Ensures valid value on blur
// Prevents:
// - Empty values
// - Negative numbers
// - NaN values
// - Non-integer values
```

---

### 5. ProductCard Component (`src/components/store/ProductCard.jsx`)

Reusable product card with quick add to cart and wishlist.

#### Error Handling

**Product Validation:**
```javascript
// Every operation checks:
if (!product || !product.id) {
  console.error('Invalid product');
  return;
}
```

**Price Display:**
```javascript
// Always format with toFixed(2)
// Provide fallback (|| 0)
${(Number(product.price) || 0).toFixed(2)}
```

**Image Fallback:**
```javascript
// Primary: product.image
// Fallback: '/placeholder-image.png'
// Error handler: Sets fallback on load error
```

---

## Error Handling Strategy

### Philosophy

**Defensive Programming**: Assume data can be invalid, missing, or corrupted at any point.

### Error Handling Layers

#### Layer 1: Input Validation
```javascript
// Validate before processing
if (!product || !product.id) return;
if (isNaN(quantity) || quantity < 1) return;
```

#### Layer 2: Try-Catch Blocks
```javascript
// Wrap operations that might fail
try {
  addCartItem(product, quantity);
} catch (error) {
  console.error('Error:', error);
  alert('Failed to add item. Please try again.');
}
```

#### Layer 3: Safe Defaults
```javascript
// Provide fallbacks for missing data
const price = Number(item.price) || 0;
const quantity = Number(item.quantity) || 1;
const name = product.name || 'Unknown Product';
```

#### Layer 4: Storage Error Handling
```javascript
// localStorage can fail (quota, disabled, etc.)
try {
  localStorage.setItem('cart', JSON.stringify(cart));
} catch (e) {
  console.warn('Storage error:', e);
  // Continue without crashing
}
```

#### Layer 5: Context Safety
```javascript
// Hooks return safe defaults if context missing
if (!context) {
  return { items: [], addItem: () => {} };
}
```

### Error Types Handled

1. **Null/Undefined Values**
   - Products, items, properties
   - Array operations
   - Object access

2. **Invalid Data Types**
   - Non-numeric prices/quantities
   - Non-array cart/wishlist
   - Missing required fields

3. **Storage Errors**
   - localStorage unavailable
   - Quota exceeded
   - Corrupted data

4. **Network Errors** (Future API)
   - Request failures
   - Timeouts
   - Invalid responses

5. **User Input Errors**
   - Invalid quantities
   - Empty fields
   - Negative numbers

---

## Storage Management

### localStorage Structure

#### Cart Storage
```json
{
  "cart": [
    {
      "id": "product-123",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2,
      "image": "/path/to/image.jpg",
      "brand": "Brand Name",
      "sellerId": "seller-456",
      "category": "Electronics",
      "inStock": true
    }
  ]
}
```

#### Wishlist Storage
```json
{
  "wishlist": [
    {
      "id": "product-123",
      "name": "Product Name",
      "price": 29.99,
      "image": "/path/to/image.jpg",
      "brand": "Brand Name",
      "inStock": true
    }
  ]
}
```

#### Checkout Cart Storage
```json
{
  "checkoutCart": {
    "items": [...],
    "subtotal": 59.98,
    "shipping": 0,
    "discount": 0,
    "tax": 7.20,
    "total": 67.18,
    "coupon": ""
  }
}
```

### Storage Operations

#### Loading
```javascript
// Always validate loaded data
const cart = loadFromStorage('cart', []);
// Returns [] if:
// - localStorage unavailable
// - Key doesn't exist
// - Data is corrupted
// - Data is not an array
```

#### Saving
```javascript
// Always validate before saving
if (Array.isArray(cart)) {
  saveToStorage('cart', cart);
}
// Handles:
// - Quota exceeded
// - Storage disabled
// - Invalid data types
```

### Data Migration (Future)

If storage structure changes:
```javascript
// Check version and migrate
const version = localStorage.getItem('cart_version');
if (version !== CURRENT_VERSION) {
  // Migrate old data to new format
  migrateCartData();
}
```

---

## Usage Examples

### Adding Item to Cart

```javascript
import { useCart } from '@/context/store';

function ProductCard({ product }) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    // Validation is handled internally
    addItem(product, 1);
  };
  
  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

### Updating Quantity

```javascript
import { useCart } from '@/context/store';

function CartItem({ item }) {
  const { updateQuantity } = useCart();
  
  // Increase by 1
  const increase = () => {
    updateQuantity(item.id, 1, { mode: 'delta' });
  };
  
  // Set to specific value
  const setQuantity = (qty) => {
    updateQuantity(item.id, qty, { mode: 'set' });
  };
}
```

### Checking Wishlist Status

```javascript
import { useWishlist } from '@/context/store';

function ProductCard({ product }) {
  const { isWishlisted, addItem, removeItem } = useWishlist();
  
  const toggleWishlist = () => {
    if (isWishlisted(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };
  
  return (
    <button onClick={toggleWishlist}>
      {isWishlisted(product.id) ? 'Remove' : 'Add'} to Wishlist
    </button>
  );
}
```

### Accessing Cart Data

```javascript
import { useCart } from '@/context/store';

function CartSummary() {
  const { items, subtotal, itemCount, totalQuantity } = useCart();
  
  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total Quantity: {totalQuantity}</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
    </div>
  );
}
```

---

## Edge Cases & Validations

### Handled Edge Cases

#### 1. Empty Cart
- ✅ Shows empty state message
- ✅ Disables checkout button
- ✅ Validates before checkout

#### 2. Invalid Product Data
- ✅ Missing ID → Rejected
- ✅ Missing price → Uses 0 or rejects
- ✅ Invalid price → Validates and rejects
- ✅ Missing name → Uses "Unknown Product"

#### 3. Invalid Quantities
- ✅ NaN → Defaults to 1
- ✅ Negative → Clamped to 1
- ✅ Zero → Clamped to 1
- ✅ Decimal → Floored to integer
- ✅ Empty string → Defaults to 1

#### 4. Storage Issues
- ✅ localStorage disabled → Continues without persistence
- ✅ Quota exceeded → Logs warning, continues
- ✅ Corrupted data → Resets to empty array
- ✅ Invalid JSON → Returns fallback

#### 5. Missing Context
- ✅ Used outside Provider → Returns safe defaults
- ✅ Context not initialized → No crashes

#### 6. Image Loading
- ✅ Missing image → Uses placeholder
- ✅ Failed load → Falls back to placeholder
- ✅ Invalid URL → Handles gracefully

#### 7. Stock Management
- ✅ Out of stock → Prevents add to cart
- ✅ Shows out-of-stock overlay
- ✅ Disables buttons appropriately

#### 8. Duplicate Items
- ✅ Same product added twice → Updates quantity
- ✅ Prevents duplicate entries

### Validation Checklist

Before adding to cart:
- [ ] Product exists
- [ ] Product has valid ID
- [ ] Product has valid price (number, >= 0)
- [ ] Quantity is valid (number, >= 1)
- [ ] Product is in stock
- [ ] All required fields present

Before checkout:
- [ ] Cart is not empty
- [ ] All items have valid data
- [ ] All prices are valid
- [ ] All quantities are valid
- [ ] Totals calculated correctly

---

## Future API Integration

### Current State
- All operations are client-side only
- Data stored in localStorage
- No server synchronization

### Planned API Integration

#### Endpoints (Future)

```javascript
// Get cart from server
GET /api/cart
Response: { items: [...], subtotal: 0 }

// Add item to cart
POST /api/cart/items
Body: { productId, quantity }
Response: { success: true, cart: {...} }

// Update quantity
PUT /api/cart/items/:itemId
Body: { quantity }
Response: { success: true, cart: {...} }

// Remove item
DELETE /api/cart/items/:itemId
Response: { success: true, cart: {...} }

// Sync cart
POST /api/cart/sync
Body: { localCart: [...] }
Response: { serverCart: [...], conflicts: [...] }
```

#### Integration Strategy

**Hybrid Approach:**
1. Update local state immediately (optimistic UI)
2. Sync with server in background
3. Handle conflicts gracefully
4. Fallback to local-only if API fails

**Error Handling:**
```javascript
const addItem = async (product, qty) => {
  // 1. Update local state immediately
  setCart(prev => [...prev, { ...product, quantity: qty }]);
  
  try {
    // 2. Sync with server
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id, quantity: qty })
    });
    
    if (!response.ok) throw new Error('API error');
    
    // 3. Update with server response
    const { cart } = await response.json();
    setCart(cart);
  } catch (error) {
    // 4. Handle error (keep local state, show warning)
    console.error('Failed to sync with server:', error);
    // Optionally: Queue for retry
  }
};
```

**Offline Support:**
- Queue operations when offline
- Sync when connection restored
- Handle conflicts on sync

---

## Testing Considerations

### Unit Tests (Recommended)

```javascript
// Test addItem
test('adds new item to cart', () => {
  const { result } = renderHook(() => useCart());
  result.current.addItem(mockProduct, 2);
  expect(result.current.items).toHaveLength(1);
  expect(result.current.items[0].quantity).toBe(2);
});

// Test updateQuantity
test('updates existing item quantity', () => {
  // Add item first
  // Then update quantity
  // Verify quantity changed
});

// Test error handling
test('handles invalid product gracefully', () => {
  const { result } = renderHook(() => useCart());
  result.current.addItem(null, 1);
  expect(result.current.items).toHaveLength(0);
});
```

### Integration Tests

- Test full cart flow (add → update → remove → checkout)
- Test wishlist flow (add → remove → move to cart)
- Test localStorage persistence
- Test error scenarios

### Manual Testing Checklist

- [ ] Add item to cart
- [ ] Update quantity (increase, decrease, direct input)
- [ ] Remove item from cart
- [ ] Add to wishlist
- [ ] Remove from wishlist
- [ ] Move all to cart from wishlist
- [ ] Proceed to checkout
- [ ] Test with invalid data
- [ ] Test with localStorage disabled
- [ ] Test with corrupted localStorage data
- [ ] Test empty cart scenarios
- [ ] Test out-of-stock products

---

## Troubleshooting

### Common Issues

#### Cart/Wishlist Not Persisting
**Cause**: localStorage disabled or quota exceeded
**Solution**: Check browser settings, clear old data

#### Items Disappearing
**Cause**: Corrupted localStorage data
**Solution**: Clear localStorage, reset to empty array

#### Invalid Calculations
**Cause**: Invalid price/quantity data
**Solution**: Data validation should prevent this, check console for errors

#### Context Errors
**Cause**: Using hooks outside StoreProvider
**Solution**: Ensure component is wrapped in StoreProvider

---

## Code Maintenance

### Adding New Features

1. **New Cart Operation**
   - Add function to StoreProvider
   - Add validation
   - Add error handling
   - Update TypeScript types (if using TS)
   - Update documentation

2. **New Validation Rule**
   - Add to relevant function
   - Add error message
   - Test edge cases
   - Update documentation

### Refactoring Guidelines

- Always maintain backward compatibility
- Keep error handling comprehensive
- Test all edge cases
- Update documentation
- Consider migration for storage changes

---

## Conclusion

The Cart & Wishlist system is designed with production-ready error handling and validation. Every operation is protected against invalid data, storage failures, and edge cases. The system gracefully degrades when errors occur, ensuring users always have a functional experience.

### Key Takeaways

1. **Always validate input** before processing
2. **Provide safe defaults** for missing data
3. **Handle errors gracefully** without crashing
4. **Log errors** for debugging
5. **Test edge cases** thoroughly
6. **Document assumptions** and validations

---

## Version History

- **v1.0.0** (Current)
  - Initial implementation
  - Comprehensive error handling
  - localStorage persistence
  - Full validation coverage

---

*Last Updated: [Current Date]*
*Maintained by: Development Team*

