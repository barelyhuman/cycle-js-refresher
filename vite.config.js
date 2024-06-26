import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import babel from 'vite-plugin-babel';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [babel(),preact()],
})
