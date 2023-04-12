export const api = "https://playoffs-api.up.railway.app/"

export const configuracaoFetch = (method, data) => {
    let config

    if(method === "GET"){
        config = {
            method: method,
            headers: {}
        }
    }
    else{
        config = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };
    }

    return config
}

export const executarFetch = async (endpoint, config, mensagemErro) => {
    try {
        const res = await fetch(`${api}${endpoint}`, config);
  
        const data = await res.json();

        console.log(data)

        mensagemErro.textContent = data.results[0]
        data.succeed ? mensagemErro.classList.add("text-success") : mensagemErro.classList.add("text-danger")
        setTimeout(() => {
            mensagemErro.textContent = ""
        }, 3500);
    } catch (error) {
        console.log(error)
    }
}

export const limparMensagem = (mensagemErro) => {
    let classesRemoviveis = ["text-success", "text-danger"]
    classesRemoviveis.forEach((classe) => {
        mensagemErro.classList.remove(classe)
    })
}