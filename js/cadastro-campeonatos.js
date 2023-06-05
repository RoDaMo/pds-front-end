import { configuracaoFetch, executarFetch, limparMensagem, api } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/cadastro-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-campeonatos.json' assert { type: 'JSON' }
import JustValidate from "just-validate"
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import {exibidorImagem} from '../js/utilidades/previewImagem'
import { uploadImagem } from './utilidades/uploadImagem'
import './utilidades/loader'
import * as bootstrap from 'bootstrap'

let cpfObrigatorio = false
let cadastrouCpf = false
let confirmouCpf = true
let meuModal

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()
   
    let endpoint = `auth/cpf`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    if(data === undefined)
        confirmouCpf = false
    if(!data.results) {
        cpfObrigatorio = true
        const modal = document.getElementById('JanelaModal')
        meuModal =  new bootstrap.Modal(modal)
        meuModal.show();
    }
})

const mensagemErro2 = document.getElementById("mensagem-erro2")
const formularioCpf = document.getElementById("formCpf")
const cpf =  document.getElementById("cpf")
const validator2 = new JustValidate(formularioCpf, {
    validateBeforeSubmitting: true,
})

validator2
    .addField(cpf, [
        {
            rule: 'required',
            errorMessage: 'Favor inserir CPF',
        },
        {
            rule: 'minLength',
            value: 11,
            errorMessage: 'Nome de usuário deve possuir 11 caracteres.',
        },
        {
            rule: 'maxLength',
            value: 11,
            errorMessage: 'Nome de usuário deve possuir 11 caracteres.',
        },
        {
            validator: (value, context) => {
                var numberCpf = new Array(11)
                for (var i = 0; i < 11; i++)
                    numberCpf[i] = parseInt(value[i])

                var sum = 0
                for (var i = 0; i < 9; i++)
                    sum += numberCpf[i] * (10 - i)

                var firstVerifierDigit = (sum * 10) % 11
                firstVerifierDigit = firstVerifierDigit === 10 ? 0 : firstVerifierDigit

                sum = 0
                var arrayNova = numberCpf.slice()
                arrayNova[9] = firstVerifierDigit
                for (var i = 0; i < 10; i++)
                    sum += arrayNova[i] * (11 - i)

                var secondVerifierDigit = (sum * 10) % 11;
                secondVerifierDigit = secondVerifierDigit === 10 ? 0 : secondVerifierDigit

                if (firstVerifierDigit !== numberCpf[9] || secondVerifierDigit !== numberCpf[10])
                    return false
                
                return true
            },
            errorMessage: 'CPF inválido',
        }
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();

        const resultado = await postCpf("auth/cpf", 
            cpf.value
        )

        if (resultado) {
            formularioCpf.reset()
            cadastrouCpf = true
            meuModal.hide()
        }

        loader.hide();
    })



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
const emblema = document.getElementById('emblema')
const quantidadeJogadores = document.getElementById('quantidade-jogadores')

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

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

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

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


imagem.addEventListener("change", async() => {
    loader.show()
    const data = await uploadImagem(imagem, 0, mensagemErro)
    emblema.value = `${api}img/${data.results}`
    exibidorImagem(escudo, emblema.value)
    loader.hide()
    document.getElementById('salvar').disabled = !(data.succeed === true)
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
            errorMessage: 'Insira uma logo',
        },
        {
            rule: 'files',
            value: {
                files: {
                    extensions: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
                },
            },
            errorMessage: 'Tamanho máximo da imagem: 5mb',
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
    .addField(quantidadeJogadores, [
        {
            rule: 'required',
            errorMessage: 'Favor inserir número de jogadores por time',
        },
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();

        const resultado = await postCampeonato("championships", {
            "name": nomeCampeonato.value,
            "initialDate": dataInicial.value,
            "finalDate": dataFinal.value,
            "sportsId": parseInt(esporte.value),
            "teamQuantity": parseInt(quantidade.value),
            "logo": emblema.value,
            "description": descricao.value,
            "Format": parseInt(formato.value),
            "Nation": pais.value,
            "State": estado.value,
            "City": cidade.value,
            "Neighborhood": bairro.value,
            "NumberOfPlayers": quantidadeJogadores.value
        })

        if (resultado) {
            formulario.reset()
            escudo.src = "#"
        }
        loader.hide();
        
        window.location.assign('/pages/configuracao-campeonato.html')
    })

async function postCampeonato(endpoint, body) {
    if(cpfObrigatorio && !cadastrouCpf) {
        meuModal.show()
        return
    }
    if(!confirmouCpf) {
        location.reload()
        return
    }

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

async function postCpf(endpoint, body) {
    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro2.classList.add("text-danger")
        data.results.forEach(element => mensagemErro2.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, (res) => mensagemErro2.textContent = res.results, callbackServidor)
    if (!data) return false

    notificacaoSucesso(data.results[0])
    return true
}