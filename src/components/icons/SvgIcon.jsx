import React from 'react'

// Reusable SVG Icon Component
export default function SvgIcon({
    name,
    className = "w-6 h-6",
    fill = "currentColor",
    stroke = "none",
    ...props
}) {
    // You can add your SVG icons here or import them from separate files
    const icons = {
        // Social Media Icons
        facebook: (

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                <path d="M5.03184 13.5024C11.0699 13.5024 14.3718 8.49713 14.3718 4.15673C14.3718 4.01458 14.3689 3.87308 14.3625 3.73217C15.005 3.26699 15.5595 2.69103 16 2.03128C15.4118 2.29294 14.7789 2.46904 14.1149 2.54844C14.7926 2.14181 15.3129 1.49851 15.5584 0.73169C14.914 1.11419 14.2091 1.38382 13.4739 1.52898C12.8749 0.890525 12.0221 0.491211 11.0778 0.491211C9.26494 0.491211 7.79489 1.96219 7.79489 3.7754C7.79489 4.03319 7.82374 4.28385 7.88006 4.52436C5.15177 4.38699 2.73252 3.07995 1.11343 1.09252C0.821818 1.59379 0.668434 2.16349 0.668943 2.74345C0.668943 3.88304 1.24846 4.88903 2.12976 5.47759C1.60846 5.46166 1.0986 5.32077 0.643057 5.06676C0.642569 5.08055 0.642569 5.09399 0.642569 5.10872C0.642569 6.69944 1.77408 8.02759 3.27613 8.32854C2.99402 8.40542 2.70292 8.44428 2.41054 8.44411C2.19938 8.44411 1.99359 8.42333 1.79359 8.38491C2.21151 9.69 3.42335 10.6397 4.86013 10.6663C3.73659 11.5474 2.32127 12.0723 0.783024 12.0723C0.521349 12.0725 0.259888 12.0573 0 12.0267C1.45281 12.9585 3.17789 13.5022 5.032 13.5022" fill="white" />
            </svg>
        ),
        twitter: (
            <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} className={className} {...props}>
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
        ),
        instagram: (
            <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} className={className} {...props}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        linkedin: (
            <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} className={className} {...props}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        youtube: (
            <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} className={className} {...props}>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        telegram: (
            <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} className={className} {...props}>
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),

        // Navigation Icons
        search: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
        user: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        heart: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        cart: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
        ),
        menu: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
        ),
        close: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
            </svg>
        ),

        // Arrow Icons
        chevronDown: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="m6 9 6 6 6-6" />
            </svg>
        ),
        chevronRight: (
            <svg viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="m9 18 6-6-6-6" />
            </svg>
        ),

        // Add more icons as needed...
    }

    const IconComponent = icons[name]

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`)
        return null
    }

    return IconComponent
}

// Export individual icon components for better tree-shaking
export const FacebookIcon = (props) => <SvgIcon name="facebook" {...props} />
export const TwitterIcon = (props) => <SvgIcon name="twitter" {...props} />
export const InstagramIcon = (props) => <SvgIcon name="instagram" {...props} />
export const LinkedinIcon = (props) => <SvgIcon name="linkedin" {...props} />
export const YoutubeIcon = (props) => <SvgIcon name="youtube" {...props} />
export const TelegramIcon = (props) => <SvgIcon name="telegram" {...props} />
export const SearchIcon = (props) => <SvgIcon name="search" {...props} />
export const UserIcon = (props) => <SvgIcon name="user" {...props} />
export const HeartIcon = (props) => <SvgIcon name="heart" {...props} />
export const CartIcon = (props) => <SvgIcon name="cart" {...props} />
export const MenuIcon = (props) => <SvgIcon name="menu" {...props} />
export const CloseIcon = (props) => <SvgIcon name="close" {...props} />
export const ChevronDownIcon = (props) => <SvgIcon name="chevronDown" {...props} />
export const ChevronRightIcon = (props) => <SvgIcon name="chevronRight" {...props} />
