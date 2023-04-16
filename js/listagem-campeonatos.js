import { configuracaoFetch, executarFetch } from "./utilidades/configFetch";

const listagem = async () => {
    const config = configuracaoFetch("GET")

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }
  
    const data = await executarFetch("championships?name=", config, null, callbackServidor)

    const tbody = document.getElementById('tbody');

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

listagem();