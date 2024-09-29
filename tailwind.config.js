/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  
  theme: {
      extend: {
        colors: {
          'navy-blue': '#1e3a8a',
          'dark-navy': '#153e75',
          'coral': '#ff6b6b',
          'dark-coral': '#e55a5a',
          'cream': '#fdf8f5',
          'teal-600': '#2c7a7b',
          'cream': '#fdf8f5'
        }
      }
    },
    variants: {
      extend: {
        backgroundColor: ['hover', 'focus'],
      }
    },
  plugins: [],
}

