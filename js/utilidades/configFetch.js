export const api = "https://playoffs-api.up.railway.app/"
export const configuracaoFetch = (method, data = null) => {
    const lng = localStorage.getItem('lng')
    const config = {
        method: method,
        headers: {
            'Accept-Language': lng
        }
    }

    if(method !== "GET"){
        config.body = JSON.stringify(data)
        config.headers['Content-Type'] = "application/json"
    }

    return config
}

export const executarFetch = async (endpoint, config, callbackStatus, callbackServidor) => {
    const { notificacaoErro } = await import('./notificacoes')
    const res = await fetch(`${api}${endpoint}`, config)

    if(res.status === 401){
        console.log("auth erro")
        const resPut = await fetch(`${api}auth`, configuracaoFetch("PUT"))
        if(resPut.status === 401){
            window.location.assign("/pages/login.html");
        }
    }

    if (!res.ok) {
        if (!callbackStatus) {
            notificacaoErro()
            return
        }  

        callbackStatus(res)
        return
    }

    const data = await res.json()
    if (!data.succeed) {
        if (!callbackServidor) {
            notificacaoErro()
            return
        }

        callbackServidor(data)
        return
    }   

    return data
}

export const limparMensagem = (mensagemErro) => {
    let classesRemoviveis = ["text-success", "text-danger"]
    classesRemoviveis.forEach(classe => {
        mensagemErro.classList.remove(classe)
        mensagemErro.innerHTML = ''
    })
}