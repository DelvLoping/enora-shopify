/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/*.json',
  ],
  theme: {
    extend: {
      colors: {
        cream: 'oklch(0.972 0.012 80)',
        sand: 'oklch(0.92 0.025 75)',
        taupe: 'oklch(0.62 0.028 55)',
        charcoal: 'oklch(0.22 0.008 60)',
        offwhite: 'oklch(0.985 0.006 85)',
        ember: 'oklch(0.62 0.18 25)',
        'ember-soft': 'oklch(0.78 0.10 28)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',
        destructive: 'oklch(0.577 0.245 27.325)',
        'destructive-foreground': 'oklch(0.985 0.006 85)',
      },
      fontFamily: {
        display: ['Fraunces', 'Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter Tight', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['88px', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display': ['64px', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
      },
      boxShadow: {
        'soft': '0 30px 80px -40px rgba(56, 55, 53, 0.25)',
        'glow': '0 0 120px -20px rgba(194, 92, 32, 0.35)',
      },
      backgroundImage: {
        'warm-gradient': 'radial-gradient(ellipse at 50% 0%, oklch(0.95 0.03 60) 0%, oklch(0.972 0.012 80) 55%, oklch(0.92 0.025 75) 100%)',
        'ember-glow': 'radial-gradient(circle at 50% 100%, oklch(0.78 0.10 28 / 0.35) 0%, transparent 60%)',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ember': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        reveal: 'reveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-ember': 'pulse-ember 4s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      borderRadius: {
        '3xl': 'calc(var(--radius) + 12px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
    },
  },
  plugins: [],
};
