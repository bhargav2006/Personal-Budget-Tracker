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
        // Verdant Signal Surfaces
        background: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'surface-sunken': 'var(--surface-sunken)',
        sidebar: 'var(--sidebar)',
        card: 'var(--surface)',
        
        // Borders
        border: 'var(--border)',
        'control-border': 'var(--control-border)',

        // Typography
        textPrimary: 'var(--text)',
        textSecondary: 'var(--text-muted)',
        textSubtle: 'var(--text-subtle)',

        // Brand & Actions
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          container: 'var(--primary-container)',
          'on-container': 'var(--on-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          container: 'var(--secondary-container)',
          'on-container': 'var(--on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          hover: 'var(--tertiary-hover)',
          container: 'var(--tertiary-container)',
          'on-container': 'var(--on-tertiary-container)',
        },

        // Category Accents
        lilac: 'var(--accent-lilac)',
        coral: 'var(--accent-coral)',

        // Domain & Status Colors
        income: 'var(--income)',
        'income-bg': 'var(--income-bg)',
        expense: 'var(--expense)',
        'expense-bg': 'var(--expense-bg)',
        accent: 'var(--primary)',
        success: 'var(--success)',
        'success-bg': 'var(--success-bg)',
        warning: 'var(--warning)',
        'warning-bg': 'var(--warning-bg)',
        error: 'var(--error)',
        'error-bg': 'var(--error-bg)',
        info: 'var(--info)',
        'info-bg': 'var(--info-bg)',
        focus: 'var(--focus)',
        accentGrey: 'var(--text-subtle)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        popover: 'var(--shadow-popover)',
        primary: 'var(--shadow-primary)',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      borderRadius: {
        btn: '10px',
      }
    },
  },
  plugins: [],
}
