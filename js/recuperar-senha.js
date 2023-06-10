import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import { configuracaoFetch, executarFetch, limparMensagem, api } from "./utilidades/configFetch"
import portugues from './i18n/ptbr/recuperar-senha.json' assert { type: 'JSON' }
import ingles from './i18n/en/recuperar-senha.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import './utilidades/loader'

const loader = document.createElement('app-loader');
document.body.appendChild(loader);
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


const formulario = document.getElementById("formulario")
const email = document.getElementById("email")
const mensagemErro = document.getElementById("mensagem-erro")
const botao = document.getElementById("reenviar-email")
const divResposta = document.getElementById("div-reposta")
let idUsuario = null

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    if(!validacoes()) return

    await postToken({
        "Email": email.value,
    })
})

async function postToken(body) {
    const config = configuracaoFetch("POST", body)
    loader.show()
    const res = await fetch(`${api}auth/forgot-password`, config)
    loader.hide()

    const data = await res.json()

    if(res.ok){
        idUsuario = data.results
        await notificacaoSucesso(data.message)
        apresentarResultado()
    } else {
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
        email.value = ""
        await notificacaoErro(data.message)
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

    if(data) await notificacaoSucesso(data.message)
})

const emailRegex = (str) => /\S+@\S+\.\S+/.test(str);

const validacoes = () => {
    let controle = true;

    const mensagemErro = (elementoId, mensagemErro) => {
        document.getElementById(elementoId).innerHTML = mensagemErro;
    }

    const limparMensagemErro = (elementoId) => {
        document.getElementById(elementoId).textContent = "";
    }

    if(!emailRegex(email.value) || email.value === ""){
        mensagemErro("email-validacao", `<span class="i18" key="EmailInvalido">${i18next.t("EmailInvalido")}</span>`);
        controle = false;
    } else {
        limparMensagemErro("email-validacao");
    }

    return controle;
}