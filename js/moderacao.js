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
            <div id="card-${idModal}" class="card-denuncia card card-body mt-5 border border-black border-1 rounded-5">
                <a  class="text-decoration-none">
                    <div class="row gap-0">
                        <h4>${reportType(e, false, true)}</h4>

                        <div class="d-flex gap-2">
                            <i class="bi bi-shield-exclamation"></i>
                            <p><span class="i18" key="Tipo">${i18next.t("Tipo")}</span> <span class="i18" key="TipoCampeonato">${i18next.t(reportType(e, false, false))}</span></p>
                            <i class="bi bi-shield-exclamation"></i>
                            <p><span class="i18" key="Violacao">${i18next.t("Violacao")}</span> <span class="i18" key=${tipoDenuncia(e)}>${i18next.t(tipoDenuncia(e))}</span></p>
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
                            <div class="modal fade p-4 "  tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered ">
                                    <div class="modal-content p-2 ">
                                        <h1>${infos.results.name}</h1>
                                        <h2>${tipoDenuncia(e)}</h2>
                                        <p>Descrição do Campeonato: ${infos.results.description}</p>
                                        <p>Descrição da Denuncia: ${e.description}</p>
                                        <p>Tipo de Denuncia: ${reportType(e, false, false)}</p>
                                        <img style="height: 150px; width: 150px;" src="${infos.results.logo}"/>
                                        <h3>Times</h3>
                                        <div>
                                            <div>${exibirTimes(infos.results.teams)}</div>
                                        </div>
                                        <div>
                                            <button type="button" id="excluir-denuncia-${idModal}" key="BotaoExcluir" class="i18 btn btn-danger">Excluir</button>
                                            <button type="button" id="encerrar-${idModal}" key="BotaoEncerrar" class="i18 btn btn-success">${completed ? 'Abrir Denuncia' : 'Encerrar Denuncia'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    case 1:
                        return /*html*/` 
                            <div class="modal fade p-4 "  tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered ">
                                    <div class="modal-content p-2 ">
                                        <h1>${infos[0].results.name}</h1>
                                        <h2>${tipoDenuncia(e)}</h2>
                                        <p>Descrição da Denuncia: ${e.description}</p>
                                        <p>Tipo de Denuncia: ${reportType(e, false, false)}</p>
                                        <img style="height: 150px; width: 150px;" src="${infos[0].results.emblem}"/>
                                        <h3>Uniformes</h3>
                                        <div>
                                            <img style="height: 150px; width: 150px;" src="${infos[0].results.uniformHome}"/>  
                                            <img style="height: 150px; width: 150px;" src="${infos[0].results.uniformAway}"/>               
                                        </div>
                                        <h3>Jogadores</h3>
                                        <div>
                                            <div>${exibirJogadores(infos[1])}</div>            
                                        </div>
                                        <h3>Técnico</h3>
                                        <div>
                                            <img style="height: 150px; width: 150px;" src="${infos[0].results.technician.picture}"/>   
                                            <p>${infos[0].results.technician.name}</p>          
                                        </div>
                                        <div>
                                            <button type="button" id="excluir-denuncia-${idModal}" key="BotaoExcluir" class="i18 btn btn-danger">Excluir</button>
                                            <button type="button" id="encerrar-${idModal}" key="BotaoEncerrar" class="i18 btn btn-success">${completed ? 'Abrir Denuncia' : 'Encerrar Denuncia'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    case 2:
                        if(infos.results.cnpj !== null || infos.results.cpf !== null){
                            return  /*html*/` 
                            <div class="modal fade p-4 "  tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered ">
                                    <div class="modal-content p-2 ">
                                        <h1>${infos.results.name}</h1>
                                        <div>
                                            <img style="height: 150px; width: 150px;" src="${infos.results.picture}"/>             
                                        </div>
                                        <h2>${tipoDenuncia(e)}</h2>
                                        <p>Descrição da Denuncia: ${e.description}</p>
                                        <p>Tipo de Denuncia: ${reportType(e, false, false)}</p>
                                        <div>
                                            <button type="button" id="excluir-denuncia-${idModal}" key="BotaoExcluir" class="i18 btn btn-danger">Excluir</button>
                                            <button type="button" id="encerrar-${idModal}" key="BotaoEncerrar" class="i18 btn btn-success">${completed ? 'Abrir Denuncia' : 'Encerrar Denuncia'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        }
                        else{
                            return  /*html*/` 
                            <div class="modal fade p-4 "  tabindex="-1" aria-labelledby="denunciaLabel" aria-hidden="true" id="modal-${idModal}">
                                <div class="modal-dialog modal-dialog-centered ">
                                    <div class="modal-content p-2 ">
                                        <h1>${infos.results.name}</h1>
                                        <h1>Nome Artístico: ${infos.results.artisticName}</h1>
                                        <div>
                                            <img style="height: 150px; width: 150px;" src="${infos.results.picture}"/>             
                                        </div>
                                        <h2>${tipoDenuncia(e)}</h2>
                                        <p>Descrição da Denuncia: ${e.description}</p>
                                        <p>Tipo de Denuncia: ${reportType(e, false, false)}</p>
                                        <div>
                                            <button type="button" id="excluir-denuncia-${idModal}" key="BotaoExcluir" class="i18 btn btn-danger">Excluir</button>
                                            <button type="button" id="encerrar-${idModal}" key="BotaoEncerrar" class="i18 btn btn-success">${completed ? 'Abrir Denuncia' : 'Encerrar Denuncia'}</button>
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
                        <div class="d-flex">
                            <img style="height: 30px; width: 30px;" src="${team.emblem}" alt="" />
                            <p>${team.name}</p>
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
                        <div class="d-flex">
                            <img style="height: 30px; width: 30px;" src="${jogador.picture}" alt="" />
                            <p>${jogador.name}</p>
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