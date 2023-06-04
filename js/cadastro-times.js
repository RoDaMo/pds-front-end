import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { exibidorImagem } from '../js/utilidades/previewImagem'
import JustValidate from "just-validate"
import { uploadImagem } from './utilidades/uploadImagem'
import './utilidades/loader'
import * as bootstrap from 'bootstrap'

let cpfObrigatorio = false
let cadastrouCpf = false
let confirmouCpf = true
let meuModal

window.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault()
   
    let endpoint = `auth/cpf`
    const config = configuracaoFetch("GET")
    const data = await executarFetch(endpoint, config)

    console.log("oi")
    console.log(data)

    if(data === undefined)
        confirmouCpf = false
    if(!data.results) {
        cpfObrigatorio = true
        const modal = document.getElementById('JanelaModal')
        meuModal =  new bootstrap.Modal(modal)
        meuModal.show();
    }
})

const mensagemErro2 = document.getElementById("mensagem-erro2")
const formularioCpf = document.getElementById("formCpf")
const cpf =  document.getElementById("cpf")
const validator2 = new JustValidate(formularioCpf, {
    validateBeforeSubmitting: true,
})

validator2
    .addField(cpf, [
        {
            rule: 'required',
            errorMessage: 'Favor inserir CPF',
        },
        {
            rule: 'minLength',
            value: 11,
            errorMessage: 'Nome de usuário deve possuir 11 caracteres.',
        },
        {
            rule: 'maxLength',
            value: 11,
            errorMessage: 'Nome de usuário deve possuir 11 caracteres.',
        },
        {
            validator: (value, context) => {
                var numberCpf = new Array(11)
                for (var i = 0; i < 11; i++)
                    numberCpf[i] = parseInt(value[i])

                var sum = 0
                for (var i = 0; i < 9; i++)
                    sum += numberCpf[i] * (10 - i)

                var firstVerifierDigit = (sum * 10) % 11
                firstVerifierDigit = firstVerifierDigit === 10 ? 0 : firstVerifierDigit

                sum = 0
                var arrayNova = numberCpf.slice()
                arrayNova[9] = firstVerifierDigit
                for (var i = 0; i < 10; i++)
                    sum += arrayNova[i] * (11 - i)

                var secondVerifierDigit = (sum * 10) % 11;
                secondVerifierDigit = secondVerifierDigit === 10 ? 0 : secondVerifierDigit

                if (firstVerifierDigit !== numberCpf[9] || secondVerifierDigit !== numberCpf[10])
                    return false
                
                return true
            },
            errorMessage: 'CPF inválido',
        }
    ])
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        loader.show();

        const resultado = await postCpf("auth/cpf", 
            cpf.value
        )

        if (resultado) {
            formularioCpf.reset()
            cadastrouCpf = true
            meuModal.hide()
        }

        loader.hide();
    })

const loader = document.createElement('app-loader');
document.body.appendChild(loader);


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
                    extensions: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
                },
            },
            errorMessage: 'Tamanho máximo da imagem: 5mb',
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
                    extensions: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
                },
            },
            errorMessage: 'Tamanho máximo da imagem: 5mb',
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
                    extensions: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
                    maxSize: 5000000,
                    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
                },
            },
            errorMessage: 'Tamanho máximo da imagem: 5mb',
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

        loader.show();

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

        loader.hide();
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
    if(cpfObrigatorio && !cadastrouCpf) {
        meuModal.show()
        return
    }
    if(!confirmouCpf) {
        location.reload()
        return
    }

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

async function postCpf(endpoint, body) {
    const config = configuracaoFetch("POST", body)

    const callbackServidor = data => {
        mensagemErro2.classList.add("text-danger")
        data.results.forEach(element => mensagemErro2.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, (res) => mensagemErro2.textContent = res.results, callbackServidor)
    if (!data) return false

    notificacaoSucesso(data.results[0])
    return true
}