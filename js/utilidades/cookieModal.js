import portugues from '../i18n/ptbr/cookieModal.json' assert { type: 'JSON' }
import ingles from '../i18n/en/cookieModal.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./internacionalizacao"

inicializarInternacionalizacao(ingles, portugues)

export class cookie extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 
      /* html */`
      <div class="fixed-bottom toast bg-dark text-white w-100 mw-100" role="alert" data-autohide="false">
        <div class="toast-body px-3 py-4 row justify-content-between">
          <div class="col-9">
            <h4 class="i18" key="CookiesTitulo">Cookies</h4>
            <p class="i18" key="Cookies">
              Este site utiliza cookies essenciais para o seu funcionamento. Ao utilizar esse site, você consente com o uso destes cookies.
            </p>
          </div>
          <div class="col align-self-center d-flex justify-content-end">
            <button type="button" class="btn btn-lg btn-light" id="btn-aceitar-cookie">
              Ok
            </button>
          </div>
        </div>
      </div>
      `
  }
}

customElements.define('componente-cookie', cookie);
