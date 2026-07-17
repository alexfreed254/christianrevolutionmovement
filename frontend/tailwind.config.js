/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Christ Revolution Movement Brand Colors (from logo)
        primary: {
          50: '#FAF5FF',   // Lightest purple
          100: '#F3E8FF',  // Very light purple
          200: '#E9D5FF',  // Light purple from logo
          300: '#D8B4FE',  // Light-medium purple
          400: '#C4B5FD',  // Medium purple from logo
          500: '#9B7FD9',  // Main purple from logo ⭐
          600: '#7C3AED',  // Darker purple
          700: '#6D28D9',  // Deep purple
          800: '#5B21B6',  // Very deep purple
          900: '#4C1D95',  // Darkest purple
        },
        secondary: {
          50: '#F9FAFB',   // Lightest gray
          100: '#F3F4F6',  // Very light gray
          200: '#E5E7EB',  // Light gray
          300: '#D1D5DB',  // Medium-light gray
          400: '#9CA3AF',  // Medium gray
          500: '#6B7280',  // Base gray
          600: '#4B5563',  // Dark gray
          700: '#374151',  // Darker gray
          800: '#1F2937',  // Very dark gray
          900: '#111827',  // Almost black
        },
        // Quick access brand colors
        'crm-purple': '#9B7FD9',      // Main brand purple
        'crm-purple-light': '#C4B5FD', // Light purple
        'crm-purple-lighter': '#E9D5FF', // Lighter purple
        'crm-purple-dark': '#7C3AED',  // Dark purple
        'crm-black': '#000000',        // Logo black
        'crm-white': '#FFFFFF',        // Logo white
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
