import { configuracaoFetch, api, executarFetch } from "./configFetch";
import './loader'
import i18next from "i18next"
import Lenis from '@studio-freight/lenis'

const toTopBtn = document.getElementById("gotop")
const navbarComponente = document.querySelector("componente-header")
const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const scrollTrigger = document.querySelectorAll(".scroll-trigger")
const isHomer = document.querySelector("#is-homer")

let mobibarLogo
let navbar
let offcanvasNavbar 

function isVisible(el) {
    let rect = el.getBoundingClientRect()
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

document.addEventListener("DOMContentLoaded", () => {
    mobibarLogo = navbarComponente.querySelector('img[alt="Logo Playoffs"]')
    navbar = navbarComponente.querySelector(".navbar")
    offcanvasNavbar = navbarComponente.querySelector("#offcanvasNavbar")

    if(isHomer) {
        navbarComponente.firstElementChild.classList.remove("bg-white", "pb-1")
    }
})

const loader = document.createElement('app-loader')
document.body.appendChild(loader)

const mobibarComponenteClasses = ["rounded-0", "mt-0", "shadow-none", "navbar-blur"]
const mobibarLogoClasses = ["mt-0"]

let lenis = new Lenis({
    wheelMultiplier: 0.4,
    smoothWheel: true,
    touchMultiplier: 0.6,
    smoothTouch: true,
    syncTouch: true,
    normalizeWheel: true,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
  
requestAnimationFrame(raf)

if(toTopBtn) {
    toTopBtn.style.display = "none"
}

let menuOpen = false

navbarComponente.classList.add("w-100", "position-fixed", "top-0", "z-3")

if(!isHomer) {
    document.body.style.marginTop = "calc(60px + 2rem)"
} else {
    if (mediaQueryMobile.matches) {
        document.body.style.marginTop = "calc(60px)"
    }
}


lenis.on("scroll", () => {
    // To top button appearing
    if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
    ) {
        if(toTopBtn) {
            toTopBtn.style.display = "block"
        }
    } else {
        if(toTopBtn) {
            toTopBtn.style.display = "none"
        }
    }

    if (
        document.body.scrollTop > 585 ||
        document.documentElement.scrollTop > 585
    ) {
        navbarComponente.querySelectorAll(".nav-item").forEach(item => item.firstElementChild.classList.add("text-dark"))
        if(navbarComponente.querySelector(".bi-caret-left-fill")) {
            navbarComponente.querySelector(".bi-caret-left-fill").style.setProperty('--custom-white', "black")
        }

    } else {
        navbarComponente.querySelectorAll(".nav-item").forEach(item => item.firstElementChild.classList.remove("text-dark"))
        if(navbarComponente.querySelector(".bi-caret-left-fill")) {
            navbarComponente.querySelector(".bi-caret-left-fill").style.setProperty('--custom-white', "white")
        }
    }

    if (!menuOpen) {
        navbarComponente.classList.add(...mobibarComponenteClasses)
        mobibarLogo.classList.add(...mobibarLogoClasses)

        if (window.scrollY === 0){
            navbarComponente.classList.remove(...mobibarComponenteClasses)
            mobibarLogo.classList.remove(...mobibarLogoClasses)
        }
    } 

    if(!isHomer) {
        if(window.scrollY != 0) {
            // document.body.style.marginTop = "60px"
            navbarComponente.firstElementChild.classList.remove("bg-white", "pb-1")
        } else {
            // document.body.style.marginTop = "0px"
            navbarComponente.firstElementChild.classList.add("bg-white", "pb-1")
        }
    }
})

if(toTopBtn) {
    toTopBtn.addEventListener("click", () => {
        lenis.scrollTo(0, {lock: true, force: true, duration: 1.8})
    })
}

document.addEventListener("DOMContentLoaded", () => {
    offcanvasNavbar.addEventListener("show.bs.offcanvas", () => {
        navbarComponente.classList.remove(...mobibarComponenteClasses)  
        mobibarLogo.classList.remove(...mobibarLogoClasses)  
        menuOpen = true
        lenis.stop()
    })

    offcanvasNavbar.addEventListener("hide.bs.offcanvas", () => {
        if (window.scrollY != 0) {
            navbarComponente.classList.add(...mobibarComponenteClasses)
            mobibarLogo.classList.add(...mobibarLogoClasses)  

            menuOpen = false
        } else {
            menuOpen = false
        }
        lenis.start()
    })
})

if (mediaQueryMobile.matches) {

    if(isHomer) {
        let startY = 0
        let endY = 0


        window.addEventListener("touchstart", e => {
            startY = e.touches[0].clientY
        })

        // Scrollend Trigger
        window.addEventListener("touchend", e => {
            endY = e.changedTouches[0].clientY

            console.log(endY, startY);

            setTimeout(() => {
                if (endY > startY && !(isVisible(scrollTrigger[0]))) {
                    scrollTrigger.forEach(trigger => {
                        if (isVisible(trigger) && trigger.classList.contains("bottom-trigger")) {
                            lenis.scrollTo(trigger.parentElement, {duration: 0.7})
                        }
                    })
                } else if (endY < startY && !(isVisible(scrollTrigger[7]))) {
                    scrollTrigger.forEach(trigger => {
                        if (isVisible(trigger) && trigger.classList.contains("top-trigger")) {
                            lenis.scrollTo(trigger.parentElement, {duration: 0.7})
                        }
                    })
                }
            }, 120);

        })
    }
}

export class header extends HTMLElement {
    constructor() {
        super();
        const lng = localStorage.getItem('lng');

        let classDark = ''
        if (document.body.getAttribute('is-home')) {
            classDark = 'header-home'
        }

        this.innerHTML = /* html */`
            <header class="bg-white pb-1">
                <div class="container">
                    <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="col col-lg-4">
                            <a class="navbar-brand m-auto" href="/"><img src="/Logo_Playoffs.png" class="logo-play img-fluid" width="180" alt="Logo Playoffs"></a>
                        </div>
                        
                        <button class="navbar-toggler navbar-tgg border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>  

                        <div class="offcanvas offcanvas-end mobile" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

                            <div class="offcanvas-header container pt-2 pb-2">
                                <h2 class="fw-semibold mb-0 text-black">Menu</h2>
                                <button id="close-offcanvas" type="button" class="btn-close me-1" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>

                            <hr class="opacity-50 border rounded-pill m-0 bg-dark d-flex d-lg-none">

                            <div class="offcanvas-body" id="offcanvas">
                                <form class="col col-md d-flex justify-content-center m-auto" id="pesquisa" role="search">
                                    <input id="barra-pesquisa" class="form-control m-lg-auto p-1 m-sm-5 mb-sm-2 m-3 mb-2 border-0 rounded-pill h-5 pesquisar i18-placeholder" type="search" key="PesquisaPlaceholder" placeholder="Procurar" aria-label="Search">
                                </form>  
                                <ul class="menu-li col col-sm-10 col-lg navbar-nav m-auto mt-lg-0 mt-3 justify-content-end align-items-center ${classDark}" id="status-usuario">
                                    <li class="nav-item mx-4">
                                        <a class="nav-link rounded-3 px-3 i18" href="/pages/login.html" key="Acessar">Acessar</a>
                                    </li>
                                    <li class="nav-item">
                                        <select class="form-select rounded-3 ps-3 py-2 bg-transparent" id="lingua" required>
                                            <option value="ptbr" ${lng === 'ptbr' ? 'selected' : ''}>Português</option>
                                            <option value="en" ${lng === 'en' ? 'selected' : ''}>English</option>
                                        </select>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        `

        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('autenticado', () => {
                if (localStorage.getItem('autenticado') == 'false')
                    document.dispatchEvent(new Event('header-carregado', { bubbles: true }))
                    
                this.estaLogado(lng)
            })
        })
        // this.estaLogado(lng)
    }
    
    estaLogado(lng) {
        const autenticado = localStorage.getItem('autenticado') == 'true'
        if (!autenticado) return;

        const defaultImg = 'https://cdn-icons-png.flaticon.com/512/17/17004.png'
        const user = JSON.parse(localStorage.getItem('user-info'))
        const info = /* html */`
            <li class="nav-item d-none d-lg-inline-flex me-5 navbar-user-img-wrapper navbar-clicavel" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasUser" aria-label="Toggle navigation">
                <i class="bi bi-caret-left-fill mt-1 text-black"></i>
                <img src="${user.picture ? user.picture : defaultImg}" class="foto-usuario ms-2 h-100 w-100">
            </li>
            <!--
            <li class="nav-item mx-4 d-none d-lg-block">
                <i class="bi bi-gear text-primary fs-4 navbar-clicavel" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasUser" aria-label="Toggle navigation"></i>
            </li>
            -->
            <li class="nav-item">
                <select class="form-select rounded-3 ps-3 py-2 bg-transparent" id="lingua" required>
                    <option value="ptbr" ${lng === 'ptbr' ? 'selected' : ''}>Português</option>
                    <option value="en" ${lng === 'en' ? 'selected' : ''}>English</option>
                </select>
            </li>
            <div class="list-group list-group-flush d-lg-none w-100">
                <a href="/pages/pagina-usuarios.html?id=${user.id}" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                    <i class="bi bi-person fs-4"></i>
                    <span class="i18" key="Perfil">${i18next.t("Perfil")}</span>
                </a>
                <a href="/pages/configuracao-usuarios.html" class="list-group-item py-4 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                    <i class="bi bi-person-gear fs-4"></i>
                    <span class="i18" key="Configuracoes">${i18next.t("Configuracoes")}</span>
                </a>
                ${this.possuiCampeonato(user.championshipId)}
                <a href="/pages/cadastro-times.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                    <i class="bi bi-people fs-4"></i>
                    <span class="i18" key="Time">${i18next.t("Time")}</span>
                </a>
                <a href="javascript:void(0)" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3 deslogar-usuario">
                    <i class="bi bi-box-arrow-right fs-4"></i>
                    <span class="i18" key="Sair">${i18next.t("Sair")}</span>
                </a>
            </div>
        `
        const status = document.getElementById('status-usuario')
        status.innerHTML = info
        const offcanvasUser = document.createElement('div')
        offcanvasUser.classList.add('offcanvas', 'offcanvas-end')
        offcanvasUser.id = 'offcanvasUser'
        offcanvasUser.setAttribute('tabindex', '-1')
        offcanvasUser.setAttribute('aria-labelledby', 'offcanvasUser')
        offcanvasUser.innerHTML = /* html */`
            <div class="offcanvas-header">
                <div class="d-flex flex-row gap-3">
                    <img src="${user.picture ? user.picture : defaultImg}" class="foto-usuario">
                    <h5 class="offcanvas-title" id="offcanvasUserName">${user.userName}</h5>
                    <p id="usernameChampionshipId" class="d-none">${user.championshipId}</p>
                    <p id="usernameTeamManagementId" class="d-none">${user.teamManagementId}</p>
                    <p id="usernameUserId" class="d-none">${user.id}</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="list-group list-group-flush">
                    <a href="/pages/pagina-usuarios.html?id=${user.id}" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-person fs-4"></i>
                        <span class="i18" key="Perfil">${i18next.t("Perfil")}</span>
                    </a>
                    <a href="/pages/configuracao-usuarios.html" class="list-group-item py-4 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-person-gear fs-4"></i>
                        <span class="i18" key="Configuracoes">${i18next.t("Configuracoes")}</span>
                    </a>
                    ${this.possuiCampeonato(user.championshipId)}
                    ${!user.teamManagementId ? `
                    <a href="/pages/cadastro-times.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-people fs-4"></i>
                        <span class="i18" key="Time">${i18next.t("Time")}</span>
                    </a>` : `
                    <a href="/pages/configuracao-time.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-people fs-4"></i>
                        <span class="i18" key="TimeConfig">${i18next.t("TimeConfig")}</span>
                    </a>`}
                    <a href="javascript:void(0)" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3 deslogar-usuario">
                        <i class="bi bi-box-arrow-right fs-4"></i>
                        <span class="i18" key="Sair">${i18next.t("Sair")}</span>
                    </a>
                </div>
            </div>
        `
        
        document.body.appendChild(offcanvasUser)
        document.querySelectorAll('.deslogar-usuario').forEach(el => el.addEventListener('click', async () => {
            loader.show()
            const configLogout = configuracaoFetch('DELETE', null, false, false)
            await executarFetch('auth', configLogout)
            loader.hide()
            localStorage.setItem('autenticado', false)
            localStorage.removeItem('user-info')
            window.location.assign('/index.html')
        }))
        
        document.dispatchEvent(new Event('header-carregado', { bubbles: true }))
    }

    possuiCampeonato(campeonatoId) {
        if (campeonatoId) {
            // TODO: remover essa limitação e adicionar pagina para listar campeonatos do usuário
            return /* html */`
            <a href="/pages/configuracao-campeonato.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                <i class="bi bi-calendar-plus fs-4"></i>
                <span class="i18" key="ConfigurarCampeonato">${i18next.t("ConfigurarCampeonato")}</span>
            </a>
            `
        }
        
        return /*html */ `
        <a href="/pages/cadastro-campeonatos.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
            <i class="bi bi-calendar-plus fs-4"></i>
            <span class="i18" key="Campeonato">${i18next.t("Campeonato")}</span>
        </a>`
    }
}

window.customElements.define('componente-header', header);