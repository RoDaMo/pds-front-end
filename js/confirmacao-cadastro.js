import { configuracaoFetch, executarFetch } from "./utilidades/configFetch"
import { notificacaoErro } from "./utilidades/notificacoes"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import portugues from './i18n/ptbr/confirmacao-cadastro.json' assert { type: 'JSON' }
import ingles from './i18n/en/confirmacao-cadastro.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

document.querySelector('#lingua').addEventListener('change', event => {
    const selectedIndex = event.target.selectedIndex;
    localStorage.setItem('lng', event.target.children[selectedIndex].value);
    document.body.dispatchEvent(new Event('nova-lingua', { bubbles: true }))
})

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()

    const divReposta = document.getElementById("div-reposta")
    const divReposta2 = document.getElementById("div-reposta-2")
    const divReposta3 = document.getElementById("div-reposta-3")

    let queryString = window.location.search
    let endpoint = `auth/confirm-email${queryString}`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

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
        let endpoint = `auth/resend-confirm-email?id=${idUsuario}`
        const config = configuracaoFetch("GET")
        const data = await executarFetch(endpoint, config)
    
        if(data) {
            divReposta2.classList.add("d-none")
            divReposta3.classList.remove("d-none")
            notificacaoSucesso(data.message)
        }
    })

    botao2.addEventListener("click", async() => {
        let endpoint = `auth/resend-confirm-email?id=${idUsuario}`
        const config = configuracaoFetch("GET")
        const data = await executarFetch(endpoint, config)
    
        if(data) {
            notificacaoSucesso(data.message)
        }
    })
}

  
