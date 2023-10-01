import JustValidate from "just-validate"
import { configuracaoFetch, api, limparMensagem } from "./utilidades/configFetch"
import { visualizarSenha } from "./utilidades/visualizar-senha"
import { redirecionamento } from './utilidades/redirecionamento'
import './utilidades/loader'
import portugues from './i18n/ptbr/login.json' assert { type: 'JSON' }
import ingles from './i18n/en/login.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const nomeUsuario = document.getElementById("nome-usuario")
const senha = document.getElementById("senha")
const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const lembrar = document.getElementById('lembrar')

const loginCardHeader = document.querySelector("#login-card-header")

document.addEventListener("DOMContentLoaded", () => {
    loginCardHeader.insertAdjacentHTML('afterbegin', `
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


const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})
criarValidacao()
visualizarSenha()
redirecionamento(nomeUsuario)

const reqVerificacao = async(e) => {
    e.preventDefault()
    nomeUsuario.value ? await postUsuarioExiste({"Username": nomeUsuario.value}) : mensagemErro.innerHTML = `<span class="i18" key="NomeObrigatorio">${i18next.t("NomeObrigatorio")}</span>`
}

document.getElementById("continuar").addEventListener("click", async(e) => {
    reqVerificacao(e)
})

formulario.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if(document.getElementById("senha-formulario").classList.contains("d-none")){
            reqVerificacao(e)
        }
    }
});

async function postUsuarioExiste(body) {
    limparMensagem(mensagemErro)
    loader.show()
    const config = configuracaoFetch("POST", body)
    const res = await fetch(`${api}auth/exists`, config)

    const data = await res.json()
    loader.hide()

    if(data.results && data.succeed){
        document.getElementById("continuar").classList.add("d-none")
        document.getElementById("entrar").classList.remove("d-none")
        document.getElementById("senha-formulario").classList.remove("d-none")
        document.getElementById('texto-bem-vindo').innerHTML = `<span class="i18" key="PossuiConta">${i18next.t("PossuiConta")}</span>`
        nomeUsuario.parentElement.classList.replace('mb-5', 'mb-2');
    }
    else{
        
        window.location.assign(`/pages/cadastro-usuarios.html?userName=${nomeUsuario.value}`);
        
    }

    return true
}

async function postToken(body) {
    console.log('hahaha')
    const config = configuracaoFetch("POST", body)

    if (!window.location.href.includes('netlify'))
        config.headers["IsLocalhost"] = true;

    loader.show()
    const res = await fetch(`${api}auth`, config)
    const data = await res.json()
    loader.hide()
    console.log('hahaha 2')

    if(!data.succeed){
        mensagemErro.textContent = data.message
        mensagemErro.classList.add("text-danger")
        senha.value = ""
        localStorage.setItem('autenticado', true)
        
    } else {
        window.location.assign(`/`)
    }
}

document.addEventListener('nova-lingua', criarValidacao)

const opcao1 = document.getElementById("1")
const opcao2 = document.getElementById("2")
const lng = localStorage.getItem('lng');
lng === 'ptbr' ? opcao1.selected == 'true' : opcao2.selected == 'true'
document.addEventListener('DOMContentLoaded', () => document.dispatchEvent(new Event('header-carregado', { bubbles: true })))
document.getElementById('formulario').addEventListener('submit', (e) => e.preventDefault())

async function callbackValidation(e) {
    e.preventDefault()
    if (!validator.isFormValid())
        validator.refresh()

    limparMensagem(mensagemErro)

    loader.show();
    const formData = new FormData(formulario)

    await postToken({
        "Username": nomeUsuario.value,
        "Password": senha.value,
        "RememberMe": lembrar.checked ? true : false,
        "CaptchaToken": formData.get('g-recaptcha-response')
    })
    loader.hide();
}

function criarValidacao() {
    validator
        .addField(nomeUsuario, [
            {
                rule: 'required',
                errorMessage: `<span class="i18" key="NomeObrigatorio">${i18next.t("NomeObrigatorio")}</span>`,
            },
            {
                rule: 'minLength',
                value: 4,
                errorMessage: `<span class="i18" key="NomeMinimo">${i18next.t("NomeMinimo")}</span>`,
            },
            {
                rule: 'maxLength',
                value: 100,
                errorMessage: `<span class="i18" key="NomeMaximo">${i18next.t("NomeMaximo")}</span>`,
            },
            {
                rule: 'customRegexp',
                value: /^[A-Za-z0-9_-]*$/,
                errorMessage: `<span class="i18" key="NomeInvalido">${i18next.t("NomeInvalido")}</span>`,
            },
        ])
        .addField(senha, [
            {
                rule: 'required',
                errorMessage: `<span class="i18" key="SenhaObrigatoria">${i18next.t("SenhaObrigatoria")}</span>`,
            },
            {
                rule: 'customRegexp',
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{4,}$/,
                errorMessage: `<span class="i18" key="SenhaInvalida">${i18next.t("SenhaInvalida")}</span>`,
            },
            
        ])
        .onSuccess(callbackValidation)
}

document.getElementById('formulario').addEventListener('submit-firefox', callbackValidation)

window.dispatchEvent(new Event('pagina-load'))