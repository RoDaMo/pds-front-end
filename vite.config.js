import { defineConfig } from 'vite'
import { resolve } from 'path'
// import mpa from 'vite-plugin-mpa'

export default defineConfig({
  // appType: 'mpa',
  // plugins: [ mpa({ open: "pages" }) ],
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap')
    }
  },
  build: {
    outDir: 'app',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        cadastro: resolve(__dirname, 'pages/cadastro-campeonatos.html'),
        login: resolve(__dirname, 'pages/login.html'),
        cadastroUsuarios: resolve(__dirname, 'pages/cadastro-usuarios.html'),
        listagem: resolve(__dirname, 'pages/listagem-campeonatos.html')
      }
    }
  },
})