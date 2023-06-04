import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"

const filtroEsporte = document.getElementById('esportes')
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
}

flatpickr(filtroInicio, {
    dateFormat: "Y-m-d",
    locale: Portuguese,
    altInput: true,
    onChange: (selectedDates, dateStr, instance) => {
        paginasAnteriores = []
        filtros.start = dateStr;
        listagem();
    }
})

flatpickr(filtroFim, {
    dateFormat: "Y-m-d",
    locale: Portuguese,
    altInput: true,
    onChange: (selectedDates, dateStr, instance) => {
        paginasAnteriores = []
        filtros.finish = dateStr;
        listagem();
    }
})

filtroEsporte.addEventListener("change", async() => {
    paginasAnteriores = []
    filtros.sport = filtroEsporte.value ? filtroEsporte.value : null;
    if(filtroEsporte.value === "") params = new URLSearchParams();
    listagem();
})

limpar.addEventListener("click", async(e) => {
    paginasAnteriores = []
    e.preventDefault()

    parametroUrl.delete('name');
    window.location.search = parametroUrl.toString()

    Object.keys(filtros).forEach((key) => {
        params.set(key, null)
    })

    const data = await executarFetch('championships', config, null, callbackServidor)

    exibirDados(data)
})

const listagem = async () => {
    limparMensagem(erro)

    usarObjeto()

    const endpoint = `championships${params.toString() ? '?' + params.toString() : ''}`
    console.log(endpoint)

    const data = await executarFetch(endpoint, config, null, callbackServidor)

    exibirDados(data)
}

proximo.addEventListener('click', async() => {
    const data = await configProximo()

    if(data.results.length !== 0) {
        exibirDados(data)
    }
})

anterior.addEventListener("click", async() => {
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
        'pitId': document.getElementById('pitId').textContent,
        'sort': document.getElementById('sort').textContent.split(",")
    }

    usarObjeto()

    const endpoint = `championships${params.toString() ? '?' + params.toString() : ''}`

    return await executarFetch(endpoint, configPaginacao, null, callbackServidor)
}

const reqBotaoProximo = async() => {
    const data = await configProximo()

    proximo.disabled = (data.results.length === 0)
}

const exibirDados = (data) => {
    conteudo.innerHTML = ``

    if(data.results.length === 0){
        erro.textContent = "Nenhum resultado encontrado"
    }

    data.results.forEach(e => {
        conteudo.innerHTML += 
        `
            <div class="card card-body mt-5 border border-2 rounded-custom text-black ">
                <div class="row gap-0">
                    <div class="col-md-2  d-flex justify-content-center ">
                        <div >
                            <img src="${e.logo}" style="max-height: 105px; max-width: 10rem;" id="logo" class="rounded img-fluid"  alt="Trofeu">
                        </div>
                    </div>

                    <div class="col-md-9 d-flex flex-column justify-content-center  ">
                        <h3 id="nome" class="card-title text-success">${e.name}</h3>
                        <div class="row gap-0">      
                            <p class="col-md-12 text-success"><i class="bi bi-calendar-event-fill m-1 text-success"></i>De ${new Date(e.initialDate).toLocaleDateString('pt-BR')} até ${new Date(e.finalDate).toLocaleDateString('pt-BR')} -<i class="bi bi-geo-alt-fill m-1 text-success"></i> ${e.nation}, ${e.city}</p>
                        </div>
                    </div>

                    <div class="col-md-1 d-flex justify-content-center align-items-center">
                        <a href="" class="d-none d-sm-block"><img src="/icons/right.svg" width="60"></a>
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
            </div>
        `;
    });
    paginasAnteriores.push(data)
    anterior.disabled = data === paginasAnteriores[0];
    reqBotaoProximo()
    window.scrollTo(0, 0);
}

listagem();