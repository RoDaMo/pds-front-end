export class header extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container justify-content-center align-items-center">
                        <div class="col col-lg-4">
                            <a class="navbar-brand m-auto p-auto" href="/"><img src="/Logo_Playoffs.png" class="img-fluid" width="180" alt="Logo Playoffs"></a>
                        </div>
                        
                        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                            <span class="btn-close d-flex"></span>
                        </button>
                            
                        <div class="collapse navbar-collapse w-100" id="navbarSupportedContent">   
                            <form id="pesquisa" class="col col-md d-flex justify-content-center m-auto p-auto" role="search">
                                <input id="barra-pesquisa" class="form-control m-lg-auto p-1 mt-5 m-sm-5 mb-sm-2 m-3 mb-2 border-0 rounded-pill h-5 pesquisar" type="search" placeholder="Procurar" aria-label="Search">
                            </form>  

                            <ul class="menu-li col col-sm-10 col-lg navbar-nav m-auto p-auto justify-content-end">
                            <li class="nav-item">
                                <a class="nav-link" href="/pages/cadastro-campeonatos.html">Criar Campeonato</a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        `
    }
}
window.customElements.define('componente-header', header);