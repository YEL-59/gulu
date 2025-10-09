'use client'

import { Providers } from '@/app/providers'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'

export default function StoreLayout({ children }) {
    return (
        <Providers>
            <div className="min-h-screen flex flex-col">
                <StoreHeader />
                <main className="flex-1">
                    {children}
                </main>
                <StoreFooter />
            </div>
        </Providers>
    )
}
