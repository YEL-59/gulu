/**
 * Example component demonstrating how to use the global loading indicator
 * This is just for reference - you can delete this file if not needed
 */

'use client'

import { useLoading, useAsyncOperation } from '@/context/loading'
import { fetchWithLoading } from '@/lib/utils/fetchWithLoading'
import { Button } from '@/components/ui/button'

export default function LoadingExample() {
  const { startLoading, stopLoading, setLoading, isLoading } = useLoading()

  // Example 1: Manual loading control
  const handleManualLoading = async () => {
    startLoading('Processing your request...')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Operation completed')
    } finally {
      stopLoading()
    }
  }

  // Example 2: Using setLoading
  const handleSetLoading = async () => {
    setLoading(true, 'Saving data...')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      setLoading(false)
    }
  }

  // Example 3: Using useAsyncOperation hook
  const asyncOperation = async (data) => {
    const response = await fetch('/api/example', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  const { execute: executeAsync, isLoading: isAsyncLoading } = useAsyncOperation(asyncOperation)

  const handleAsyncOperation = async () => {
    try {
      const result = await executeAsync({ test: 'data' })
      console.log('Result:', result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Example 4: Using fetchWithLoading
  const handleFetchWithLoading = async () => {
    try {
      const response = await fetchWithLoading(
        '/api/example',
        { method: 'GET' },
        'Fetching data...'
      )
      const data = await response.json()
      console.log('Data:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Loading Examples</h2>
      
      <div className="space-y-2">
        <Button onClick={handleManualLoading} disabled={isLoading}>
          Manual Loading (startLoading/stopLoading)
        </Button>
        
        <Button onClick={handleSetLoading} disabled={isLoading}>
          Set Loading (setLoading)
        </Button>
        
        <Button onClick={handleAsyncOperation} disabled={isAsyncLoading}>
          Async Operation Hook
        </Button>
        
        <Button onClick={handleFetchWithLoading} disabled={isLoading}>
          Fetch With Loading
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-600">
          Global loading indicator is showing...
        </p>
      )}
    </div>
  )
}

