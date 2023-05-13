const olhos = document.getElementById("olhos")
const olhoAberto = document.getElementById("olho-aberto")
const olhoFechado = document.getElementById("olho-fechado")

export const visualizarSenha = () => {
    olhos.addEventListener('click', () => {
        (olhoAberto.classList.contains("d-none")) ? senha.type = "password" : senha.type = "text"
        olhoAberto.classList.toggle("d-none")
        olhoFechado.classList.toggle("d-none")
    })
}