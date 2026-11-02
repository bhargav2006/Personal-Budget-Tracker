/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global Design System Foundation Surfaces
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        'surface-sunken': 'var(--color-surface-sunken)',
        sidebar: 'var(--color-sidebar)',
        card: 'var(--color-surface)',
        
        // Borders & Dividers
        border: 'var(--color-border)',
        'control-border': 'var(--color-control-border)',
        divider: 'var(--color-divider)',

        // Typography Hierarchy
        textPrimary: 'var(--color-text)',
        textSecondary: 'var(--color-text-muted)',
        textSubtle: 'var(--color-text-subtle)',
        textInverse: 'var(--color-text-inverse)',

        // Brand Primary & Action Tokens
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          container: 'var(--color-primary-container)',
          'on-container': 'var(--color-on-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          container: 'var(--color-secondary-container)',
          'on-container': 'var(--color-on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          hover: 'var(--color-tertiary-hover)',
          container: 'var(--color-tertiary-container)',
          'on-container': 'var(--color-on-tertiary-container)',
        },

        // Category & Specialty Accents
        lilac: 'var(--color-accent-lilac)',
        coral: 'var(--color-accent-coral)',
        mint: 'var(--color-accent-mint)',

        // Domain Financial & Semantic Feedback Colors
        income: 'var(--color-income)',
        'income-bg': 'var(--color-income-bg)',
        expense: 'var(--color-expense)',
        'expense-bg': 'var(--color-expense-bg)',
        accent: 'var(--color-primary)',
        success: 'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        warning: 'var(--color-warning)',
        'warning-bg': 'var(--color-warning-bg)',
        error: 'var(--color-error)',
        'error-bg': 'var(--color-error-bg)',
        info: 'var(--color-info)',
        'info-bg': 'var(--color-info-bg)',
        focus: 'var(--color-focus)',
        accentGrey: 'var(--color-text-subtle)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        popover: 'var(--shadow-popover)',
        primary: 'var(--shadow-primary)',
        sm: 'var(--shadow-sm)',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      borderRadius: {
        btn: '10px',
      }
    },
  },
  plugins: [],
}
