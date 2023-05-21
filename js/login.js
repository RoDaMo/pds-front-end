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

    if(data.results && data.succeed){
        document.getElementById("continuar").classList.add("d-none")
        document.getElementById("entrar").classList.remove("d-none")
        document.getElementById("senha-formulario").classList.remove("d-none")
        document.getElementById('texto-bem-vindo').textContent = "Você já possui uma conta, entre usando seu nome de usuário e senha."
        nomeUsuario.parentElement.classList.replace('mb-5', 'mb-2');
    }
    else{
        window.location.assign(`/pages/cadastro-usuarios.html?userName=${nomeUsuario.value}`);
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

    if (!window.location.href.includes('netlify'))
        config.headers["IsLocalhost"] = true;

    const res = await fetch(`https://playoffs-api.up.railway.app/auth`, config)

    const data = await res.json()

    if(!data.succeed){
        mensagemErro.textContent = data.message
        mensagemErro.classList.add("text-danger")
        senha.value = ""
    }

    return true
}