import { executarFetch, configuracaoFetch } from "./utilidades/configFetch";

const taticas = {
  toggleTabs(activeBtn, inactiveBtn, showTab, hideTab) {
    activeBtn.classList.add('active');
    inactiveBtn.classList.remove('active');
    showTab.classList.remove('d-none');
    hideTab.classList.add('d-none');
  },
  callbackDrop(e) {
    console.log('hahahah')
    console.log(e.target)
    const droppedElementId = e.dataTransfer.getData('text/plain');
    const droppedElement = document.getElementById(droppedElementId)
    const bolaTarget = e.target
    console.log(droppedElementId)
    if (droppedElement.classList.contains('nodrop') && bolaTarget.classList.contains('nodrop') || !(e.target.classList.contains('jogadores') || e.target.id == 'goleiro'))
      return;

    const antigoId = bolaTarget.id
    const antigoHtml = bolaTarget.innerHTML
    const antigoBackground = bolaTarget.style.backgroundImage
    const antigoTitle = bolaTarget.getAttribute('title')

    bolaTarget.innerHTML = droppedElement.innerHTML;
    bolaTarget.style.backgroundImage = droppedElement.style.backgroundImage;
    bolaTarget.setAttribute('title', droppedElement.getAttribute('title'))
    const id = droppedElement.id
    if (document.getElementById('campo-futebol').querySelector('#' + id) == null && !antigoId) {
      droppedElement.remove();
      bolaTarget.id = id
      return;
    }

    bolaTarget.id = id
    droppedElement.id = antigoId
    droppedElement.style.backgroundImage = antigoBackground
    droppedElement.innerHTML = antigoHtml
    droppedElement.setAttribute('title', antigoTitle)

    for (const subBolas of document.getElementsByClassName('sub-bola')) {
      subBolas.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
      }, { once: true })
    }
  },
  renderizarEsquemaTatico(valores, campoFutebol, linhasCampo) {
    for (let i = 0; i < linhasCampo.length; i++) {
      const linha = linhasCampo[i];
      const valoresParaEstaLinha = parseInt(valores[i])
      linha.innerHTML = '';
      for (let j = 0; j < valoresParaEstaLinha; j++) {

        linha.innerHTML += /*html*/`
          <div class="bola jogadores" title="Jogador Qualquer" data-posicao="${j + 1}" data-linha="${i + 1}" draggable="true">
              <div class="sub-bola">
                  <small>0</small>
              </div>
          </div>
        `
      }
    }

    for (const bola of document.getElementsByClassName('bola')) {
      bola.addEventListener('dragover', e => e.preventDefault())
      bola.addEventListener('drop', this.callbackDrop)
    }

    for (const imagens of document.getElementsByClassName('jogadores')) {
      imagens.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', imagens.id))
    }
  },
  async esquemaTatico() {
    const campoFutebol = document.getElementById('campo-futebol')
    const botoesEsquemaTatico = document.getElementsByClassName('botao-esquema-tatico');
    const containerErro = document.getElementById('container-erro-esquema-tatico');
    const soma = 10;
    const arrayValores = ['4', '3', '3']
    const linhasCampo = document.getElementsByClassName('linha-campo')
    await this.listagemReservas()

    for (const botao of botoesEsquemaTatico) {
      botao.addEventListener('change', () => {
        let somaTemporaria = 0
        arrayValores.length = 0
        if (botao.value == 0)
          botao.value = null

        for (const outrosBotoes of botoesEsquemaTatico) {
          somaTemporaria += parseInt(outrosBotoes.value ? outrosBotoes.value : 0)
          arrayValores.push(outrosBotoes.value)
        }
  
        if (somaTemporaria > soma) {
          containerErro.textContent = 'Quantidade de jogadores titulares não pode ultrapassar 10!'
          containerErro.classList.remove('d-none')
        }
        else {
          containerErro.textContent = ''
          this.renderizarEsquemaTatico(arrayValores, campoFutebol, linhasCampo)
        }
      })
    }
    botoesEsquemaTatico.item(0).dispatchEvent(new Event('change'))
  },
  async listagemReservas() {
    const listagem = document.getElementById('jogadores-time'),
          response = await executarFetch('teams/39/players'),
          results = response.results

    listagem.innerHTML = ''
    for (const jogador of results) {
      listagem.innerHTML += /*html*/`
        <div class="bola jogadores nodrop" title="${jogador.name}" id="jogador-${jogador.id}" draggable="true" style="background-image: url('${jogador.picture}');">
            <div class="sub-bola">
                <small>${jogador.number}</small>
            </div>
        </div>
      `
    }

    listagem.addEventListener('dragover', e => e.preventDefault())
    listagem.addEventListener('drop', e => {
      const droppedElementId = e.dataTransfer.getData('text/plain');
      const droppedElement = document.getElementById(droppedElementId)
      if (droppedElement.classList.contains('nodrop'))
        return;

      const originalParent = droppedElement.parentElement;
      console.log(originalParent, droppedElement)
      const cloneElement = droppedElement.cloneNode()

      cloneElement.addEventListener('dragover', e => e.preventDefault())
      cloneElement.addEventListener('drop', this.callbackDrop)
      cloneElement.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', cloneElement.id))
      cloneElement.style.backgroundImage = null
      cloneElement.id = ''
      cloneElement.innerHTML = `
        <div class="sub-bola">
            <small>0</small>
        </div>
      `
      cloneElement.setAttribute('title', '')

      originalParent.appendChild(cloneElement)
      droppedElement.classList.add('nodrop')
      listagem.appendChild(droppedElement)
    })
  },
  init() {
    const botao1 = document.getElementById('botao-aba-1'),
          botao2 = document.getElementById('botao-aba-2'),
          aba1 = document.getElementById('aba-time-1'),
          aba2 = document.getElementById('aba-time-2')

    botao1.addEventListener('click', () => this.toggleTabs(botao1, botao2, aba1, aba2));
    botao2.addEventListener('click', () => this.toggleTabs(botao2, botao1, aba2, aba1));
    
    this.esquemaTatico()

    document.addEventListener('scoreboard-carregado', () => {
      botao1.textContent = document.getElementById('m-team1-name').textContent
      botao2.textContent = document.getElementById('m-team2-name').textContent
    })

  }
}

taticas.init();