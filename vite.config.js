import { defineConfig } from 'vite'
import { resolve } from 'path'
// import mpa from 'vite-plugin-mpa'

export default defineConfig({
  appType: 'mpa',
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap')
    }
  },
  build: {
    outDir: 'dist'
  },
})