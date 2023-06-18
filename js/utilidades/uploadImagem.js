import { configuracaoFetch, executarFetch } from "./configFetch"
export const uploadImagem = async(input, type, mensagemErro) => {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch("img", configuracaoFetch("POST", formData, true), callbackServidor, callbackServidor)

    if (!data) return false

    if (Array.isArray(data.results))
        return;
        
    return data
}