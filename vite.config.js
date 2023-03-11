import { defineConfig } from 'vite'
// import mpa from 'vite-plugin-mpa'

export default defineConfig({
  appType: 'mpa',
  build: {
    outDir: 'dist'
  },
})