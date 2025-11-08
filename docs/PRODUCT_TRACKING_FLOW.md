# Product Tracking Flow - How Monitoring Works

This document explains how the system monitors when products are added to reseller stores.

## Overview

When a reseller adds a wholesaler's product to their store, the system automatically tracks:
- **When** the product was added (timestamp)
- **Who** added it (reseller information)
- **What** was added (product details)
- **How many** units (quantity)

## Step-by-Step Flow

### 1. Reseller Adds Product to Store

**Location:** `/reseller/dashboard/store/browse`

**Process:**
1. Reseller clicks "Add to Store" button on a product
2. A dialog opens asking for quantity (e.g., 30 headphones)
3. Reseller enters quantity and clicks "Add to Store"
4. System creates a product listing record with:

```javascript
{
  id: "rpl-1234567890",
  resellerId: "reseller-1",
  resellerName: "Tech Reseller Pro",
  productId: "p-001",
  productName: "Wireless Headphones",
  wholesalerId: "wholesaler-1",
  wholesalerProductId: "p-001",
  quantity: 30,
  addedAt: "2024-01-15T10:30:00.000Z",  // ← TIMESTAMP AUTOMATICALLY CAPTURED
  status: "active"
}
```

**Key Point:** The `addedAt` field is automatically set using `new Date().toISOString()` when the product is added. This captures the exact date and time.

**Code Location:** `src/app/reseller/dashboard/store/browse/page.jsx` (line 119)

```javascript
addedAt: new Date().toISOString(),  // Current timestamp in ISO format
```

### 2. Data Storage

**Current Implementation (Frontend):**
- Data is saved to `localStorage` with key `'resellerProductListings'`
- Format: JSON array of all product listings

**Future Implementation (Backend):**
- Will save to database via API call
- Timestamp will be set by server for accuracy

### 3. Wholesaler Views Product Tracking

**Location:** `/wholesaler/dashboard/product-tracking`

**Real-Time Monitoring:**

The wholesaler page automatically updates to show new product additions:

1. **Polling Mechanism:**
   - Checks `localStorage` every 1 second for changes
   - Updates the display when new listings are detected

2. **Data Loading:**
   ```javascript
   // Loads all product listings
   const listings = loadProductListings();
   
   // Filters for this wholesaler's products
   const productTracking = listings.filter(
     listing => listing.wholesalerId === currentWholesalerId
   );
   ```

3. **Date Display:**
   - The `addedAt` timestamp is converted to a readable date format
   - Displayed in the "Date Added" column of the table

**Code Location:** `src/app/wholesaler/dashboard/product-tracking/page.jsx` (line 255)

```javascript
<TableCell className="text-sm text-gray-600">
  {new Date(reseller.addedAt).toLocaleDateString()}
  // Converts: "2024-01-15T10:30:00.000Z" → "1/15/2024"
</TableCell>
```

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  RESELLER ADDS PRODUCT                                       │
│  /reseller/dashboard/store/browse                            │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Reseller clicks "Add to Store"                          │
│  2. Enters quantity (e.g., 30 headphones)                   │
│  3. Clicks "Add to Store"                                   │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  SYSTEM CAPTURES TIMESTAMP                                   │
│  addedAt: new Date().toISOString()                          │
│  → "2024-01-15T10:30:00.000Z"                               │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  DATA SAVED                                                  │
│  localStorage.setItem('resellerProductListings', ...)       │
│  OR                                                          │
│  API POST /api/reseller-product-listings                    │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  WHOLESALER PAGE MONITORS                                    │
│  /wholesaler/dashboard/product-tracking                      │
│                                                              │
│  • Polls every 1 second                                      │
│  • Loads all listings                                        │
│  • Filters by wholesaler ID                                  │
│  • Displays in table with date                               │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  WHOLESALER SEES:                                            │
│                                                              │
│  Product: Wireless Headphones                                │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Reseller Name │ Quantity │ Date Added │ Status    │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ Tech Reseller │   30     │ 1/15/2024  │ Active    │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Technical Details

### Timestamp Format

The system uses **ISO 8601 format** for timestamps:
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2024-01-15T10:30:00.000Z`
- Timezone: UTC (Z indicates UTC)

### Date Display

The timestamp is converted to a user-friendly format:
- **Input:** `"2024-01-15T10:30:00.000Z"`
- **Output:** `"1/15/2024"` (using `toLocaleDateString()`)

You can customize the date format:
```javascript
// Current: "1/15/2024"
new Date(reseller.addedAt).toLocaleDateString()

// Alternative formats:
new Date(reseller.addedAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})
// → "January 15, 2024"

new Date(reseller.addedAt).toLocaleString()
// → "1/15/2024, 10:30:00 AM"
```

### Real-Time Updates

**Current Implementation:**
- Polls `localStorage` every 1 second
- Updates display when changes detected

**Future Implementation (with API):**
- WebSocket connection for instant updates
- Server-sent events (SSE)
- Or polling API endpoint every few seconds

## Example Data Flow

### When Reseller Adds 30 Headphones:

**Step 1: Reseller Action**
```javascript
// User clicks "Add to Store" and enters quantity: 30
handleConfirmAdd() {
  const newListing = {
    id: "rpl-1705312200000",
    resellerId: "reseller-1",
    resellerName: "Tech Reseller Pro",
    productId: "p-001",
    productName: "Wireless Headphones",
    wholesalerId: "wholesaler-1",
    quantity: 30,
    addedAt: "2024-01-15T10:30:00.000Z",  // ← Captured automatically
    status: "active"
  };
  // Save to localStorage
}
```

**Step 2: Wholesaler Views (Within 1 second)**
```javascript
// Wholesaler page loads listings
const listings = loadProductListings();

// Filters for wholesaler-1's products
const productTracking = listings.filter(
  listing => listing.wholesalerId === "wholesaler-1"
);

// Displays in table:
// Product: Wireless Headphones
// Reseller: Tech Reseller Pro
// Quantity: 30
// Date Added: 1/15/2024  ← Converted from ISO timestamp
```

## Key Features

✅ **Automatic Timestamp Capture** - No manual date entry needed
✅ **Real-Time Monitoring** - Updates every second
✅ **Accurate Tracking** - ISO 8601 format ensures consistency
✅ **User-Friendly Display** - Dates shown in readable format
✅ **Historical Record** - All additions are permanently tracked

## Future Enhancements

1. **More Detailed Timestamps:**
   - Show time along with date
   - Display relative time ("2 hours ago", "3 days ago")

2. **Filtering by Date:**
   - Filter products added in last 7 days
   - Filter by specific date range

3. **Analytics:**
   - Chart showing product additions over time
   - Most popular products by reseller additions

4. **Notifications:**
   - Email/notification when reseller adds product
   - Daily/weekly summary of new additions

