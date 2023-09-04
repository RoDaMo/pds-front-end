import '../scss/pagina-usuarios.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/pagina-usuarios.json' assert { type: 'JSON' }
import ingles from './i18n/en/pagina-usuarios.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

// incluir lenis.js

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')

const sportsSection = document.querySelector('.sports-section')

const userInfo = document.querySelector('.user-info')
const userBio = document.querySelector('.user-bio')
const userPicWrapper = document.querySelector('.user-pic-wrapper')
const userRealName = document.querySelector('.user-realname')
const userName = document.querySelector('.user-name')
const userConfigBtn = document.querySelector('.user-config-btn')
const userCurrentTeam = document.querySelector('.user-current-team')
const userPic = document.querySelector('#user-pic'),
      botaoEditar = document.getElementById('botao-perfil-editar')

window.onload = () => {
    if (userPic.getAttribute('src') == '') {
        userPic.setAttribute('src', '../default-user-image.png')
    }

    if (userBio.innerText == '') {
        userBio.innerHTML = `<span class="i18" key="SemDescricao">${i18next.t("SemDescricao")}</span>`
    }

    if (userRealName.innerText == '') {
        userRealName.innerText = 'Name'
    }

    if (userName.innerText == '') {
        userName.innerText = 'User name'
    }

    if (mediaQueryMobile.matches) {
    
        userInfo.firstElementChild.classList.remove("ms-3")
        userCurrentTeam.classList.replace("mt-6r", "mt-5")
        userPicWrapper.parentElement.classList.remove("me-4")
        userPicWrapper.classList.remove("me-0")
        userRealName.parentElement.classList.remove("me-4")
        userRealName.classList.replace("text-end", "text-center")
        userName.classList.replace("text-end", "text-center")
        userConfigBtn.parentElement.classList.remove("me-3")
        userConfigBtn.parentElement.classList.replace("justify-content-end", "justify-content-center")

        sportsSection.classList.remove('ms-4')
    }
}


const mensagemErro = document.getElementById("mensagem-erro")
const parametroUrl = new URLSearchParams(window.location.search);

document.addEventListener('header-carregado', async () => {
    const currentUserId = document.getElementById('usernameUserId')
    const id = parametroUrl.get('id')


    if (currentUserId && id == currentUserId.textContent) {
        botaoEditar.classList.remove('d-none')
    }
    
    const config = configuracaoFetch("GET")
    
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }
    
    loader.show()
    const data = await executarFetch(`auth/${id}`, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    loader.hide()

    if (data.results == null || data.succeed == false) {
        window.dispatchEvent(new Event('pagina-load'))
        window.location.href = '/pages/404.html'
        return;
    } 

    if (!data.results.username) {
        console.log("É um jogador temporário");
        document.getElementById("user-pic").src = !data.results.picture ? '../default-user-image.png' : data.results.picture
        document.getElementById("name").textContent = data.results.name
        document.getElementById("artistic-name").textContent = data.results.artisticName
        document.getElementById("number").textContent = data.results.number
        document.getElementById("position").textContent = data.results.playerPosition


    } else if (data.results.number || data.results.artisticName) {
        console.log(data);
        console.log("É um usuário jogador");
        document.getElementById("user-pic").src = !data.results.picture ? '../default-user-image.png' : data.results.picture
        document.getElementById("user-bio").textContent = data.results.bio
        document.getElementById("user-name").textContent = data.results.username
        document.getElementById("name").textContent = data.results.name
        document.getElementById("artistic-name").textContent = data.results.artisticName
        document.getElementById("number").textContent = data.results.number
        document.getElementById("position").textContent = data.results.playerPosition



    } else {
        console.log(data);
        console.log("É um usuário normal");
        document.getElementById("user-pic").src = !data.results.picture ? '../default-user-image.png' : data.results.picture
        document.getElementById("user-bio").textContent = data.results.bio
        document.getElementById("user-name").textContent = data.results.username
        document.getElementById("name").textContent = data.results.name
    }

    const userRoleElement = document.getElementById("userRole");
    const botaoExcluir = document.getElementById("botaoExcluirUsuario");
    const botaoExcluir2 = document.getElementById("botaoExcluirTemp");


    if (userRoleElement) {
        const userRole = userRoleElement.textContent.trim()
        console.log("oi")
        console.log(nomeUsuario)

        if (userRole === "admin") {
            if(data.results.username)
            {
                botaoExcluir.classList.remove('d-none')
                botaoExcluir.addEventListener('click', async () => {
                    loader.show(); // Mostrar o loader, se necessário
                    const configFetch = configuracaoFetch('DELETE')
                    const response = await executarFetch(`moderation/users/${id}`, configFetch); 
                    loader.hide(); // Esconder o loader após a conclusão da solicitação
                
                    if (response.succeed) {
                        window.location.assign('/index.html')
                    }
                })
            }
            else
            {
                botaoExcluir2.classList.remove('d-none')
                botaoExcluir2.addEventListener('click', async () => {
                    loader.show(); // Mostrar o loader, se necessário
                    const configFetch = configuracaoFetch('DELETE')
                    const response = await executarFetch(`moderation/playertempprofiles/${id}`, configFetch); 
                    loader.hide(); // Esconder o loader após a conclusão da solicitação
                
                    if (response.succeed) {
                        window.location.assign('/index.html')
                    }
                })
            }
        }
    }
})
