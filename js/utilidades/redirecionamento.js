export const redirecionamento = (elemento) => {
    const urlParams = new URLSearchParams(window.location.search).get('userName')
    if(urlParams){
        elemento.value = urlParams
    }
}