import '../scss/pagina-campeonatos.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-campeonatos.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')
const ssTeamContent = document.querySelectorAll('.ss-team-content')
const ssTeamName = document.querySelectorAll('.ss-team-name')

// const championshipSport = document.getElementById('championshipSport')

const teamsSportIcon = document.querySelectorAll('.teams-sport-icon')

const championshipInfo = document.querySelector('.championship-info')
const championshipDesc = document.querySelector('.championship-desc')
const championshipPicWrapper = document.querySelector('.championship-pic-wrapper')
const championshipName = document.querySelector('.championship-name')
// const championshipConfigBtn = document.querySelector('.championship-config-btn')
const championshipChars = document.querySelector('.championship-chars'),
        championshipChar = document.querySelectorAll('.championship-char')
const championshipPic = document.querySelector('#championship-pic')
        // botaoEditar = document.getElementById('botao-campeonato-editar')


window.onload = () => {
    if (championshipPic.getAttribute('src') == '') {
        championshipPic.setAttribute('src', '../default-championship-image.png')
    }

    if (championshipDesc.innerText == '') {
        championshipDesc.innerHTML = `<span class="i18" key="SemDescricao">${i18next.t("SemDescricao")}</span>`
    }

    if (championshipName.innerText == '') {
        championshipName.innerText = 'Name'
    }

    if (ssTeamContent.length == 0) {
        ssFirstContent.classList.add('justify-content-center', 'align-items-center')
        ssFirstContent.innerHTML = `
            <div class="p-5">
                <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
            </div>
        `
    }

    if (mediaQueryMobile.matches) {
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

        ssSlider.classList.replace('w-100', 'vw-100')
        sportsSection.classList.remove('ms-4')
        ssFirstContentWrapper.classList.replace('w-90', 'w-100')
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

        document.addEventListener('DOMContentLoaded', () => {
            if (ssTeamContent.length == 0) {
                ssFirstContent.classList.add('justify-content-center', 'align-items-center')
                ssFirstContent.innerHTML = `
                    <div>
                        <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
                    </div>
                `
    
                championshipChars.classList.add('d-none')
            }
        })
    
        championshipInfo.firstElementChild.classList.remove("ms-3")
        championshipChars.classList.replace("mt-6r", "mt-5")
        championshipPicWrapper.parentElement.classList.remove("me-4")
        championshipPicWrapper.classList.remove("me-0")
        championshipName.parentElement.classList.remove("me-4")
        championshipName.classList.replace("text-end", "text-center")
        // championshipConfigBtn.parentElement.classList.remove("me-3")
        // championshipConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")
    
        ssSlider.classList.replace('w-100', 'vw-100')
        ssSlider.classList.add('z-9999')
        sportsSection.classList.remove('ms-4')
        ssFirstContentWrapper.classList.replace('w-90', 'w-100')
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
    }
}

