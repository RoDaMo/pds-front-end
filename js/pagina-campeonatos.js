import '../scss/pagina-campeonatos.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-campeonatos.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import Lenis from '@studio-freight/lenis'

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

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')

const ssTeamName = document.querySelectorAll('.ss-team-name')

const championshipSport = document.getElementById('championshipSport')
const championshipSportIcon = document.getElementById('championshipSportIcon')

const teamsSportIcon = document.querySelectorAll('.teams-sport-icon')

const championshipInfo = document.querySelector('.championship-info')
const championshipDesc = document.querySelector('.championship-desc')
const championshipPicWrapper = document.querySelector('.championship-pic-wrapper')
const championshipName = document.querySelector('.championship-name')
// const championshipConfigBtn = document.querySelector('.championship-config-btn')
const championshipChars = document.querySelector('.championship-chars'),
        championshipChar = document.querySelector('.championship-char')
const championshipPic = document.querySelector('#championship-pic')
        // botaoEditar = document.getElementById('botao-campeonato-editar')


function ssTeamContentMobile() {
    const ssTeamContent = document.querySelectorAll('.ss-team-content')

    ssTeamContent.forEach(content => {
        if (ssTeamContent.length > 1) {
            content.classList.replace('w-100', 'w-75')
        } else {
            content.classList.replace('w-100', 'w-87')
        }
        
        content.classList.add('mx-2')
    })
        
    ssTeamName.forEach(name => {
        name.parentElement.classList.add('w-50')
    })

    if (ssTeamContent.length == 0) {
        ssFirstContent.classList.add('justify-content-center', 'align-items-center')
        ssFirstContent.innerHTML = `
            <div class="p-5">
                <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
            </div>
        `
    }
}

document.addEventListener('header-carregado', () => {
    if (championshipPic.getAttribute('src') == '') {
        championshipPic.setAttribute('src', '../default-championship-image.png')
    }

    if (championshipDesc.innerText == '') {
        championshipDesc.innerHTML = `<span id="camp-bio" class="i18" key="SemDescricao">${i18next.t("SemDescricao")}</span>`
    }

    if (championshipName.innerText == '') {
        championshipName.innerText = 'Name'
    }

    // ssSlider.classList.add('z-9999')
    // const callback = () => ssSlider.classList.toggle('z-9999')
    
    // const offcanvasNavbar = document.getElementById("offcanvasNavbar")
    // const offcanvasUser = document.getElementById("offcanvasUser")
    
    // offcanvasNavbar.addEventListener("show.bs.offcanvas", callback)
    // offcanvasUser.addEventListener("show.bs.offcanvas", callback)
    // offcanvasNavbar.addEventListener("hidden.bs.offcanvas", callback)
    // offcanvasUser.addEventListener("hidden.bs.offcanvas", callback)
})

if (mediaQueryMobile.matches) {
    ssFirstContentWrapper.classList.replace('w-90', 'w-100')

    ssSlider.classList.replace('w-100', 'vw-100')
    sportsSection.classList.remove('ms-4')

    teamsSportIcon.forEach(icon => {
        icon.classList.remove('me-3')
    })

    championshipInfo.firstElementChild.classList.add('d-flex', 'justify-content-center')
    championshipInfo.firstElementChild.classList.remove("ms-3")
    championshipDesc.classList.add('text-center')
    championshipChars.classList.replace("mt-6r", "mt-5")
    championshipChars.classList.add('justify-content-center')
    championshipPicWrapper.parentElement.classList.remove("me-4")
    championshipPicWrapper.classList.remove("me-0")
    championshipName.parentElement.classList.remove("me-4")
    championshipName.classList.replace("text-end", "text-center")
    // championshipConfigBtn.parentElement.classList.remove("me-3")
    // championshipConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")
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
    const data = await executarFetch(`championships/${id}`, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    loader.hide()
    
    const sport = document.getElementById("championshipSport"),
          key = data.results.sportsId == 1 ? "Futebol" : "Volei"

    sport.textContent = i18next.t(key)
    sport.setAttribute('key', key)

    let iconSrc = (data.results.sportsId === 1) ? '../icons/sports_soccer.svg' : '../icons/sports_volleyball.svg'
    // championshipChar.insertAdjacentHTML("afterbegin", 'championshipSportIcon" src="'+ iconSrc +'" alt="sport-icon" class="sports-icon me-1">')

    document.getElementById("championship-pic").src = !data.results.logo ? '../default-championship-image.png' : data.results.logo
    document.getElementById("championship-desc").textContent = data.results.description
    document.getElementById("data-inicial").textContent = new Date(data.results.initialDate).toLocaleDateString('pt-BR')
    document.getElementById("data-final").textContent = new Date(data.results.finalDate).toLocaleDateString('pt-BR')
    document.getElementById("name").textContent = data.results.name

    if(data.results.rules){
        document.getElementById("conteudo").innerHTML += `
            <button class="btn download-btn rounded-pill fw-semibold card-bg" id="botao-baixar-regulamento">
                <a href="${data.results.rules}" id="regulamento" class="text-center fs-6 i18 text-decoration-none" key="BaixarRegulamento">Baixar Regulamento</a>
            </button>
        `
    }

    const times = document.getElementById("times")
    data.results.teams.forEach((e) => {
        times.innerHTML += `
            <div class="d-flex w-100 rounded-5 mb-3 mt-5 mt-md-0 ss-team-content">
                <span class="d-none team-id">${e.id}</span>
                <div class="position-relative m-3 overflow-hidden rounded-circle ss-team-logo">
                    <img src=${e.emblem} alt="teamCrest" class="img-fluid position-absolute mw-100 h-100">
                </div>

                <span>

                    <p class="mt-3 ss-team-name w-100 fs-5 text-nowrap text-truncate d-block">${e.name}</p>

                </span>
                <span class="d-flex justify-content-end ms-auto sports-icon-wrapper">
                    <img src="${iconSrc}" alt="sport-icon" class="sports-icon teams-sport-icon mt-3 me-3">
                </span>
            </div>
        `

        // Ao clicar em cada time da lista, redireciona para a página desse time
        const ssTeamContent = document.querySelectorAll('.ss-team-content')
        ssTeamContent.forEach(content => {
            content.addEventListener('click', () => {
                const teamId = content.querySelector('.team-id').textContent
                window.location.href = `pagina-times.html?id=${teamId}`
            })
        })

    })

    
        
}

async function validacaoTimes() {
    await obterInfo()

    if (mediaQueryMobile.matches) {
        ssTeamContentMobile()
    } else {
        const ssTeamContent = document.querySelectorAll('.ss-team-content')

        if (ssTeamContent.length == 0) {
            ssFirstContent.classList.add('justify-content-center', 'align-items-center')
            ssFirstContent.innerHTML = `
                <div class="p-5">
                    <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
                </div>
            `
        }
    }
}

validacaoTimes()