import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { visualizarSenha } from "./utilidades/visualizar-senha"

const nomeUsuario = document.getElementById("nome-usuario")
const senha = document.getElementById("senha")
const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")

visualizarSenha()

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    const resultado = await postToken({
        "Username": nomeUsuario.value,
        "Password": senha.value,
    })

    if (resultado)
        formulario.reset()
})

async function postToken(body) {
    const config = configuracaoFetch("POST", body)
    const res = await fetch(`https://playoffs-api.up.railway.app/auth`, config)

    const data = await res.json()
    console.log(data)

    if(!data.succeed){
        mensagemErro.textContent = data.message
        mensagemErro.classList.add("text-danger")
    }

    return true
}