import '../scss/pagina-usuarios.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-usuarios.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-usuarios.json' assert { type: 'JSON' }
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import * as bootstrap from 'bootstrap'

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

// incluir lenis.js

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')

const sessionUserInfo = JSON.parse(localStorage.getItem('user-info'))

console.log(sessionUserInfo)

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')

const ssChampionshipName = document.querySelectorAll('.ss-championship-name')
const ssFirstContent = document.querySelector('.ss-first-content')


const userInfo = document.querySelector('.user-info')
const userBio = document.querySelector('.user-bio')
const userPicWrapper = document.querySelector('.user-pic-wrapper')
const userRealName = document.querySelector('.user-realname')
const userName = document.querySelector('.user-name')
const userConfigBtn = document.querySelector('.user-config-btn')
const userCurrentTeam = document.querySelector('.user-current-team')
const userPic = document.querySelector('#user-pic'),
      botaoEditar = document.getElementById('botao-perfil-editar')

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

        ssSlider.classList.replace('w-100', 'vw-100')
    
        userInfo.firstElementChild.classList.remove("ms-3")
        userCurrentTeam.classList.replace("mt-6r", "mt-5")
        userPicWrapper.parentElement.classList.remove("me-4")
        userPicWrapper.classList.remove("me-0")
        userRealName.parentElement.classList.remove("me-4")
        userRealName.classList.replace("text-end", "text-center")
        userName.classList.replace("text-end", "text-center")
        userConfigBtn.parentElement.classList.remove("me-3")
        userConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")

        sportsSection.classList.remove('ms-4')
    }
}

const mensagemErro = document.getElementById("mensagem-erro")
const parametroUrl = new URLSearchParams(window.location.search);

function ssChampionshipContentMobile() {
    const ssChampionshipContent = document.querySelectorAll('.ss-championship-content')

    ssChampionshipContent.forEach(content => {
        if (ssChampionshipContent.length > 1) {
            content.classList.replace('w-100', 'w-75')
        } else {
            content.classList.replace('w-100', 'w-87')
        }
        
        content.classList.add('mx-2')
    })

    ssChampionshipName.forEach(name => {
        name.parentElement.classList.add('w-50')
    })
}

const obterInfo = async () => {
    const id = parametroUrl.get('id')

    document.addEventListener('header-carregado', () => {
        const currentUserId = document.getElementById('usernameUserId')
        if (currentUserId && id == currentUserId.textContent) {
            botaoEditar.classList.remove('d-none')
        }
    })
    
    const config = configuracaoFetch("GET")
    
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }
    
    loader.show()
    const data = await executarFetch(`auth/${id}`, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    loader.hide()

    if (data.results == null || data.succeed == false) {
        window.dispatchEvent(new Event('pagina-load'))
        window.location.href = '/pages/404.html'
        return;
    } 

    document.getElementById("user-pic").src = !data.results.picture ? '../default-user-image.png' : data.results.picture
    document.getElementById("user-bio").textContent = data.results.bio
    document.getElementById("artistic-name").textContent = data.results.username
    document.getElementById("name").textContent = data.results.name

    const player = data.results
    console.log(player)
    if (player.playerTeamId > 0) {
        const response = await executarFetch(`teams/${player.playerTeamId}`),
            time = response.results

        const linkTime = `/pages/pagina-times.html?id=${time.id}`
        document.getElementById('emblema-time').src = time.emblem
        document.getElementById('nome-time').textContent = time.name
        document.getElementById('artistic-name').textContent = `${player.artisticName}`
        document.getElementById('numero-jogador').textContent = player.number
        document.getElementById('link-time').href = linkTime
        document.getElementById('link-time-2').href = linkTime
        window.dispatchEvent(new Event('pagina-load'))
    }
    else if (player.teamManagementId > 0) {
        const response = await executarFetch(`teams/${player.teamManagementId}`),
            time = response.results

        document.getElementById('emblema-time').src = time.emblem
        document.getElementById('nome-time').textContent = time.name
        document.getElementById('numero-jogador').classList.add('d-none')
    } else {
        document.getElementById('user-current-team').classList.add('d-none')
    }

    // Campeonatos administrados
    const admCampeonatos = document.getElementById("adm-campeonatos")
    const campeonatosAdministrados = await executarFetch(`organizer/${id}/championship/`, configuracaoFetch("GET"))

    campeonatosAdministrados?.results.forEach((e) => {

        admCampeonatos.innerHTML += `
            <div class="d-flex w-100 rounded-5 mb-3 p-2 mt-5 mt-md-0 lvl2-primary-bg ss-championship-content">
                    <span class="d-none championship-id">${e.id}</span>

                <section class="position-relative border border-2 m-3 overflow-hidden rounded-circle ss-championship-image">
                    <img src="${e.logo}" alt="championshipImage" class="img-fluid position-absolute mw-100 h-100">
                </section>

                <span class="d-flex flex-column justify-content-center align-items-start">
                    <p class="ss-championship-name fs-5 text-nowrap text-truncate d-block">${e.name}</p>
                </span>
            </div>
        `

        const ssChampionshipContent = document.querySelectorAll('.ss-championship-content')
        ssChampionshipContent.forEach(content => {
            content.addEventListener('click', () => {
                const championshipId = content.querySelector('.championship-id').textContent
                window.location.href = `pagina-campeonatos.html?id=${championshipId}`
            })
        })
    })
    
}


async function waitInfo() {
    const admCampeonatos = document.getElementById("adm-campeonatos")
    await obterInfo()

    if (mediaQueryMobile.matches) {
        ssChampionshipContentMobile()
    }

    if (!admCampeonatos.hasChildNodes()) {
        ssFirstContent.classList.add('justify-content-center', 'align-items-center')
        ssFirstContent.removeAttribute('data-lenis-prevent')
        ssFirstContent.innerHTML = `
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

        const res = await executarFetch(`reports/verify?idUser=${id}`, configFetch); 
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
            document.getElementById("excluir-usuario-admin").classList.remove('d-none')
        }
    }

    verificarSeJaDenunciou()
    aparecerBotaoExcluir()

    botaoDenunciar.addEventListener('click', () => {
        modalDenunciaBT.show()
    })

    document.getElementById("excluir-usuario-admin").addEventListener('click', async() => {
        loader.show()
        const data = await executarFetch(`moderation/users/${id}`, configuracaoFetch("DELETE"))
        console.log(data)
        loader.hide()
        if(data.succeed){
            notificacaoSucesso('Usuário excluído')
            setTimeout(() => {
                window.location.href = `/`
            }, 2000);
        }
    })



    document.getElementById("SalvarDenuncia").addEventListener('click', async () => {
        loader.show();
        const configFetch = configuracaoFetch('POST', {
            "AuthorId": sessionUserInfo.id,
            "ReportType": 2,
            "ReportedUserId": id,
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
