export const api = "https://playoffs-api.up.railway.app/"

export const configuracaoFetch = (method, data) => {
    let config = {
        method: method,
        headers: {}
    };

    if(method !== "GET"){
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
        if (res.status != 200) {
            //exibir notificação erro
            return;
        }

        const data = await res.json();
        if (!data.sucesso) {
            //exibir notificação de erro
            return;
        }

        return data;
    } catch {
        //exibir notificação de erro
    }
}

export const limparMensagem = (mensagemErro) => {
    let classesRemoviveis = ["text-success", "text-danger"]
    classesRemoviveis.forEach(classe => mensagemErro.classList.remove(classe))
}