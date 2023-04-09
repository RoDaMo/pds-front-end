export class header extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid justify-content-center">
                        <div class="col col-lg-4">
                            <a class="navbar-brand m-auto p-auto" href="#"><img src="../public/Logo_Playoffs.png" class="img-fluid" width="180" alt="Logo Playoffs"></a>
                        </div>
                        
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                            
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">   
                            <form class="col col-md d-flex justify-content-center m-auto p-auto" role="search">
                            <input class="form-control m-lg-auto p-1 m-sm-5 mb-sm-2 m-3 mb-2 border-0 rounded-pill h-5" type="search" placeholder="Procurar" aria-label="Search">
                            </form>  

                            <ul class="col col-sm-10 col-lg navbar-nav m-auto p-auto justify-content-end">
                            <li class="nav-item">
                                <a class="nav-link" href="#">Criar Campeonato</a>
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