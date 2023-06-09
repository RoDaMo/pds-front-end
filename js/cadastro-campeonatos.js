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
import i18next from "i18next";
import './utilidades/loader'
import * as bootstrap from 'bootstrap'

inicializarInternacionalizacao(ingles, portugues);

document.querySelector('#lingua').addEventListener('change', event => {
    const selectedIndex = event.target.selectedIndex;
    localStorage.setItem('lng', event.target.children[selectedIndex].value);
    document.body.dispatchEvent(new Event('nova-lingua', { bubbles: true }))
})

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
            errorMessage:  `<span class="i18" key="CpfObrigatorio">${i18next.t("CpfObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 11,
            errorMessage: `<span class="i18" key="CpfTamanho">${i18next.t("CpfTamanho")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 11,
            errorMessage: `<span class="i18" key="CpfTamanho">${i18next.t("CpfTamanho")}</span>`,
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
            errorMessage: `<span class="i18" key="CpfInvalido">${i18next.t("CpfInvalido")}</span>`,
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
    optionDefault.value = ""
    optionDefault.innerHTML = `<span class="i18" key="SelecioneOpcao">${i18next.t("SelecioneOpcao")}</span>`,
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

esporte.addEventListener("change", () => {
    if(esporte.value === "1") {
        quantidadeJogadores.value = ""
        quantidadeJogadores.setAttribute("min", 11)
        quantidadeJogadores.setAttribute("max", 25)
    } else if(esporte.value === "2") {
        quantidadeJogadores.value = ""
        quantidadeJogadores.setAttribute("min", 6)
        quantidadeJogadores.setAttribute("max", 15)
    }

    if (esporte.value) {
        quantidadeJogadores.value = ""
        quantidadeJogadores.disabled = false;
        quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholder")
        quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholder"))
    } else {
        quantidadeJogadores.value = ""
        quantidadeJogadores.disabled = true;
        quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholderDisabled")
        quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholderDisabled"))
    }
})

quantidadeJogadores.addEventListener("change", () => {
    if(esporte.value === "1") {
        if(quantidadeJogadores.value < 11 || quantidadeJogadores.value > 25) {
            quantidadeJogadores.value = 11
        }
    } else if(esporte.value === "2") {
        if(quantidadeJogadores.value < 6 || quantidadeJogadores.value > 15) {
            quantidadeJogadores.value = 6
        }
    }
})



validator
    .addField(nomeCampeonato, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="NomeCampeonatoObrigatorio">${i18next.t("NomeCampeonatoObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: `<span class="i18" key="NomeCampeonatoMinimo">${i18next.t("NomeCampeonatoMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 40,
            errorMessage: `<span class="i18" key="NomeCampeonatoMaximo">${i18next.t("NomeCampeonatoMaximo")}</span>`,
        },
    ])
    .addField(dataInicial, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="DataInicialObrigatoria">${i18next.t("DataInicialObrigatoria")}</span>`,
        },
        {
            validator: (value) => {
                const dataInicial = new Date(value)
                const dataAtual = new Date()
                return dataInicial >= dataAtual
            },
            errorMessage: `<span class="i18" key="DataInicialMaiorIgual">${i18next.t("DataInicialMaiorIgual")}</span>`

        }
    ])
    .addField(dataFinal, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="DataFinalObrigatoria">${i18next.t("DataFinalObrigatoria")}</span>`,
        },
        {
            validator: (value) => {
                const dataInicial = new Date(document.getElementById("data-inicial").value)
                const dataFinal = new Date(value)
                return dataFinal >= dataInicial
            },
            errorMessage: `<span class="i18" key="DataFinalMaiorIgual">${i18next.t("DataFinalMaiorIgual")}</span>`
        }
    ])
    .addField(esporte, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EsporteObrigatorio">${i18next.t("EsporteObrigatorio")}</span>`,
        },
    ])
    .addField(formato, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="FormatoObrigatorio">${i18next.t("FormatoObrigatorio")}</span>`,
        },
    ])
    .addField(quantidade, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="QuantidadeObrigatoria">${i18next.t("QuantidadeObrigatoria")}</span>`,
        },
    ])
    .addField(imagem, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="LogoObrigatoria">${i18next.t("LogoObrigatoria")}</span>`,
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
            errorMessage: `<span class="i18" key="ImagemTamanho">${i18next.t("ImagemTamanho")}</span>`,
        }
    ])
    .addField(pais, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="PaisObrigatorio">${i18next.t("PaisObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: `<span class="i18" key="PaisMinimo">${i18next.t("PaisMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 40,
            errorMessage: `<span class="i18" key="PaisMaximo">${i18next.t("PaisMaximo")}</span>`,
        },
    ])
    .addField(estado, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EstadoObrigatorio">${i18next.t("EstadoObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: `<span class="i18" key="EstadoMinimo">${i18next.t("EstadoMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 40,
            errorMessage: `<span class="i18" key="EstadoMaximo">${i18next.t("EstadoMaximo")}</span>`,
        },
    ])
    .addField(cidade, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="CidadeObrigatoria">${i18next.t("CidadeObrigatoria")}</span>`,
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: `<span class="i18" key="CidadeMinimo">${i18next.t("CidadeMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 40,
            errorMessage: `<span class="i18" key="CidadeMaximo">${i18next.t("CidadeMaximo")}</span>`,
        },
    ])
    .addField(bairro, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="BairroObrigatorio">${i18next.t("BairroObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: `<span class="i18" key="BairroMinimo">${i18next.t("BairroMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 40,
            errorMessage: `<span class="i18" key="BairroMaximo">${i18next.t("BairroMaximo")}</span>`,
        },

    ])
    .addField(descricao, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="DescricaoObrigatoria">${i18next.t("DescricaoObrigatoria")}</span>`,
        },
        {
            rule: 'minLength',
            value: 10,
            errorMessage: `<span class="i18" key="DescricaoMinimo">${i18next.t("DescricaoMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 2000,
            errorMessage: `<span class="i18" key="DescricaoMaximo">${i18next.t("DescricaoMaximo")}</span>`,
        },
    ])
    .addField(quantidadeJogadores, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="QuantidadeJogadoresObrigatorio">${i18next.t("QuantidadeJogadoresObrigatorio")}</span>`,
        },  
        {
            validator: (value) => {
                if (esporte.value == "2") {
                    return value >= 6 && value <= 15
                } else if (esporte.value == "1") { 
                    return value >= 11 && value <= 25
                }
            },
            errorMessage: `<span class="i18" key="QuantidadeJogadoresInvalido">${i18next.t("QuantidadeJogadoresInvalido")}</span>`,
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