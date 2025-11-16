# Cart & Wishlist Backend API Implementation

## ✅ Conversion Complete!

Your cart and wishlist system has been successfully converted from **localStorage** to **backend API** system. Now your cart and wishlist will sync across all devices! 🎉

## What Changed

### Before (localStorage)
- ❌ Cart stored only in browser
- ❌ Lost when clearing browser data
- ❌ Not synced across devices
- ❌ No server-side validation

### After (Backend API)
- ✅ Cart stored on server
- ✅ Persists across sessions
- ✅ Syncs across all devices
- ✅ Server-side validation
- ✅ Requires authentication

## New Files Created

### API Utilities
- `src/lib/api/cart.js` - Cart API functions
- `src/lib/api/wishlist.js` - Wishlist API functions

### API Routes
- `src/app/api/cart/route.js` - Cart CRUD operations
- `src/app/api/cart/[itemId]/route.js` - Individual cart item operations
- `src/app/api/wishlist/route.js` - Wishlist CRUD operations
- `src/app/api/wishlist/[productId]/route.js` - Individual wishlist item operations
- `src/app/api/wishlist/check/[productId]/route.js` - Check wishlist status

### Storage Layer
- `src/lib/storage/cart-wishlist-storage.js` - Shared storage module (currently in-memory)

### Updated Files
- `src/context/store.js` - Now uses API instead of localStorage

## How It Works

### Flow Diagram

```
User Action (Add to Cart)
    ↓
React Component
    ↓
Store Context (useCart hook)
    ↓
API Utility (cart.js)
    ↓
Next.js API Route (/api/cart)
    ↓
Storage Layer (in-memory Map)
    ↓
Response back to Context
    ↓
UI Updates
```

### Authentication

**All cart/wishlist operations now require user authentication.**

- If user is not signed in, they'll see: "Please sign in to add items to cart"
- Session is checked on every API call
- Uses NextAuth session management

## API Endpoints

### Cart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/[itemId]` | Update item quantity |
| DELETE | `/api/cart/[itemId]` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |

### Wishlist Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get user's wishlist |
| POST | `/api/wishlist` | Add item to wishlist |
| DELETE | `/api/wishlist/[productId]` | Remove item from wishlist |
| GET | `/api/wishlist/check/[productId]` | Check if product is wishlisted |

## Current Storage: In-Memory

**Important**: Currently using in-memory storage (Map) for development.

**Limitations**:
- Data lost on server restart
- Not shared across server instances
- Development/testing only

**Next Step**: Migrate to database (see `docs/API_MIGRATION_GUIDE.md`)

## Usage Examples

### Adding to Cart (No Code Changes Needed!)

The frontend code doesn't need to change - the context API remains the same:

```javascript
import { useCart } from '@/context/store';

function ProductCard({ product }) {
  const { addItem, loading, error } = useCart();
  
  const handleAdd = async () => {
    await addItem(product, 1);
    // Cart automatically syncs with server!
  };
}
```

### New Features Available

```javascript
const { 
  items,           // Cart items
  addItem,         // Add to cart
  updateQuantity,  // Update quantity
  removeItem,      // Remove item
  clearCart,       // Clear cart
  subtotal,        // Calculate subtotal
  loading,         // ⭐ NEW: Loading state
  error,           // ⭐ NEW: Error messages
} = useCart();
```

## Error Handling

All operations now return proper error messages:

```javascript
const { error } = useCart();

if (error) {
  // Show error to user
  alert(error); // e.g., "Please sign in to add items to cart"
}
```

## Loading States

Track when operations are in progress:

```javascript
const { loading } = useCart();

if (loading) {
  return <div>Loading cart...</div>;
}
```

## Testing

### 1. Sign In Required
- Try adding to cart without signing in
- Should see: "Please sign in to add items to cart"

### 2. Add Items
- Sign in
- Add items to cart
- Cart should persist across page refreshes

### 3. Multi-Device Sync
- Add items on one device
- Sign in on another device
- Cart should appear on second device

### 4. Error Handling
- Test with invalid data
- Should see appropriate error messages

## Migration to Database

**Current**: In-memory storage (development)
**Next**: Database storage (production)

See `docs/API_MIGRATION_GUIDE.md` for complete migration instructions.

Quick steps:
1. Create Prisma schema
2. Run migration
3. Update storage module
4. Done!

## Benefits

### ✅ Multi-Device Sync
Add items on your phone, see them on your laptop!

### ✅ Data Persistence
Cart survives browser clears, device changes, etc.

### ✅ Security
Server validates all operations

### ✅ Analytics Ready
Can track cart abandonment, popular products, etc.

### ✅ Scalable
Easy to add features like:
- Saved carts
- Cart sharing
- Abandoned cart recovery
- Analytics

## Troubleshooting

### "Please sign in" errors
- **Solution**: User must be authenticated
- All cart/wishlist operations require login

### Cart not syncing
- **Check**: Are you signed in on both devices?
- **Check**: Same user account?
- **Check**: API routes working? (check browser console)

### Data lost on server restart
- **Expected**: Currently using in-memory storage
- **Solution**: Migrate to database (see migration guide)

## Next Steps

1. ✅ **Done**: API implementation
2. ✅ **Done**: Frontend integration
3. ⏳ **Next**: Migrate to database
4. ⏳ **Future**: Add caching
5. ⏳ **Future**: Add analytics

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs
3. Verify authentication is working
4. See `docs/API_MIGRATION_GUIDE.md` for database migration

---

**Status**: ✅ Ready for Development
**Next**: Migrate to Database for Production

*Last Updated: [Current Date]*

