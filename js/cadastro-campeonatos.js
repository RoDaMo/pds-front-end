import { configuracaoFetch, executarFetch, limparMensagem, api } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { notificacaoErro } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/cadastro-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-campeonatos.json' assert { type: 'JSON' }
import JustValidate from "just-validate"
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import { exibidorImagem } from './utilidades/previewImagem.js'
import { uploadImagem } from './utilidades/uploadImagem'
import i18next from "i18next";
import './utilidades/loader'
import * as bootstrap from 'bootstrap'

inicializarInternacionalizacao(ingles, portugues);

let meuModal
let confirmou = false

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()
   
    const endpoint = `auth/cpf`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    if(data === undefined) {
        notificacaoErro().close()
        const modal = document.getElementById('ModalErro')
        let modalErro =  new bootstrap.Modal(modal)
        modalErro.show()
        modal.addEventListener('hidden.bs.modal', () => {
            window.location.assign(`/index.html`)
        });
    }
    if(!data.results) {
        const modal = document.getElementById('JanelaModal')
        meuModal =  new bootstrap.Modal(modal)
        meuModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            if(!confirmou)
                window.location.assign(`/index.html`)
        });
    }
})

const mensagemErro2 = document.getElementById("mensagem-erro2")
const formularioCpf = document.getElementById("formCpf")
const cpf =  document.getElementById("cpf")
const validator2 = new JustValidate(formularioCpf, {
    validateBeforeSubmitting: true,
})

var cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', function(event) {
    var v = event.target.value
    v=v.replace(/\D/g,"")
    v=v.replace(/(\d{3})(\d)/,"$1.$2")
    v=v.replace(/(\d{3})(\d)/,"$1.$2")
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") 
    event.target.value = v;
});

validator2
    .addField(cpf, [
        {
            rule: 'required',
            errorMessage:  `<span class="i18" key="CpfObrigatorio">${i18next.t("CpfObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 14,
            errorMessage: `<span class="i18" key="CpfTamanho">${i18next.t("CpfTamanho")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 14,
            errorMessage: `<span class="i18" key="CpfTamanho">${i18next.t("CpfTamanho")}</span>`,
        },
        {
            validator: (value, context) => {
                const numberCpf = new Array(11)
                let test = value
                test =  test.replace(/[.-]/g, "")
                for (var i = 0; i < 11; i++)
                    numberCpf[i] = parseInt(test[i])

                let sum = 0
                for (let i = 0; i < 9; i++)
                    sum += numberCpf[i] * (10 - i)

                let firstVerifierDigit = (sum * 10) % 11
                firstVerifierDigit = firstVerifierDigit === 10 ? 0 : firstVerifierDigit

                sum = 0
                const arrayNova = numberCpf.slice()
                arrayNova[9] = firstVerifierDigit
                for (let i = 0; i < 10; i++)
                    sum += arrayNova[i] * (11 - i)

                let secondVerifierDigit = (sum * 10) % 11;
                secondVerifierDigit = secondVerifierDigit === 10 ? 0 : secondVerifierDigit

                return !(firstVerifierDigit !== numberCpf[9] || secondVerifierDigit !== numberCpf[10]);
            },
            errorMessage: `<span class="i18" key="CpfInvalido">${i18next.t("CpfInvalido")}</span>`,
        }
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();

        const resultado = await postCpf("auth/cpf", 
            cpf.value.replace(/[.-]/g, "")
        )

        if (resultado) {
            formularioCpf.reset()
            confirmou = true
            meuModal.hide()
        }

        loader.hide();
    })



let formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const escudo = document.getElementById('escudo')

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
const inputFormato = document.getElementById('input-formato')

const doubleMatchWrapper = document.getElementById('double-match-wrapper')

// Double Match Checkboxes
const doubleMatchPontosCorridos = document.createElement('div')
doubleMatchPontosCorridos.classList.add('form-check', 'mt-2')
doubleMatchPontosCorridos.innerHTML = `
    <label class="form-check-label" for="double-match-pc">
        <span class="i18 text-success " key="DoubleMatchPC">${i18next.t("DoubleMatchPC")}</span>
    </label>

    <input class="form-check-input" type="checkbox" value="" id="double-match-pc">
`

let PCCheckboxElem = null

const doubleMatchEliminatorias = document.createElement('div')
doubleMatchEliminatorias.classList.add('form-check', 'mt-2')
doubleMatchEliminatorias.innerHTML = `
    <label class="form-check-label" for="double-match-eliminatorias">
        <span class="i18 text-success " key="DoubleMatchEliminatorias">${i18next.t("DoubleMatchEliminatorias")}</span>
    </label>
    
    <input class="form-check-input" type="checkbox" value="" id="double-match-eliminatorias">
`

let eliminatoriasCheckboxElem = null

const doubleMatchFinal = document.createElement('div')
doubleMatchFinal.classList.add('form-check', 'mt-2')
doubleMatchFinal.innerHTML = `
    <label class="form-check-label" for="double-match-final">
        <span class="i18 text-success " key="DoubleMatchFinal">${i18next.t("DoubleMatchFinal")}</span>
    </label>

    <input class="form-check-input" type="checkbox" value="" id="double-match-final">
`

let finalCheckboxElem = null

const doubleMatchFaseDeGrupos = document.createElement('div')
doubleMatchFaseDeGrupos.classList.add('form-check', 'mt-2')
doubleMatchFaseDeGrupos.innerHTML = `
    <label class="form-check-label" for="double-match-FG">
        <span class="i18 text-success " key="DoubleMatchFG">${i18next.t("DoubleMatchFG")}</span>
    </label>

    <input class="form-check-input" type="checkbox" value="" id="double-match-FG">
`

let FGCheckboxElem = null


const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

const optionDefault = () => {
    const optionDefault = document.createElement('option')
    optionDefault.value = ""
    optionDefault.classList.add('i18')
    optionDefault.text = i18next.t("SelecioneOpcao")
    optionDefault.setAttribute("key", "SelecioneOpcao")
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


// Checkboxes
// Verify sport value
formato.addEventListener("change", () => {
    if(formato.value === "3"){
        resetQuantidade()
        for(let i = 1; i <= 18; i++ ){
            if(i % 2 === 0){
                adicionarOpcao(i + 2)
            }
        }
    } 
    else if(formato.value === "4"){
        resetQuantidade()
        for (let i = 2; i <= 6; i++) {
            adicionarOpcao(2 ** i)
        }
    }
    else {
        resetQuantidade()
        for(let i = 1; i <= 6; i++) {
            adicionarOpcao(2 ** i)
        }
    }

    doubleMatchWrapper.innerHTML = ""

    changeTeamQTDStatus()

    verifyDoubleMatch()
})

function changeTeamQTDStatus() {
    if (esporte.value && formato.value) {
        quantidade.value = ""
        quantidade.disabled = false;
        quantidade.setAttribute("key", "QuantidadePlaceholder")
        quantidade.setAttribute("placeholder", i18next.t("QuantidadePlaceholder"))
        quantidade.classList.remove("text-muted")
    } else {
        quantidade.value = ""
        quantidade.disabled = true;
        quantidade.firstElementChild.textContent = i18next.t("QuantidadePlaceholderDisabled")
        quantidade.classList.add("text-muted")
    }
}

function verifyDoubleMatch() {
    
    if (formato.value === "3") {
        doubleMatchWrapper.appendChild(doubleMatchPontosCorridos)
		PCCheckboxElem = document.getElementById('double-match-pc')
        
    } else if (formato.value === "1") {
        if (esporte.value === "1") {
            doubleMatchWrapper.appendChild(doubleMatchEliminatorias)
			eliminatoriasCheckboxElem = document.getElementById('double-match-eliminatorias')

            doubleMatchWrapper.appendChild(doubleMatchFinal)
			finalCheckboxElem = document.getElementById('double-match-final')

        }
    } else if (formato.value === "4") {
        doubleMatchWrapper.appendChild(doubleMatchFaseDeGrupos)
		FGCheckboxElem = document.getElementById('double-match-FG')

        if (esporte.value === "1") {
            doubleMatchWrapper.appendChild(doubleMatchEliminatorias)
			eliminatoriasCheckboxElem = document.getElementById('double-match-eliminatorias')

            doubleMatchWrapper.appendChild(doubleMatchFinal)
			finalCheckboxElem = document.getElementById('double-match-final')

        }
        
    }
}

let lng = localStorage.getItem('lng')

flatpickr(dataInicial, {
    dateFormat: "Y-m-d",
    locale: lng === 'ptbr' ? Portuguese : ingles,
    altInput: true,
})

flatpickr(dataFinal, {
    dateFormat: "Y-m-d",
    locale: lng === 'ptbr' ? Portuguese : ingles,
    altInput: true,
})

document.addEventListener('nova-lingua', event => {
    let lng = localStorage.getItem('lng')

    flatpickr(dataInicial, {
        dateFormat: "Y-m-d",
        locale: lng === 'ptbr' ? Portuguese : ingles,
        altInput: true,
    })

    flatpickr(dataFinal, {
        dateFormat: "Y-m-d",
        locale: lng === 'ptbr' ? Portuguese : ingles,
        altInput: true,
    })

    criarValidacao()

})


imagem.addEventListener("change", async() => {
    loader.show()
    const data = await uploadImagem(imagem, 0, mensagemErro)
    loader.hide()
    
    if (Array.isArray(data.results))
        return;

    emblema.value = `${api}img/${data.results}`
    exibidorImagem(escudo, emblema.value)
    document.getElementById('salvar').disabled = !(data.succeed === true)
})

esporte.addEventListener("change", () => {
    
    doubleMatchWrapper.innerHTML = ""

    changeTeamQTDStatus()
    
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

        formato.disabled = false;
        formato.value = ""
        formato.firstElementChild.textContent = i18next.t("FormatoPlaceholder")
        formato.classList.remove("text-muted")
    } else {
        doubleMatchWrapper.innerHTML = ""

        quantidadeJogadores.value = ""
        quantidadeJogadores.disabled = true;
        quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholderDisabled")
        quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholderDisabled"))

        formato.disabled = true;
        formato.value = ""
        formato.firstElementChild.textContent = i18next.t("FormatoPlaceholderDisabled")
        formato.classList.add("text-muted")
    }
})

quantidadeJogadores.addEventListener("change", () => {
    if(esporte.value === "1") {
        if(quantidadeJogadores.value < 11) {
            quantidadeJogadores.value = 11
        } else if (quantidadeJogadores.value > 25) {
            quantidadeJogadores.value = 25
        }
    } else if(esporte.value === "2") {
        if(quantidadeJogadores.value < 6) {
            quantidadeJogadores.value = 6
        } else if (quantidadeJogadores.value > 15) {
            quantidadeJogadores.value = 15
        }
    }
})

async function postCampeonato(endpoint, body) {
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    loader.show()
    const data = await executarFetch(endpoint, configuracaoFetch("POST", body), callbackServidor, callbackServidor)
    loader.hide()

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

    loader.show()
    const data = await executarFetch(endpoint, config, (res) => mensagemErro2.textContent = res.results, callbackServidor)
    loader.hide()

    if (!data) return false

    notificacaoSucesso(data.results[0])
    return true
}

criarValidacao()

function criarValidacao() {
    i18next.changeLanguage(localStorage.getItem('lng'))
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
                dataAtual.setDate(dataAtual.getDate() - 1)
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
    .addField(emblema, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EmblemaObrigatorio">${i18next.t("EmblemaObrigatorio")}</span>`,
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
            "NumberOfPlayers": quantidadeJogadores.value,
            "DoubleStartLeagueSystem": PCCheckboxElem?.checked,
            "DoubleMatchEliminations": (parseInt(quantidade.value) === 2 || (parseInt(formato.value) === 4 && parseInt(quantidade.value) === 4)) ? false : eliminatoriasStatus,
            "FinalDoubleMatch": finalCheckboxElem?.checked,
            "DoubleMatchGroupStage": FGCheckboxElem?.checked,
        })

        if (resultado) {
            formulario.reset()
            escudo.src = "#"
        }
        loader.hide();
        
        window.location.assign(`/pages/configuracao-campeonato.html`)
    })
}