/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     extend: {
      fontFamily: {
        'roboto': ['var(--font-roboto)', 'sans-serif'],
        'lora': ['var(--font-lora)', 'serif'],
      },
      colors: {
        'lightestGray': "#acacac",
        'lightGray': "#595959",
        'bgGray': "#c6c6c6",
        'evenLighterGray': "#e8e8e8",
      },
    },  
  },
  plugins: [],
}