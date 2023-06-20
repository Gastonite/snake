import { defineConfig } from 'vite'



export default defineConfig({
  root: 'src',
  publicDir: '../public',
  server: {
    port: 4242,
  },
})