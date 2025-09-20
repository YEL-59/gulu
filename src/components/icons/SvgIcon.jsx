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

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_270_4881)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 0C12.4183 0 16 3.58173 16 8C16 12.4183 12.4183 16 8 16C3.58173 16 0 12.4183 0 8C0 3.58173 3.58173 0 8 0Z" fill="white" />
                    <path d="M9.04217 15.9328V9.75225H10.7856L11.0167 7.57697H9.04217L9.0451 6.48815C9.0451 5.92079 9.09903 5.61693 9.91445 5.61693H11.0045V3.44128H9.26065C7.16597 3.44128 6.42881 4.49647 6.42881 6.27123V7.57714H5.12305V9.75261H6.42881V15.8452C6.9375 15.9465 7.4634 16 8.00187 16C8.34972 16 8.69721 15.9776 9.04217 15.9328Z" fill="#1071FF" />
                </g>
                <defs>
                    <clipPath id="clip0_270_4881">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
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
        pinterest: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_270_4884)">
                    <path d="M7.02503 0.0531425C4.36618 0.349959 1.71669 2.5011 1.60734 5.57394C1.5386 7.45013 2.07131 8.85767 3.8569 9.25291C4.63175 7.88599 3.60695 7.58448 3.44761 6.59561C2.79304 2.54328 8.1217 -0.220242 10.9102 2.60889C12.8395 4.56789 11.5695 10.5948 8.45757 9.96839C5.4769 9.37007 9.91666 4.57257 7.53743 3.63057C5.60344 2.86509 4.57551 5.9723 5.49252 7.51575C4.95512 10.1699 3.79754 12.671 4.2662 16C5.78621 14.8971 6.29861 12.785 6.71884 10.5823C7.48276 11.0463 7.89049 11.529 8.8653 11.604C12.4599 11.8821 14.4673 8.01565 13.9768 4.44916C13.541 1.28728 10.3853 -0.321784 7.02503 0.0531425Z" fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_270_4884">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
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

        google: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_146_6649)">
                    <path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83806H12.2402V14.459H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9273 23.7663 12.2764Z" fill="#4285F4" />
                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853" />
                    <path d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70577V6.61482H1.51674C-0.185266 10.0056 -0.185266 14.0005 1.51674 17.3912L5.50277 14.3003Z" fill="#FBBC04" />
                    <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335" />
                </g>
                <defs>
                    <clipPath id="clip0_146_6649">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        ),

        // Navigation Icons
        search: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        cart: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
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
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M12.4993 15C11.8166 14.9988 11.141 15.1373 10.5139 15.4072C9.88686 15.677 9.32171 16.0724 8.85327 16.5689C8.38483 17.0654 8.02303 17.6527 7.79016 18.2943C7.55729 18.936 7.45828 19.6186 7.49924 20.3L9.09925 45.625C9.25845 48.1674 10.3819 50.5532 12.2403 52.2954C14.0987 54.0377 16.5519 55.005 19.0993 55.0001H40.9493C43.4966 55.005 45.9499 54.0377 47.8083 52.2954C49.6666 50.5532 50.7901 48.1674 50.9493 45.625L52.4993 20.3C52.5403 19.6186 52.4413 18.936 52.2084 18.2943C51.9755 17.6527 51.6137 17.0654 51.1453 16.5689C50.6768 16.0724 50.1117 15.677 49.4846 15.4072C48.8576 15.1373 48.1819 14.9988 47.4993 15H12.4993Z" fill="#F58B45" />
                <path d="M40 25C39.337 25 38.7011 24.7366 38.2322 24.2678C37.7634 23.7989 37.5 23.1631 37.5 22.5V17.5C37.5 15.5109 36.7098 13.6032 35.3033 12.1967C33.8968 10.7902 31.9891 10 30 10C28.0109 10 26.1032 10.7902 24.6967 12.1967C23.2902 13.6032 22.5 15.5109 22.5 17.5V22.5C22.5 23.1631 22.2366 23.7989 21.7678 24.2678C21.2989 24.7366 20.663 25 20 25C19.337 25 18.7011 24.7366 18.2322 24.2678C17.7634 23.7989 17.5 23.1631 17.5 22.5V17.5C17.5 14.1848 18.817 11.0054 21.1612 8.66117C23.5054 6.31696 26.6848 5 30 5C33.3152 5 36.4946 6.31696 38.8388 8.66117C41.183 11.0054 42.5 14.1848 42.5 17.5V22.5C42.5 23.1631 42.2366 23.7989 41.7678 24.2678C41.2989 24.7366 40.663 25 40 25Z" fill="#F36E16" />
                <path d="M26.8242 43.8C26.1719 43.8039 25.5439 43.5527 25.0742 43.1L20.8242 38.9C20.411 38.4247 20.1924 37.8109 20.2122 37.1814C20.2319 36.5519 20.4885 35.9531 20.9307 35.5046C21.3728 35.0561 21.968 34.791 22.5971 34.7624C23.2263 34.7337 23.8431 34.9436 24.3242 35.35L26.8242 37.85L34.0492 30.75C34.5344 30.4109 35.1242 30.2549 35.7137 30.31C36.3031 30.365 36.8539 30.6274 37.2679 31.0505C37.682 31.4736 37.9325 32.0298 37.9749 32.6203C38.0172 33.2108 37.8486 33.7971 37.4992 34.275L28.5242 43.1C28.067 43.5408 27.4592 43.791 26.8242 43.8Z" fill="#EDEBEA" />
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
export const PinterestIcon = (props) => <SvgIcon name="pinterest" {...props} />
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
export const LogoIcon = (props) => <SvgIcon name="logo" {...props} />
export const GoogleIcon = (props) => <SvgIcon name="google" {...props} />
