import formPlugin from '@tailwindcss/forms'

export default {
  content: ['./src/**/*.{js,jsx}',"./index.html"],
  theme: {
    extend: {},
  },
  plugins: [formPlugin],
}
