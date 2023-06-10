
import { inicializarInternacionalizacao } from './js/utilidades/internacionalizacao'
import { configuracaoFetch, executarFetch } from './js/utilidades/configFetch';
import globalEn from './js/i18n/en/main.json' assert { type: 'JSON' };
import globalPt from './js/i18n/ptbr/main.json' assert { type: 'JSON' };
import '/scss/styles.scss'
import 'bootstrap-icons/font/bootstrap-icons.scss'
import * as bootstrap from 'bootstrap'

if (!localStorage.getItem('lng')) {
  localStorage.setItem('lng', 'ptbr')
}

document.addEventListener('DOMContentLoaded', async () => {
  inicializarInternacionalizacao(globalEn, globalPt)
  const pesquisa = document.getElementById("pesquisa")
  const barraPesquisa = document.getElementById("barra-pesquisa")
  
  if(pesquisa !== null){
    pesquisa.addEventListener("submit", (e) => {
      e.preventDefault()
      window.location.assign(`/pages/listagem-campeonatos.html?name=${barraPesquisa.value}`)
    })
  }

  if (document.body.getAttribute('requires-auth')) {
    const config = configuracaoFetch('GET'),
          response = await executarFetch('auth', config)
  }
})
