import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch";

const erro = document.getElementById("mensagem-erro")
const parametroUrl = new URLSearchParams(window.location.search);

const listagem = async (queryString) => {
    limparMensagem(erro)
    // tbody.innerHTML = ""

    const config = configuracaoFetch("GET")

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const params = new URLSearchParams();
    params.set('name', queryString);
    const endpoint = `championships${(queryString ? '?' + params.toString() : '')}`

    const data = await executarFetch(endpoint, config, null, callbackServidor)

    console.log(data)

    if(data.results.length === 0){
        erro.textContent = "Nenhum resultado encontrado"
    }

    // this.innerHTML = ``

    // data.results.forEach(e => {
    //     tbody.innerHTML += 
    //     `<tr>
    //         <td>${e.name}</td>
    //         <td>${e.prize}</td>
    //         <td>${e.initialDate}</td>
    //         <td>${e.finalDate}</td>
    //         <td>${e.sportsId === 1 ? "Futebol" : "Vôlei"}</td>
    //     </tr>`;
    // });
}

listagem(parametroUrl.get("name"))