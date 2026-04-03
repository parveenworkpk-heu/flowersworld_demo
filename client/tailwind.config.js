module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C73086',
        secondary: '#FF6B6B',
        'soft-pink': '#FFB6C1',
        cream: '#FFF9E6',
        sage: '#8B9A7D',
        gold: '#D4AF37',
        dark: '#212529',
        light: '#FAFAFA'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
