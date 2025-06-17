/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A243F',
        secondary: '#7A582A',
        accent: '#7A582A',
        textColor: '#7A7A7A',
        white: '#FFFFFF',
        lightGray: '#A0A4B0',
        bgGray: '#F0F0F0',
        lightBg: '#F9F9F9',
        yellow: '#ECC440',
        darkYellow: '#DDAC17',
        goldYellow: '#CA9D14',
        lightYellow: '#F3D676',
        brown: '#A88C63',
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s infinite',
        'slide-up-fade': 'slide-up-fade 1s ease-out forwards',
        'fade-in': 'fade-in 0.8s ease-in forwards',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-10px)',
          },
          '60%': {
            transform: 'translateY(-5px)',
          },
        },
        'slide-up-fade': {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100px)',
            opacity: '0',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
