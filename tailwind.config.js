export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          body: 'var(--bg-body)',
          elevated: 'var(--bg-elevated)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          soft: 'var(--primary-soft)',
          subtle: 'var(--primary-subtle)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          soft: 'var(--warning-soft)',
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          soft: 'var(--text-soft)',
          'on-primary': 'var(--text-on-primary)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      backgroundImage: {
        'gradient-header': 'var(--gradient-header)',
        'gradient-primary': 'var(--gradient-primary)',
      },
    },
  },
  plugins: [],
}

