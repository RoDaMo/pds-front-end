import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/moderacao.json' assert { type: 'JSON' }
import ingles from './i18n/en/moderacao.json' assert { type: 'JSON' }
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import i18next from "i18next";
import './utilidades/loader'
import * as bootstrap from 'bootstrap'

const loader = document.createElement('app-loader');
document.body.appendChild(loader);
inicializarInternacionalizacao(ingles, portugues);

const filtroTipo = document.getElementById('tipos')
const filtroCompletado = document.getElementById('completado')
const filtroTiposDenuncia = document.getElementById('tipos-denuncia')
const erro = document.getElementById("mensagem-erro")
const conteudo = document.getElementById('conteudo')
const config = configuracaoFetch("GET")
const limpar = document.getElementById("limpar")

const callbackServidor = data => {
    erro.classList.add("text-danger")
    data.results.forEach(element => erro.innerHTML += `${element}<br>`);
}

let filtros = {
    type: 3,
    completed: false,
    typeOfViolation: 8
}

filtroTipo.addEventListener("change", async () => {
    filtros.type = filtroTipo.value ? filtroTipo.value : 3;
    await listagem();
})

filtroCompletado.addEventListener("change", async () => {
    filtros.completed = filtroCompletado.value ? filtroCompletado.value : "false";
    await listagem();
})

filtroTiposDenuncia.addEventListener("change", async () => {
    filtros.typeOfViolation = filtroTiposDenuncia.value ? filtroTiposDenuncia.value : 8;
    await listagem();
})

limpar.addEventListener("click", async(e) => {
    e.preventDefault()

    loader.show()
    const data = await executarFetch('reports?type=3&completed=false&typeOfViolation=8', config, null, callbackServidor)
    loader.hide()

    exibirDados(data)
})

const listagem = async () => {
    limparMensagem(erro)

    const endpoint = `reports?type=${filtros.type}&completed=${filtros.completed}&typeOfViolation=${filtros.typeOfViolation}`
    loader.show()
    const data = await executarFetch(endpoint, config, null, callbackServidor)
    loader.hide()

    exibirDados(data)
}

const exibirDados = async (data) => {
    conteudo.innerHTML = ``

    if(data.results.length === 0){
        conteudo.innerHTML = /* html */`
        <div class="text-center my-5">
            <h1 class="i18 text-primary" key="Erro">${i18next.t("Erro")}</h1>
        </div>
        `
        return;
    }

    const reportType = (e, retornarItem, retornarNome) => {
        switch(e.reportType){
            case 0:
                if(retornarItem){
                    return e.reportedChampionshipId
                }
                else if(retornarNome){
                    return e.reportedChampionsipName
                }
                else{
                    return "TipoCampeonato"
                }
            case 1:
                if(retornarItem){
                    return e.reportedTeamId
                }
                else if(retornarNome){
                    return e.reportedTeamName
                }
                else{
                    return "TipoTime"
                }
            case 2:
                if(retornarItem){
                    if(e.reportedUserId === null) return e.reportedPlayerTempId
                    else return e.reportedUserId
                }
                else if(retornarNome){
                    return e.reportedUserName
                }
                else{
                    return "TipoUsuario"
                }
            case 3:
                return "Todos"
            default: "Denuncia"
        } 
    }

    const tipoDenuncia = (e) => {
        switch(e.violation){
            case 0:
                return "Inapropriado"
            case 1:
                return "Spam"
            case 2:
                return "Scam"
            case 3:
                return "Odio"
            case 4:
                return "Desinformacao"
            case 5:
                return "Legais"
            case 6:
                return "Assedio"
            case 7:
                return "Outro"
            case 8:
                return "TodosTipos"
            default: "Denuncia"
        } 
    }

    let contador = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    data.results.forEach( (e) => {
        contador++
        const idModal = `${contador}`
        const cardHTML = /*html*/`
            <div id="card-${idModal}" class="card-denuncia card card-body mt-4 border-0 lvl0-color rounded-4 list__warnings cursor-pointer">
                <a class="text-decoration-none">
                    <div class="row gap-0">
                        <h4 class="normal-text-color">${reportType(e, false, true)}</h4>

                        <div class="d-flex flex-column">
                            <div class="d-flex flex-row">
                                <i class="bi bi-shield-exclamation me-2"></i>
                                <p class="m-0 p-0"><span class="i18" key="Tipo">${i18next.t("Tipo")}</span> <span class="i18" key="TipoCampeonato">${i18next.t(reportType(e, false, false))}</span></p>
                            </div>

                            <div class="d-flex flex-row">
                                <i class="bi bi-shield-exclamation me-2"></i>
                                <p class="m-0 p-0"><span class="i18" key="Violacao">${i18next.t("Violacao")}</span> <span class="i18" key=${tipoDenuncia(e)}>${i18next.t(tipoDenuncia(e))}</span></p>
                            </div>
                            <p class="d-none">${reportType(e, true, false)}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;

        conteudo.insertAdjacentHTML('beforeend', cardHTML);
        document.getElementById(`card-${idModal}`).addEventListener('click', async() => {
            const denuncia = (infos, tipo, completed) => {
                console.log(infos)
                switch(tipo) {
                    case 0:
                        return /*html*/` 
                            <div data-lenis-prevent class="modal navbar-blur modal-lg fade" tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content p-4 py-5">
                                        <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-circle mod-img-wrapper mx-auto">
                                            <img class="img-fluid position-absolute w-100 h-100" src="${infos.results.logo}"/>             
                                        </div>
                                        <h1 class="text-center mt-3 mb-0">${infos.results.name}</h1>
                                        <h2 class="rounded-4 bg-danger text-white text-center w-auto mx-auto px-3 py-2 my-3 i18" key=${tipoDenuncia(e)}>${i18next.t(tipoDenuncia(e))}</h2>

                                        <p class="fw-normal text-center mt-2">${e.description}</p>

                                        ${
                                            infos.results.teams.length > 0 ?
                                            /*html*/`
                                                <h3 class="i18 text-center mt-3">${i18next.t('Teams')}</h3>
                                                <div class="d-flex justify-content-center flex-column align-items-center">${exibirTimes(infos.results.teams)}</div>        
                                            ` : ""
                                        }

                                        <p class="fw-semibold text-center mt-5"><span class="i18" key="ReportType">${i18next.t('ReportType')}</span>: ${reportType(e, false, false)}</p>

                                        <div class="d-flex justify-content-center">
                                            <button type="button" id="excluir-denuncia-${idModal}" key="Excluir" class="i18 btn btn-danger me-2">${i18next.t('Excluir')}</button>
                                            <button type="button" id="encerrar-${idModal}"key=${completed ? "AbrirDenuncia" : "EncerrarDenuncia"} class="i18 btn btn-success">${completed ? i18next.t('AbrirDenuncia') : i18next.t('EncerrarDenuncia')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    case 1:
                        return /*html*/` 
                            <div data-lenis-prevent class="modal navbar-blur modal-lg fade" tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered ">
                                    <div class="modal-content p-4 py-5">
                                        <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-circle mod-img-wrapper mx-auto">
                                            <img class="img-fluid position-absolute w-100 h-100" src="${infos[0].results.emblem}"/>             
                                        </div>

                                        <h1 class="text-center mt-3 mb-0">${infos[0].results.name}</h1>
                                        <h2 class="rounded-4 bg-danger text-white text-center w-auto mx-auto px-3 py-2 my-3 i18" key=${tipoDenuncia(e)}>${i18next.t(tipoDenuncia(e))}</h2>
                                        <p class="fw-normal text-center mt-2">${e.description}</p>

                                        <div class="lvl1-color p-3 rounded-4 mt-5">
                                            <h3 class="i18 text-center">${i18next.t('Uniforms')}</h3>
                                            <div class="d-flex flex-md-row flex-column">
                                                <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-4 mod-img-wrapper mx-auto">
                                                    <img class="img-fluid position-absolute w-100 h-100" src="${infos[0].results.uniformHome}"/>             
                                                </div>

                                                <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-4 mod-img-wrapper mx-auto">
                                                    <img class="img-fluid position-absolute w-100 h-100" src="${infos[0].results.uniformAway}"/>             
                                                </div>                                         
                                            </div>
                                        </div>

                                        ${
                                            infos[1].length > 0 ?
                                            /*html*/`
                                                <h3 class="i18 text-center mt-3">${i18next.t('Players')}</h3>
                                                <div class="d-flex justify-content-center flex-column align-items-center">${exibirJogadores(infos[1])}</div>        
                                            ` : ""
                                        }     

                                        ${
                                            infos[0].results.technician.name !== null ?
                                            /*html*/`
                                                <div class="lvl1-color p-3 rounded-4 mt-5">
                                                    <h3 class="i18 text-center">${i18next.t('Coach')}</h3>
                                                    <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-circle mod-img-wrapper mx-auto">
                                                        <img class="img-fluid position-absolute w-100 h-100" src="${infos[0].results.technician.picture}"/>             
                                                    </div>
                                                    <h1 class="text-center mt-3 mb-0">${infos[0].results.technician.name}</h1>
                                                </div>
                                            ` : ""
                                        }

                                        
                                        <p class="fw-semibold text-center mt-5"><span class="i18" key="ReportType">${i18next.t('ReportType')}</span>: ${reportType(e, false, false)}</p>

                                        <div class="d-flex justify-content-center">
                                            <button type="button" id="excluir-denuncia-${idModal}" key="Excluir" class="i18 btn btn-danger me-2">${i18next.t('Excluir')}</button>
                                            <button type="button" id="encerrar-${idModal}"key=${completed ? "AbrirDenuncia" : "EncerrarDenuncia"} class="i18 btn btn-success">${completed ? i18next.t('AbrirDenuncia') : i18next.t('EncerrarDenuncia')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    case 2:
                        if(infos.results.cnpj !== null || infos.results.cpf !== null){
                            return  /*html*/` 
                            <div data-lenis-prevent class="modal navbar-blur modal-lg fade" tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered ">
                                    <div class="modal-content p-4 py-5">
                                        <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-circle mod-img-wrapper mx-auto">
                                            <img class="img-fluid position-absolute w-100 h-100" src="${infos.results.picture}"/>             
                                        </div>

                                        <h1 class="text-center mt-3 mb-0">${infos.results.name}</h1>

                                        <h2 class="rounded-4 bg-danger text-white text-center w-auto mx-auto px-3 py-2 my-3 i18" key=${tipoDenuncia(e)}>${i18next.t(tipoDenuncia(e))}</h2>
                                        <p class="fw-normal text-center mt-2">${e.description}</p>

                                        <p class="fw-semibold text-center mt-3"><span class="i18" key="ReportType">${i18next.t('ReportType')}</span>: ${reportType(e, false, false)}</p>
                                        <div class="d-flex justify-content-center">
                                            <button type="button" id="excluir-denuncia-${idModal}" key="Excluir" class="i18 btn btn-danger me-2">${i18next.t('Excluir')}</button>
                                            <button type="button" id="encerrar-${idModal}" key=${completed ? "AbrirDenuncia" : "EncerrarDenuncia"} class="i18 btn btn-success">${completed ? i18next.t('AbrirDenuncia') : i18next.t('EncerrarDenuncia')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        }
                        else{
                            return  /*html*/` 
                            <div data-lenis-prevent class="modal navbar-blur modal-lg fade" tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content p-4 py-5">
                                        <div class="d-flex bg-white justify-content-center position-relative overflow-hidden border border-2 rounded-circle mod-img-wrapper mx-auto">
                                            <img class="img-fluid position-absolute w-100 h-100" src="${infos.results.picture}"/>             
                                        </div>

                                        <h1 class="text-center mt-3 mb-0">${infos.results.name}</h1>
                                        <span class="fw-semibold text-center opacity-50">${infos.results.artisticName}</span>
                                        
                                        <h2 class="rounded-4 bg-danger text-white text-center w-auto mx-auto px-3 py-2 my-3 i18" key=${tipoDenuncia(e)}>${i18next.t(tipoDenuncia(e))}</h2>
                                        <p class="fw-normal text-center mt-2">${e.description}</p>

                                        <p class="fw-semibold text-center mt-3"><span class="i18" key="ReportType">${i18next.t('ReportType')}</span>: ${reportType(e, false, false)}</p>
                                        <div class="d-flex justify-content-center">
                                            <button type="button" id="excluir-denuncia-${idModal}" key="Excluir" class="i18 btn btn-danger me-2">${i18next.t('Excluir')}</button>
                                            <button type="button" id="encerrar-${idModal}" key=${completed ? "AbrirDenuncia" : "EncerrarDenuncia"} class="i18 btn btn-success">${completed ? i18next.t('AbrirDenuncia') : i18next.t('EncerrarDenuncia')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        }
                    default: return null
                }
            }

            const verificarStatusDenuncia = () => {
                document.getElementById(`encerrar-${idModal}`).textContent = document.getElementById(`encerrar-${idModal}`).textContent === "Abrir Denuncia" ? "Encerrar Denuncia" : "Abrir Denuncia"
            }

            const exibirTimes = (teams) => {
                let resultado = "";
                teams.forEach((team) => {
                    resultado += `
                        <div class="d-flex align-items-center rounded-4 py-2 px-3 lvl2-color my-1">
                            <img class="me-2 rounded-circle bg-white" style="height: 30px; width: 30px;" src="${team.emblem}" alt="" />
                            <span>${team.name}</span>
                        </div>
                    `;
                });
                return resultado;
            }

            const exibirJogadores = (jogadores) => {
                console.log(jogadores)
                let resultado = "";
                jogadores.forEach((jogador) => {
                    resultado += `
                        <div class="d-flex align-items-center rounded-4 py-2 px-3 lvl2-color my-1">
                            <img class="me-2 rounded-circle bg-white" style="height: 30px; width: 30px;" src="${jogador.picture}" alt="" />
                            <span>${jogador.name}</span>
                        </div>
                    `;
                });
                return resultado;
            }
            

            const pegarInformacoes = async(type, id) => {
                switch(type){
                    case 0:
                        const dataCampeonato = await executarFetch(`championships/${id}`, configuracaoFetch("GET"), null, callbackServidor)
                        return dataCampeonato
                    case 1:
                        const dataTime = await executarFetch(`teams/${id}`, configuracaoFetch("GET"), null, callbackServidor)
                        const dataTimeJogadores = await executarFetch(`teams/${id}/players`, configuracaoFetch("GET"), null, callbackServidor)
                        return [dataTime, dataTimeJogadores.results]
                    case 2:
                        const dataUsuario = await executarFetch(`auth/${id}`, configuracaoFetch("GET"), null, callbackServidor)
                        console.log(dataUsuario)
                        return dataUsuario
                }
            }
            console.log(e)

            const infos = await pegarInformacoes(e.reportType, reportType(e, true, false))

            document.body.insertAdjacentHTML('beforeend', denuncia(infos, e.reportType, e.completed))

            const modalDenuncia = document.getElementById(`modal-${idModal}`)
            let modalDenunciaBT = new bootstrap.Modal(modalDenuncia, {keyboard: false})
            console.log(modalDenuncia)
            modalDenunciaBT.show()          

            const botaoExcluir = async() => {
                if(e.reportType === 0 || e.reportType === 2){
                    if(infos.results.deleted){
                        desabilitarBotao()
                    }
                }
                else{
                    if(infos[0].results.deleted){
                        desabilitarBotao()
                    }
                }
            }

            const desabilitarBotao = () => {
                document.getElementById(`excluir-denuncia-${idModal}`).textContent = "Excluído"
                document.getElementById(`excluir-denuncia-${idModal}`).disabled = true
            }

            botaoExcluir()

            document.getElementById(`excluir-denuncia-${idModal}`).addEventListener('click', async() => {
                switch(e.reportType){
                    case 0:
                        loader.show()
                        const dataCampeonato = await executarFetch(`moderation/championships/${reportType(e, true, false)}`, configuracaoFetch("DELETE"), null, callbackServidor)
                        loader.hide()
                        if(dataCampeonato.succeed){
                            desabilitarBotao()
                            verificarStatusDenuncia()
                            notificacaoSucesso("Excluído com sucesso")
                        }
                    case 1:
                        loader.show()
                        const dataTime = await executarFetch(`moderation/teams/${reportType(e, true, false)}`, configuracaoFetch("DELETE"), null, callbackServidor)
                        loader.hide()
                        if(dataTime.succeed){
                            desabilitarBotao()
                            verificarStatusDenuncia()
                            notificacaoSucesso("Excluído com sucesso")
                        }
                    case 2:
                        loader.show()
                        const dataUser = await executarFetch(`moderation/users/${reportType(e, true, false)}`, configuracaoFetch("DELETE"), null, callbackServidor)
                        loader.hide()
                        if(dataUser.succeed){
                            desabilitarBotao()
                            verificarStatusDenuncia()
                            notificacaoSucesso("Excluído com sucesso")
                        }
                }
            })

            document.getElementById(`encerrar-${idModal}`).addEventListener('click', async() => {
                loader.show()
                const data = await executarFetch(`reports`, configuracaoFetch("PUT", {"Id": e.id, "Completed": e.completed ? false : true}), null, callbackServidor)
                loader.hide()
                if(data.succeed){
                    desabilitarBotao()
                    verificarStatusDenuncia()
                    notificacaoSucesso("O status da denuncia foi alterado")
                    modalDenunciaBT.hide()
                    listagem()
                }
            })
        });   
        
    });

    

}


listagem();
window.dispatchEvent(new Event('pagina-load'))