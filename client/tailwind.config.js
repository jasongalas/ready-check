/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "aquamarine": '#0298e6',
        "navy-blue": '#03045E',
        "navy-blue-hover": '#0608c6',
        "honolulu-blue": '#0077B6',
        "blue-btn": '#0259CA',
        "blue-hover": '#2583fd',
        "dark-green": '#008148',
        "green-hover": '#00ab5f',
        "darker-background": '##ded6d6'
    },
  },  
  },
  plugins: [
    require('daisyui'),
  ],
}

