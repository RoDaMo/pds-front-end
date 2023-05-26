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
const params = new URLSearchParams();
const proximo = document.getElementById("proximo")
const anterior = document.getElementById("anterior")

let paginasAnteriores = []

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

    const data = await executarFetch(endpoint, config, null, callbackServidor)

    exibirDados(data)
}

proximo.addEventListener('click', async() => {
    const lng = localStorage.getItem('lng')
    const pitId = document.getElementById('pitId') 
    const sort = document.getElementById('sort')

    const configPaginacao = configuracaoFetch("GET")

    configPaginacao.headers = {
        'Accept-Language': lng,
        'pitId': pitId.textContent,
        'sort': sort.textContent.split(",")
    }

    usarObjeto()

    const endpoint = `championships${params.toString() ? '?' + params.toString() : ''}`

    const data = await executarFetch(endpoint, configPaginacao, null, callbackServidor)

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

const ultimoArray = (array, element) => (array[array.length - 1] === element) ? true : false

const exibirDados = (data) => {
    conteudo.innerHTML = ``

    if(data.results.length === 0){
        erro.textContent = "Nenhum resultado encontrado"
    }

    let contador = -1
    data.results.forEach(e => {
        contador++
        conteudo.innerHTML += 
        `
            <div class="card card-body mt-5 border border-2 rounded-custom text-black ">
                <div class="row gap-0">
                    <div class="col-md-3 d-flex justify-content-center align-items-center">
                        <img src="${e.logo}" id="logo" class="rounded img-fluid" width="50%" alt="Trofeu">
                    </div>

                    <div class="col-md-8">
                        <h3 id="nome" class="card-title">${e.name}</h3>
                        <div class="row gap-0">      
                            <p id="data-inicio" class="col-md-4"><img src="/icons/calendar.svg">De ${e.initialDate}</p>
                            <p id="data-final" class=" col-md-4"> <img src="/icons/calendar.svg">Até ${e.finalDate}</p>
                            <p id="local" class="card-text col-md-4"><img src="/icons/map.svg">${e.nation}, ${e.city}</p>
                        </div>
                    </div>

                    <div class="col-md-1 d-flex justify-content-center align-items-center">
                        <a href="" class="d-none d-sm-block"><img src="/icons/right.svg" width="90"></a>
                    </div> 
                    ${
                        ultimoArray(data.results, e) ?
                        `
                            <p id="pitId" class="d-none">${e.pitId}</p>
                            <p id="sort" class="d-none">${e.sort}</p>
                            <p class="d-none">${contador !== 14 ? proximo.disabled = true : proximo.disabled = false }</p>
                        ` :
                        ""
                    }
                </div>
            </div>
        `;
    });
    paginasAnteriores.push(data)
}

listagem();