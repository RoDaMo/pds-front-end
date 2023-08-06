import { inicializarInternacionalizacao, inicializarInternacionalizacaoGlobal } from './js/utilidades/internacionalizacao'
import { configuracaoFetch, api } from './js/utilidades/configFetch';
import globalEn from './js/i18n/en/main.json' assert { type: 'JSON' };
import globalPt from './js/i18n/ptbr/main.json' assert { type: 'JSON' };
import '/scss/styles.scss'
import 'bootstrap-icons/font/bootstrap-icons.scss'
import i18next from 'i18next';
import { cookie } from './js/utilidades/cookieModal';
import * as bootstrap from 'bootstrap'

if (!localStorage.getItem('lng')) {
  localStorage.setItem('lng', 'ptbr')
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log(document.cookie)
  if (!document.cookie.includes('aceitou-cookies')) {
    const cookieTooltip = new cookie()
    document.body.appendChild(cookieTooltip)
    const toast = new bootstrap.Toast(cookieTooltip, { autohide: false })
    toast.show()
    document.getElementById('btn-aceitar-cookie').addEventListener('click', () => {
      document.cookie = `aceitou-cookies=true; expires=${new Date().setTime(new Date().getTime() + 2000*24*60*60*1000)};path=/;`
      toast.hide()
      cookieTooltip.remove();
    })
  }


  inicializarInternacionalizacao(globalEn, globalPt)
  inicializarInternacionalizacaoGlobal()
  document.addEventListener('header-carregado', () => {
    document.getElementById('lingua').addEventListener('change', event => {
      const selectedIndex = event.target.selectedIndex;
      localStorage.setItem('lng', event.target.children[selectedIndex].value);
      i18next.changeLanguage(localStorage.getItem('lng'))
      document.body.dispatchEvent(new Event('nova-lingua', { bubbles: true }))
    })
  })

  const pesquisa = document.getElementById("pesquisa")
  const barraPesquisa = document.getElementById("barra-pesquisa")
  
  if(pesquisa !== null){
    pesquisa.addEventListener("submit", (e) => {
      e.preventDefault()
      window.location.assign(`/pages/listagem-campeonatos.html?name=${barraPesquisa.value}`)
    })
  }

  const config = configuracaoFetch('GET'),
        response = await fetch(`${api}auth/user`, config)

  localStorage.setItem('autenticado', response.ok)
  if (response.ok) {
    const resultados = await response.json()
    localStorage.setItem('user-info', JSON.stringify(resultados.results))
  } else {
    localStorage.removeItem('user-info')
    if (document.body.getAttribute('requires-auth'))
      window.location.assign('/')
  }

  if (document.body.getAttribute('only-anon') && response.ok) 
    window.location.assign('/')

  document.dispatchEvent(new Event('autenticado', { bubbles: true }))
})
