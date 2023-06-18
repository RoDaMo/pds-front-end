export const exibidorImagem = (elemento, link) => {
    elemento.src = link == null ? '/public/default-championship-image' : link
}