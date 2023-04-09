let url = "https://playoffs-api.up.railway.app/Championship"
let formulario = document.getElementById("formulario")
let mensagemErro = document.getElementById("mensagem-erro")
let classesRemoviveis = ["text-success", "text-danger"]

formulario.addEventListener("submit", (e) => {
    e.preventDefault()
    
    classesRemoviveis.forEach((classe) => {
        mensagemErro.classList.remove(classe)
    })

    let nomeCampeonato = document.getElementById("nome-campeonato").value
    let dataInicio = document.getElementById("data-inicio").value
    let dataFinal = document.getElementById("data-final").value
    let esporte = document.getElementById("esportes").value
    let premiacao = document.querySelector('input[name="premiacao"]:checked').value

    postCampeonato({
        "name": nomeCampeonato,
        "prize": premiacao,
        "initialDate": dataInicio,
        "finalDate": dataFinal,
        "sportsId": esporte
    })
})

async function postCampeonato(body) {
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json",
        },
    });
  
    const data = await res.json();

    mensagemErro.textContent = data.results[0]
    data.succeed ? mensagemErro.classList.add("text-success") : mensagemErro.classList.add("text-danger")
    setTimeout(() => {
        mensagemErro.textContent = ""
    }, 3000);
}