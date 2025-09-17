/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/lib/**/*.{js,jsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Gulu Brand Colors - Based on #1071FF
        primary: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1071FF', // Your main brand color
          600: '#0d5ce6',
          700: '#0a47cc',
          800: '#0833b3',
          900: '#062099',
          950: '#04155c',
        },
        // Button Colors - Based on #F36E16
        accent: {
          50: '#fef7ed',
          100: '#fdedd5',
          200: '#fbd8aa',
          300: '#f8bc74',
          400: '#f5953c',
          500: '#F36E16', // Your button color
          600: '#e05506',
          700: '#ba4008',
          800: '#94330e',
          900: '#782c0f',
          950: '#411405',
        },
        // Text Colors for your project
        text: {
          primary: '#242424',   // Main text color
          secondary: '#505050', // Secondary text color
          muted: '#6B7280',     // Muted text (lighter)
          light: '#9CA3AF',     // Light text
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(16, 113, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(16, 113, 255, 0.4)',
        'glow-orange': '0 0 20px rgba(243, 110, 22, 0.3)',
        'glow-orange-lg': '0 0 40px rgba(243, 110, 22, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #1071FF 0%, #0d5ce6 100%)',
        'gradient-button': 'linear-gradient(135deg, #F36E16 0%, #e05506 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1071FF 0%, #F36E16 100%)',
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
