# Global Loading Indicator - Usage Guide

## Overview

A global loading indicator has been implemented that automatically shows when loading operations are happening in your application. The loading indicator appears as a full-screen overlay with a spinner and optional message.

## Features

- ✅ Automatic loading state management
- ✅ Counter-based system (handles multiple concurrent loading operations)
- ✅ Optional loading messages
- ✅ Easy-to-use hooks and utilities
- ✅ Automatic fetch wrapper integration

## Basic Usage

### Method 1: Using the `useLoading` Hook

```jsx
'use client'

import { useLoading } from '@/context/loading'

export default function MyComponent() {
  const { startLoading, stopLoading, setLoading } = useLoading()

  const handleSubmit = async () => {
    // Start loading
    startLoading('Saving data...')
    
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ data: 'example' })
      })
      // ... handle response
    } finally {
      // Stop loading
      stopLoading()
    }
  }

  // Or use setLoading for simpler toggle
  const handleAction = async () => {
    setLoading(true, 'Processing...')
    try {
      await someAsyncOperation()
    } finally {
      setLoading(false)
    }
  }

  return <button onClick={handleSubmit}>Save</button>
}
```

### Method 2: Using `useAsyncOperation` Hook

```jsx
'use client'

import { useAsyncOperation } from '@/context/loading'

export default function MyComponent() {
  const saveData = async (data) => {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  const { execute, isLoading, error } = useAsyncOperation(saveData)

  const handleSubmit = async () => {
    try {
      const result = await execute({ name: 'John' })
      console.log('Saved:', result)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
```

### Method 3: Using `fetchWithLoading` Utility

```jsx
'use client'

import { fetchWithLoading } from '@/lib/utils/fetchWithLoading'

export default function MyComponent() {
  const handleSubmit = async () => {
    // Automatically shows loading indicator
    const response = await fetchWithLoading(
      '/api/save',
      {
        method: 'POST',
        body: JSON.stringify({ data: 'example' })
      },
      'Saving your data...' // Optional loading message
    )
    
    const result = await response.json()
    // Loading automatically stops when fetch completes
  }

  return <button onClick={handleSubmit}>Save</button>
}
```

## Updating Existing API Calls

You can easily update your existing API calls to use the global loading. Here's an example:

### Before:
```javascript
// src/lib/api/cart.js
export async function addToCart(product, quantity = 1) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId: product.id, quantity })
    })
    // ... rest of code
  } catch (error) {
    // ... error handling
  }
}
```

### After (with global loading):
```javascript
// src/lib/api/cart.js
import { fetchWithLoading } from '@/lib/utils/fetchWithLoading'

export async function addToCart(product, quantity = 1) {
  try {
    const response = await fetchWithLoading(
      API_BASE,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product.id, quantity })
      },
      'Adding to cart...' // Optional message
    )
    // ... rest of code
  } catch (error) {
    // ... error handling
  }
}
```

## Component-Level Usage

### Check Loading State

```jsx
'use client'

import { useLoading } from '@/context/loading'

export default function MyComponent() {
  const { isLoading, loadingMessage } = useLoading()

  return (
    <div>
      {isLoading && (
        <p>Currently loading: {loadingMessage || 'Please wait...'}</p>
      )}
      {/* Your component content */}
    </div>
  )
}
```

## Advanced Usage

### Multiple Concurrent Operations

The loading system uses a counter, so multiple operations can run simultaneously:

```jsx
const { startLoading, stopLoading } = useLoading()

// Operation 1 starts
startLoading('Loading products...')

// Operation 2 starts (loading still shows)
startLoading('Loading categories...')

// Operation 1 finishes
stopLoading() // Loading still shows (Operation 2 is still running)

// Operation 2 finishes
stopLoading() // Loading now hides
```

### Custom Loading Messages

```jsx
const { setLoading } = useLoading()

// Show with message
setLoading(true, 'Uploading file...')

// Change message
setLoading(true, 'Processing file...')

// Hide
setLoading(false)
```

## Integration with Existing Code

The global loading is already integrated into your app structure:

1. **LoadingProvider** - Wraps your app in `src/app/providers.jsx`
2. **GlobalLoading Component** - Rendered in `src/app/layout.jsx`
3. **Context Available** - Use `useLoading()` hook anywhere in your app

## Examples

### Form Submission
```jsx
const { setLoading } = useLoading()

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true, 'Submitting form...')
  
  try {
    await submitForm(formData)
    toast.success('Form submitted!')
  } catch (error) {
    toast.error('Submission failed')
  } finally {
    setLoading(false)
  }
}
```

### Data Fetching
```jsx
const { startLoading, stopLoading } = useLoading()

useEffect(() => {
  const fetchData = async () => {
    startLoading('Loading data...')
    try {
      const data = await fetch('/api/data').then(r => r.json())
      setData(data)
    } finally {
      stopLoading()
    }
  }
  fetchData()
}, [])
```

## Notes

- The loading indicator appears as a full-screen overlay with a backdrop
- It automatically handles multiple concurrent loading operations
- Loading messages are optional but recommended for better UX
- The loading state is global and accessible from any component
- The fetch wrapper automatically includes credentials and JSON headers

## Troubleshooting

If the loading indicator doesn't appear:

1. Make sure you're using the hook inside a component that's wrapped by `LoadingProvider`
2. Check that `GlobalLoading` is rendered in your layout
3. Verify that `startLoading()` is called before the async operation
4. Ensure `stopLoading()` is called in a `finally` block


