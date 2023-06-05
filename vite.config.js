import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
// import mpa from 'vite-plugin-mpa'
import htmlPurge from 'vite-plugin-html-purgecss'
import purgeCSSPlugin from '@fullhuman/postcss-purgecss'
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [
    htmlPurge,
    purgeCSSPlugin({
      content: ['./**/*.html']
    })
  ],
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
        listagem: resolve(__dirname, 'pages/listagem-campeonatos.html'),
        paginaUsuarios: resolve(__dirname, 'pages/pagina-usuarios.html'),
        redefinirSenha: resolve(__dirname, 'pages/redefinir-senha.html'),
        cadastroTimes: resolve(__dirname, 'pages/cadastro-times.html'),
        confirmacaoCadastro: resolve(__dirname, 'pages/confirmacao-cadastro.html'),
        configuracaoUsuarios: resolve(__dirname, 'pages/configuracao-usuarios.html'),
        configuracaoCampeonato: resolve(__dirname, 'pages/configuracao-campeonato.html'),
        recuperarSenha: resolve(__dirname, 'pages/recuperar-senha.html')
      }
    }
  },
})