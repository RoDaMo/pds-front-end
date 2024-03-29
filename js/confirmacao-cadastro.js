import { configuracaoFetch, executarFetch } from "./utilidades/configFetch"
import { notificacaoErro } from "./utilidades/notificacoes"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import portugues from './i18n/ptbr/confirmacao-cadastro.json' assert { type: 'JSON' }
import ingles from './i18n/en/confirmacao-cadastro.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import './utilidades/loader'

const loader = document.createElement('app-loader');
document.body.appendChild(loader);
inicializarInternacionalizacao(ingles, portugues);

const confirmSignCardHeader = document.querySelector("#confirmsign-card-header")

document.addEventListener("DOMContentLoaded", () => {
    confirmSignCardHeader.insertAdjacentHTML('afterbegin', `
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

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()

    const divReposta = document.getElementById("div-reposta")
    const divReposta2 = document.getElementById("div-reposta-2")
    const divReposta3 = document.getElementById("div-reposta-3")

    const queryString = window.location.search

    loader.show()
    const data = await executarFetch(`auth/confirm-email${queryString}`, configuracaoFetch("GET"))
    loader.hide()

    if(!data) {
        divReposta.classList.remove("d-none")
    } else if(data.results.length === 1){
        window.location.assign(`/pages/login.html?userName=${data.results}`)
    } else {
        divReposta2.classList.remove("d-none")
        reenviarEmail(data.results[0], divReposta2, divReposta3)
        notificacaoErro(data.results[1])
    }
  })

function reenviarEmail(idUsuario, divReposta2, divReposta3) {
    const botao = document.getElementById("reenviar-email")
    const botao2 = document.getElementById("reenviar-email2")

    botao.addEventListener("click", async() => {
        loader.show()
        const data = await executarFetch(`auth/resend-confirm-email?id=${idUsuario}`, configuracaoFetch("GET"))
        loader.hide()

        if(data) {
            divReposta2.classList.add("d-none")
            divReposta3.classList.remove("d-none")
            notificacaoSucesso(data.message)
        }
    })

    botao2.addEventListener("click", async () => {
        loader.show()
        const data = await executarFetch(`auth/resend-confirm-email?id=${idUsuario}`, configuracaoFetch("GET"))
        loader.hide()

        if (data) {
            notificacaoSucesso(data.message)
        }
    })
}

document.addEventListener('DOMContentLoaded', () => document.dispatchEvent(new Event('header-carregado', { bubbles: true })))  
window.dispatchEvent(new Event('pagina-load'))
