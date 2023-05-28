import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import {exibidorImagem} from './utilidades/previewImagem'
import JustValidate from "just-validate"


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

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

exibidorImagem(emblema, escudo)
exibidorImagem(uniformeHome, home)
exibidorImagem(uniformeAway, away)

validator
    .addField(nome, [
        {
            rule: 'required',
            errorMessage: 'O nome do time é obrigatório',
        },
    ])
    .addField(esporte, [
        {
            rule: 'required',
            errorMessage: 'Favor selecionar um esporte',
        },
    ])
    .addField(emblema, [
        {
            rule: 'required',
            errorMessage: 'Insira o emblema do time',
        },
        {
            rule: 'files',
            value: {
                files: {
                    extensions: ['jpeg', 'jpg', 'png'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png'],
                },
            },
            errorMessage: 'Imagem em jpeg/jpg/png - máx. 5mb',
        }
    ])
    .addField(uniformeHome, [
        {
            rule: 'required',
            errorMessage: 'Insira o uniforme de casa',
        },
        {
            rule: 'files',
            value: {
                files: {
                    extensions: ['jpeg', 'jpg', 'png'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png'],
                },
            },
            errorMessage: 'Imagem em jpeg/jpg/png - máx. 5mb',
        }

    ])
    .addField(uniformeAway, [
        {
            rule: 'required',
            errorMessage: 'Insira o uniforme de fora',
        },
        {
            rule: 'files',
            value: {
                files: {
                    extensions: ['jpeg', 'jpg', 'png'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png'],
                },
            },
            errorMessage: 'Imagem em jpeg/jpg/png - máx. 5mb',
        }
    ])
    .addField(descricao, [
        {
            rule: 'required',
            errorMessage: 'Favor inserir uma descrição',
        },
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        const resultado = await postTime("teams", {
            "emblem": emblema.value,
            "uniformHome": uniformeHome.value,
            "uniformWay": uniformeAway.value,
            "sportsId": parseInt(esporte.value),
            "name": nome.value,
            "cpf": "47239015211"
        })
        
        if (resultado){
            formulario.reset()
            escudo.src = "#"
            home.src = "#"
            away.src = "#"
        }
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