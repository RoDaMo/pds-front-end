export const api = import.meta.env.MODE === 'production' ? "https://www.api.playoffs.app.br/" : "https://playoffs-api.up.railway.app/"
export const configuracaoFetch = (method, data = null, uploadArquivo = false, body = true) => {
    const lng = localStorage.getItem('lng')
    const config = {
        method: method,
        headers: {
            'Accept-Language': lng
        },
        credentials: 'include'
    }

    if(method !== "GET" && body){
        config.body = data

        if (!uploadArquivo) {
            config.body = JSON.stringify(data)
            config.headers['Content-Type'] =  "application/json"
        }
    }

    return config
}

export const executarFetch = async (endpoint, config, callbackStatus, callbackServidor, redirecionarLogin = true) => {
    const { notificacaoErro } = await import('./notificacoes')
    const res = await fetch(`${api}${endpoint}`, config)

    if(res.status === 401){
        if (!window.location.href.includes('playoffs'))
            config.headers["IsLocalhost"] = true

        const resPut = await fetch(`${api}auth`, configuracaoFetch("PUT"))
        
        if (resPut.status === 401 && redirecionarLogin){
            window.location.assign("/pages/login.html")
        }
        
        if (!redirecionarLogin) 
            return await executarFetch(endpoint, config, callbackStatus, callbackServidor, redirecionarLogin);
    }

    if (!res.ok) {
        const texto = await res.text(); 
        try {
            const data = JSON.parse(texto)
            try {
                if (!data.succeed) {
                    if (callbackStatus)
                        throw new Error('Teste')

                    callbackStatus(data);
                    return
                }
                return data
            } catch (err) {
                notificacaoErro(data.message.length > 0 ? data.message : typeof data.results == 'object' && data.results != null ? data.results[0] : data.results)
            }
        } catch (err) {
            notificacaoErro()
        }
        return
    }

    const texto = await res.text(); 
    try {
        const data = JSON.parse(texto)
        
        try {
            if (!data.succeed) {
                callbackServidor(data);
                return
            }   
            return data
        } catch (err) {
            notificacaoErro(data.message.length > 0 ? data.message : typeof data.results == 'object' && data.results != null ? data.results[0] : data.results)
        }
    } catch (err) {
        notificacaoErro()
    }
}

export const limparMensagem = (mensagemErro) => {
    let classesRemoviveis = ["text-success", "text-danger"]
    classesRemoviveis.forEach(classe => {
        mensagemErro.classList.remove(classe)
        mensagemErro.innerHTML = ''
    })
}