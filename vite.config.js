import { defineConfig } from 'vite'
import { resolve } from 'path'
// import mpa from 'vite-plugin-mpa'

export default defineConfig({
  appType: 'mpa',
  // plugins: [ mpa({ open: "pages" }) ],
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'pages/home.html'),
        login: resolve(__dirname, 'pages/login.html')
      }
    }
  },
})