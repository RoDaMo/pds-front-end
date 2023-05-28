import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/cadastro-campeonatos.json' assert { type: 'JSON' }
import ingles from './i18n/en/cadastro-campeonatos.json' assert { type: 'JSON' }
import JustValidate from "just-validate"

inicializarInternacionalizacao(ingles, portugues);
let formulario = document.getElementById("formulario")
let mensagemErro = document.getElementById("mensagem-erro")

const validator = new JustValidate(formulario, {
    validateBeforeSubmitting: true,
})

validator
    .addField('#nome-campeonato', [
        {
            rule: 'required',
            errorMessage: 'O nome do campeonato é obrigatório',
        },
    ])
    .addField('#data-inicio', [
        {
            rule: 'required',
            errorMessage: 'A data de início é obrigatória',
        },
    ])
    .addField('#data-final', [
        {
            rule: 'required',
            errorMessage: 'A data final é obrigatória',
        },
    ])
    .addField('#esportes', [
        {
            rule: 'required',
            errorMessage: 'Favor selecionar um esporte',
        },
    ])
    .addRequiredGroup('#grupo-premiacao', 'Selecione ao menos uma opção')
    .onSuccess(async(e) => {
        e.preventDefault()
        limparMensagem(mensagemErro)

        let nomeCampeonato = document.getElementById("nome-campeonato").value
        let dataInicio = document.getElementById("data-inicio").value
        let dataFinal = document.getElementById("data-final").value
        let esporte = document.getElementById("esportes").value
        let premiacao = document.querySelector('input[name="premiacao"]:checked').value

        const resultado = await postCampeonato("championships", {
            "name": nomeCampeonato,
            "prize": premiacao,
            "initialDate": dataInicio,
            "finalDate": dataFinal,
            "sportsId": esporte
        })

        if (resultado)
            formulario.reset()
    })

async function postCampeonato(endpoint, body) {
    const config = configuracaoFetch("POST", body)
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(endpoint, config, null, callbackServidor)
    if (!data) return false

    // if (!data.succeed) {
    //     mensagemErro.classList.add("text-danger")
    //     mensagemErro.textContent = data.results[0]
    //     return false
    //     // nao permita que o label desapareca
    //     // setTimeout(() => {
    //     //     mensagemErro.textContent = ""
    //     // }, 3500);
    // }

    notificacaoSucesso(data.results[0])
    return true
}