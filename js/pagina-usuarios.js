import '../scss/pagina-usuarios.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-usuarios.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-usuarios.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

// incluir lenis.js

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')
const ssTeamContent = document.querySelectorAll('.ss-team-content')
const ssTeamName = document.querySelectorAll('.ss-team-name')

const userInfo = document.querySelector('.user-info')
const userBio = document.querySelector('.user-bio')
const userPicWrapper = document.querySelector('.user-pic-wrapper')
const userRealName = document.querySelector('.user-realname')
const userName = document.querySelector('.user-name')
const userConfigBtn = document.querySelector('.user-config-btn')
const userCurrentTeam = document.querySelector('.user-current-team')
const userPic = document.querySelector('#user-pic'),
      botaoEditar = document.getElementById('botao-perfil-editar')

let currentUserId = document.getElementById('usernameUserId')

window.onload = () => {
    if (userPic.getAttribute('src') == '') {
        userPic.setAttribute('src', '../default-user-image.png')
    }

    if (userBio.innerText == '') {
        userBio.innerHTML = `<span class="i18" key="SemDescricao">${i18next.t("SemDescricao")}</span>`
    }

    if (userRealName.innerText == '') {
        userRealName.innerText = 'Name'
    }

    if (userName.innerText == '') {
        userName.innerText = 'User name'
    }

    if (mediaQueryMobile.matches) {
        document.addEventListener('DOMContentLoaded', () => {
            if (ssTeamContent.length == 0) {
                ssFirstContent.classList.add('justify-content-center', 'align-items-center')
                ssFirstContent.innerHTML = `
                    <div>
                        <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
                    </div>
                `

                userCurrentTeam.classList.add('d-none')
            }
        })

        userInfo.firstElementChild.classList.remove("ms-3")
        userCurrentTeam.classList.replace("mt-6r", "mt-5")
        userPicWrapper.parentElement.classList.remove("me-4")
        userPicWrapper.classList.remove("me-0")
        userRealName.parentElement.classList.remove("me-4")
        userRealName.classList.replace("text-end", "text-center")
        userName.classList.replace("text-end", "text-center")
        userConfigBtn.parentElement.classList.remove("me-3")
        userConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")

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
    }
    if (mediaQueryMobile.matches) {
        document.addEventListener('DOMContentLoaded', () => {
            if (ssTeamContent.length == 0) {
                ssFirstContent.classList.add('justify-content-center', 'align-items-center')
                ssFirstContent.innerHTML = `
                    <div>
                        <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
                    </div>
                `
    
                userCurrentTeam.classList.add('d-none')
            }
        })
    
        userInfo.firstElementChild.classList.remove("ms-3")
        userCurrentTeam.classList.replace("mt-6r", "mt-5")
        userPicWrapper.parentElement.classList.remove("me-4")
        userPicWrapper.classList.remove("me-0")
        userRealName.parentElement.classList.remove("me-4")
        userRealName.classList.replace("text-end", "text-center")
        userName.classList.replace("text-end", "text-center")
        userConfigBtn.parentElement.classList.remove("me-3")
        userConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")
    
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
    }
}


const mensagemErro = document.getElementById("mensagem-erro")
const parametroUrl = new URLSearchParams(window.location.search);
const obterInfo = async () => {
    const id = parametroUrl.get('id')

    if (!currentUserId) {
        await new Promise(r => setTimeout(r, 200))
		currentUserId = document.getElementById('usernameUserId')
    }
    console.log(currentUserId && id == currentUserId.textContent, currentUserId.textContent, id)
    if (currentUserId && id == currentUserId.textContent) {
        botaoEditar.classList.remove('d-none')
    }
    
    const config = configuracaoFetch("GET")
    
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }
    
    loader.show()
    const data = await executarFetch(`auth/${id}`, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    loader.hide()
    
    document.getElementById("user-pic").src = !data.results.picture ? '../default-user-image.png' : data.results.picture
    document.getElementById("user-bio").textContent = data.results.bio
    document.getElementById("user-name").textContent = data.results.username
    document.getElementById("name").textContent = data.results.name
}

obterInfo();

