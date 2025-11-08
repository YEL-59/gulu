# Testing Guide - Registration & Signup Updates

This guide will help you test all the changes made to the registration and signup flow.

## Prerequisites

1. Make sure your development server is running:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Navigate to your application (usually `http://localhost:3000`)

---

## Test 1: Country Selection in Registration

### Test for Reseller Registration

1. **Navigate to Reseller Registration:**
   - Go to `/reseller` or click "BECOME A RESELLER" button
   - Click on "BECOME A RESELLER" button
   - You should see the Reseller Terms page
   - Accept terms and click "Accept & Continue"

2. **Test Country Selection:**
   - Fill in Step 1 (Basic Info) and click "NEXT"
   - In Step 2 (Business Info), scroll to the "Business Address" section
   - Click on the "Country" dropdown
   - **Expected:** You should see a list of 70+ countries (not just USA, Canada, Bangladesh)
   - Try selecting different countries like:
     - United Kingdom
     - Australia
     - Germany
     - India
     - Japan
     - etc.
   - **Expected:** All countries should be selectable

### Test for Wholesaler Registration

1. **Navigate to Wholesaler Registration:**
   - Go to `/wholesaler` or click "BECOME A WHOLESALER" button
   - You should see the Wholesaler Terms page (NEW!)
   - Read the eligibility requirements
   - Accept terms and click "Accept & Continue to Registration"

2. **Test Country Selection:**
   - Follow the same steps as reseller registration
   - In Step 2, check the Country dropdown
   - **Expected:** Full list of countries should be available

---

## Test 2: Industry Selection in Registration

### Test for Both Reseller and Wholesaler

1. **Navigate to Registration** (either reseller or wholesaler)

2. **Test Industry Selection:**
   - In Step 2 (Business Info), find the "Industry/Category" dropdown
   - Click on it
   - **Expected:** You should see 30+ industries, including:
     - Electronics
     - Fashion & Apparel
     - Home & Living
     - Beauty & Personal Care
     - Health & Wellness
     - Sports & Outdoors
     - Toys & Games
     - Books & Media
     - Automotive
     - Food & Beverage
     - Pet Supplies
     - Office Supplies
     - Jewelry & Accessories
     - Furniture
     - Kitchen & Dining
     - Garden & Tools
     - Baby Products
     - Computers & Accessories
     - Mobile Phones & Accessories
     - Audio & Video
     - Gaming
     - Cameras & Photography
     - Watches
     - Luggage & Travel
     - Musical Instruments
     - Industrial & Scientific
     - Software
     - Arts & Crafts
     - Collectibles
     - Antiques
   - Select any industry
   - **Expected:** Selection should work correctly

---

## Test 3: Login After Registration

### Test for Reseller Registration

1. **Complete Reseller Registration:**
   - Go through all registration steps
   - Fill in all required fields
   - Submit the form

2. **Check Success Panel:**
   - After submission, you should see a success message
   - **Expected:** You should see:
     - "Registration Successful!" heading
     - A message about receiving confirmation email
     - Two buttons:
       - "LOGIN TO YOUR ACCOUNT" (NEW!)
       - "CONTINUE SELLING"

3. **Test Login Button:**
   - Click on "LOGIN TO YOUR ACCOUNT" button
   - **Expected:** Should navigate to `/auth/signin` page
   - You should see the login form

### Test for Wholesaler Registration

1. **Complete Wholesaler Registration:**
   - Go through all registration steps
   - Fill in all required fields
   - Submit the form

2. **Check Success Panel:**
   - After submission, you should see a success message
   - **Expected:** You should see:
     - "Application Submitted!" heading
     - A message about Super Admin review
     - Two buttons:
       - "LOGIN TO YOUR ACCOUNT" (NEW!)
       - "CONTINUE"

3. **Test Login Button:**
   - Click on "LOGIN TO YOUR ACCOUNT" button
   - **Expected:** Should navigate to `/auth/signin` page

---

## Test 4: Wholesaler Terms Page

1. **Navigate to Wholesaler Page:**
   - Go to `/wholesaler`
   - Click "BECOME A WHOLESALER" button

2. **Check Terms Page:**
   - **Expected:** You should see a new page at `/wholesaler/terms` with:
     - Title: "Become a Wholesaler / Full-Seller"
     - Blue section with "Eligibility Requirements":
       - Manufacturers
       - Verified Suppliers
       - Registered Companies (5+ years)
     - Amber section with "Important Information":
       - Limited Approval notice
       - Exclusive Approval Process notice
       - Recommendation to become reseller if not eligible
     - Gray section with link to reseller terms
     - Checkbox to accept terms
     - "Accept & Continue to Registration" button (disabled until checkbox is checked)

3. **Test Terms Acceptance:**
   - Try clicking "Accept & Continue" without checking the box
   - **Expected:** Button should be disabled
   - Check the acceptance checkbox
   - **Expected:** Button should become enabled
   - Click "Accept & Continue to Registration"
   - **Expected:** Should navigate to `/wholesaler/onboarding`

4. **Test Cancel Button:**
   - Click "Cancel" button
   - **Expected:** Should navigate back to `/wholesaler`

5. **Test Reseller Recommendation Link:**
   - Click "Learn More About Becoming a Reseller" link
   - **Expected:** Should navigate to `/reseller/terms`

---

## Test 5: Reseller Terms Page Updates

1. **Navigate to Reseller Terms:**
   - Go to `/reseller`
   - Click "BECOME A RESELLER" button
   - Or go directly to `/reseller/terms`

2. **Check Updated Terms:**
   - **Expected:** You should see updated policies:
     - **Policy 1:** "Resellers can sell only products available on our platform (from approved wholesalers)."
     - **Policy 2:** "After receiving an order, the reseller must first purchase the product from the wholesaler through the platform. Only after purchasing the product will the reseller be able to withdraw earnings from our platform."
     - **Policy 3:** "If the reseller already has the product in stock, they may proceed to ship it and withdraw earnings after verification."
     - **Policy 4:** "These policies are designed for the benefit and protection of all users..."

3. **Test Terms Acceptance:**
   - Check the acceptance checkbox
   - Click "Accept & Continue"
   - **Expected:** Should navigate to `/reseller/onboarding`

---

## Test 6: Reseller Browse Wholesaler Products Feature

### Prerequisites
- You need to be logged in as a reseller (or simulate being on the reseller dashboard)
- Navigate to `/reseller/dashboard/store`

### Test Browse Feature

1. **Access Browse Page:**
   - On the Store page, you should see a "Browse Wholesaler Products" button in the top right
   - Click the button
   - **Expected:** Should navigate to `/reseller/dashboard/store/browse`

2. **Check Browse Page Layout:**
   - **Expected:** You should see:
     - Title: "Browse Wholesaler Products"
     - Subtitle: "Browse and add products from approved wholesalers to your store"
     - Search bar with search icon
     - Category filter dropdown
     - Grid of product cards

3. **Test Search Functionality:**
   - Type a product name in the search bar
   - **Expected:** Products should filter in real-time
   - Try searching by:
     - Product name
     - Category
     - Brand

4. **Test Category Filter:**
   - Click on the category dropdown
   - Select a category
   - **Expected:** Products should filter to show only that category
   - Select "All Categories"
   - **Expected:** All products should show again

5. **Test Product Cards:**
   - **Expected:** Each product card should show:
     - Product image (or placeholder)
     - Product name
     - Brand
     - Category badge
     - Stock status badge
     - Price
     - Rating (if available)
     - "Add to Store" button

6. **Test Add to Store:**
   - Click "Add to Store" on any product
   - **Expected:** 
     - Button should change to "Added to Store" with green background
     - An alert/notification should appear (currently using `alert()`)
     - Product should be marked as added
   - Try adding multiple products
   - **Expected:** Each should be marked as added independently

7. **Test Out of Stock Products:**
   - Find a product marked as "Out of Stock"
   - **Expected:** "Add to Store" button should be disabled

8. **Test Empty State:**
   - Search for a product that doesn't exist (e.g., "xyzabc123")
   - **Expected:** Should show "No products found" message with helpful text

9. **Test Info Card:**
   - Scroll to the bottom of the page
   - **Expected:** Should see a blue info card explaining how the feature works

---

## Test 7: Navigation Flow

### Test Complete Reseller Flow

1. Go to `/reseller`
2. Click "BECOME A RESELLER"
3. Read and accept terms at `/reseller/terms`
4. Complete registration at `/reseller/onboarding`
5. After success, click "LOGIN TO YOUR ACCOUNT"
6. Should land on `/auth/signin`
7. (After login) Go to `/reseller/dashboard/store`
8. Click "Browse Wholesaler Products"
9. Add products to store

### Test Complete Wholesaler Flow

1. Go to `/wholesaler`
2. Click "BECOME A WHOLESALER"
3. Read eligibility requirements at `/wholesaler/terms`
4. Accept terms and continue
5. Complete registration at `/wholesaler/onboarding`
6. After success, click "LOGIN TO YOUR ACCOUNT"
7. Should land on `/auth/signin`

---

## Common Issues & Troubleshooting

### Issue: Countries/Industries not showing
- **Check:** Make sure `src/constants/countries.js` and `src/constants/industries.js` files exist
- **Check:** Verify imports in StepBusiness components are correct

### Issue: Terms page not found
- **Check:** Verify `src/app/wholesaler/terms/page.jsx` exists
- **Check:** Make sure the route is `/wholesaler/terms` (not `/wholesaler/term`)

### Issue: Browse page not loading
- **Check:** Verify `src/app/reseller/dashboard/store/browse/page.jsx` exists
- **Check:** Make sure you're logged in or on the dashboard route
- **Check:** Verify the products data file exists at `src/lib/data/products.json`

### Issue: Login button not working
- **Check:** Verify the link points to `/auth/signin`
- **Check:** Make sure the signin page exists

---

## Quick Test Checklist

- [ ] Reseller registration shows all countries
- [ ] Wholesaler registration shows all countries
- [ ] Reseller registration shows all industries
- [ ] Wholesaler registration shows all industries
- [ ] Reseller success page has login button
- [ ] Wholesaler success page has login button
- [ ] Login button navigates to signin page
- [ ] Wholesaler terms page displays correctly
- [ ] Wholesaler terms acceptance works
- [ ] Reseller terms page has updated policies
- [ ] Browse wholesaler products page loads
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Add to store button works
- [ ] Products show correct information

---

## Notes

- All features are frontend-only and use mock data
- API integration will be needed later
- The "Add to Store" feature currently uses `alert()` for notifications - you may want to replace this with a toast notification system
- Product data comes from `src/lib/data/products.json` and sellers from `src/lib/data/sellers.json`

---

## Next Steps After Testing

1. Report any bugs or issues found
2. Test on different screen sizes (mobile, tablet, desktop)
3. Test with different browsers
4. Verify all links and navigation work correctly
5. Check that all form validations work properly

