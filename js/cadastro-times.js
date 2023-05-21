import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import {exibidorImagem} from './utilidades/previewImagem'


const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const escudo = document.getElementById("escudo")
const home = document.getElementById("home")
const away = document.getElementById("away")

const nome = document.getElementById("nome")
const esporte = document.getElementById("esportes")
const descricao = document.getElementById("descricao")
const emblema = document.getElementById("logo")
const uniformeHome = document.getElementById("uniforme-casa")
const uniformeAway = document.getElementById("uniforme-fora")

exibidorImagem(emblema, escudo)
exibidorImagem(uniformeHome, home)
exibidorImagem(uniformeAway, away)

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    const resultado = await postTime("teams", {
        "emblem": emblema.value,
        "uniformHome": uniformeHome.value,
        "uniformWay": uniformeAway.value,
        "sportsId": esporte.value,
        "name": nome.value,
        "cpf": "12345678903"
    })
    
    if (resultado)
        formulario.reset()
})

async function postTime(endpoint, body) {
    console.log(body)

    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, null, callbackServidor)

    console.log(data)

    if (!data) return false

    notificacaoSucesso(data.message)
    return true
}