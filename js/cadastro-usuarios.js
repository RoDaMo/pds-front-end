import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import { visualizarSenha } from "./utilidades/visualizar-senha"

const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const botaoContinuar = document.getElementById("continuar")

const nomeUsuario = document.getElementById("nome-usuario")
const nome = document.getElementById("nome")
const email = document.getElementById("email-usuario")
const senha = document.getElementById("senha")
const dataAniversario = document.getElementById("data")

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
const emailRegex = (str) => /\S+@\S+\.\S+/.test(str);
const nomeUsuarioRegex = (str) => /^[A-Za-z0-9_-]*$/.test(str);
const caracteres = (str) => /.{4,}/.test(str);
const especial = (str) => /^[a-zA-Z0-9 ]*$/.test(str);

botaoContinuar.addEventListener("click", () => {
    if(!emailRegex(email.value) || email.value === ""){
        document.getElementById("email-validacao").textContent = "Email Inválido"
    }
    else{
        document.getElementById("parte-2").classList.remove("d-none")
        document.getElementById("formulario-1").classList.add("d-none")
        document.getElementById("bem-vindo").classList.add("d-none")
        document.getElementById("texto-apresentacao").textContent = "Você ainda não tem uma conta! Crie a sua e junte-se a nós."
        document.getElementById("formulario-2").classList.remove("d-none")
        document.getElementById("email-validacao").textContent = ""
    }
})

const validacoes = () => {
    let controle = true;

    const mensagemErro = (elementoId, mensagemErro) => {
        document.getElementById(elementoId).textContent = mensagemErro;
    }

    const limparMensagemErro = (elementoId) => {
        document.getElementById(elementoId).textContent = "";
    }

    if(!emailRegex(email.value) || email.value === ""){
        mensagemErro("email-validacao", "Email inválido");
        controle = false;
    } else {
        limparMensagemErro("email-validacao");
    }

    if(nome.value === ""){
        mensagemErro("nome-validacao", "Nome inválido");
        controle = false;
    } else {
        limparMensagemErro("nome-validacao");
    }

    if(!nomeUsuarioRegex(nomeUsuario.value) || nomeUsuario.value === ""){
        mensagemErro("nome-usuario-validacao", "Nome de usuário inválido, não pode conter espaço nem caractere especial");
        controle = false;
    } else {
        limparMensagemErro("nome-usuario-validacao");
    }

    if(dataAniversario.value === ""){
        mensagemErro("data-validacao", "Data de nascimento inválida, é necessário possuir pelo menos 13 anos de idade para se cadastrar");
        controle = false;
    } else {
        limparMensagemErro("data-validacao");
    }

    if(!letraMaiuscula(senha.value) || !letraMinuscula(senha.value) || !numero(senha.value) || !especial(senha.value) || !caracteres(senha.value)){
        controle = false;
    }

    return controle;
}

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    if(!validacoes()) return

    const resultado = await postUsuario("auth/register", {
        "Name": nome.value,
        "Email": email.value,
        "Password": senha.value,
        "Username": nomeUsuario.value,
        "Birthday": dataAniversario.value
    })
    
    if (resultado)
        formulario.reset()
})

async function postUsuario(endpoint, body) {
    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, null, callbackServidor)

    if (!data) return false

    notificacaoSucesso(data.message)
    return true
}