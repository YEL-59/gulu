/**
 * Enhanced fetch wrapper that automatically tracks loading state
 * Usage: import { fetchWithLoading } from '@/lib/utils/fetchWithLoading'
 * 
 * const response = await fetchWithLoading('/api/endpoint', { method: 'POST', ... })
 */

let loadingContext = null

/**
 * Initialize the fetch wrapper with loading context
 * This is called automatically by the LoadingProvider
 */
export function setLoadingContext(context) {
  loadingContext = context
}

/**
 * Fetch wrapper that automatically manages loading state
 * @param {string|Request} url - The URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {string|null} loadingMessage - Optional loading message to display
 * @returns {Promise<Response>}
 */
export async function fetchWithLoading(url, options = {}, loadingMessage = null) {
  // Get loading context if available
  const context = loadingContext || (typeof window !== 'undefined' && window.__loadingContext)
  
  if (context) {
    context.startLoading(loadingMessage)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    })
    return response
  } finally {
    if (context) {
      context.stopLoading()
    }
  }
}

/**
 * Hook to get fetchWithLoading with automatic context
 * Usage in components:
 * const { fetchWithLoading } = useFetchWithLoading()
 */
export function useFetchWithLoading() {
  if (typeof window !== 'undefined' && window.__loadingContext) {
    return {
      fetchWithLoading: (url, options, message) => 
        fetchWithLoading(url, options, message)
    }
  }
  
  // Fallback if context not available
  return {
    fetchWithLoading: async (url, options) => {
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        credentials: 'include',
      })
    }
  }
}


