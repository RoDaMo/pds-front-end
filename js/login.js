import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { visualizarSenha } from "./utilidades/visualizar-senha"

const nomeUsuario = document.getElementById("nome-usuario")
const senha = document.getElementById("senha")
const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")

visualizarSenha()

document.getElementById("continuar").addEventListener("click", async(e) => {
    e.preventDefault();
    await postUsuarioExiste({
        "Username": nomeUsuario.value,
    })
})

async function postUsuarioExiste(body) {
    const config = configuracaoFetch("POST", body)
    const res = await fetch(`https://playoffs-api.up.railway.app/auth/exists`, config)

    const data = await res.json()
    console.log(data)

    if(data.results){
        document.getElementById("continuar").classList.add("d-none")
        document.getElementById("entrar").classList.remove("d-none")
        document.getElementById("senha-formulario").classList.remove("d-none")
    }
    else{
        window.location.assign("/pages/cadastro-usuarios.html");
    }

    return true
}

formulario.addEventListener("submit", async(e) => {
    e.preventDefault()
    limparMensagem(mensagemErro)

    const resultado = await postToken({
        "Username": nomeUsuario.value,
        "Password": senha.value,
    })
})

async function postToken(body) {
    const config = configuracaoFetch("POST", body)
    const res = await fetch(`https://playoffs-api.up.railway.app/auth`, config)

    const data = await res.json()
    console.log(data)

    if(!data.succeed){
        mensagemErro.textContent = data.message
        mensagemErro.classList.add("text-danger")
        senha.value = ""
    }

    return true
}