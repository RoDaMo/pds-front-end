export class header extends HTMLElement {
    constructor() {
        super();
        const lng = localStorage.getItem('lng');

        let classDark = ''
        if (document.body.getAttribute('is-home')) {
            classDark = 'header-home'
        }

        this.innerHTML = /* html */`
            <header class="container">
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="col col-lg-4">
                        <a class="navbar-brand m-auto" href="/"><img src="/Logo_Playoffs.png" class="logo-play img-fluid" width="180" alt="Logo Playoffs"></a>
                    </div>
                    
                    <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>  

                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

                        <div class="offcanvas-header container pt-2 pb-2">
                            <h2 class="fw-light text-black">Menu</h2>
                            <button id="close-offcanvas" type="button" class="btn-close me-1" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>

                        <hr class="opacity-50 border rounded-pill m-0 bg-dark d-flex d-lg-none">

                        <div class="offcanvas-body">
                            <form class="col col-md d-flex justify-content-center m-auto" id="pesquisa" role="search">
                                <input id="barra-pesquisa" class="form-control m-lg-auto p-1 m-sm-5 mb-sm-2 m-3 mb-2 border-0 rounded-pill h-5 pesquisar i18-placeholder" type="search" key="PesquisaPlaceholder" placeholder="Procurar" aria-label="Search">
                            </form>  

                            <ul class="menu-li col col-sm-10 col-lg navbar-nav m-auto mt-lg-0 mt-3 justify-content-end align-items-center ${classDark}">
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

}
window.customElements.define('componente-header', header);