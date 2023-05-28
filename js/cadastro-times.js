import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import {exibidorImagem} from '../js/utilidades/previewImagem'
import {uploadImagem} from './utilidades/uploadImagem'


const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const escudo = document.getElementById("escudo")
const home = document.getElementById("home")
const away = document.getElementById("away")

const emblema = document.getElementById("emblema")
const uniforme1 = document.getElementById("uniforme-1")
const uniforme2 = document.getElementById("uniforme-2")

const nome = document.getElementById("nome")
const esporte = document.getElementById("esportes")
const descricao = document.getElementById("descricao")
const logo = document.getElementById("logo")
const uniformeHome = document.getElementById("uniforme-casa")
const uniformeAway = document.getElementById("uniforme-fora")

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    const resultado = await postTime("teams", {
        "emblem": logo.value,
        "uniformHome": uniformeHome.value,
        "uniformAway": uniformeAway.value,
        "sportsId": esporte.value,
        "name": nome.value,
    })
    
    if (resultado){
        formulario.reset()
        escudo.src = "#"
        home.src = "#"
        away.src = "#"
    }
})

let imagensValidacao = {
    logo: false,
    uCasa: false,
    uFora: false,
}

const ativarBotao = () => (imagensValidacao.logo && imagensValidacao.uCasa && imagensValidacao.uFora) ? document.getElementById('salvar').disabled = false : document.getElementById('salvar').disabled = true

logo.addEventListener("change", async() => {
    const data = await uploadImagem(logo, 4, mensagemErro)

    emblema.value = `https://playoffs-api.up.railway.app/img/${data.results}`
    exibidorImagem(escudo, emblema.value)
    
    imagensValidacao.logo = data.succeed === true
    console.log(imagensValidacao)
    ativarBotao()
})

uniformeHome.addEventListener("change", async() => {
    const data = await uploadImagem(uniformeHome, 3, mensagemErro)

    uniforme1.value = `https://playoffs-api.up.railway.app/img/${data.results}`
    exibidorImagem(home, uniforme1.value)
    
    imagensValidacao.uCasa = data.succeed === true
    console.log(imagensValidacao)
    ativarBotao()
})

uniformeAway.addEventListener("change", async() => {
    const data = await uploadImagem(uniformeAway, 3, mensagemErro)

    uniforme2.value = `https://playoffs-api.up.railway.app/img/${data.results}`
    exibidorImagem(away, uniforme2.value)

    imagensValidacao.uFora = data.succeed === true
    console.log(imagensValidacao)
    ativarBotao()
})


async function postTime(endpoint, body) {
    console.log(body)

    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)

    console.log(data)

    if (!data) return false

    notificacaoSucesso(data.message)
    return true
}