# Cart & Wishlist API Migration Guide

## Current Implementation

The cart and wishlist system is now using **backend API routes** instead of localStorage. Currently, it uses **in-memory storage** (Map) for development purposes.

## Architecture

```
Frontend (React Context)
    ↓
API Utility Functions (src/lib/api/cart.js, wishlist.js)
    ↓
Next.js API Routes (src/app/api/cart/, wishlist/)
    ↓
Storage Layer (src/lib/storage/cart-wishlist-storage.js)
    ↓
[Currently: In-Memory Map]
[Future: Prisma Database]
```

## Current Storage: In-Memory Map

**Location**: `src/lib/storage/cart-wishlist-storage.js`

**Limitations**:
- Data lost on server restart
- Not shared across server instances
- No persistence
- Development only

## Migration to Database (Prisma)

### Step 1: Create Prisma Schema

Create or update `prisma/schema.prisma`:

```prisma
model CartItem {
  id          String   @id @default(cuid())
  userId      String
  productId   String
  quantity    Int      @default(1)
  product     Json     // Store product snapshot
  size        String?
  color       String?
  addedAt     DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, productId, size, color])
  @@index([userId])
}

model WishlistItem {
  id          String   @id @default(cuid())
  userId      String
  productId   String
  product     Json     // Store product snapshot
  addedAt     DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId])
}

model User {
  id            String         @id @default(cuid())
  // ... other user fields
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
}
```

### Step 2: Run Migration

```bash
npx prisma migrate dev --name add_cart_wishlist
```

### Step 3: Update Storage Module

Replace `src/lib/storage/cart-wishlist-storage.js`:

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserCart(userId) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { addedAt: 'asc' }
  })
  
  return cartItems.map(item => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    size: item.size,
    color: item.color,
    addedAt: item.addedAt,
  }))
}

export async function saveUserCart(userId, cartItems) {
  // Delete all existing items
  await prisma.cartItem.deleteMany({
    where: { userId }
  })
  
  // Create new items
  if (cartItems.length > 0) {
    await prisma.cartItem.createMany({
      data: cartItems.map(item => ({
        userId,
        productId: item.productId,
        quantity: item.quantity,
        product: item.product,
        size: item.size,
        color: item.color,
      }))
    })
  }
}

export async function getUserWishlist(userId) {
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: 'desc' }
  })
  
  return wishlistItems.map(item => ({
    id: item.id,
    productId: item.productId,
    product: item.product,
    addedAt: item.addedAt,
  }))
}

export async function saveUserWishlist(userId, wishlistItems) {
  // Delete all existing items
  await prisma.wishlistItem.deleteMany({
    where: { userId }
  })
  
  // Create new items
  if (wishlistItems.length > 0) {
    await prisma.wishlistItem.createMany({
      data: wishlistItems.map(item => ({
        userId,
        productId: item.productId,
        product: item.product,
      }))
    })
  }
}
```

### Step 4: Update API Routes

Update all API routes to use `await` for async storage functions:

**Before:**
```javascript
const userCart = getUserCart(userId);
saveUserCart(userId, userCart);
```

**After:**
```javascript
const userCart = await getUserCart(userId);
await saveUserCart(userId, userCart);
```

### Step 5: Optimize Database Queries

Instead of deleting and recreating, use upsert operations:

```javascript
// Better approach for cart updates
export async function addCartItem(userId, productId, quantity, product) {
  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      }
    },
    update: {
      quantity: { increment: quantity },
      product, // Update product snapshot
      updatedAt: new Date(),
    },
    create: {
      userId,
      productId,
      quantity,
      product,
    }
  })
}
```

## API Endpoints

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[itemId]` - Update item quantity
- `DELETE /api/cart/[itemId]` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Wishlist Endpoints

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/[productId]` - Remove item from wishlist
- `GET /api/wishlist/check/[productId]` - Check if product is wishlisted

## Authentication

All endpoints require authentication via NextAuth session. If user is not authenticated:
- Returns `401 Unauthorized`
- Frontend shows appropriate error message

## Error Handling

All API functions return:
```javascript
{
  success: boolean,
  items/cart/wishlist: array,
  error: string | null
}
```

## Testing

### Test API Routes

```bash
# Start dev server
npm run dev

# Test with curl (requires auth cookie)
curl -X GET http://localhost:3000/api/cart \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### Test Frontend Integration

1. Sign in to your app
2. Add items to cart
3. Check cart persists across page refreshes
4. Sign in on different device - cart should sync

## Performance Considerations

### Current (In-Memory)
- ✅ Instant reads/writes
- ❌ No persistence
- ❌ Not scalable

### Database (Prisma)
- ✅ Persistent storage
- ✅ Scalable
- ✅ Can add indexes
- ⚠️ Slightly slower (but acceptable)

### Optimization Tips

1. **Add Database Indexes**:
   ```prisma
   @@index([userId, productId])
   ```

2. **Use Connection Pooling**:
   ```javascript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + "?connection_limit=10"
       }
    }
   })
   ```

3. **Cache Frequently Accessed Data**:
   - Consider Redis for cart/wishlist caching
   - Cache for 5-10 minutes

4. **Batch Operations**:
   - When moving all wishlist to cart, batch the inserts

## Migration Checklist

- [ ] Create Prisma schema
- [ ] Run database migration
- [ ] Update storage module to use Prisma
- [ ] Update API routes to use async/await
- [ ] Test all cart operations
- [ ] Test all wishlist operations
- [ ] Test authentication requirements
- [ ] Test error handling
- [ ] Test with multiple users
- [ ] Test data persistence
- [ ] Add database indexes
- [ ] Set up connection pooling
- [ ] Monitor performance

## Rollback Plan

If issues occur:
1. Revert storage module to in-memory Map
2. Keep API routes unchanged
3. Frontend will continue working
4. Fix database issues
5. Re-deploy

## Next Steps

1. **Immediate**: System works with in-memory storage
2. **Short-term**: Migrate to database (1-2 days)
3. **Long-term**: Add caching, analytics, etc.

---

*Last Updated: [Current Date]*

