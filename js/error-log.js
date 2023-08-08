import { configuracaoFetch, executarFetch, api } from './utilidades/configFetch'

const logs = async () => {
  const callbackSucesso = (data) => {
    const logsContainer = document.getElementById('logs-container')
    for (const log of data.results) {
      logsContainer.innerHTML += /*html*/ `
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${log.id}" aria-expanded="true" aria-controls="collapse-${log.id}">
            ${log.message} - ${log.timeOfError}
          </button>
        </h2>
        <div id="collapse-${log.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            ${log.stackTrace}
          </div>
        </div>
      </div>`
    }
  }
  
  const config = configuracaoFetch('GET'),
        logs = await executarFetch('error', config)
  callbackSucesso(logs)
}
logs()