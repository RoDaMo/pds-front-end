import { configuracaoFetch, executarFetch, limparMensagem, api } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { notificacaoErro } from "./utilidades/notificacoes"
import { exibidorImagem } from '../js/utilidades/previewImagem'
import JustValidate from "just-validate"
import { uploadImagem } from './utilidades/uploadImagem'
import portugues from './i18n/ptbr/cadastro-times.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-times.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import './utilidades/loader'
import * as bootstrap from 'bootstrap'

inicializarInternacionalizacao(ingles, portugues);

document.addEventListener('nova-lingua', event => {
    criarValidacao()
})

let meuModal
let confirmou = false

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()
   
    let endpoint = `auth/cpf`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    console.log(data)

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

const cpfLabel = document.getElementById('cpf-label');

cpf.addEventListener('input', function(event) {
    let v = event.target.value
    v=v.replace(/\D/g,"")
    v=v.replace(/(\d{3})(\d)/,"$1.$2")
    v=v.replace(/(\d{3})(\d)/,"$1.$2")
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2") 
    event.target.value = v;
});

let selecionado = 'cpf'
const cnpjInput = document.getElementById('cnpj')
cnpjInput.addEventListener('input', (e) => {
    const x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
});

const cnpjLabel = document.getElementById('cnpj-label')

document.getElementById('cnpj-radio').addEventListener('change', () => {
    selecionado = 'cnpj'
    cpf.classList.add('d-none')
    cpfLabel.classList.add('d-none')
    cnpjInput.classList.remove('d-none')
    cnpjLabel.classList.remove('d-none')
    cpf.value = null
})

document.getElementById('cpf-radio').addEventListener('change', () => {
    selecionado = 'cpf'
    cpf.classList.remove('d-none')
    cpfLabel.classList.remove('d-none')
    cnpjInput.classList.add('d-none')
    cnpjLabel.classList.add('d-none')
    cnpjInput.value = null
})

validator2
    .addField(cpf, [
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
                if (cnpjInput.value)
                    return true;

                
                const numberCpf = new Array(11)
                let test = value
                test =  test.replace(/[.-]/g, "")
                if (/^(.)\1*$/.test(test))
                    return false
                
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
        },
        {
            validator: (value, context) => value ? true : cnpjInput.value ? true : false,
            errorMessage:  `<span class="i18" key="CpfObrigatorio">${i18next.t("CpfObrigatorio")}</span>`,
        }
    ])
    .addField(cnpjInput, [
        {
            rule: 'minLength',
            value: 18,
            errorMessage: `<span class="i18" key="CpfTamanho">${i18next.t("CnpjTamanho")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 18,
            errorMessage: `<span class="i18" key="CpfTamanho">${i18next.t("CnpjTamanho")}</span>`,
        },
        {
            validator: validarCNPJ,
            errorMessage: `<span class="i18" key="CpfInvalido">${i18next.t("CnpjInvalido")}</span>`,
        },
        {
            validator: (value, context) => value ? true : cpf.value ? true : false,
            errorMessage:  `<span class="i18" key="CpfObrigatorio">${i18next.t("CnpjObrigatorio")}</span>`,
        }
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();
        const valor = cpf.value ? cpf.value.replace(/[.-]/g, "") : cnpjInput.value.trim().replace(/\D/g, '')

        const resultado = await postCpf("auth/cpf", 
            valor
        )

        if (resultado) {
            formularioCpf.reset()
            confirmou = true
            meuModal.hide()
        }

        loader.hide();
    })

function validarCNPJ(cnpj, context) {
    if (cpf.value)
        return true

    const multiplicador1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    const multiplicador2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];

    cnpj = cnpj.trim().replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

    if (cnpj.length !== 14 || /^0+$/.test(cnpj)) 
        return false;

    let tempCnpj = cnpj.substring(0, 12);

    let digito = calcularDigito(tempCnpj, multiplicador1);
    digito += calcularDigito(tempCnpj + digito, multiplicador2);

    return cnpj.endsWith(digito);
}

function calcularDigito(valor, multiplicadores) {
    let soma = 0;

    for (let i = 0; i < valor.length; i++) {
        soma += (valor.charAt(i) - '0') * multiplicadores[i];
    }

    let resto = soma % 11;
    if (resto < 2) 
        resto = 0;
    else 
        resto = 11 - resto;

    return String(resto);
}

const loader = document.createElement('app-loader');
document.body.appendChild(loader);


const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const escudo = document.getElementById("escudo")
const home = document.getElementById("home")
const away = document.getElementById("away")

const emblema = document.getElementById("emblema")
const uniforme1 = document.getElementById("uniforme-1")
const uniforme2 = document.getElementById("uniforme-2")

const nome = document.getElementById("nome")
const esporte = document.getElementById("esportes")
const descricao = document.getElementById("descricao")
const logo = document.getElementById("logo")
const uniformeHome = document.getElementById("uniforme-casa")
const uniformeAway = document.getElementById("uniforme-fora")

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

exibidorImagem(emblema, escudo)
exibidorImagem(uniformeHome, home)
exibidorImagem(uniformeAway, away)

criarValidacao()

let imagensValidacao = {
    logo: false,
    uCasa: false,
    uFora: false,
}

const ativarBotao = () => (imagensValidacao.logo && imagensValidacao.uCasa && imagensValidacao.uFora) ? document.getElementById('salvar').disabled = false : document.getElementById('salvar').disabled = true

logo.addEventListener("change", async() => {
    const data = await uploadImagem(logo, 4, mensagemErro)

    emblema.value = `${api}img/${data.results}`
    exibidorImagem(escudo, emblema.value)
    
    imagensValidacao.logo = data.succeed === true
    console.log(imagensValidacao)
    ativarBotao()
})

uniformeHome.addEventListener("change", async() => {
    const data = await uploadImagem(uniformeHome, 3, mensagemErro)

    uniforme1.value = `${api}img/${data.results}`
    exibidorImagem(home, uniforme1.value)
    
    imagensValidacao.uCasa = data.succeed === true
    console.log(imagensValidacao)
    ativarBotao()
})

uniformeAway.addEventListener("change", async() => {
    const data = await uploadImagem(uniformeAway, 3, mensagemErro)

    uniforme2.value = `${api}img/${data.results}`
    exibidorImagem(away, uniforme2.value)

    imagensValidacao.uFora = data.succeed === true
    console.log(imagensValidacao)
    ativarBotao()
})


async function postTime(endpoint, body) {
    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)

    if (!data) return false

    notificacaoSucesso(data.message)
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

function criarValidacao() {
    i18next.changeLanguage(localStorage.getItem('lng'))
    validator
    .addField(nome, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="NomeTimeObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: `<span class="i18" key="NomeTimeMinimo">${i18next.t("NomeTimeMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 100,
            errorMessage: `<span class="i18" key="NomeTimeMaximo">${i18next.t("NomeTimeMaximo")}</span>`,
        }
    ])
    .addField(esporte, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EsporteObrigatorio">${i18next.t("EsporteObrigatorio")}</span>`,
        },
    ])
    .addField(emblema, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EmblemaTimeObrigatorio">${i18next.t("EmblemaTimeObrigatorio")}</span>`,
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
            errorMessage: `<span class="i18" key="TamanhoMaximo">${i18next.t("TamanhoMaximo")}</span>`,
        }
    ])
    .addField(uniforme1, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="Uniforme1Obrigatorio">${i18next.t("Uniforme1Obrigatorio")}</span>`,
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
            errorMessage: `<span class="i18" key="TamanhoMaximo">${i18next.t("TamanhoMaximo")}</span>`,
        }
    ])
    .addField(uniforme2, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="Uniforme2Obrigatorio">${i18next.t("Uniforme2Obrigatorio")}</span>`,
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
            errorMessage: `<span class="i18" key="TamanhoMaximo">${i18next.t("TamanhoMaximo")}</span>`,
        }
    ])
    .addField(uniformeHome, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="UniformeCasaObrigatorio">${i18next.t("UniformeCasaObrigatorio")}</span>`,
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
            errorMessage: `<span class="i18" key="TamanhoMaximo">${i18next.t("TamanhoMaximo")}</span>`,
        }

    ])
    .addField(uniformeAway, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="UniformeForaObrigatorio">${i18next.t("UniformeForaObrigatorio")}</span>`,
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
            errorMessage: `<span class="i18" key="TamanhoMaximo">${i18next.t("TamanhoMaximo")}</span>`,
        }
    ])
    .addField(logo, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="LogoObrigatorio">${i18next.t("LogoObrigatorio")}</span>`,
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
            errorMessage: `<span class="i18" key="TamanhoMaximo">${i18next.t("TamanhoMaximo")}</span>`,
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
            value: 1000,
            errorMessage: `<span class="i18" key="DescricaoMaximo">${i18next.t("DescricaoMaximo")}</span>`,
        }
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();

        const resultado = await postTime("teams", {
            "emblem": emblema.value,
            "uniformHome": uniforme1.value,
            "uniformAway": uniforme2.value,
            "sportsId": esporte.value,
            "name": nome.value,
        })
        
        if (resultado){
            formulario.reset()
            escudo.src = "#"
            home.src = "#"
            away.src = "#"
            window.location.assign('/')
        }

        loader.hide();
        window.location.assign(`/pages/configuracao-time.html`)

    })
}

window.dispatchEvent(new Event('pagina-load'))