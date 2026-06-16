import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Background palette
        bg: {
          primary: '#050816',
          secondary: '#0A1020',
          tertiary: '#101827',
          card: 'rgba(10,16,32,0.7)',
        },
        // Accent palette
        cyan: {
          DEFAULT: '#00E5FF',
          dim: 'rgba(0,229,255,0.15)',
          glow: 'rgba(0,229,255,0.3)',
        },
        pink: {
          DEFAULT: '#FF4FD8',
          dim: 'rgba(255,79,216,0.15)',
          glow: 'rgba(255,79,216,0.3)',
        },
        violet: {
          DEFAULT: '#7C3AED',
          dim: 'rgba(124,58,237,0.15)',
          glow: 'rgba(124,58,237,0.3)',
        },
        // Neutral
        slate: {
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #050816 0%, #0A1020 50%, #101827 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(10,16,32,0.8) 0%, rgba(16,24,39,0.6) 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)',
        'pink-gradient': 'linear-gradient(135deg, #FF4FD8 0%, #7C3AED 100%)',
        'neon-border': 'linear-gradient(90deg, #00E5FF, #7C3AED, #FF4FD8, #00E5FF)',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.1)',
        'pink-glow': '0 0 20px rgba(255,79,216,0.3), 0 0 60px rgba(255,79,216,0.1)',
        'violet-glow': '0 0 20px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)',
        'card': '0 0 30px rgba(0,229,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 0 50px rgba(0,229,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', filter: 'blur(20px)' },
          '50%': { opacity: '1', filter: 'blur(30px)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'neon-border': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'typewriter': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'particle': {
          '0%': { transform: 'translate(0,0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx),var(--ty)) scale(0)', opacity: '0' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'neon-border': 'neon-border 3s ease infinite',
        'typewriter': 'typewriter 3s steps(40) forwards',
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slide-in-from-bottom 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'radar-sweep': 'radar-sweep 3s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config