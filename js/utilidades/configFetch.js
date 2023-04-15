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

export const executarFetch = async (endpoint, config, callbackStatus, callbackServidor) => {
    const { notificacaoErro } = import('./notificacoes');
    const res = await fetch(`${api}${endpoint}`, config)

    if (!res.ok) {
        if (!callbackStatus) {
            notificacaoErro();
            throw new Error();
        }   

        callbackStatus(res)
        throw new Error();
    }

    const data = await res.json()
    if (!data.succeed) {
        if (!callbackServidor) {
            notificacaoErro();
            throw new Error();
        }

        callbackServidor(data);
        throw new Error();
    }

    return data
}

export const limparMensagem = (mensagemErro) => {
    let classesRemoviveis = ["text-success", "text-danger"]
    classesRemoviveis.forEach(classe => mensagemErro.classList.remove(classe))
}