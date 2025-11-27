'use client'

import { useLoading } from '@/context/loading'

export default function GlobalLoading() {
  const { isLoading, loadingMessage } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 min-w-[200px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-500"></div>
        </div>
        {loadingMessage && (
          <p className="text-sm font-medium text-gray-700 text-center max-w-xs">
            {loadingMessage}
          </p>
        )}
        {!loadingMessage && (
          <p className="text-sm font-medium text-gray-700">Loading...</p>
        )}
      </div>
    </div>
  )
}

