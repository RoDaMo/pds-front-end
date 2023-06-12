import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import { visualizarSenha } from "./utilidades/visualizar-senha"
import JustValidate from "just-validate"
import { redirecionamento } from './utilidades/redirecionamento'
import './utilidades/loader'
import portugues from './i18n/ptbr/cadastro-usuario.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-usuario.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const h1 = document.getElementById("bem-vindo")
const h4 = document.getElementById("texto-apresentacao")
const divResposta = document.getElementById("div-reposta")
const botao = document.getElementById("reenviar-email")

const nomeUsuario = document.getElementById("nome-usuario")
const nome = document.getElementById("nome")
const email = document.getElementById("email-usuario")
const senha = document.getElementById("senha")
const dataAniversario = document.getElementById("data")
const useTermsCheckbox = document.getElementById("useTermsCheckbox")
const privacyTermsCheckbox = document.getElementById("privacyTermsCheckbox")

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const iconeMaiuscula = document.getElementById("icone-maiuscula")
const textoMaiuscula = document.getElementById("texto-maiuscula")
const iconeMinuscula = document.getElementById("icone-minuscula")
const textoMinuscula = document.getElementById("texto-minuscula")
const iconeNumero = document.getElementById("icone-numero")
const textoNumero = document.getElementById("texto-numero")
const iconeCaractere = document.getElementById("icone-caractere")
const textoCaractere = document.getElementById("texto-caractere")
const iconeEspecial = document.getElementById("icone-especial")
const textoEspecial = document.getElementById("texto-especial")

let idUsuario = null

redirecionamento(nomeUsuario)

const lng = localStorage.getItem('lng')

flatpickr(dataAniversario, {
    dateFormat: "Y-m-d",
    locale: lng === 'ptbr' ? Portuguese : ingles,
    altInput: true,
    minDate: new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()),
    maxDate: new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDate())
})

visualizarSenha()

const mudarClasse = (elemento, textoElemento, condicao) => {
    if(condicao){
        elemento.classList.remove("bi-x-circle-fill", "text-danger");
        elemento.classList.add("bi-check-circle-fill", "text-success");
        textoElemento.classList.remove("text-danger");
        textoElemento.classList.add("text-success");
    } else {
        elemento.classList.remove("bi-check-circle-fill", "text-success");
        elemento.classList.add("bi-x-circle-fill", "text-danger");
        textoElemento.classList.remove("text-success");
        textoElemento.classList.add("text-danger");
    }
}

senha.addEventListener("keyup", () => {
    let valorSenha = senha.value;
    mudarClasse(iconeMaiuscula, textoMaiuscula, letraMaiuscula(valorSenha));
    mudarClasse(iconeMinuscula, textoMinuscula, letraMinuscula(valorSenha));
    mudarClasse(iconeNumero, textoNumero, numero(valorSenha));
    mudarClasse(iconeCaractere, textoCaractere, caracteres(valorSenha));
    mudarClasse(iconeEspecial, textoEspecial, especial(valorSenha));
});

const letraMaiuscula = (str) => /[A-Z]/.test(str);
const letraMinuscula = (str) => /[a-z]/.test(str);
const numero = (str) => /[0-9]/.test(str);
const caracteres = (str) => /.{4,}/.test(str);
const especial = (str) => /^[a-zA-Z0-9 ]*$/.test(str);

criarValidacao()

botao.addEventListener("click", async() => {
    let endpoint = `auth/resend-confirm-email?id=${idUsuario}`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    if(data)
        notificacaoSucesso(data.message)
})

async function postUsuario(endpoint, body) {
    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    loader.show()
    const data = await executarFetch(endpoint, config, callbackServidor, callbackServidor)
    loader.hide()

    if (!data) return false

    idUsuario = data.results
    notificacaoSucesso(data.message)
    return true
}

function apresentarResultado() {
    h1.style.display = "none"
    h4.style.display = "none"
    formulario.style.display = "none"
    divResposta.classList.remove("d-none")
}
const inputData = document.querySelector('[tabindex]')
inputData.placeholder = i18next.t("DataNascimentoPlaceholder")
dataAniversario.placeholder = i18next.t("DataNascimentoPlaceholder")
inputData.setAttribute('key', 'DataNascimentoPlaceholder')
inputData.classList.add("i18-placeholder")

document.addEventListener('DOMContentLoaded', () => document.dispatchEvent(new Event('header-carregado', { bubbles: true })))
i18next.on('languageChanged', event => {
    criarValidacao()
    
    inputData.placeholder = i18next.t("DataNascimentoPlaceholder")
    dataAniversario.placeholder = i18next.t("DataNascimentoPlaceholder")
    inputData.setAttribute('key', 'DataNascimentoPlaceholder')
    inputData.classList.add("i18-placeholder")

    flatpickr(dataAniversario, {
        dateFormat: "Y-m-d",
        locale:  localStorage.getItem('lng') === 'ptbr' ? Portuguese : ingles,
        altInput: true,
        maxDate: new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDate())
    })
})

const opcao1 = document.getElementById("1")
const opcao2 = document.getElementById("2")
lng === 'ptbr' ? opcao1.selected = 'true' : opcao2.selected = 'true'


function criarValidacao() {
    validator
    .addField(email, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EmailObrigatorio">${i18next.t("EmailObrigatorio")}</span>`
        },
        {
            rule: 'email',
            errorMessage: `<span class="i18" key="EmailInvalido">${i18next.t("EmailInvalido")}</span>`
        },
    ])
    .addField(nome, [
        {
            rule: 'required',
            errorMessage:  `<span class="i18" key="NomeObrigatorio">${i18next.t("NomeObrigatorio")}</span>`
        },
        {
            rule: 'minLength',
            value: 1,
            errorMessage: `<span class="i18" key="NomeMinimo">${i18next.t("NomeMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 100,
            errorMessage: `<span class="i18" key="NomeMaximo">${i18next.t("NomeMaximo")}</span>`,
        },
    ])
    .addField(nomeUsuario, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeUsuarioObrigatorio")}</span>`
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage:  `<span class="i18" key="NomeUsuarioMinimo">${i18next.t("NomeUsuarioMinimo")}</span>`,
        },
        {
            rule: 'maxLength',
            value: 20,
            errorMessage: `<span class="i18" key="NomeUsuarioMaximo">${i18next.t("NomeUsuarioMaximo")}</span>`,
        },
        {
            rule: 'customRegexp',
            value: /^[A-Za-z0-9_-]*$/,
            errorMessage: `<span class="i18" key="NomeUsuarioInvalido">${i18next.t("NomeUsuarioInvalido")}</span>`,
        },
    ])
    .addField(dataAniversario, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="DataNascimentoObrigatoria">${i18next.t("DataNascimentoObrigatoria")}</span>`
        },
    ])
    .addField(senha, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="SenhaObrigatoria">${i18next.t("SenhaObrigatoria")}</span>`
        },
        {
            rule: 'customRegexp',
            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{4,}$/,
            errorMessage: " ",
        }
    ])
    .addField(useTermsCheckbox, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="TermosUsoObrigatorio">${i18next.t("TermosUsoObrigatorio")}</span>`
        },
    ])
    .addField(privacyTermsCheckbox, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="PoliticaPrivacidadeObrigatoria">${i18next.t("PoliticaPrivacidadeObrigatoria")}</span>`
        },
    ])
    validator.onSuccess(async (e) => {
        e.preventDefault();
        limparMensagem(mensagemErro);
      
        const resultado = await postUsuario("auth/register", {
            "Name": nome.value,
            "Email": email.value,
            "Password": senha.value,
            "Username": nomeUsuario.value,
            "Birthday": dataAniversario.value
        })
        
        if (resultado){
            apresentarResultado()
        }
    });
}
