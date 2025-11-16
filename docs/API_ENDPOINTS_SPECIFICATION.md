# Cart & Wishlist API Endpoints Specification

## Overview

This document specifies all API endpoints required for the Cart & Wishlist system. These endpoints must be implemented by the backend team.

**Total Endpoints**: 8 endpoints (5 for Cart, 3 for Wishlist)

---

## Authentication

**All endpoints require authentication.**

- Use NextAuth session (JWT token in cookies)
- User ID should be available from session: `session.user.id`
- If not authenticated, return `401 Unauthorized`

---

## Cart Endpoints (5 endpoints)

### 1. Get User's Cart
**GET** `/api/cart`

**Description**: Retrieve all items in the user's cart

**Authentication**: Required

**Request**:
```
GET /api/cart
Headers:
  Cookie: next-auth.session-token=<token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "cart-item-123",
      "productId": "product-456",
      "quantity": 2,
      "product": {
        "id": "product-456",
        "name": "Product Name",
        "price": 29.99,
        "originalPrice": 39.99,
        "image": "/path/to/image.jpg",
        "brand": "Brand Name",
        "sellerId": "seller-789",
        "category": "Electronics",
        "inStock": true,
        "size": "Large",
        "color": "Blue"
      },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized. Please sign in."
}
```

---

### 2. Add Item to Cart
**POST** `/api/cart`

**Description**: Add a product to the user's cart or update quantity if already exists

**Authentication**: Required

**Request**:
```
POST /api/cart
Headers:
  Content-Type: application/json
  Cookie: next-auth.session-token=<token>

Body:
{
  "productId": "product-456",
  "quantity": 2,
  "product": {
    "id": "product-456",
    "name": "Product Name",
    "price": 29.99,
    "originalPrice": 39.99,
    "image": "/path/to/image.jpg",
    "brand": "Brand Name",
    "sellerId": "seller-789",
    "category": "Electronics",
    "inStock": true,
    "size": "Large",
    "color": "Blue"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "cart": [
    {
      "id": "cart-item-123",
      "productId": "product-456",
      "quantity": 2,
      "product": { ... },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Item added to cart successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Missing required fields or invalid data
```json
{
  "error": "Missing required fields: productId and product"
}
```

- **401 Unauthorized**: User not authenticated
```json
{
  "error": "Unauthorized. Please sign in."
}
```

**Business Logic**:
- If product already exists in cart, **add** the quantity (don't replace)
- If product doesn't exist, create new cart item
- Validate quantity >= 1
- Validate product data exists

---

### 3. Update Cart Item Quantity
**PUT** `/api/cart/[itemId]`

**Description**: Update the quantity of a specific cart item

**Authentication**: Required

**URL Parameters**:
- `itemId` - The cart item ID (not product ID)

**Request**:
```
PUT /api/cart/cart-item-123
Headers:
  Content-Type: application/json
  Cookie: next-auth.session-token=<token>

Body:
{
  "quantity": 5,
  "mode": "set"  // or "delta"
}
```

**Mode Options**:
- `"set"`: Set quantity to exact value (default)
- `"delta"`: Add/subtract from current quantity (e.g., quantity: -1 to decrease)

**Response** (200 OK):
```json
{
  "success": true,
  "cart": [
    {
      "id": "cart-item-123",
      "productId": "product-456",
      "quantity": 5,
      "product": { ... },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Cart item updated successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Invalid quantity
```json
{
  "error": "Invalid quantity"
}
```

- **401 Unauthorized**: User not authenticated
```json
{
  "error": "Unauthorized. Please sign in."
}
```

- **404 Not Found**: Cart item not found
```json
{
  "error": "Item not found in cart"
}
```

**Business Logic**:
- Quantity must be >= 1
- If mode is "delta", add/subtract from current quantity
- If mode is "set", replace quantity with new value
- Ensure quantity never goes below 1

---

### 4. Remove Item from Cart
**DELETE** `/api/cart/[itemId]`

**Description**: Remove a specific item from the user's cart

**Authentication**: Required

**URL Parameters**:
- `itemId` - The cart item ID (not product ID)

**Request**:
```
DELETE /api/cart/cart-item-123
Headers:
  Cookie: next-auth.session-token=<token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "cart": [
    // Remaining cart items
  ],
  "message": "Item removed from cart successfully"
}
```

**Error Responses**:
- **401 Unauthorized**: User not authenticated
```json
{
  "error": "Unauthorized. Please sign in."
}
```

- **404 Not Found**: Cart item not found
```json
{
  "error": "Item not found in cart"
}
```

---

### 5. Clear Entire Cart
**DELETE** `/api/cart`

**Description**: Remove all items from the user's cart

**Authentication**: Required

**Request**:
```
DELETE /api/cart
Headers:
  Cookie: next-auth.session-token=<token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "cart": [],
  "message": "Cart cleared successfully"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized. Please sign in."
}
```

---

## Wishlist Endpoints (3 endpoints)

### 6. Get User's Wishlist
**GET** `/api/wishlist`

**Description**: Retrieve all items in the user's wishlist

**Authentication**: Required

**Request**:
```
GET /api/wishlist
Headers:
  Cookie: next-auth.session-token=<token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "wishlist-item-123",
      "productId": "product-456",
      "product": {
        "id": "product-456",
        "name": "Product Name",
        "price": 29.99,
        "originalPrice": 39.99,
        "image": "/path/to/image.jpg",
        "brand": "Brand Name",
        "sellerId": "seller-789",
        "category": "Electronics",
        "inStock": true
      },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized. Please sign in."
}
```

---

### 7. Add Item to Wishlist
**POST** `/api/wishlist`

**Description**: Add a product to the user's wishlist

**Authentication**: Required

**Request**:
```
POST /api/wishlist
Headers:
  Content-Type: application/json
  Cookie: next-auth.session-token=<token>

Body:
{
  "productId": "product-456",
  "product": {
    "id": "product-456",
    "name": "Product Name",
    "price": 29.99,
    "originalPrice": 39.99,
    "image": "/path/to/image.jpg",
    "brand": "Brand Name",
    "sellerId": "seller-789",
    "category": "Electronics",
    "inStock": true
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "wishlist": [
    {
      "id": "wishlist-item-123",
      "productId": "product-456",
      "product": { ... },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Item added to wishlist successfully"
}
```

**Error Responses**:
- **400 Bad Request**: Missing required fields
```json
{
  "error": "Missing required fields: productId and product"
}
```

- **401 Unauthorized**: User not authenticated
```json
{
  "error": "Unauthorized. Please sign in."
}
```

- **409 Conflict**: Item already in wishlist
```json
{
  "error": "Item already in wishlist"
}
```

**Business Logic**:
- Check if product already exists in wishlist
- If exists, return 409 Conflict
- If not, add to wishlist

---

### 8. Remove Item from Wishlist
**DELETE** `/api/wishlist/[productId]`

**Description**: Remove a product from the user's wishlist

**Authentication**: Required

**URL Parameters**:
- `productId` - The product ID (not wishlist item ID)

**Request**:
```
DELETE /api/wishlist/product-456
Headers:
  Cookie: next-auth.session-token=<token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "wishlist": [
    // Remaining wishlist items
  ],
  "message": "Item removed from wishlist successfully"
}
```

**Error Responses**:
- **401 Unauthorized**: User not authenticated
```json
{
  "error": "Unauthorized. Please sign in."
}
```

- **404 Not Found**: Product not found in wishlist
```json
{
  "error": "Item not found in wishlist"
}
```

---

### 9. Check if Product is in Wishlist (Optional)
**GET** `/api/wishlist/check/[productId]`

**Description**: Check if a specific product is in the user's wishlist

**Authentication**: Optional (returns false if not authenticated)

**URL Parameters**:
- `productId` - The product ID to check

**Request**:
```
GET /api/wishlist/check/product-456
Headers:
  Cookie: next-auth.session-token=<token>
```

**Response** (200 OK):
```json
{
  "isWishlisted": true
}
```

**Note**: If user is not authenticated, return `{"isWishlisted": false}` (don't return 401)

---

## Summary Table

| # | Method | Endpoint | Purpose | Auth Required |
|---|--------|----------|---------|---------------|
| 1 | GET | `/api/cart` | Get user's cart | ✅ Yes |
| 2 | POST | `/api/cart` | Add item to cart | ✅ Yes |
| 3 | PUT | `/api/cart/[itemId]` | Update item quantity | ✅ Yes |
| 4 | DELETE | `/api/cart/[itemId]` | Remove item from cart | ✅ Yes |
| 5 | DELETE | `/api/cart` | Clear entire cart | ✅ Yes |
| 6 | GET | `/api/wishlist` | Get user's wishlist | ✅ Yes |
| 7 | POST | `/api/wishlist` | Add item to wishlist | ✅ Yes |
| 8 | DELETE | `/api/wishlist/[productId]` | Remove item from wishlist | ✅ Yes |
| 9 | GET | `/api/wishlist/check/[productId]` | Check wishlist status | ⚠️ Optional |

**Total: 9 endpoints** (8 required, 1 optional)

---

## Important Notes for Backend Developer

### 1. Authentication
- All endpoints (except check) require authentication
- Get user ID from NextAuth session: `session.user.id`
- Return 401 if not authenticated

### 2. Data Structure
- Store product snapshot in cart/wishlist (product data may change)
- Cart items have `quantity` field
- Wishlist items don't have quantity

### 3. Cart Item ID vs Product ID
- **Cart Item ID**: Unique ID for each cart entry (e.g., "cart-item-123")
- **Product ID**: The actual product identifier (e.g., "product-456")
- Use Cart Item ID for cart operations (update, delete)
- Use Product ID for wishlist operations

### 4. Quantity Updates
- Support two modes: `"set"` (absolute) and `"delta"` (relative)
- Always ensure quantity >= 1
- When adding same product to cart, **add** quantities (don't replace)

### 5. Error Handling
- Always return JSON with `error` field
- Use appropriate HTTP status codes:
  - 200: Success
  - 400: Bad Request (invalid data)
  - 401: Unauthorized (not authenticated)
  - 404: Not Found (item doesn't exist)
  - 409: Conflict (already exists)
  - 500: Server Error

### 6. Response Format
- Always return consistent JSON structure
- Include success/error messages
- Return full cart/wishlist array after operations

### 7. Database Considerations
- Store product snapshot (JSON) - product data may change
- Index on `userId` for fast queries
- Index on `productId` for wishlist checks
- Consider soft deletes vs hard deletes

---

## Testing Checklist

Before connecting to frontend, backend should test:

- [ ] All endpoints return correct status codes
- [ ] Authentication works correctly
- [ ] Cart operations work (add, update, remove, clear)
- [ ] Wishlist operations work (add, remove)
- [ ] Duplicate products handled correctly
- [ ] Quantity validation works
- [ ] Error messages are clear
- [ ] Response format matches specification
- [ ] Data persists correctly
- [ ] Multi-user isolation works (users can't see each other's carts)

---

## Frontend Integration

The frontend is **already implemented** and ready to connect. Once backend endpoints are ready:

1. Backend implements endpoints matching this specification
2. Frontend automatically connects (no code changes needed)
3. Test with real API
4. Done! ✅

**Frontend files using these endpoints**:
- `src/lib/api/cart.js` - Cart API calls
- `src/lib/api/wishlist.js` - Wishlist API calls
- `src/context/store.js` - React context using APIs

---

## Questions?

If backend developer has questions:
1. Check `docs/API_MIGRATION_GUIDE.md` for database schema
2. Check `docs/CART_WISHLIST_API_IMPLEMENTATION.md` for implementation details
3. All endpoints are already implemented in frontend - use as reference

---

*Last Updated: [Current Date]*
*Version: 1.0*

