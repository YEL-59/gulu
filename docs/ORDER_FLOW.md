# Order Flow: Customer → Reseller → Wholesaler

## Overview
This document describes the complete order flow in the B2B dropshipping marketplace, from when a customer adds a product to cart through the reseller purchasing from the wholesaler.

---

## 📊 Flow Diagram

```
┌─────────────┐
│  CUSTOMER   │
└──────┬──────┘
       │
       │ 1. Browse Products
       │ 2. Add to Cart
       │ 3. Checkout
       │
       ▼
┌─────────────────────┐
│  ORDER PROCESSING   │
│  (orderProcessor.js)│
└──────┬──────────────┘
       │
       │ Creates:
       │ - Order Object
       │ - Purchase Records (if reseller product)
       │
       ▼
┌─────────────────────┐
│   ORDER SAVED       │
│  - userOrders[]     │
│  - resellerPurchases│
└──────┬──────────────┘
       │
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌──────────────────┐          ┌─────────────────────┐
│   RESELLER       │          │   WHOLESALER        │
│   DASHBOARD      │          │   DASHBOARD         │
└──────┬───────────┘          └──────┬──────────────┘
       │                              │
       │ 4. Sees Order                │ 5. Sees Purchase Request
       │    in Orders Table           │    in Orders Page
       │                              │
       │    ⚠️ Pending Purchase       │    Status: Pending
       │    Warning Shown             │
       │                              │
       ▼                              │
┌──────────────────┐                 │
│  PURCHASES PAGE  │                 │
│  /purchases      │                 │
└──────┬───────────┘                 │
       │                              │
       │ 6. Views Pending Purchases   │
       │ 7. Clicks "Purchase Now"     │
       │ 8. Confirms Purchase         │
       │                              │
       │    Updates:                  │
       │    status: "completed"       │
       │                              │
       ▼                              │
┌──────────────────┐                 │
│  PURCHASE        │                 │
│  COMPLETED       │                 │
└──────┬───────────┘                 │
       │                              │
       │                              │
       └──────────────┬───────────────┘
                      │
                      │ 9. Wholesaler sees
                      │    completed order
                      │
                      ▼
            ┌──────────────────┐
            │  ORDER FULFILLED │
            │  Ready to Ship   │
            └──────────────────┘
```

---

## 🔄 Detailed Step-by-Step Flow

### **Step 1: Customer Adds to Cart**
**Location:** `src/app/store/product/[slug]/page.jsx`

- Customer browses products on the store
- Clicks "Add to Cart" button
- Product is added to cart context/localStorage
- Cart includes: `productId`, `sellerId`, `price`, `quantity`, etc.

**Key Code:**
```javascript
addCartItem({
  id: product.id,
  name: product.name,
  price: product.price,
  sellerId: product.sellerId,
  // ... other fields
}, quantity)
```

---

### **Step 2: Customer Checks Out**
**Location:** `src/app/store/billingAddress/page.jsx`

- Customer fills billing/shipping information
- Clicks "Place Order"
- Calls `processOrder()` function

**Key Code:**
```javascript
const { order, purchaseRecords } = processOrder(
  { billing, shipping, paymentMethod, note },
  cart.items
);
```

---

### **Step 3: Order Processing**
**Location:** `src/lib/utils/orderProcessor.js`

**What Happens:**
1. **Order Creation:**
   - Generates unique order ID
   - Creates order object with customer info, items, shipping, etc.
   - Status: `"pending"`

2. **Purchase Record Creation:**
   - For each cart item, checks if product is from a reseller
   - Uses `getProductWithSellerInfo()` to identify seller type
   - If product is from reseller:
     - Creates purchase record with:
       - `orderId` - Links to customer order
       - `resellerId` - Who sold the product
       - `wholesalerId` - Who supplies the product
       - `resellerPrice` - Price customer paid
       - `wholesalerPrice` - Price reseller pays (usually 70% of reseller price)
       - `status: "pending"`

**Key Code:**
```javascript
if (productInfo && productInfo.isReseller && productInfo.wholesaler) {
  const purchaseRecord = createPurchaseRecord({
    orderId: orderId,
    productId: cartItem.id,
    resellerId: productInfo.seller.id,
    wholesalerId: productInfo.wholesaler.id,
    productName: cartItem.name,
    quantity: cartItem.quantity || 1,
    resellerPrice: cartItem.price,
    wholesalerPrice: productInfo.wholesalePrice || calculateWholesalePrice(cartItem.price),
  });
  purchaseRecords.push(purchaseRecord);
}
```

---

### **Step 4: Data Storage**
**Location:** `src/app/store/billingAddress/page.jsx`

**Storage:**
1. **Order Saved:**
   - Saved to `localStorage.getItem('userOrders')`
   - Customer can view their order history

2. **Purchase Records Saved:**
   - Saved to `localStorage.getItem('resellerPurchases')`
   - These records trigger actions for resellers

**Key Code:**
```javascript
// Save order
const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
existingOrders.push(order)
localStorage.setItem('userOrders', JSON.stringify(existingOrders))

// Save purchase records
const existingPurchases = JSON.parse(localStorage.getItem('resellerPurchases') || '[]')
const updatedPurchases = [...existingPurchases, ...purchaseRecords]
localStorage.setItem('resellerPurchases', JSON.stringify(updatedPurchases))
```

---

### **Step 5: Reseller Sees Order**
**Location:** `src/components/reseller/dashboard/OrdersTable.jsx`

**What Reseller Sees:**
- Order appears in "Orders" table
- Order has `hasPendingPurchase: true` flag
- Warning badge/button shown: "⚠️ Purchase from wholesaler required"
- "Purchase" button visible

**Key Indicators:**
- Order shows in reseller's dashboard
- Status: Order is "pending" (waiting for reseller to purchase from wholesaler)
- Cannot mark order as complete until purchase is made

---

### **Step 6: Reseller Views Purchases Page**
**Location:** `src/app/reseller/dashboard/purchases/page.jsx`

**What Reseller Sees:**
- List of all pending purchases from wholesalers
- Each purchase shows:
  - Product name
  - Original customer order ID
  - Quantity needed
  - Wholesale price (what reseller pays)
  - Reseller price (what customer paid)
  - Profit margin calculation

**Key Information:**
```javascript
{
  productName: "Product Name",
  orderId: "order-123",  // Links to customer order
  quantity: 2,
  wholesalerPrice: 70.00,  // What reseller pays
  resellerPrice: 100.00,   // What customer paid
  status: "pending"
}
```

---

### **Step 7: Reseller Confirms Purchase**
**Location:** `src/app/reseller/dashboard/purchases/page.jsx`

**Action Flow:**
1. Reseller clicks "Purchase Now" button
2. Confirmation dialog appears
3. Reseller confirms purchase
4. Purchase record status changes: `"pending"` → `"completed"`

**Key Code:**
```javascript
const updatedPurchases = purchases.map((p) =>
  p.id === selectedPurchase.id 
    ? { ...p, status: "completed", completedAt: new Date().toISOString() } 
    : p
);
localStorage.setItem('resellerPurchases', JSON.stringify(updatedPurchases));
```

**Result:**
- Purchase record status updated to "completed"
- Reseller has now "purchased" from wholesaler
- Order can now be fulfilled

---

### **Step 8: Wholesaler Sees Order**
**Location:** `src/app/wholesaler/dashboard/orders/page.jsx`

**What Wholesaler Sees:**
- List of all purchase requests from resellers
- Can see:
  - Reseller ID
  - Product name
  - Quantity
  - Price
  - Status (pending/completed)
  - Order date

**Key Features:**
- Wholesaler can view pending orders
- When reseller completes purchase, status updates to "completed"
- Wholesaler can track revenue from reseller orders

---

### **Step 9: Order Fulfillment**

**When Purchase is Completed:**
1. ✅ Reseller has paid wholesaler (in system)
2. ✅ Purchase record status: "completed"
3. ✅ Wholesaler can prepare shipment
4. ✅ Order can be marked as "fulfilled"

**Notifications (Future Enhancement):**
- Email/SMS to reseller when purchase completed
- Email/SMS to wholesaler when new order received
- Email/SMS to customer when order ships

---

## 📋 Data Structures

### **Order Object**
```javascript
{
  id: "order-1234567890-abc123",
  orderDate: "Jan 15, 2024",
  estimatedDelivery: "Jan 25, 2024",
  status: "pending",
  items: [
    {
      name: "Product Name",
      image: "/path/to/image.jpg",
      price: 100.00,
      quantity: 2
    }
  ],
  customer: "John Doe",
  billing: { /* billing address */ },
  shipping: { /* shipping address */ },
  paymentMethod: "credit_card",
  note: "Customer note",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### **Purchase Record**
```javascript
{
  id: "rp-1234567890",
  resellerId: "reseller-1",
  orderId: "order-1234567890-abc123",  // Links to customer order
  productId: "product-123",
  wholesalerId: "wholesaler-1",
  productName: "Product Name",
  quantity: 2,
  resellerPrice: 100.00,      // Price customer paid to reseller
  wholesalerPrice: 70.00,     // Price reseller pays to wholesaler
  status: "pending",           // "pending" | "completed"
  createdAt: "2024-01-15T10:30:00.000Z",
  orderDate: "2024-01-15T10:30:00.000Z",
  completedAt: null            // Set when reseller completes purchase
}
```

---

## 🔑 Key Files & Functions

### **Order Processing**
- `src/lib/utils/orderProcessor.js` - Main order processing logic
  - `processOrder()` - Creates order and purchase records

### **Purchase Management**
- `src/lib/utils/resellerPurchases.js` - Purchase record utilities
  - `createPurchaseRecord()` - Creates purchase record
  - `checkPendingPurchases()` - Checks for pending purchases
  - `canWithdraw()` - Checks if reseller can withdraw funds
  - `completePurchase()` - Marks purchase as completed

### **Customer Flow**
- `src/app/store/product/[slug]/page.jsx` - Product page (add to cart)
- `src/app/store/cart/page.jsx` - Cart page
- `src/app/store/billingAddress/page.jsx` - Checkout & order placement

### **Reseller Flow**
- `src/components/reseller/dashboard/OrdersTable.jsx` - Shows orders with pending purchase warnings
- `src/app/reseller/dashboard/purchases/page.jsx` - Purchase from wholesalers page

### **Wholesaler Flow**
- `src/app/wholesaler/dashboard/orders/page.jsx` - View reseller orders

### **API**
- `src/app/api/orders/route.js` - Order API endpoint (currently logs only)

---

## 💰 Financial Flow

```
Customer Order: $100.00
│
├─ Reseller Receives: $100.00 (from customer)
│
├─ Reseller Pays: $70.00 (to wholesaler)
│
└─ Reseller Profit: $30.00 (30% margin)

Wholesaler Receives: $70.00 (from reseller)
```

**Note:** Prices are calculated automatically:
- Wholesale price = 70% of reseller price (default)
- Can be customized per product via `productSellerMapping.js`

---

## 🚀 Future Enhancements

1. **Real-time Notifications**
   - WebSocket notifications when orders are placed
   - Email notifications for all parties

2. **Payment Integration**
   - Actual payment processing
   - Escrow system for reseller payments
   - Automatic payment to wholesaler when reseller confirms

3. **Inventory Management**
   - Real-time stock updates
   - Low stock alerts
   - Automatic reordering

4. **Shipping Integration**
   - Shipping label generation
   - Tracking number assignment
   - Delivery confirmation

5. **Analytics Dashboard**
   - Revenue tracking
   - Profit margins
   - Order trends
   - Best-selling products

---

## 📝 Notes

- Currently uses `localStorage` for demo purposes
- In production, all data should be stored in a database
- API endpoints should handle all data persistence
- Real authentication should be implemented
- Payment processing should be integrated
- Email notifications should be sent at each step

---

## 🔗 Related Documentation

- Product Seller Mapping: `src/lib/utils/productSellerMapping.js`
- Cart Context: `src/context/store.js`
- Order API: `src/app/api/orders/route.js`

