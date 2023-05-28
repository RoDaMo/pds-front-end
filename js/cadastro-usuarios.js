import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import { visualizarSenha } from "./utilidades/visualizar-senha"
import JustValidate from "just-validate"
import {redirecionamento} from './utilidades/redirecionamento'

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

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

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

flatpickr(dataAniversario, {
    dateFormat: "Y-m-d",
    locale: Portuguese,
    altInput: true,
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

validator
    .addField(email, [
        {
            rule: 'required',
            errorMessage: 'O email é obrigatório.'
        },
        {
            rule: 'email',
            errorMessage: 'Email inválido.'
        },
    ])
    .addField(nome, [
        {
            rule: 'required',
            errorMessage: 'O nome é obrigatório.'
        },
    ])
    .addField(nomeUsuario, [
        {
            rule: 'required',
            errorMessage: 'O nome de usuário é obrigatório.'
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: 'Nome de usuário deve possuir no mínimo 4 caracteres.',
        },
        {
            rule: 'maxLength',
            value: 20,
            errorMessage: 'Nome de usuário deve possuir no máximo 20 caracteres.',
        },
        {
            rule: 'customRegexp',
            value: /^[A-Za-z0-9_-]*$/,
            errorMessage: 'Nome de usuário inválido, não pode conter espaço nem caractere especial.',
        },
    ])
    .addField(dataAniversario, [
        {
            rule: 'required',
            errorMessage: 'A data é obrigatória. É necessário possuir pelo menos 13 anos de idade para se cadastrar.'
        },
    ])
    .addField(senha, [
        {
            rule: 'required',
            errorMessage: 'A senha é obrigatória.'
        },
        {
            rule: 'customRegexp',
            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{4,}$/,
            errorMessage: " ",
        }
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)


        const resultado = await postUsuario("auth/register", {
            "Name": nome.value,
            "Email": email.value,
            "Password": senha.value,
            "Username": nomeUsuario.value,
            "Birthday": dataAniversario.value
        })
        
        if (resultado){
            window.location.assign(`/pages/login.html?userName=${nomeUsuario.value}`);
        }
    })
    
    if (resultado){
        apresentarResultado()
    }
})

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

    const data = await executarFetch(endpoint, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)

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
