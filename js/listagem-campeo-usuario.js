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

let filtros = {
    name: null,
    sport: null,
    start: null,
    finish: null,
    status: null
}

let lng = localStorage.getItem('lng')


flatpickr(filtroInicio, {
    dateFormat: "Y-m-d",
    locale:  lng === 'ptbr' ? Portuguese : ingles,
    altInput: true,
    onChange: async (selectedDates, dateStr, instance) => {
        paginasAnteriores = []
        filtros.start = dateStr;
        await listagem();
    }
})

flatpickr(filtroFim, {
    dateFormat: "Y-m-d",
    locale:  lng === 'ptbr' ? Portuguese : ingles,
    altInput: true,
    onChange: async (selectedDates, dateStr, instance) => {
        paginasAnteriores = []
        filtros.finish = dateStr;
        await listagem();
    }
})

document.addEventListener('nova-lingua', event => {
    let lng = localStorage.getItem('lng');
    flatpickr(filtroInicio, {
        dateFormat: "Y-m-d",
        locale:  lng === 'ptbr' ? Portuguese : ingles,
        altInput: true,
        onChange: (selectedDates, dateStr, instance) => {
            paginasAnteriores = []
            filtros.finish = dateStr;
            console.log('filtroInicio')
            listagem();
        }
    })
    flatpickr(filtroFim, {
        dateFormat: "Y-m-d",
        locale:  lng === 'ptbr' ? Portuguese : ingles,
        altInput: true,
        onChange: (selectedDates, dateStr, instance) => {
            paginasAnteriores = []
            filtros.finish = dateStr;
            console.log('filtroFim')
            listagem();
        }
    })

    let inputData1 = document.querySelectorAll('[tabindex]')[1]
    inputData1.placeholder = i18next.t("FiltrarApartir")
    inputData1.setAttribute('key', 'FiltrarApartir')
    inputData1.classList.add("i18-placeholder")

    let inputData2 = document.querySelectorAll('[tabindex]')[2]
    inputData2.placeholder = i18next.t("FiltrarAte")
    inputData2.setAttribute('key', 'FiltrarAte')
    inputData2.classList.add("i18-placeholder")
})

filtroEsporte.addEventListener("change", async () => {
    paginasAnteriores = []
    filtros.sport = filtroEsporte.value ? filtroEsporte.value : null;
    if(filtroEsporte.value === "") params = new URLSearchParams();
    await listagem();
})

filtroStatus.addEventListener("change", async () => {
    paginasAnteriores = []
    filtros.status = filtroStatus.value ? filtroStatus.value : null;
    if(filtroStatus.value === "") params = new URLSearchParams();
    await listagem();
})

limpar.addEventListener("click", async(e) => {
    paginasAnteriores = []
    e.preventDefault()

    parametroUrl.delete('name');
    window.location.search = parametroUrl.toString()

    Object.keys(filtros).forEach((key) => {
        params.set(key, null)
    })

    loader.show()
    const data = await executarFetch('organizer/championship', config, null, callbackServidor)
    loader.hide()

    exibirDados(data)
})

const listagem = async () => {
    limparMensagem(erro)

    usarObjeto()

    const endpoint = `organizer/championship${params.toString() ? '?' + params.toString() : ''}`
    loader.show()
    const data = await executarFetch(endpoint, config, null, callbackServidor)
    console.log(data)
    loader.hide()

    exibirDados(data)
}

proximo.addEventListener('click', async () => {
    const data = await configProximo()

    if(data.results.length !== 0) {
        exibirDados(data)
    }
})

anterior.addEventListener("click", async () => {
    exibirDados(elementoAnterior(paginasAnteriores, paginasAnteriores[paginasAnteriores.length-1]))
});

const usarObjeto = () => {
    filtros.name = parametroUrl.get("name") ? parametroUrl.get("name") : null

    Object.keys(filtros).forEach((key) => {
        if(filtros[key]) {
            params.set(key, filtros[key])
        }
    })
}

const elementoAnterior = (vetor, elemento) => {
    const indice = vetor.indexOf(elemento);
    
    if (indice === -1 || indice === 0) {
        return vetor[vetor.length-1];
    }
    
    return vetor[indice - 1];
}

const configProximo = async () => {
    const configPaginacao = configuracaoFetch("GET")

    configPaginacao.headers = {
        'Accept-Language': localStorage.getItem('lng'),
        'pitId': document.getElementById('pitId') ? document.getElementById('pitId').textContent : null,
        'sort': document.getElementById('sort') ? document.getElementById('sort').textContent.split(",") : null
    }

    usarObjeto()

    const endpoint = `championship${params.toString() ? '?' + params.toString() : ''}`

    return await executarFetch(endpoint, configPaginacao, null, callbackServidor)
}

const reqBotaoProximo = async() => {
    const data = await configProximo()

    proximo.disabled = (data !== undefined) ? (data.results.length === 0) : true
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
        /*html*/`
            <div class="card card-body mt-5 border border-2 rounded-custom text-black">
                <a href="/pages/configuracao-campeonato.html?id=${e.id}" class="text-decoration-none">
                    <div class="row gap-0">
                        <div class="col-md-2  d-flex justify-content-center ">
                            <div>
                                <img src="${e.logo}" style="max-height: 105px; max-width: 10rem;" id="logo" class="rounded img-fluid"  alt="Trofeu">
                            </div>
                        </div>

                        <div class="col-md-9 d-flex flex-column justify-content-center  ">
                            <h3 id="nome" class="card-title text-success">${e.name}</h3>
                            <div class="row gap-0">      
                                <p class="col-md-12 text-success"><i class="bi bi-calendar-event-fill m-1 text-success"></i> <span class="i18" key="De">${i18next.t("De")}</span> ${new Date(e.initialDate).toLocaleDateString('pt-BR')}  <span class="i18" key="Ate">${i18next.t("Ate")}</span> ${new Date(e.finalDate).toLocaleDateString('pt-BR')} -<i class="bi bi-geo-alt-fill m-1 text-success"></i> ${e.nation}, ${e.city}</p>
                            </div>
                        </div>

                        <div class="col-md-1 d-flex justify-content-center align-items-center">
                            <img src="/icons/right.svg" width="60">
                        </div> 
                        ${
                            (data.results[data.results.length - 1] === e) ?
                            `
                                <p id="pitId" class="d-none">${e.pitId}</p>
                                <p id="sort" class="d-none">${e.sort}</p>

                            ` :
                            ""
                        }
                    </div>
                </a>
            </div>
        `;
    });
    paginasAnteriores.push(data)
    anterior.disabled = data === paginasAnteriores[0];
    await reqBotaoProximo()
    window.scrollTo(0, 0);
}

listagem();

let inputData1 = document.querySelectorAll('[tabindex]')[1]
inputData1.placeholder = i18next.t("FiltrarApartir")
inputData1.setAttribute('key', 'FiltrarApartir')
inputData1.classList.add("i18-placeholder")

let inputData2 = document.querySelectorAll('[tabindex]')[2]
inputData2.placeholder = i18next.t("FiltrarAte")
inputData2.setAttribute('key', 'FiltrarAte')
inputData2.classList.add("i18-placeholder")