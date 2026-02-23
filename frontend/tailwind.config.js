export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)',
        'gradient-light': 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
      },
    },
  },
  plugins: [],
};
