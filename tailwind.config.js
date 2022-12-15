module.exports = {
  content: ["./*.html","./src/**/*.js"],
  important: true,
  theme: {
    extend: {
      colors: {
        "primary": "var(--theme-primary)",
        "primary-dark": "var(--theme-primary-dark)",
        "primary-light": "var(--theme-primary-light)",
        "secondary": "var(--theme-secondary)",
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ]
}