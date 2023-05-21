import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/cadastro-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-campeonatos.json' assert { type: 'JSON' }
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import {exibidorImagem} from '../js/utilidades/previewImagem'

inicializarInternacionalizacao(ingles, portugues);
let formulario = document.getElementById("formulario")
let mensagemErro = document.getElementById("mensagem-erro")
const escudo = document.getElementById('escudo')

const pais = document.getElementById('pais')
const estado = document.getElementById('estado')
const cidade = document.getElementById('cidade')
const bairro = document.getElementById('bairro')
const descricao = document.getElementById('descricao')
const dataInicial = document.getElementById("data-inicial")
const dataFinal = document.getElementById("data-final")
const nomeCampeonato = document.getElementById("nome")
const esporte = document.getElementById("esportes")
const formato = document.getElementById('formato')
const quantidade = document.getElementById('quantidade')
const imagem = document.getElementById('logo')

exibidorImagem(imagem, escudo)

const optionDefault = () => {
    const optionDefault = document.createElement('option')
    optionDefault.value = 0
    optionDefault.text = 'Selecione uma opção'
    quantidade.appendChild(optionDefault)
}

const adicionarOpcao = (value) => {
    const option = document.createElement('option')
    option.value = value
    option.text = value
    quantidade.appendChild(option)
}

const resetQuantidade = () => {
    quantidade.innerHTML = ""
    optionDefault()
}

formato.addEventListener("change", () => {
    if(formato.value === "1"){
        resetQuantidade()
        for(let i = 1; i <= 18; i++){
            if(i % 2 === 0){
                adicionarOpcao(i + 2)
            }
        }
    }
    else{
        resetQuantidade()
        for(let i = 1; i <= 6; i++){
            adicionarOpcao(2 ** i)
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
        "name": nomeCampeonato.value,
        "initialDate": dataInicial.value,
        "finalDate": dataFinal.value,
        "sportsId": parseInt(esporte.value),
        "teamQuantity": parseInt(quantidade.value),
        "logo": imagem.value,
        "description": descricao.value,
        "Format": parseInt(formato.value),
        "Nation": pais.value,
        "State": estado.value,
        "City": cidade.value,
        "Neighborhood": bairro.value
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

    notificacaoSucesso(data.results[0])
    return true
}