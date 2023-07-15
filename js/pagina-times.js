import '../scss/pagina-times.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-times.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-times.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

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

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const mediaQueryTablet = window.matchMedia('(max-width: 992px)')

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')

const splideList = document.querySelector('.splide__list')

const ssSecondContentWrapper = document.querySelector('.ss-second-content-wrapper')
const ssSecondContent = document.querySelector('.ss-second-content')

const ssThirdContentWrapper = document.querySelector('.ss-third-content-wrapper')
const ssThirdContent = document.querySelector('.ss-third-content')

const ssPlayerName = document.querySelectorAll('.ss-player-name')

const teamSport = document.getElementById('teamSport')
const teamSportIcon = document.getElementById('teamSportIcon')

const teamInfo = document.querySelector('.team-info')
const teamDesc = document.querySelector('.team-desc')
const teamPicWrapper = document.querySelector('.team-pic-wrapper')
const teamName = document.querySelector('.team-name')
// const teamConfigBtn = document.querySelector('.team-config-btn')
const teamChars = document.querySelector('.team-chars'),
        teamChar = document.querySelectorAll('.team-char')
const teamPic = document.querySelector('#team-pic')
        // botaoEditar = document.getElementById('botao-time-editar')


function ssPlayerContentMobile() {
    const ssPlayerContent = document.querySelectorAll('.ss-player-content')

    ssPlayerContent.forEach(content => {
        if (ssPlayerContent.length > 1) {
            content.classList.replace('w-100', 'w-75')
        } else {
            content.classList.replace('w-100', 'w-87')
        }
        
        content.classList.add('mx-2')
    })

    ssPlayerName.forEach(name => {
        name.parentElement.classList.add('w-50')
    })
}

document.addEventListener('header-carregado', () => {
    if (teamPic.getAttribute('src') == '') {
        teamPic.setAttribute('src', '../default-team-image.png')
    }

    if (teamDesc.innerText == '') {
        teamDesc.innerHTML = `<span id="team-bio" class="i18" key="SemDescricao">${i18next.t("SemDescricao")}</span>`
    }

    if (teamName.innerText == '') {
        teamName.innerText = 'Name'
    }

    ssSlider.classList.add('z-9999')
    const callback = () => ssSlider.classList.toggle('z-9999')
    
    const offcanvasNavbar = document.getElementById("offcanvasNavbar")
    const offcanvasUser = document.getElementById("offcanvasUser")
    
    offcanvasNavbar.addEventListener("show.bs.offcanvas", callback)
    offcanvasUser.addEventListener("show.bs.offcanvas", callback)
    offcanvasNavbar.addEventListener("hidden.bs.offcanvas", callback)
    offcanvasUser.addEventListener("hidden.bs.offcanvas", callback)
})

if (mediaQueryMobile.matches) {

    ssSlider.classList.replace('w-100', 'vw-100')
    sportsSection.classList.remove('ms-4')

    teamInfo.firstElementChild.classList.add('d-flex', 'justify-content-center')
    teamInfo.firstElementChild.classList.remove("ms-3")
    teamDesc.classList.add('text-center')
    teamChars.classList.replace("mt-6r", "mt-5")
    teamChars.classList.add('justify-content-center')
    teamPicWrapper.parentElement.classList.remove("me-4")
    teamPicWrapper.classList.remove("me-0")
    teamName.parentElement.classList.remove("me-4")
    teamName.classList.replace("text-end", "text-center")
    // teamConfigBtn.parentElement.classList.remove("me-3")
    // teamConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")
}

const mensagemErro = document.getElementById("mensagem-erro")
const parametroUrl = new URLSearchParams(window.location.search);
const obterInfo = async () => {
    const id = parametroUrl.get('id')
    console.log(id)

    const config = configuracaoFetch("GET")
    
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }
    
    loader.show()
    const data = await executarFetch(`teams/${id}`, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    loader.hide()
    
    const sport = document.getElementById("teamSport"),
          key = data.results.sportsId == 1 ? "Futebol" : "Volei"

    sport.textContent = i18next.t(key)
    sport.setAttribute('key', key)

    document.getElementById("team-pic").src = !data.results.emblem ? '../default-team-image.png' : data.results.emblem
    document.getElementById("team-desc").textContent = data.results.description
    document.getElementById("name").textContent = data.results.name

    // Jogadores do time
    const jogadores = document.getElementById("jogadores")
    data.results.players.forEach((e) => {
        jogadores.innerHTML += `
            <div class="d-flex w-100 rounded-5 mb-3 mt-5 mt-md-0 ss-player-content">

                <div class="position-relative m-3 overflow-hidden rounded-circle ss-player-image">
                    <img src="" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
                </div>

                <span>

                    <p class="mt-3 ss-player-name w-100 fs-5 text-nowrap text-truncate d-block">${e.name}</p>
                    <p class="ss-player-username w-100 fs-6 opacity-75 text-nowrap text-truncate d-block">${e.username}</p>

                </span>
            </div>
        `
    })

    // Camisetas do time
    data.results.shirts.forEach(e => {
        splideList.innerHTML += `
            <li class="splide__slide">
                <img class="img-fluid rounded-4 jerseys-img" src="${e.shirtURL}" alt="C1">
            </li>
        `
    })

    // Ícone de esporte do time
    if (data.results.sportsId == 1) {
        teamSportIcon.src = '../icons/sports_soccer.svg'

    } else {
        teamSportIcon.src = '../icons/sports_volleyball.svg'

    }    
}

// obterInfo()

async function waitInfo() {
    const ssPlayerContent = document.querySelectorAll('.ss-player-content')
    const ssChampionshipContent = document.querySelectorAll('.ss-championship-content')
    // await obterInfo()

    if (mediaQueryMobile.matches) {
        ssPlayerContentMobile()
    }

    if (ssPlayerContent.length == 0) {
        ssFirstContent.classList.add('justify-content-center', 'align-items-center')
        ssFirstContent.removeAttribute('data-lenis-prevent')
        ssFirstContent.innerHTML = `
            <div class="p-5">
                <span class="i18" key="NenhumJogador">${i18next.t("NenhumJogador")}</span>
            </div>
        `
    }

    if (ssChampionshipContent.length == 0) {
        ssThirdContent.classList.add('justify-content-center', 'align-items-center')
        ssThirdContent.removeAttribute('data-lenis-prevent')
        ssThirdContent.innerHTML = `
            <div class="p-5">
                <span class="i18" key="NenhumCampeonato">${i18next.t("NenhumCampeonato")}</span>
            </div>
        `
    }

    const splide = new Splide( '#image-carousel', {
        type: 'loop',
        padding: { left: '10rem', right: '8rem' },
        perPage: 1,
        lazyLoad: 'nearby',
        breakpoints: {
            1199: {
                padding: { left: '9.5rem', right: '8.3rem' },
            },
            575: {
                padding: { left: '5rem', right: '4rem' },
            },

        },
    })

    splide.mount()

    document.querySelector('.splide__arrows').classList.add('d-none')

}

waitInfo()



