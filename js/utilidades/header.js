import { configuracaoFetch, api, executarFetch } from "./configFetch";

export class header extends HTMLElement {
    constructor() {
        super();
        const lng = localStorage.getItem('lng');

        let classDark = ''
        if (document.body.getAttribute('is-home')) {
            classDark = 'header-home'
        }

        this.estaLogado(lng)

        this.innerHTML = /* html */`
            <header class="container">
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="col col-lg-4">
                        <a class="navbar-brand m-auto" href="/"><img src="/Logo_Playoffs.png" class="logo-play img-fluid" width="180" alt="Logo Playoffs"></a>
                    </div>
                    
                    <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>  

                    <div class="offcanvas offcanvas-end mobile" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

                        <div class="offcanvas-header container pt-2 pb-2">
                            <h2 class="fw-light text-black">Menu</h2>
                            <button id="close-offcanvas" type="button" class="btn-close me-1" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>

                        <hr class="opacity-50 border rounded-pill m-0 bg-dark d-flex d-lg-none">

                        <div class="offcanvas-body" id="offcanvas">
                            <form class="col col-md d-flex justify-content-center m-auto" id="pesquisa" role="search">
                                <input id="barra-pesquisa" class="form-control m-lg-auto p-1 m-sm-5 mb-sm-2 m-3 mb-2 border-0 rounded-pill h-5 pesquisar i18-placeholder" type="search" key="PesquisaPlaceholder" placeholder="Procurar" aria-label="Search">
                            </form>  
                            <ul class="menu-li col col-sm-10 col-lg navbar-nav m-auto mt-lg-0 mt-3 justify-content-end align-items-center ${classDark}" id="status-usuario">
                                <li class="nav-item mx-4">
                                    <a class="nav-link rounded-3 px-3" href="/pages/login.html">Acessar</a>
                                </li>
                                <li class="nav-item">
                                    <select class="form-select rounded-3 ps-3 py-2 bg-transparent" id="lingua" required>
                                        <option value="ptbr" ${lng === 'ptbr' ? 'selected' : ''}>Português</option>
                                        <option value="en" ${lng === 'en' ? 'selected' : ''}>English</option>
                                    </select>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        `
        this.querySelector('#lingua').addEventListener('change', event => {
            const selectedIndex = event.target.selectedIndex;
            localStorage.setItem('lng', event.target.children[selectedIndex].value);
            document.body.dispatchEvent(new Event('nova-lingua', { bubbles: true }))
        })
    }
    
    async estaLogado(lng) {
        const config = configuracaoFetch('GET');
        const infoUser = await fetch(`${api}auth/user`, config)
        if (infoUser.ok) {
            const defaultImg = 'https://cdn-icons-png.flaticon.com/512/17/17004.png'
            const resultados = await infoUser.json()
            const user = resultados.results
            console.log(user)
            const info = /* html */`
                <li class="nav-item d-none d-lg-block">
                    <img src="${user.picture ? infoUser.picture : defaultImg}" class="foto-usuario navbar-clicavel" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasUser" aria-label="Toggle navigation">
                </li>
                <li class="nav-item mx-4 d-none d-lg-block">
                    <i class="bi bi-gear text-primary fs-4 navbar-clicavel" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasUser" aria-label="Toggle navigation"></i>
                </li>
                <li class="nav-item">
                    <select class="form-select rounded-3 ps-3 py-2 bg-transparent" id="lingua" required>
                        <option value="ptbr" ${lng === 'ptbr' ? 'selected' : ''}>Português</option>
                        <option value="en" ${lng === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </li>
                <div class="list-group list-group-flush d-lg-none w-100">
                    <a href="javascript:void(0)" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-person fs-4"></i>
                        Página de perfil
                    </a>
                    <a href="/pages/configuracao-usuarios.html" class="list-group-item py-4 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-person-gear fs-4"></i>
                        Configurações do usuário
                    </a>
                    ${this.possuiCampeonato(user.championshipId)}
                    <a href="/pages/cadastro-times.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                        <i class="bi bi-people fs-4"></i>
                        Criar um time
                    </a>
                    <a href="javascript:void(0)" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3 deslogar-usuario">
                        <i class="bi bi-box-arrow-right fs-4"></i>
                        Sair da conta
                    </a>
                </div>
            `
            const status = document.getElementById('status-usuario')
            status.innerHTML = info

            const offcanvasUser = document.createElement('div')
            offcanvasUser.classList.add('offcanvas', 'offcanvas-end')
            offcanvasUser.id = 'offcanvasUser'
            offcanvasUser.setAttribute('tabindex', '-1')
            offcanvasUser.setAttribute('aria-labelledby', 'offcanvasUser')
            offcanvasUser.innerHTML = /* html */`
                <div class="offcanvas-header">
                    <div class="d-flex flex-row gap-3">
                        <img src="${user.picture ? user.picture : defaultImg}" class="foto-usuario">
                        <h5 class="offcanvas-title" id="offcanvasUserName">${user.userName}</h5>
                        <p id="usernameChampionshipId" class="d-none">${user.championshipId}</p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="list-group list-group-flush">
                        <a href="javascript:void(0)" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                            <i class="bi bi-person fs-4"></i>
                            Página de perfil
                        </a>
                        <a href="/pages/configuracao-usuarios.html" class="list-group-item py-4 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                            <i class="bi bi-person-gear fs-4"></i>
                            Configurações do usuário
                        </a>
                        ${this.possuiCampeonato(user.championshipId)}
                        <a href="/pages/cadastro-times.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                            <i class="bi bi-people fs-4"></i>
                            Criar um time
                        </a>
                        <a href="javascript:void(0)" id="deslogar-usuario" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                            <i class="bi bi-box-arrow-right fs-4"></i>
                            Sair da conta
                        </a>
                    </div>
                </div>
            `
            
            document.body.appendChild(offcanvasUser)
            document.querySelectorAll('.deslogar-usuario').forEach(el => el.addEventListener('click', async () => {
                const configLogout = configuracaoFetch('DELETE', null, false, false)
                await executarFetch('auth', configLogout)
                window.location.assign('/index.html')
            }))
        }
    }

    possuiCampeonato(campeonatoId) {
        console.log(campeonatoId)
        if (campeonatoId) {
            // TODO: remover essa limitação e adicionar pagina para listar campeonatos do usuário
            return /* html */`
            <a href="/pages/configuracao-campeonato.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
                <i class="bi bi-calendar-plus-fill fs-4"></i>
                Configurar campeonato
            </a>
            `
        }
        
        return /*html */ `
        <a href="/pages/cadastro-campeonatos.html" class="list-group-item py-3 px-2 fs-5 item-offcanvas-usuario d-flex align-items-center flex-row gap-3">
            <i class="bi bi-calendar-plus-fill fs-4"></i>
            Cadastrar campeonato
        </a>`
    }
}
window.customElements.define('componente-header', header);