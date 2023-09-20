import i18next from "i18next";

class footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = (window.matchMedia('(max-width: 575px)').matches) ? `
            <div class="container mt-0 d-flex d-md-none flex-column">
                <div class="row mb-2 justify-content-center">
                    <ul class="list-group list-group-horizontal list-group-flush justify-content-center p-0">
                        <li class="list-group-item border-0 opacity-75 bg-transparent"><a href="https://github.com/RoDaMo"><i class="bi bi-github fs-1"></i></a></li>
                    </ul>    
                </div>
                

                <hr class="opacity-50 border rounded-pill m-0 bg-dark">

                <div class="row mb-auto mt-2 justify-content-center">
                    <div class="col-auto mb-3">
                        <ul class="list-group list-group-horizontal list-group-flush">
                            <li class="list-group-item border-0 opacity-75 me-5 bg-transparent"><a href="/pages/termos-de-privacidade.html" class="i18" key="Politica">${i18next.t("Politica")}</a></li>
                            <li class="list-group-item border-0 opacity-75 bg-transparent"><a href="/pages/termos-de-uso.html" class="i18" key="Termos">${i18next.t("Termos")}</a></li>
                        </ul>
                        <ul class="list-group list-group-horizontal list-group-flush">
                            <li class="list-group-item border-0 opacity-75 me-5 bg-transparent"><a href="/pages/sobre-nos.html" class="i18" key="Sobre">${i18next.t("Sobre")}</a></li>
                            <li class="list-group-item border-0 opacity-75 bg-transparent"><a href="/pages/cookies.html">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <p class="text-center opacity-50">&#169; 2023 RoDaMo</p>
                    </div>
                </div>
            </div>
        ` : `
            <div class="container">
                <footer class="mt-2 d-none d-md-flex flex-column ">
                    <section class="row">
                        <div class="me-auto col-auto my-auto">
                        <a class="navbar-brand footer-navbar-brand" href="/">
                            <img src=${(document.documentElement.getAttribute("data-bs-theme") == "light") ? "/Logo_Playoffs.png" : "/Logo_Playoffs_White.png"} class="logo-play img-fluid ms-2" width="180" alt="Logo Playoffs">
                        </a>
                        </div>
                        
                        <div class="col-auto">
                        <ul class="list-group list-group-horizontal list-group-flush">
                            <li class="list-group-item bg-transparent border-0 opacity-75"><a href="/pages/termos-de-privacidade.html" class="i18" key="Politica">${i18next.t("Politica")}</a></li>
                            <li class="list-group-item bg-transparent border-0 opacity-75"><a href="/pages/termos-de-uso.html" class="i18" key="Termos">${i18next.t("Termos")}</a></li>
                        </ul>
                        <ul class="list-group list-group-horizontal list-group-flush">
                            <li class="list-group-item bg-transparent border-0 opacity-75"><a href="/pages/sobre-nos.html" class="i18" key="Sobre">${i18next.t("Sobre")}</a></li>
                            <li class="list-group-item bg-transparent border-0 opacity-75"><a href="/pages/cookies.html">Cookies</a></li>
                        </ul>
                        </div>
                    </section>

                    <hr class="border rounded-pill my-2 d-flex">
                    
                    <section class="row">
                        <p class="col-auto ms-2 my-auto me-auto opacity-50">&#169; 2023 RoDaMo</p>
                        <ul class="col-auto me-2 float-right align-self-end list-group list-group-horizontal list-group-flush">
                        <li class="list-group-item bg-transparent border-0 opacity-75"><a href="https://github.com/RoDaMo"><i class="bi bi-github fs-5"></i></a></li>
                        <li class="list-group-item bg-transparent border-0 opacity-75"><a href="https://www.youtube.com/@EquipeRodamo/featured"><i class="bi bi-youtube fs-5"></i></a></li>
                        </ul>
                    </section>
                </footer>
            </div>
        `
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.customElements.define('componente-footer', footer)

    const footerNavbarBrandImg = document.querySelector(".footer-navbar-brand img")

    document.querySelectorAll(".theme-option-btns").forEach(btn => {
        btn.addEventListener('click', async () => {
            (document.documentElement.getAttribute('data-bs-theme') != "light") ?
            footerNavbarBrandImg?.setAttribute('src', '/Logo_Playoffs.png')
            : footerNavbarBrandImg?.setAttribute('src', "/Logo_Playoffs_White.png")
        })
    })
})
