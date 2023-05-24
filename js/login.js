import JustValidate, { Rules } from "just-validate"
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { visualizarSenha } from "./utilidades/visualizar-senha"

const nomeUsuario = document.getElementById("nome-usuario")
const senha = document.getElementById("senha")
const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")

const validator = new JustValidate("#formulario")

validator
    .addField(nomeUsuario, [
        {
            rule: 'required',
            errorMessage: 'O nome de usuário é obrigatório',
        },
    ])
    .addField(senha, [
        {
            rule: 'required',
            errorMessage: 'A senha é obrigatória',
        },
        {
            rule: 'customRegexp',
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{4,}$/,
            errorMessage: 'A senha deve conter ao menos 4 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial',
        },
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        await postToken({
            "Username": nomeUsuario.value,
            "Password": senha.value,
        })
    })


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

    if(data.results) {
        document.getElementById("continuar").classList.add("d-none")
        document.getElementById("entrar").classList.remove("d-none")
        document.getElementById("senha-formulario").classList.remove("d-none")
        document.getElementById('texto-bem-vindo').textContent = "Você já possui uma conta, entre usando seu nome de usuário e senha."
        nomeUsuario.parentElement.classList.replace('mb-5', 'mb-2');
    }
    else {
        window.location.assign("/pages/cadastro-usuarios.html");
    }

    return true
}

// formulario.addEventListener("submit", async(e) => {
//     e.preventDefault()
//     limparMensagem(mensagemErro)

//     await postToken({
//         "Username": nomeUsuario.value,
//         "Password": senha.value,
//     })
// })

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







