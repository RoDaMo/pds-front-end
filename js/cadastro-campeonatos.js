import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/cadastro-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-campeonatos.json' assert { type: 'JSON' }

import JustValidate from "just-validate"
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
// import {exibidorImagem} from '../js/utilidades/previewImagem'


inicializarInternacionalizacao(ingles, portugues);
let formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
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

// exibidorImagem(imagem, escudo)

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

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

validator
    .addField(nomeCampeonato, [
        {
            rule: 'required',
            errorMessage: 'O nome do campeonato é obrigatório',
        },
    ])
    .addField(dataInicial, [
        {
            rule: 'required',
            errorMessage: 'A data inicial é obrigatória',
        },
    ])
    .addField(dataFinal, [
        {
            rule: 'required',
            errorMessage: 'A data final é obrigatória',
        },
        {
            validator: (value, context) => {
                const dataInicial = new Date(document.getElementById("data-inicial").value)
                const dataFinal = new Date(value)
                return dataFinal >= dataInicial
            },
            errorMessage: 'A data final deve ser maior ou igual a data inicial',
        }
    ])
    .addField(esporte, [
        {
            rule: 'required',
            errorMessage: 'Favor selecionar um esporte',
        },
    ])
    .addField(formato, [
        {
            rule: 'required',
            errorMessage: 'Favor selecionar um formato',
        },
    ])
    .addField(quantidade, [
        {
            rule: 'required',
            errorMessage: 'Favor selecionar uma quantidade',
        },
    ])
    .addField(imagem, [
        {
            rule: 'required',
            errorMessage: 'Favor selecionar uma imagem',
        },
        {
            rule: 'files',
            value: {
                files: {
                    extensions: ['jpeg', 'jpg', 'png'],
                    maxSize: 20000,
                    types: ['image/jpeg', 'image/jpg', 'image/png'],
                },
            },
            errorMessage: 'Imagem em jpeg/jpg/png - máx. 20kb',
        }
    ])
    .addField(pais, [
        {
            rule: 'required',
            errorMessage: 'O país é obrigatório',
        },
    ])
    .addField(estado, [
        {
            rule: 'required',
            errorMessage: 'O estado é obrigatório',
        },
    ])
    .addField(cidade, [
        {
            rule: 'required',
            errorMessage: 'A cidade é obrigatório',
        },
    ])
    .addField(bairro, [
        {
            rule: 'required',
            errorMessage: 'O bairro é obrigatório',
        },
    ])
    .addField(descricao, [
        {
            rule: 'required',
            errorMessage: 'Favor inserir uma descrição',
        },
    ])
    .onSuccess(async(e) => {
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

        if (resultado) {
            formulario.reset()
            escudo.src = "#"
        }
    })

async function postCampeonato(endpoint, body) {
    console.log(body)
    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    if (!data) return false

    notificacaoSucesso(data.results[0])
    return true
}