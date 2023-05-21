import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/cadastro-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-campeonatos.json' assert { type: 'JSON' }
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"

inicializarInternacionalizacao(ingles, portugues);
let formulario = document.getElementById("formulario")
let mensagemErro = document.getElementById("mensagem-erro")

const dataInicial = document.getElementById("data-inicial")
const dataFinal = document.getElementById("data-final")
const nomeCampeonato = document.getElementById("nome-campeonato")
const esporte = document.getElementById("esportes")
const formato = document.getElementById('formato')
const quantidade = document.getElementById('quantidade')

formato.addEventListener("change", () => {
    if(formato.value === "1"){
        quantidade.innerHTML = ""
        for(let i = 0; i <= 16; i++){
            if(i % 2 === 0){
                const option = document.createElement('option')
                option.value = i
                option.text = i + 4
                quantidade.appendChild(option)
            }
        }
    }
    else{
        quantidade.innerHTML = ""
        for(let i = 0; i <= 6; i++){
            const option = document.createElement('option')
            option.value = i
            option.text = 2 ** i
            quantidade.appendChild(option)
        }
    }
})

flatpickr(dataInicial, {
    dateFormat: "Y-m-d",
    locale: Portuguese,
    altInput: true,
})

flatpickr(dataFinal, {
    dateFormat: "Y-m-d",
    locale: Portuguese,
    altInput: true,
})

formulario.addEventListener("submit", async e => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    const resultado = await postCampeonato("championships", {
        "name": nomeCampeonato,
        "prize": premiacao,
        "initialDate": dataInicio,
        "finalDate": dataFinal,
        "sportsId": esporte
    })

    if (resultado)
        formulario.reset()
})

async function postCampeonato(endpoint, body) {
    const config = configuracaoFetch("POST", body)
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, null, callbackServidor)
    if (!data) return false

    // if (!data.succeed) {
    //     mensagemErro.classList.add("text-danger")
    //     mensagemErro.textContent = data.results[0]
    //     return false
    //     // nao permita que o label desapareca
    //     // setTimeout(() => {
    //     //     mensagemErro.textContent = ""
    //     // }, 3500);
    // }

    notificacaoSucesso(data.results[0])
    return true
}