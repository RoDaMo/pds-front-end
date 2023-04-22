export class header extends HTMLElement {
    constructor() {
        super();
        const lng = localStorage.getItem('lng');
        this.innerHTML = /* html */`
            <header class="container">
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="col col-lg-4">
                        <a class="navbar-brand m-auto p-auto" href="/"><img src="/Logo_Playoffs.png" class="img-fluid" width="180" alt="Logo Playoffs"></a>
                    </div>
                    
                    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                        <span class="btn-close d-flex"></span>
                    </button>
                    <div class="vw-100">   
                    <div class="collapse navbar-collapse w-100" id="navbarSupportedContent">   
                        <form class="col col-md d-flex justify-content-center m-auto p-auto" id="pesquisa" role="search">
                            <input id="barra-pesquisa" class="form-control m-lg-auto p-1 mt-5 m-sm-5 mb-sm-2 m-3 mb-2 border-0 rounded-pill h-5 pesquisar i18-placeholder" type="search" key="PesquisaPlaceholder" placeholder="Procurar" aria-label="Search">
                        </form>  

                        <ul class="menu-li col col-sm-10 col-lg navbar-nav m-auto p-auto justify-content-end align-items-center">
                            <li class="nav-item m-auto">
                                <a class="nav-link i18 rounded-3 px-3" href="/pages/cadastro-campeonatos.html" key="LinkCadastroCampeonato">Criar Campeonato</a>
                            </li>
                            <li class="nav-item">
                                <select class="form-select rounded-3 ps-3 py-2" id="lingua" required>
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

}
window.customElements.define('componente-header', header);