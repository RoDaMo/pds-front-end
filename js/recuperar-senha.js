import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import JustValidate from "just-validate"
import portugues from './i18n/ptbr/recuperar-senha.json' assert { type: 'JSON' }
import ingles from './i18n/en/recuperar-senha.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

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
console.log(opcao1)
lng === 'ptbr' ? opcao1.selected = 'true' : opcao2.selected = 'true'

const formulario = document.getElementById("formulario")
const email = document.getElementById("email")
const mensagemErro = document.getElementById("mensagem-erro")
const botao = document.getElementById("reenviar-email")
const divResposta = document.getElementById("div-reposta")
let idUsuario = null

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

validator
    .addField(email, [
        {
            rule: 'required',
            errorMessage: `<span class="i18" key="EmailObrigatorio">${i18next.t("EmailObrigatorio")}</span>`
        },
        {
            rule: 'email',
            errorMessage: `<span class="i18" key="EmailInvalido">${i18next.t("EmailInvalido")}</span>`
        }
    ])
    .onSuccess(async (e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

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