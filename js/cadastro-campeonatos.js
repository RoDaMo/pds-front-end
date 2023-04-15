import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";
import { notificacaoSucesso } from "./utilidades/notificacoes";

let formulario = document.getElementById("formulario")
let mensagemErro = document.getElementById("mensagem-erro")

formulario.addEventListener("submit", async e => {
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