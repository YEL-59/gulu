'use client'

import { SessionProvider } from 'next-auth/react'
import { StoreProvider } from '@/context/store'

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  )
}
