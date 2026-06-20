/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#763300",
        "outline-variant": "#c4c6cd",
        "on-primary": "#ffffff",
        "background": "#f6fafe",
        "on-primary-container": "#8292ad",
        "inverse-surface": "#2c3134",
        "secondary-fixed-dim": "#ffb68d",
        "error": "#ba1a1a",
        "surface-container-highest": "#dfe3e7",
        "tertiary": "#051629",
        "on-secondary-fixed": "#331200",
        "tertiary-fixed-dim": "#b7c8e1",
        "surface-container-high": "#e4e9ed",
        "inverse-primary": "#b7c7e4",
        "surface-variant": "#dfe3e7",
        "on-surface": "#171c1f",
        "surface-bright": "#f6fafe",
        "inverse-on-surface": "#edf1f5",
        "surface-container-lowest": "#ffffff",
        "primary-fixed": "#d4e3ff",
        "on-surface-variant": "#44474d",
        "surface-tint": "#505f78",
        "on-tertiary-fixed": "#0b1c30",
        "surface": "#f6fafe",
        "primary-container": "#1b2b41",
        "primary-fixed-dim": "#b7c7e4",
        "on-background": "#171c1f",
        "surface-dim": "#d6dade",
        "on-secondary": "#ffffff",
        "on-error-container": "#93000a",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#8292ab",
        "on-secondary-container": "#5e2700",
        "on-error": "#ffffff",
        "secondary": "#9b4500",
        "primary": "#05162b",
        "on-primary-fixed": "#0b1c31",
        "error-container": "#ffdad6",
        "surface-container": "#eaeef2",
        "outline": "#75777d",
        "on-tertiary-fixed-variant": "#38485d",
        "secondary-container": "#fc7c1f",
        "secondary-fixed": "#ffdbc9",
        "tertiary-fixed": "#d3e4fe",
        "tertiary-container": "#1b2b3f",
        "on-primary-fixed-variant": "#38485f",
        "surface-container-low": "#f0f4f8"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "base": "8px",
        "margin": "24px",
        "lg": "24px",
        "md": "16px",
        "gutter": "16px",
        "sm": "8px",
        "xs": "4px",
        "xl": "32px"
      },
      // Kita daftarkan utility font agar class seperti font-display-lg bisa terbaca
      fontFamily: {
        "display-lg": ["Inter", "sans-serif"],
        "label-technical": ["JetBrains Mono", "monospace"],
        "display-lg-mobile": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "button": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Jika kamu menggunakan plugin forms di React
  ],
}