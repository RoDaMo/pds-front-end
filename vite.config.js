import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
// import mpa from 'vite-plugin-mpa'
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  server: {
    https: isDev ? {
      key: fs.readFileSync('./newkey.pem'),
      cert: fs.readFileSync('./cert.pem')
    } : undefined
  },
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