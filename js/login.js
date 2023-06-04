import JustValidate from "just-validate"
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { visualizarSenha } from "./utilidades/visualizar-senha"
import {redirecionamento} from './utilidades/redirecionamento'
import './utilidades/loader'




const nomeUsuario = document.getElementById("nome-usuario")
const senha = document.getElementById("senha")
const formulario = document.getElementById("formulario")
const mensagemErro = document.getElementById("mensagem-erro")
const lembrar = document.getElementById('lembrar')


const loader = document.createElement('app-loader');
document.body.appendChild(loader);


const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

validator
    .addField(nomeUsuario, [
        {
            rule: 'required',
            errorMessage: 'O nome de usuário é obrigatório',
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: 'Nome de usuário deve possuir no mínimo 4 caracteres.',
        },
        {
            rule: 'maxLength',
            value: 20,
            errorMessage: 'Nome de usuário deve possuir no máximo 20 caracteres.',
        },
        {
            rule: 'customRegexp',
            value: /^[A-Za-z0-9_-]*$/,
            errorMessage: 'Nome de usuário inválido, não pode conter espaço nem caractere especial.',
        },
    ])
    .addField(senha, [
        {
            rule: 'required',
            errorMessage: 'A senha é obrigatória',
        },
        {
            rule: 'customRegexp',
            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{4,}$/,
            errorMessage: 'A senha deve conter ao menos 4 caracteres, uma letra maiúscula, uma minúscula e um número. Sem caracteres especiais.',
        },
        
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();

        await postToken({
            "Username": nomeUsuario.value,
            "Password": senha.value,
            "RememberMe": lembrar.checked ? true : false
        })
        loader.hide();
    })

visualizarSenha()

redirecionamento(nomeUsuario)

document.getElementById("continuar").addEventListener("click", async(e) => {
    e.preventDefault();
    nomeUsuario.value ? await postUsuarioExiste({"Username": nomeUsuario.value}) : mensagemErro.textContent = "Preencha nome de usuário"
})

async function postUsuarioExiste(body) {
    limparMensagem(mensagemErro)
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
    } else {
        window.location.assign(`/`)
    }
}
