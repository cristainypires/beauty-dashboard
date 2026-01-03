/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Podes adicionar as cores da Maddie aqui depois
      colors: {
        maddie: {
          pink: '#FFF5F7',
          wine: '#5D2E46',
        }
      }
    },
  },
  plugins: [],
}