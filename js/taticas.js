import { executarFetch, configuracaoFetch } from "./utilidades/configFetch";
import { notificacaoErro } from "./utilidades/notificacoes";
import i18next from "i18next";
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const positionMapping = {
  1: "Goleiro",
  2: "Zagueiro",
  3: "Lateral",
  4: "Volante",
  5: "MeioCampista",
  6: "MeiaAtacante",
  7: "Ala",
  8: "Ponta",
  9: "Centroavante",
  10: "Levantador",
  11: "Central",
  12: "Libero",
  13: "Ponteiro",
  14: "Oposto",
};
const getPlayerPosition = (position) => {
  return i18next.t(positionMapping[position] || "SemPosicao");
};

const taticas = {
  async toggleTabs(activeBtn, inactiveBtn, showTab, hideTab, idPartida, jogadores) {
    activeBtn.classList.add('active')
    inactiveBtn.classList.remove('active')
    showTab.classList.remove('d-none')
    hideTab.classList.add('d-none')
    hideTab.innerHTML = ''
    showTab.innerHTML = `
    <div class="d-flex justify-content-center mb-2 align-items-center">
      <input type="number" class="botao-esquema-tatico form-control d-inline" id="fundo" min="0" max="6" value="4"/>
      <span>-</span>
      <input type="number" class="botao-esquema-tatico form-control d-inline" id="meio" min="0" max="6" value="3"/>
      <span>-</span>
      <input type="number" class="botao-esquema-tatico form-control d-inline" id="meio-avante" min="0" max="6" value="3"/>
      <span>-</span>
      <input type="number" class="botao-esquema-tatico form-control d-inline" id="avante" min="0" max="6"/>
    </div>
    <div class="text-danger d-none mb-2" id="container-erro-esquema-tatico"></div>
    <div class="container">
        <div class="row justify-content-center gap-4">
            <div class="col-3" id="campo-futebol">
                <div class="container h-100 d-flex flex-column-reverse justify-content-evenly" id="campo-futebol-container">
                    <div class="row justify-content-evenly linha-goleiro">
                        <div class="bola jogadores" is-goleiro="goleiro" draggable="true" data-coluna="1" data-linha="0">
                            <div class="sub-bola">
                                <small>0</small>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-evenly linha-campo">
                        
                    </div>
                    <div class="row justify-content-evenly linha-campo">
                      
                    </div>
                    <div class="row justify-content-evenly linha-campo">
                        
                    </div>
                    <div class="row justify-content-evenly linha-campo">
                        
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div class="bg-verde-limao p-2 row rounded-custom gap-3" id="jogadores-time">

                </div>
            </div>
        </div>
    </div>`

    await taticas.esquemaTatico(jogadores, idPartida, activeBtn.getAttribute('id-time'))
    document.getElementById('submeter-taticas').setAttribute('aba-ativa', showTab.id)
  },
  callbackDrop(e) {
    const droppedElementId = e.dataTransfer.getData('text/plain');
    const droppedElement = document.getElementById(droppedElementId)
    const bolaTarget = e.target
    console.log(droppedElement.classList.contains('nodrop') && bolaTarget.classList.contains('nodrop'))
    if (droppedElement.classList.contains('nodrop') && bolaTarget.classList.contains('nodrop') || !e.target.classList.contains('jogadores'))
      return
    console.log('hehe2')

    const antigoId = bolaTarget.id
    if (bolaTarget.getAttribute('is-goleiro') == 'goleiro' && droppedElement.getAttribute('data-posicao') != 1) {
      notificacaoErro('Posição exclusiva para goleiros')
      return
    }

    if (droppedElement.getAttribute('data-posicao') == 1 && bolaTarget.getAttribute('data-linha') > 0) {
      notificacaoErro('Goleiro não pode ser posicionado nessa localização')
      return
    }

    const antigoHtml = bolaTarget.innerHTML
    const antigoBackground = bolaTarget.style.backgroundImage
    const antigoTitle = bolaTarget.getAttribute('title')

    bolaTarget.innerHTML = droppedElement.innerHTML;
    bolaTarget.style.backgroundImage = droppedElement.style.backgroundImage;
    bolaTarget.setAttribute('title', droppedElement.getAttribute('title'))
    bolaTarget.setAttribute('data-posicao', droppedElement.getAttribute('data-posicao'))
    
    const id = droppedElement.id
    if (document.getElementById('campo-futebol').querySelector('#' + id) == null && (!antigoId || antigoId == 'goleiro')) {
      droppedElement.parentElement.remove()
      droppedElement.remove();
      bolaTarget.id = id
      return;
    }
    
    bolaTarget.id = id
    droppedElement.id = antigoId
    droppedElement.style.backgroundImage = antigoBackground
    droppedElement.innerHTML = antigoHtml
    droppedElement.setAttribute('title', antigoTitle)
    droppedElement.dispatchEvent(new Event('change', {bubbles: true}))
    bolaTarget.dispatchEvent(new Event('change', {bubbles: true}))

    for (const subBolas of document.getElementsByClassName('sub-bola')) {
      subBolas.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
      }, { once: true })
    }

    bolaTarget.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', e.target.id))
  },
  renderizarEsquemaTatico(valores, jogadores, linhasCampo, temJogadores) {
    for (let i = 0; i < linhasCampo.length; i++) {
      const linha = linhasCampo[i];
      const valoresParaEstaLinha = parseInt(valores[i])
      linha.innerHTML = '';

      let html = '';
      console.log(valoresParaEstaLinha)
      for (let j = 0; j < valoresParaEstaLinha; j++) {
        let titulo, picture, numero, id, posicao;

        if (temJogadores) {
          const jogador = jogadores[i + 1][j];
          titulo = jogador.name;
          picture = jogador.picture;
          numero = jogador.number;
          id = `jogador-${jogador.id}`;
          posicao = jogador.playerPosition;
        } else {
          titulo = 'Um Jogador';
          picture = '';
          numero = '0';
          id = '';
          posicao = '';
        }
        
        html += /*html*/`
          <div class="bola jogadores" title="${titulo}" id="${id}" data-coluna="${j + 1}" data-linha="${i + 1}" data-posicao="${posicao}" draggable="true" style="background-image: url('${picture}');">
              <div class="sub-bola">
                  <small>${numero}</small>
              </div>
          </div>
        `
      }
      linha.innerHTML = html;
    }

    for (const bola of document.getElementsByClassName('bola')) {
      bola.addEventListener('dragover', e => e.preventDefault())
      bola.addEventListener('drop', this.callbackDrop)
    }

    for (const imagens of document.getElementsByClassName('jogadores')) {
      imagens.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', e.target.id))
    }
  },
  async esquemaTatico(jogadores, idPartida, idTime) {
    const temJogadores = jogadores.length > 0;
    // Object to store the maximum position for each line
    const maxPositionsByLine = {};
    const playersByLine = {};

    jogadores.forEach(player => {
      if (!playersByLine[player.line]) {
        playersByLine[player.line] = [];
      }
    
      playersByLine[player.line].push(player);

      if (player.line === 99 || player.position === 99 || player.line === 0) {
        return;
      }

      if (!maxPositionsByLine[player.line - 1]) {
        maxPositionsByLine[player.line - 1] = player.position;
      } else if (player.position > maxPositionsByLine[player.line - 1]) {
        maxPositionsByLine[player.line - 1] = player.position;
      }
    });
    
    console.log(playersByLine, maxPositionsByLine);
    const botoesEsquemaTatico = document.getElementsByClassName('botao-esquema-tatico');
    const containerErro = document.getElementById('container-erro-esquema-tatico');
    const soma = 10;
    const arrayValores = temJogadores ? maxPositionsByLine : ['4', '3', '3']
    const linhasCampo = document.getElementsByClassName('linha-campo')
  
    if (!temJogadores) {
      await this.listagemReservas(idPartida, idTime)
    } else {
      const submter = document.getElementById('submeter-taticas')
      submter.setAttribute('disabled','disabled')
      submter.classList.add('d-none')
      botoesEsquemaTatico[0].parentElement.classList.add('d-none')
      await this.listagemReservas(idPartida, idTime, playersByLine[99])
    }

    for (const botao of botoesEsquemaTatico) {
      botao.addEventListener('change', async () => {
        let somaTemporaria = 0
        arrayValores.length = 0
        if (botao.value == 0)
          botao.value = null

        for (const outrosBotoes of botoesEsquemaTatico) {
          somaTemporaria += parseInt(outrosBotoes.value ? outrosBotoes.value : 0)
          arrayValores.push(outrosBotoes.value)
        }
  
        const submeter = document.getElementById('submeter-taticas')
        if (somaTemporaria > soma) {
          containerErro.textContent = 'Quantidade de jogadores titulares não pode ultrapassar 10!'
          containerErro.classList.remove('d-none')
          submeter.setAttribute('disabled', 'disabled');
        }
        else {
          if (somaTemporaria < soma)
            submeter.setAttribute('disabled', 'disabled');
          else 
            submeter.removeAttribute('disabled');

          containerErro.textContent = ''
          await this.listagemReservas(idPartida, idTime)
          this.renderizarEsquemaTatico(arrayValores, playersByLine, linhasCampo, temJogadores)

          const linhaGoleiro = document.querySelector('.linha-goleiro')

          let titulo, picture, numero, id;

          if (temJogadores) {
            const jogador = playersByLine[0][0];
            titulo = jogador.name;
            picture = jogador.picture;
            numero = jogador.number;
            id = `jogador-${jogador.id}`;
          } else {
            titulo = 'Um Jogador';
            picture = '';
            numero = '0';
            id = '';
          }

          linhaGoleiro.innerHTML = `
          <div class="bola jogadores" title="${titulo}" id="${id}" is-goleiro="goleiro" draggable="true" data-posicao="1" data-linha="0" style="background-image: url('${picture}');">
            <div class="sub-bola">
              <small>${numero}</small>
            </div>
          </div>
          `

          const bolaLinhaGoleiro = linhaGoleiro.querySelector('.bola')
          bolaLinhaGoleiro.addEventListener('dragover', e => e.preventDefault())
          bolaLinhaGoleiro.addEventListener('drop', this.callbackDrop)
          bolaLinhaGoleiro.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', e.target.id))
        }
      })
    }
    const linhaGoleiro = document.querySelector('.linha-goleiro')

    let titulo, picture, numero, id, posicao;

    if (temJogadores) {
      const jogador = playersByLine[0][0];
      titulo = jogador.name;
      picture = jogador.picture;
      numero = jogador.number;
      id = `jogador-${jogador.id}`;
      posicao = jogador.playerPosition;
    } else {
      titulo = 'Um Jogador';
      picture = '';
      numero = '0';
      id = '';
      posicao = '';
    }

    linhaGoleiro.innerHTML = `
    <div class="bola jogadores" title="${titulo}" id="${id}" is-goleiro="goleiro" draggable="true" data-coluna="1" data-posicao="${posicao}" data-linha="0" style="background-image: url('${picture}');">
      <div class="sub-bola">
        <small>${numero}</small>
      </div>
    </div>
    `
    this.renderizarEsquemaTatico(arrayValores, playersByLine, linhasCampo, temJogadores)
  },
  callbackDropReservas(e) {
    e.preventDefault()
    e.stopPropagation()
    const element = e.target.parentElement;
    const bola = element.querySelector('.bola')
    const nomeJogador = element.querySelector('p')
    const posicao = element.querySelector('.info-adicional>small')
    nomeJogador.textContent = bola.getAttribute('title')
    posicao.textContent = getPlayerPosition(bola.getAttribute('data-posicao'))
  },
  async listagemReservas(idPartida,idTime, jogadores) {
    const listagem = document.getElementById('jogadores-time')
    let jogadoresReserva = [];
    if (jogadores != null) {
      jogadoresReserva = jogadores;
    } else {
      const response = await executarFetch(`matches/${idPartida}/teams/${idTime}/players`),
            results = response.results

      jogadoresReserva = response.results
    }

    listagem.innerHTML = ''

    for (const jogador of jogadoresReserva) {
      listagem.innerHTML += /*html*/`
        <div class="lvl1-color col-6 row py-3 ps-2 bola-container">
          <div class="bola jogadores nodrop col-6" title="${jogador.name}" id="jogador-${jogador.id}" draggable="true" data-posicao="${jogador.playerPosition}" style="background-image: url('${jogador.picture}');">
            <div class="sub-bola">
              <small>${jogador.number}</small>
            </div>
          </div>
          <div class="col-6 info-adicional">
            <p class="m-0">
              ${jogador.name}
            </p>
            <small>
              ${getPlayerPosition(jogador.playerPosition)}
            </small>
          </div>
        </div>
      `
    }

    for (const bolaContainer of document.getElementsByClassName('bola-container')) {
      bolaContainer.addEventListener('change', this.callbackDropReservas)
    }

    listagem.addEventListener('dragover', e => e.preventDefault())
    listagem.addEventListener('drop', e => {
      const droppedElementId = e.dataTransfer.getData('text/plain');
      const droppedElement = document.getElementById(droppedElementId)
      if (droppedElement.classList.contains('nodrop'))
        return

      const originalParent = droppedElement.parentElement;
      const cloneElement = droppedElement.cloneNode()
      cloneElement.addEventListener('dragover', e => e.preventDefault())
      cloneElement.addEventListener('drop', this.callbackDrop)
      cloneElement.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', e.target.id))
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

      const novoContainerJogador = document.createElement('div')
      novoContainerJogador.classList.add('lvl1-color', 'col-6', 'row', 'py-3', 'ps-2')
      novoContainerJogador.appendChild(droppedElement)
      novoContainerJogador.innerHTML += /*html*/`
      <div class="col-6 info-adicional">
        <p class="m-0">
          ${droppedElement.getAttribute('title')}
        </p>
        <small>
          ${getPlayerPosition(droppedElement.getAttribute('data-posicao'))}
        </small>
      </div>
      `

      novoContainerJogador.addEventListener('change', this.callbackDropReservas)

      listagem.appendChild(novoContainerJogador)
      const novoAppended = listagem.querySelector(`#${droppedElementId}`)
      novoAppended.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', e.target.id))
      novoAppended.addEventListener('drop', this.callbackDrop)
      novoAppended.addEventListener('dragover', e => e.preventDefault())
      novoAppended.dispatchEvent(new Event('change', {bubbles: true}))
    })
  },
  async salvar(idPartida, abaAtiva) {
    const jogadoresObj = []
    const jogadoresHtml = document.getElementsByClassName('jogadores')
    const timeId = document.getElementById(abaAtiva).getAttribute('id-time')
    let contador = 0
    for (const jogador of jogadoresHtml) {
      const posicao = jogador.getAttribute('data-coluna') ?? 99
      const linha = jogador.getAttribute('data-linha') ?? 99

      jogadoresObj.push({
        PlayerId: jogador.id.replace('jogador-', ''),
        MatchId: idPartida,
        TeamId: timeId,
        Position: posicao,
        Line: linha
      })

      contador += posicao == 99 ? 0 : 1
    }
    if (contador != 11) {
      notificacaoErro('Não há jogadores o suficiente, preencha as 11 posições antes de salvar.')
      return;
    }

    loader.show();
    const resultado = await executarFetch('first-string', configuracaoFetch('POST', jogadoresObj))
    loader.hide();
    console.log(resultado)
  },
  async init() {    
    const botao1 = document.getElementById('botao-aba-1'),
          botao2 = document.getElementById('botao-aba-2'),
          aba1 = document.getElementById('aba-time-1'),
          aba2 = document.getElementById('aba-time-2'),
          idTime1 = document.getElementById('m-team1-name-wrapper').getAttribute('data-time-id'),
          idTime2 = document.getElementById('m-team2-name-wrapper').getAttribute('data-time-id'),
          idPartida = new URLSearchParams(window.location.search).get('id'),
          jogadoresArray = []

    const response = await executarFetch(`first-string?matchId=${idPartida}&teamId=${idTime1}`, configuracaoFetch('GET'))
    jogadoresArray.push(response.results);

    const response2 = await executarFetch(`first-string?matchId=${idPartida}&teamId=${idTime2}`, configuracaoFetch('GET'))
    jogadoresArray.push(response2.results);

    botao1.addEventListener('click', async () => {
      loader.show()
      await taticas.toggleTabs(botao1, botao2, aba1, aba2, idPartida, jogadoresArray[0])
      loader.hide()
    });

    botao2.addEventListener('click', async () => {
      loader.show()
      await taticas.toggleTabs(botao2, botao1, aba2, aba1, idPartida, jogadoresArray[1])
      loader.hide()
    });
    
    botao1.textContent = document.getElementById('m-team1-name').textContent
    botao2.textContent = document.getElementById('m-team2-name').textContent
    botao1.setAttribute('id-time', idTime1)
    botao2.setAttribute('id-time', idTime2)
    aba1.setAttribute('id-time', idTime1)
    aba2.setAttribute('id-time', idTime2)
    const sessionInfo = JSON.parse(localStorage.getItem('user-info'))
    const isOrganizer = sessionInfo.isOrganizer && sessionInfo.championshipId == document.getElementById('m-team1-name-wrapper').getAttribute('data-championship')
    const possuiTaticas = jogadoresArray[0].length != 0 && jogadoresArray[1].length != 0



    if (isOrganizer) {
      const botaoSubmit = document.getElementById('submeter-taticas')
      botaoSubmit.addEventListener('click', async () => await taticas.salvar(idPartida, botaoSubmit.getAttribute('aba-ativa')))

      return;
    } else {
      if (!possuiTaticas) {
        document.getElementById('match-details-tatics').innerHTML = '<h4>Os times dessa partida ainda não compartilharam o esquema tático de seus times!</h4>'
        return
      }
    }

    if (jogadoresArray[0].length > 0 || (jogadoresArray[0].length == 0 && jogadoresArray[1].length == 0)) {
      botao1.dispatchEvent(new Event('click'))
      return
    }
    else {
      botao2.dispatchEvent(new Event('click'))
      return
    }
  }
}

document.addEventListener('scoreboard-carregado', taticas.init)