const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,js}'], // Update with your content paths
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'), // Ensure this line is included
  ],
};
