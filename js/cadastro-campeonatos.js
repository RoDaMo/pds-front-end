import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";

let formulario = document.getElementById("formulario")
let mensagemErro = document.getElementById("mensagem-erro")

formulario.addEventListener("submit", (e) => {
    e.preventDefault()
    
    limparMensagem(mensagemErro)

    let nomeCampeonato = document.getElementById("nome-campeonato").value
    let dataInicio = document.getElementById("data-inicio").value
    let dataFinal = document.getElementById("data-final").value
    let esporte = document.getElementById("esportes").value
    let premiacao = document.querySelector('input[name="premiacao"]:checked').value

    postCampeonato("championships", {
        "name": nomeCampeonato,
        "prize": premiacao,
        "initialDate": dataInicio,
        "finalDate": dataFinal,
        "sportsId": esporte
    })
})

async function postCampeonato(endpoint, body) {
    const config = configuracaoFetch("POST", body)

    executarFetch(endpoint, config, mensagemErro)


}