import '/scss/styles.scss'
import * as bootstrap from 'bootstrap'

const pesquisa = document.getElementById("pesquisa")
const barraPesquisa = document.getElementById("barra-pesquisa")

pesquisa.addEventListener("submit", (e) => {
    e.preventDefault()
    window.location.assign(`../pages/listagem-campeonatos.html?name=${barraPesquisa.value}`)
})