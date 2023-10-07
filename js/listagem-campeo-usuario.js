import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/listagem-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/listagem-campeonatos.json' assert { type: 'JSON' }
import i18next from "i18next";
import './utilidades/loader'

const loader = document.createElement('app-loader');
document.body.appendChild(loader);
inicializarInternacionalizacao(ingles, portugues);

const filtroEsporte = document.getElementById('esportes')
const filtroStatus = document.getElementById('status')
const filtroInicio = document.getElementById('data-inicio')
const filtroFim = document.getElementById('data-fim')
const erro = document.getElementById("mensagem-erro")
const conteudo = document.getElementById('conteudo')
const config = configuracaoFetch("GET")
const parametroUrl = new URLSearchParams(window.location.search);
const limpar = document.getElementById("limpar")
const proximo = document.getElementById("proximo")
const anterior = document.getElementById("anterior")

let paginasAnteriores = []
let params = new URLSearchParams();

const callbackServidor = data => {
    erro.classList.add("text-danger")
    data.results.forEach(element => erro.innerHTML += `${element}<br>`);
}

let lng = localStorage.getItem('lng')

const listagem = async () => {
    limparMensagem(erro)

    const endpoint = `organizer/championship`
    loader.show()
    const data = await executarFetch(endpoint, config, null, callbackServidor)
    console.log(data)
    loader.hide()

    exibirDados(data)
}

const exibirStatus = (status) => {
    switch(status){
        case 0:
            return 'Ativo'
            break
        case 1:
            return 'Finalizado'
            break
        case 3:
            return 'Pendente'
            break
        default:
            return 'Sem Status'
    }
}

const exibirDados = async (data) => {
    conteudo.innerHTML = ``

    if(data.results.length === 0){
        conteudo.innerHTML = /* html */`
        <div class="text-center my-5">
            <h1 class="i18 text-primary" key="Erro">${i18next.t("Erro")}</h1>
        </div>
        `
    }

    data.results.forEach(e => {
        conteudo.innerHTML += 
        /* html */`
            <div class="card card-body mt-5 border border-2 rounded-custom">
                <a href="/pages/configuracao-campeonato.html?id=${e.id}" class="text-decoration-none">
                    <div class="row gap-0">
                        <div class="col-md-2  d-flex justify-content-center ">
                            <div>
                                <img src="${e.logo}" style="max-height: 105px; max-width: 10rem;" id="logo" class="rounded img-fluid"  alt="Trofeu">
                            </div>
                        </div>

                        <div class="col-md-9 d-flex flex-column justify-content-center  ">
                            <h3 id="nome" class="card-title text-center text-md-start text-success">${e.name}</h3>
                            <div class="row gap-0">      
                                <p class="col-md-12 text-success text-center text-md-start"><i class="bi bi-calendar-event-fill m-1 text-success"></i> <span class="i18" key="De">${i18next.t("De")}</span> ${new Date(e.initialDate).toLocaleDateString('pt-BR')}  <span class="i18" key="Ate">${i18next.t("Ate")}</span> ${new Date(e.finalDate).toLocaleDateString('pt-BR')} <small><i class="bi bi-dash"></i></small>${exibirStatus(e.status)}</p>
                            </div>
                        </div>

                        <div class="col-md-1 d-flex justify-content-center align-items-center">
                            <i class="bi bi-chevron-right"></i>
                        </div> 
                    </div>
                </a>
            </div>
        `;
    });

    window.dispatchEvent(new Event('pagina-load'))
}

listagem();