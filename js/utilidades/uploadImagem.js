import { configuracaoFetch, executarFetch } from "./configFetch"
export const uploadImagem = async(input, type, mensagemErro) => {
    let file = input.files[0]
    let formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    const data = await executarFetch("img", configuracaoFetch("POST", formData, true), (res) => mensagemErro.textContent = res.results[0], callbackServidor)

    if (!data) return false

    console.log(data)

    return data
}