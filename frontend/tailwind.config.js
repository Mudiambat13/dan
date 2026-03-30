export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: { 50:'#EEF2FF',100:'#E0E7FF',400:'#818CF8',500:'#6366F1',600:'#4F46E5',700:'#4338CA' },
        surface: { 50:'#F8FAFC',100:'#F1F5F9',200:'#E2E8F0',600:'#475569',700:'#334155',800:'#1E293B',900:'#0F172A',950:'#020617' }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { from:{opacity:'0'}, to:{opacity:'1'} },
        slideUp: { from:{opacity:'0',transform:'translateY(20px)'}, to:{opacity:'1',transform:'translateY(0)'} },
      }
    },
  },
  plugins: [],
}
