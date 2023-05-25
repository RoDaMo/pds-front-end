export const exibidorImagem = (elemento, imagemTag) => {
    elemento.addEventListener('change', (e) => {
        let leitor = new FileReader();
    
        leitor.onload = (evento) => imagemTag.src = evento.target.result;
    
        leitor.readAsDataURL(e.target.files[0]);
    })
}