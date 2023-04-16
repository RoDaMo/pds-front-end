
import { inicializarInternacionalizacao } from './js/utilidades/internacionalizacao'
import globalEn from './js/i18n/en/main.json' assert { type: 'JSON' };
import globalPt from './js/i18n/ptbr/main.json' assert { type: 'JSON' };
import '/scss/styles.scss'
import * as bootstrap from 'bootstrap'

const pesquisa = document.getElementById("pesquisa")
const barraPesquisa = document.getElementById("barra-pesquisa")

pesquisa.addEventListener("submit", (e) => {
    e.preventDefault()
    window.location.assign(`../pages/listagem-campeonatos.html?name=${barraPesquisa.value}`)
})

if (!localStorage.getItem('lng')) {
  localStorage.setItem('lng', 'ptbr')
}

document.addEventListener('DOMContentLoaded', () => inicializarInternacionalizacao(globalEn, globalPt))

