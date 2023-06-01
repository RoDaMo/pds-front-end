import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"


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
   
    const res = await fetch(`https://playoffs-api.up.railway.app/auth/forgot-password`, config)

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

botao.addEventListener("click", async() => {
    let endpoint = `auth/resend-forgot-password?id=${idUsuario}`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    if(data)
        notificacaoSucesso(data.message)
})

const emailRegex = (str) => /\S+@\S+\.\S+/.test(str);

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

    return controle;
}