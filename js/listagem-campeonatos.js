import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";
const tbody = document.getElementById('tbody');
const erro = document.getElementById("nenhum-resultado")
const parametroUrl = new URLSearchParams(window.location.search);

const listagem = async (queryString) => {
    limparMensagem(erro)
    tbody.innerHTML = ""

    const config = configuracaoFetch("GET")

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch(`championships?name=${queryString}`, config, null, callbackServidor)

    if(data.results.length === 0){
        erro.textContent = "Nenhum resultado encontrado"
    }

    data.results.forEach(e => {
        tbody.innerHTML += 
        `<tr>
            <td>${e.name}</td>
            <td>${e.prize}</td>
            <td>${e.initialDate}</td>
            <td>${e.finalDate}</td>
            <td>${e.sportsId === 1 ? "Futebol" : "Vôlei"}</td>
        </tr>`;
    });
}

listagem(parametroUrl.get("name"))