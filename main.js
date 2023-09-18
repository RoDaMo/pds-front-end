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

const insertColorModeBtn = async () => {
  const themeSwitcher = document.createElement('div')

  themeSwitcher.innerHTML = `
    <div class="dropdown position-fixed bottom-0 start-0 mb-3 ms-3 bd-mode-toggle">
      <button class="btn btn-bd-primary corner-babies py-2 justify-content-center rounded-4 d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (dark)">
        <div class="bi my-1 theme-icon-active fs-4"><i class="bi bi-moon"></i></div>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul id="theme-switcher-context-menu" class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text" style="">
        <li>
          <button type="button" class="theme-option-btns dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
            <div class="bi me-2 opacity-50 theme-icon"><i class="bi bi-brightness-high"></i></div>
            Light
            <div class="bi ms-auto d-none"><i class="bi bi-check"></i></div>
          </button>
        </li>
        <li>
          <button type="button" class="theme-option-btns dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
            <div class="bi me-2 opacity-50 theme-icon"><i class="bi bi-moon"></i></div>
            Dark
            <div class="bi ms-auto d-none"><i class="bi bi-check"></i></div>
          </button>
        </li>
      </ul>
    </div>
  `
  document.body.appendChild(themeSwitcher)
}

document.addEventListener('DOMContentLoaded', async () => {
  await insertColorModeBtn()
  ;(() => {
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = theme => {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
  
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelector('#bd-theme-text')
      const activeThemeIcon = document.querySelector('.theme-icon-active i')
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
      const svgOfActiveBtn = btnToActive.querySelector('div i').getAttribute('class')
  
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
  
      btnToActive.classList.add('active')
      btnToActive.setAttribute('aria-pressed', 'true')
      activeThemeIcon.setAttribute('class', svgOfActiveBtn)
      const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
      themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            setStoredTheme(theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          })
        })
    })
  })()

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
