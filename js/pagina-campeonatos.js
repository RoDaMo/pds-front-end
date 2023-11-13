import '../scss/pagina-campeonatos.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-campeonatos.json' assert { type: 'JSON' }
import i18next from "i18next";
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import Lenis from '@studio-freight/lenis'
import * as bootstrap from 'bootstrap'

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
const sessionUserInfo = JSON.parse(localStorage.getItem('user-info'))

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')

const ssTeamName = document.querySelectorAll('.ss-team-name')

const championshipSport = document.getElementById('championshipSport')
const championshipSportIcon = document.getElementById('championshipSportIcon')

const teamsSportIcon = document.querySelectorAll('.teams-sport-icon')

const botaoCampeonatoEditar = document.getElementById('botao-campeonato-editar')

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
    const ssTeamName = document.querySelectorAll('.ss-team-name')


    ssTeamContent.forEach(content => {
        if (ssTeamContent.length > 1) {
            content.classList.replace('w-100', 'w-75')
        } else {
            content.classList.replace('w-100', 'w-87')
        }
        
        content.classList.add('mx-2')
    })
        
    ssTeamName.forEach(name => {
        name.parentElement.classList.replace('align-items-center', 'align-items-start')
        name.parentElement.classList.add('w-75')
        name.classList.replace('w-100', 'w-75')
    })

    if (ssTeamContent.length == 0) {
        ssFirstContent.classList.add('justify-content-center', 'align-items-center')
        ssFirstContent.innerHTML = `
            <div class="p-md-5">
                <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
            </div>
        `
    }
}

const isChampionshipOwner = (urlId, userChampionshipId) => {
    if (urlId == userChampionshipId) {
        return true
    } else {
        return false
    }
}

const bracketExists = async championshipId => {
    const configFetch = configuracaoFetch('GET')

    const callbackStatus = (data) => {
        notificacaoErro(data.results)
    }

    loader.show()
        const response = await executarFetch(`bracketing/exists/${championshipId}`, configFetch, callbackStatus)
    loader.hide()

    if (response.succeed) {
        return true
    } else {
        return false
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
          keySport = data.results.sportsId == 1 ? "Futebol" : "Volei"

    sport.textContent = i18next.t(keySport)
    sport.setAttribute('key', keySport)

    const status = document.getElementById("championshipStatus"),
            keyStatus = (data.results.status == 0) ? "Active" 
                : (data.results.status == 1) ? "Finished"
                : (data.results.status == 2) ? "Inactive"
                : (data.results.status == 3) ? "Pending"
                : ''

    status.textContent = i18next.t(keyStatus)
    status.setAttribute('key', keyStatus)


    let iconSrc = (data.results.sportsId === 1) ? '../icons/sports_soccer.svg' : '../icons/sports_volleyball.svg'
    championshipChar.insertAdjacentHTML("afterbegin", '<img id="championshipSportIcon" src="'+ iconSrc +'" alt="sport-icon" class="sports-icon me-1">')

    document.getElementById("championship-pic").src = !data.results.logo ? '../default-championship-image.png' : data.results.logo
    document.getElementById("championship-desc").textContent = data.results.description
    document.getElementById("data-inicial").textContent = new Date(data.results.initialDate).toLocaleDateString('pt-BR')
    document.getElementById("data-final").textContent = new Date(data.results.finalDate).toLocaleDateString('pt-BR')
    document.getElementById("name").textContent = data.results.name

    if(data.results.rules){
        document.getElementById("conteudo").insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-center">
                <button class="btn download-btn my-1 rounded-pill w-auto pure-primary-bg fw-semibold card-bg" id="botao-baixar-regulamento">
                    <a href="${data.results.rules}" id="regulamento" class="text-center fs-6 i18 text-decoration-none inverted-text-color" key="BaixarRegulamento">${i18next.t("BaixarRegulamento")}</a>
                </button>
            </div>
        `)
    }

    if(bracketExists(id)) {
        document.getElementById("conteudo").insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-center">
                <button class="btn championship-options-btn my-1 pure-primary-bg rounded-pill fw-semibold card-bg" id="botao-link-bracket">
                    <a href="/pages/tabela-chaveamento.html?id=${id}" id="link-bracket" class="text-center fs-6 i18 text-decoration-none inverted-text-color" key="Bracket">${i18next.t("Bracket")}</a>
                </button>
            </div>
        `)
    }

    const times = document.getElementById("times")
    data.results.teams.forEach((e) => {
        times.innerHTML += `
            <div class="d-flex w-100 rounded-5 mb-3 mt-5 mt-md-0 lvl2-primary-bg ss-team-content">
                <span class="d-none team-id">${e.id}</span>
                <div class="position-relative m-3 overflow-hidden rounded-circle ss-team-logo">
                    <img src=${e.emblem} alt="teamCrest" class="img-fluid position-absolute mw-100 h-100">
                </div>

                <span class="d-flex flex-column justify-content-center align-items-center">

                    <p class="mb-0 ss-team-name fs-5 text-nowrap text-truncate d-block">${e.name}</p>

                </span>
                
            </div>
        `

        const ssTeamContent = document.querySelectorAll('.ss-team-content')
        ssTeamContent.forEach(content => {
            content.addEventListener('click', () => {
                const teamId = content.querySelector('.team-id').textContent
                window.location.href = `pagina-times.html?id=${teamId}`
            })
        })

    })

    if(isChampionshipOwner(id, sessionUserInfo?.championshipId)) {
        botaoCampeonatoEditar.classList.remove('d-none')
    }
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
                <div class="p-md-5">
                    <span class="i18" key="NenhumTime">${i18next.t("NenhumTime")}</span>
                </div>
            `
        }
    }

    window.dispatchEvent(new Event('pagina-load'))
}

validacaoTimes()


const confirmarDenuncia = /* html */`
    <div class="modal fade" id="ConfirmarDenuncia" tabindex="-1" aria-labelledby="ConfirmarDenunciaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title i18" key="Descricao" id="descricaoModalLabel">Descrição da Denúncia</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="descricao" key="DescricaoDenuncia" class="col-form-label i18">Descreva a denúncia:</label>
                            <textarea id="DescricaoDenuncia"  class="form-control" ></textarea>
                            <select id="tipos-denuncia" class="form-select mt-2">
                                <option class="i18" key="TipoViolacao" value="" selected>Tipo de Violação</option>
                                <option class="i18" key="Inapropriado" value="0">Conteúdo Inapropriado</option>
                                <option class="i18" key="Spam" value="1">Spam</option>  
                                <option class="i18" key="Scam" value="2">Scam</option>  
                                <option class="i18" key="Odio" value="3">Discurso de Ódio</option>  
                                <option class="i18" key="Desinformacao" value="4">Desinformação</option>
                                <option class="i18" key="Legais" value="5">Problemas Legais</option>  
                                <option class="i18" key="Assedio" value="6">Ássedio</option>  
                                <option class="i18" key="Outro" value="7">Outro</option>  
                                <option class="i18" key="TodosTipos" value="8">Todos</option>  
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary i18" key="Cancelar" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="SalvarDenuncia" key="Salvar"  class="btn btn-primary i18">Salvar</button>
                </div>
            </div>
        </div>
    </div>
`

document.addEventListener('header-carregado', async() => {
    document.body.insertAdjacentHTML('beforeend', confirmarDenuncia)

    const modalDenuncia = document.getElementById('ConfirmarDenuncia')
    let modalDenunciaBT = new bootstrap.Modal(modalDenuncia, {keyboard: false})
    
    const botaoDenunciar = document.getElementById("denunciar");
    const id = parametroUrl.get('id')

    const verificarSeJaDenunciou = async() => {
        loader.show();
        const configFetch = configuracaoFetch('GET')

        const res = await executarFetch(`reports/verify?id=${id}`, configFetch); 
        loader.hide();

        console.log(res)

        if(res.results){
            botaoDenunciar.disabled = true
            botaoDenunciar.textContent = i18next.t('JaDenunciou')
            botaoDenunciar.setAttribute('key', 'JaDenunciou')
        }

    }

    const aparecerBotaoExcluir = () => {
        if(sessionUserInfo.role === 'admin'){
            document.getElementById("excluir-campeonato-admin").classList.remove('d-none')
        }
    }

    verificarSeJaDenunciou()
    aparecerBotaoExcluir()

    botaoDenunciar.addEventListener('click', () => {
        modalDenunciaBT.show()
    })

    document.getElementById("excluir-campeonato-admin").addEventListener('click', async() => {
        loader.show()
        const data = await executarFetch(`moderation/championships/${id}`, configuracaoFetch("DELETE"))
        loader.hide()
        if(data.succeed){
            notificacaoSucesso('Campeonato excluído')
            setTimeout(() => {
                window.location.href = `/`
            }, 2000);
        }
    })

    document.getElementById("SalvarDenuncia").addEventListener('click', async () => {
        loader.show();
        const configFetch = configuracaoFetch('POST', {
            "AuthorId": sessionUserInfo.id,
            "ReportedType": 0,
            "ReportedChampionshipId": id,
            "Description": document.getElementById("DescricaoDenuncia").value ? document.getElementById("DescricaoDenuncia").value : "Sem Descrição",
            "Violation": document.getElementById("tipos-denuncia").value ? parseInt(document.getElementById("tipos-denuncia").value) : 7
        })

        const res = await executarFetch(`reports`, configFetch); 
        loader.hide();

        if(res.succeed){
            modalDenunciaBT.hide()
            document.getElementById("DescricaoDenuncia").value = ""
            notificacaoSucesso(i18next.t("Denunciado"))
            verificarSeJaDenunciou()
        }

    })
})