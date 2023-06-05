import { configuracaoFetch, limparMensagem, executarFetch } from "./utilidades/configFetch"
import { notificacaoErro } from "./utilidades/notificacoes"
import { visualizarSenha } from "./utilidades/visualizar-senha"
import portugues from './i18n/ptbr/redefinir-senha.json' assert { type: 'JSON' }
import ingles from './i18n/en/redefinir-senha.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const tradutor = document.querySelector('#lingua')
tradutor.addEventListener('change', event => {
    const selectedIndex = event.target.selectedIndex;
    localStorage.setItem('lng', event.target.children[selectedIndex].value);
    document.body.dispatchEvent(new Event('nova-lingua', { bubbles: true }))
})

const opcao1 = document.getElementById("1")
const opcao2 = document.getElementById("2")
const lng = localStorage.getItem('lng');
lng === 'ptbr' ? opcao1.selected = 'true' : opcao2.selected = 'true'

let email

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()

    const divReposta = document.getElementById("div-reposta")
    const divReposta2 = document.getElementById("div-reposta-2")

    let queryString = window.location.search
    let endpoint = `auth/reset-password${queryString}`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    if(!data) {
        divReposta.classList.remove("d-none")
    } else {
        divReposta2.classList.remove("d-none")
        visualizarSenha()
        email = data.results[0]
    }
})

const formulario = document.getElementById("formulario")
const senha = document.getElementById("senha")
const mensagemErro = document.getElementById("mensagem-erro")

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

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    if(!validacoes()) return

    await postToken({
        "Email": email,
        "Password": senha.value,
    })
})

async function postToken(body) {
    const config = configuracaoFetch("POST", body)
   
    const res = await fetch(`https://playoffs-api.up.railway.app/auth/reset-password`, config)

    const data = await res.json()

    if(res.ok){
        window.location.assign(`/pages/login.html?userName=${data.results}`)
    } else {
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
        senha.value = ""
        notificacaoErro(data.message)
    } 
}

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

const validacoes = () => {
    let controle = true;

    if(!letraMaiuscula(senha.value) || !letraMinuscula(senha.value) || !numero(senha.value) || !especial(senha.value) || !caracteres(senha.value)){
        controle = false;
    }

    return controle;
}