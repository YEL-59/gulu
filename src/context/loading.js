'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { setLoadingContext } from '@/lib/utils/fetchWithLoading'

const LoadingContext = createContext(null)

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState(null)

  const startLoading = useCallback((message = null) => {
    setLoadingCount(prev => prev + 1)
    if (message) {
      setLoadingMessage(message)
    }
  }, [])

  const stopLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1)
      if (newCount === 0) {
        setLoadingMessage(null)
      }
      return newCount
    })
  }, [])

  const setLoading = useCallback((isLoading, message = null) => {
    if (isLoading) {
      startLoading(message)
    } else {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const isLoading = loadingCount > 0

  const value = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setLoading,
    loadingCount,
  }

  // Register context for fetch wrapper
  useEffect(() => {
    setLoadingContext(value)
    if (typeof window !== 'undefined') {
      window.__loadingContext = value
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__loadingContext
      }
    }
  }, [value])

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    // Return safe defaults if used outside provider
    return {
      isLoading: false,
      loadingMessage: null,
      startLoading: () => {},
      stopLoading: () => {},
      setLoading: () => {},
      loadingCount: 0,
    }
  }
  return context
}

/**
 * Hook to wrap async operations with loading state
 * Usage: const { execute, isLoading } = useAsyncOperation(asyncFn)
 */
export function useAsyncOperation(asyncFn) {
  const { startLoading, stopLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setIsLoading(true)
    setError(null)
    startLoading()
    
    try {
      const result = await asyncFn(...args)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
      stopLoading()
    }
  }, [asyncFn, startLoading, stopLoading])

  return { execute, isLoading, error }
}

