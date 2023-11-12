import '../scss/pagina-times.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-times.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-times.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import * as bootstrap from 'bootstrap'

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const mediaQueryTablet = window.matchMedia('(max-width: 992px)')
const sessionUserInfo = JSON.parse(localStorage.getItem('user-info'))

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')

const champStuff = document.querySelector('#champstuff')

const ssSecondContentWrapper = document.querySelector('.ss-second-content-wrapper')
const ssSecondContent = document.querySelector('.ss-second-content')

const ssThirdContentWrapper = document.querySelector('.ss-third-content-wrapper')
const ssThirdContent = document.querySelector('.ss-third-content')

const ssPlayerName = document.querySelectorAll('.ss-player-name')

const teamSport = document.getElementById('teamSport')
const teamSportIcon = document.getElementById('teamSportIcon')
const conteudoInicial = document.querySelector('#conteudo')

const botaoTimeEditar = document.getElementById('botao-time-editar')

const teamInfo = document.querySelector('.team-info')
const teamDesc = document.querySelector('.team-desc')
const teamPicWrapper = document.querySelector('.team-pic-wrapper')
const teamName = document.querySelector('.team-name')
// const teamConfigBtn = document.querySelector('.team-config-btn')
const teamChars = document.querySelector('.team-chars'),
        teamChar = document.querySelector('.team-char')
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
    
    // const offcanvasNavbar = document.getElementById("offcanvasNavbar")
    // const offcanvasUser = document.getElementById("offcanvasUser")
    
    // offcanvasNavbar.addEventListener("show.bs.offcanvas", callback)
    // offcanvasUser.addEventListener("show.bs.offcanvas", callback)
    // offcanvasNavbar.addEventListener("hidden.bs.offcanvas", callback)
    // offcanvasUser.addEventListener("hidden.bs.offcanvas", callback)
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

    let iconSrc = (data.results.sportsId === 1) ? '../icons/sports_soccer.svg' : '../icons/sports_volleyball.svg'
    teamChar.insertAdjacentHTML("afterbegin", '<img id="teamSportIcon" src="'+ iconSrc +'" alt="sport-icon" class="sports-icon me-1">')

    document.getElementById("team-pic").src = !data.results.emblem ? '../default-team-image.png' : data.results.emblem
    document.getElementById("team-desc").textContent = data.results.description
    document.getElementById("name").textContent = data.results.name

    const coach = data.results.technician

    // Técnico do time
    console.log(coach)
    if (coach.name != null || coach.name != undefined) {
        conteudoInicial.insertAdjacentHTML("beforeend", `
            <div id="coach-board-wrapper" class="d-flex">
                <a href="/pages/pagina-usuarios.html?id=${coach.id}" class="row coach-board lvl1-primary-bg flex-row align-content-center px-3 p-2 text-decoration-none">

                    <div class="col-auto p-0 d-flex justify-content-center align-items-center">
                        <div class="position-relative overflow-hidden rounded-circle ss-player-image">
                            <img src="${coach.picture}" alt="coachImage" class="img-fluid position-absolute mw-100 h-100">
                        </div>
                    </div>

                    <div class="col row justify-content-center flex-column">
                        <div class="col-auto">
                            <span class="ss-player-name fs-5 text-nowrap text-truncate mb-1 mb-md-0 d-block">${coach.name}</span>
                        </div>

                        <div class="col-auto d-flex coach-badge align-items-center w-auto">
                            <span class="i18 coach-badge-text lvl0-color p-1 px-2 w-auto text-opacity-75" key="Tecnico">${i18next.t("Tecnico")}</span>
                        </div>
                    </div>
                </a>
            </div>
        `)
    }

    // Jogadores do time
    const jogadores = document.getElementById("jogadores")
    const jogadoresVinculados = await executarFetch(`teams/${id}/players`, configuracaoFetch("GET"))
    const campeonatosVinculados = await executarFetch(`teams/championship/${id}`, configuracaoFetch("GET"))
    jogadoresVinculados.results.forEach((e) => {
        switch (e.playerPosition) {
            case 1:
                e.playerPos = `<span class="i18" key="Goleiro">${i18next.t("Goleiro")}</span>`
                break;
            case 2:
                e.playerPos = `<span class="i18" key="Zagueiro">${i18next.t("Zagueiro")}</span>`
                break;
            case 3:
                e.playerPos = `<span class="i18" key="Lateral">${i18next.t("Lateral")}</span>`
                break;
            case 4:
                e.playerPos = `<span class="i18" key="Volante">${i18next.t("Volante")}</span>`
                break;
            case 5:
                e.playerPos = `<span class="i18" key="MeioCampista">${i18next.t("MeioCampista")}</span>`
                break;
            case 6:
                e.playerPos = `<span class="i18" key="MeiaAtacante">${i18next.t("MeiaAtacante")}</span>`
                break;
            case 7:
                e.playerPos = `<span class="i18" key="Ala">${i18next.t("Ala")}</span>`
                break;
            case 8:
                e.playerPos = `<span class="i18" key="Ponta">${i18next.t("Ponta")}</span>`
                break;
            case 9:
                e.playerPos = `<span class="i18" key="Centroavante">${i18next.t("Centroavante")}</span>`
                break;
            case 10:
                e.playerPos = `<span class="i18" key="Levantador">${i18next.t("Levantador")}</span>`
                break;
            case 11:
                e.playerPos = `<span class="i18" key="Central">${i18next.t("Central")}</span>`
                break;
            case 12:
                e.playerPos = `<span class="i18" key="Libero">${i18next.t("Libero")}</span>`
                break;
            case 13:
                e.playerPos = `<span class="i18" key="Ponteiro">${i18next.t("Ponteiro")}</span>`
                break;
            case 14:
                e.playerPos = `<span class="i18" key="Oposto">${i18next.t("Oposto")}</span>`
                break;
            default:
                e.playerPos = `<span class="i18" key="SemPosicao">${i18next.t("SemPosicao")}</span>`
                break;
        }

        // mostrar icone de capitao se for capitao

        jogadores.innerHTML += `
            <div class="d-flex w-100 rounded-5 mb-3 p-2 mt-5 mt-md-0 lvl2-primary-bg ss-player-content">
                 <span class="d-none player-id">${e.id}</span>

                <section class="position-relative border border-2 m-3 overflow-hidden rounded-circle ss-player-image">
                    <img src="${e.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
                </section>

                <span class="d-flex flex-column justify-content-center align-items-start">

                    <p class="ss-player-name fs-5 text-nowrap text-truncate d-block">${e.name}</p>
                    <p class="mb-0 ss-player-username fs-6 opacity-75 text-nowrap text-truncate d-block">${e.artisticName}</p>

                    <section class="ss-player-data row justify-content-center align-items-center flex-row mt-1 mx-md-auto ms-md-0">
						<p class="col-auto w-auto ss-player-data-number lvl0-color px-2 py-1 mb-0 text-opacity-75">${e.number}</p>
						<i class="col-auto col-md-auto bi bi-dot p-0 mx-auto"></i>
						<p class="col col-md-auto w-auto ss-player-data-position px-2 py-1 mb-0 lvl0-color text-opacity-75">${e.playerPos}</p>
					</section>

                </span>
            </div>
        `

        const ssPlayerContent = document.querySelectorAll('.ss-player-content')
        ssPlayerContent.forEach(content => {
            content.addEventListener('click', () => {
                const playerId = content.querySelector('.player-id').textContent
                window.location.href = `pagina-usuarios.html?id=${playerId}`
            })
        })
    })

    // Uniformes do time
    const uniformeHome = document.getElementById("uniforme-home")
    const uniformeAway = document.getElementById("uniforme-away")

    uniformeHome.firstElementChild.src = data.results.uniformHome
    uniformeAway.firstElementChild.src = data.results.uniformAway
                

    // Campeonatos do time
    campeonatosVinculados.results.forEach(e => {
        champStuff.innerHTML += /*html*/`
            <div class="col w-auto">
                <a href="/pages/pagina-campeonatos.html?id=${e.id}" class="text-decoration-none">
                    <div class="rounded-5 ss-championship-content lvl2-primary-bg d-flex flex-column w-auto h-auto m-auto p-2">
                        <div class="ss-championship-img-wrapper position-relative rounded-circle overflow-hidden m-auto mt-3">
                            <img class="img-fluid position-absolute mw-100 h-100" src="${e.logo}" alt="ChampLogo">
                        </div>
                        <p class="text-center mt-2 mb-3 fs-5 text-nowrap text-truncate d-inline-block m-auto ss-championship-texts">${e.name}</p>
                    </div>  
                </a>
            </div>
        `
    })  

    

    if(isTeamOwner(id, sessionUserInfo?.teamManagementId)) {
        botaoTimeEditar.classList.remove('d-none')
    }
}

const isTeamOwner = (urlId, userTeamId) => {
    if (urlId == userTeamId) {
        return true
    } else {
        return false
    }
}

async function waitInfo() {
    const jogadores = document.getElementById("jogadores")
    const champStuff = document.getElementById("champstuff")
    const ssPlayerContent = document.querySelectorAll('.ss-player-content')
    const ssChampionshipContent = document.querySelectorAll('.ss-championship-content')
    await obterInfo()

    if (mediaQueryMobile.matches) {
        ssPlayerContentMobile()
    }

    if (!jogadores.hasChildNodes()) {
        ssFirstContent.classList.add('justify-content-center', 'align-items-center')
        ssFirstContent.removeAttribute('data-lenis-prevent')
        ssFirstContent.innerHTML = `
            <div class="p-md-5">
                <span class="i18" key="NenhumJogador">${i18next.t("NenhumJogador")}</span>
            </div>
        `
    }

    if (!champStuff.hasChildNodes()) {
        ssThirdContent.classList.add('justify-content-center', 'align-items-center')
        ssThirdContent.removeAttribute('data-lenis-prevent')
        ssThirdContent.innerHTML = `
            <div class="p-md-5">
                <span class="i18" key="NenhumCampeonato">${i18next.t("NenhumCampeonato")}</span>
            </div>
        `
    }

    window.dispatchEvent(new Event('pagina-load'))
}

waitInfo()


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
                            <select id="tipos-denuncia" class="form-select">
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
            document.getElementById("excluir-time-admin").classList.remove('d-none')
        }
    }
    if (!mediaQueryMobile.matches) {
        setTimeout(() => {
            const ssSecondContentHeight = ssSecondContent.offsetHeight
            ssThirdContent.style.height = `${ssSecondContentHeight}px`
        }, 2000)
    }

    verificarSeJaDenunciou()
    aparecerBotaoExcluir()

    botaoDenunciar.addEventListener('click', () => {
        modalDenunciaBT.show()
    })

    document.getElementById("excluir-time-admin").addEventListener('click', async() => {
        loader.show()
        const data = await executarFetch(`moderation/teams/${id}`, configuracaoFetch("DELETE"))
        loader.hide()
        if(data.succeed){
            notificacaoSucesso('Time excluído')
            setTimeout(() => {
                window.location.href = `/`
            }, 2000);
        }
    })

    document.getElementById("SalvarDenuncia").addEventListener('click', async () => {
        loader.show();
        const configFetch = configuracaoFetch('POST', {
            "AuthorId": sessionUserInfo.id,
            "ReportType": 1,
            "ReportedTeamId": parseInt(id),
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
