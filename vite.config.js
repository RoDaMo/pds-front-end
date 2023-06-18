import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
// import mpa from 'vite-plugin-mpa'
import purgeCSSPlugin from '@fullhuman/postcss-purgecss'
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [
    purgeCSSPlugin({
      content: ['./**/*.html']
    }),
    splitVendorChunkPlugin()
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
        paginaCampeonatos: resolve(__dirname, 'pages/pagina-campeonatos.html'),
        redefinirSenha: resolve(__dirname, 'pages/redefinir-senha.html'),
        cadastroTimes: resolve(__dirname, 'pages/cadastro-times.html'),
        confirmacaoCadastro: resolve(__dirname, 'pages/confirmacao-cadastro.html'),
        configuracaoUsuarios: resolve(__dirname, 'pages/configuracao-usuarios.html'),
        configuracaoCampeonato: resolve(__dirname, 'pages/configuracao-campeonato.html'),
        recuperarSenha: resolve(__dirname, 'pages/recuperar-senha.html'),
        cookies: resolve(__dirname, 'pages/cookies.html'),
        sobreNos: resolve(__dirname, 'pages/sobre-nos.html'),
        termosPrivacidade: resolve(__dirname, 'pages/termos-de-privacidade.html'),
        termosDeUso: resolve(__dirname, 'pages/termos-de-uso.html')
      }
    }
  },
})