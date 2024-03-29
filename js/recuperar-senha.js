import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import JustValidate from "just-validate"
import { configuracaoFetch, executarFetch, limparMensagem, api } from "./utilidades/configFetch"
import portugues from './i18n/ptbr/recuperar-senha.json' assert { type: 'JSON' }
import ingles from './i18n/en/recuperar-senha.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import './utilidades/loader'


const loader = document.createElement('app-loader')
document.body.appendChild(loader)

inicializarInternacionalizacao(ingles, portugues)

document.addEventListener('nova-lingua', criarValidacao)

const recoverPassCardHeader = document.querySelector("#recoverpass-card-header")

document.addEventListener("DOMContentLoaded", () => {
    recoverPassCardHeader.insertAdjacentHTML('afterbegin', `
        <a class="navbar-brand justify-content-center d-flex m-auto p-auto col-9" href="/"><img src=${(document.documentElement.getAttribute("data-bs-theme") == "light") ? "/Logo_Playoffs.png" : "/Logo_Playoffs_White.png"} class="img-fluid" width="300" alt="Logo Playoffs"></a>
    `)    

    const navbarBrandImg = document.querySelector(".navbar-brand img")

    document.querySelectorAll(".theme-option-btns").forEach(btn => {
        btn.addEventListener('click', async () => {
            (document.documentElement.getAttribute('data-bs-theme') != "light") ?
            navbarBrandImg.setAttribute('src', '/Logo_Playoffs.png')
            : navbarBrandImg.setAttribute('src', "/Logo_Playoffs_White.png")
        })
    })
})

const opcao1 = document.getElementById("1")
const opcao2 = document.getElementById("2")
const lng = localStorage.getItem('lng');
lng === 'ptbr' ? opcao1.selected = 'true' : opcao2.selected = 'true'

const formulario = document.getElementById("formulario")
const email = document.getElementById("email")
const mensagemErro = document.getElementById("mensagem-erro")
const botao = document.getElementById("reenviar-email")
const divResposta = document.getElementById("div-reposta")
let idUsuario = null

async function postToken(body) {
    const config = configuracaoFetch("POST", body)
    loader.show()
    const res = await fetch(`${api}auth/forgot-password`, config)
    loader.hide()

    const data = await res.json()

    if(res.ok){
        idUsuario = data.results
        notificacaoSucesso(data.message)
        apresentarResultado()
    } else {
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
        email.value = ""
        notificacaoErro(data.message)
    } 
}

function apresentarResultado() {
    formulario.style.display = "none"
    divResposta.classList.remove("d-none")
}

botao.addEventListener("click", async () => {
    loader.show()
    const data = await executarFetch(`auth/resend-forgot-password?id=${idUsuario}`, configuracaoFetch("GET"))
    loader.hide()

    if(data) notificacaoSucesso(data.message)
})

// const emailRegex = (str) => /\S+@\S+\.\S+/.test(str);

// const validacoes = () => {
//     let controle = true;

//     const mensagemErro = (elementoId, mensagemErro) => {
//         document.getElementById(elementoId).innerHTML = mensagemErro;
//     }

//     const limparMensagemErro = (elementoId) => {
//         document.getElementById(elementoId).textContent = "";
//     }

//     if(!emailRegex(email.value) || email.value === ""){
//         mensagemErro("email-validacao", `<span class="i18" key="EmailInvalido">${i18next.t("EmailInvalido")}</span>`);
//         controle = false;
//     } else {
//         limparMensagemErro("email-validacao");
//     }

//     return controle;
// }


const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})
criarValidacao()

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
    .onSuccess(async (e) => {
        e.preventDefault();
        limparMensagem(mensagemErro);

        await postToken({
            "Email": email.value,
        })
      
    })
}

document.addEventListener('DOMContentLoaded', () => document.dispatchEvent(new Event('header-carregado', { bubbles: true })))
window.dispatchEvent(new Event('pagina-load'))
