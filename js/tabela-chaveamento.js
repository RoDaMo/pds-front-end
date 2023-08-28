import { Tooltip } from "bootstrap"
import { configuracaoFetch, executarFetch } from "./utilidades/configFetch"

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const chaveamento = {
  inicializarRodadas(idCampeonato, formato, rodada, limiteRodadas) {
    const listarRodadas = async (rodada) => {
      const partidasWrapper = formato.querySelector('#wrapper-partidas'),
            responsePartidas = await executarFetch(`championships/${idCampeonato}/matches?round=${rodada}`),
            partidas = responsePartidas.results
  
      partidasWrapper.innerHTML = ''
  
      for (const partida of partidas) {
        partidasWrapper.innerHTML += /*html*/`
          <div class="bg-verde-limao px-4 py-2 partida-rodada">
            <div class="text-center py-1">
              <small>${this.convertDateFormat(partida.date)}</small>
            </div>
            <div class="row">
              <div class="col-4 text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                  <p class="my-0 ms-2 fs-4">${partida.homeGoals}</p>
                </div>
              </div>
              <div class="col-4 text-center">
                  <i class="bi bi-x-lg fs-2"></i>
              </div>
              <div class="col-4 text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <p class="my-0 me-2 fs-4">${partida.visitorGoals}</p>
                  <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                </div>
              </div>
            </div>
          </div>
        `
      }
    }

    listarRodadas(1);
    const proximaPartida = document.getElementById('proxima-rodada'),
          rodadaAnterior = document.getElementById('anterior-rodada'),
          rodadaAtual = document.getElementById('rodada-atual')

    const updateUI = (novoValor) => {
      proximaPartida.classList[novoValor == limiteRodadas ? 'add' : 'remove']('invisible');
      rodadaAnterior.classList[novoValor != 1 ? 'remove' : 'add']('invisible');
      rodadaAtual.textContent = novoValor;
    }

    proximaPartida.addEventListener('click', async () => {
      const novoValor = parseInt(rodadaAtual.textContent) + 1;
      updateUI(novoValor);
  
      loader.show();
      await listarRodadas(novoValor);
      loader.hide();
    })

    rodadaAnterior.addEventListener('click', async () => {
      const novoValor = parseInt(rodadaAtual.textContent) - 1;
      updateUI(novoValor);
  
      loader.show();
      await listarRodadas(novoValor);
      loader.hide();
    })
  },
  inicializarLegendas(estatisticas) {
    const legendasEsportes = document.getElementById('legendas-estatisticas-esportes')
    for (const legenda of estatisticas) {
      legendasEsportes.innerHTML += /*html*/ `
      <div class="legenda d-inline-block me-2">
        <b>${legenda[0]}</b> - ${legenda[1]}
      </div>
      `
    }
  },
  convertDateFormat(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const returnValue = year > 2 ? `${day}/${month}/${year}` : 'Data não definida'

    return returnValue;
  },
  async inicializarTabelas(formato, championship, idCampeonato) {
    const estatisticas = [
      [['P', 'Pontos'],['V', 'Vitórias'],['J', 'Jogos'],['SG','Saldo de Gols'],['GP','Gols Pró'],['CA','Cartões Amarelos'],['CV','Cartões Vermelhos'],['Ult. Jogos','Últimos Jogos']],
      [['P', 'Pontos'],['V', 'Vitórias'],['J', 'Jogos'],['SV','Sets Vencidos'],['SD','Sets Derrotados'],['PP','Pontos Pró'],['PC','Pontos Contra'],['Ult. Jogos','Últimos Jogos']]
    ]
    this.inicializarLegendas(estatisticas[championship.sportsId - 1])
    
    const colunasEstatisticas = document.getElementsByClassName('cabecalho-customizado')
    for (let i = 0; i < 8; i++) {
      const element = estatisticas[championship.sportsId - 1][i][0];
      colunasEstatisticas.item(i).textContent = element;
    }

    const tbody = formato.getElementsByTagName('tbody').item(0),
          responseTimes = await executarFetch(`statistics/${idCampeonato}/classifications`),
          times = responseTimes.results
        
    const limiteRodadas = championship.doubleStartLeagueSystem ? (championship.teamQuantity - 1) * 2 : championship.teamQuantity - 1
    this.inicializarRodadas(idCampeonato, formato, 1, limiteRodadas)

    tbody.innerHTML = ''
    let count = 0;
    console.log(times)
    for (const time of times) {
      count++
      const estatisticas = [[time.goalBalance,time.proGoals,time.yellowCard,time.redCard], [time.winningSets,time.losingSets,time.proPoints,time.pointsAgainst], time.points,time.wins, time.amountOfMatches]
      
      tbody.innerHTML += /* html */`
      <tr class="border-top-0"> <!-- 1 -->
        <th scope="row" class="border-end-0 border-start-0 d-none d-lg-table-cell">${count}</th>
        <td class="border-start-0 border-end-0 coluna-fixa">
            <img src="${time.emblem}" width="40" height="40" class="rounded-circle">
        </td>
        <td class=" d-none d-lg-table-cell border-start-0 align-content-center">${time.name}</td>
        <td>${estatisticas[2]}</td>
        <td>${estatisticas[3]}</td>
        <td>${estatisticas[4]}</td>
        <td>${estatisticas[championship.sportsId - 1][0]}</td>
        <td>${estatisticas[championship.sportsId - 1][1]}</td>
        <td>${estatisticas[championship.sportsId - 1][2]}</td>
        <td>${estatisticas[championship.sportsId - 1][3]}</td>
        <td>
          <small class="badge rounded-pill text-bg-secondary badge-ultima-partida d-inline-flex gap-3">
            <div 
              class="vencedor partida-pilula col-2" 
              data-bs-toggle="tooltip" 
              data-bs-html="true"
              data-bs-title="<div class='align-items-center'><img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'> 3 <i class='bi bi-x-lg'></i> 1 <img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'></div>"
            ></div>
            <div 
              class="perdedor partida-pilula col-2" 
              data-bs-toggle="tooltip" 
              data-bs-html="true"
              data-bs-title="<div class='align-items-center'><img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'> 3 <i class='bi bi-x-lg'></i> 1 <img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'></div>"
            ></div>
            <div 
              class="neutro partida-pilula col-2" 
              data-bs-toggle="tooltip" 
              data-bs-html="true"
              data-bs-title="<div class='align-items-center'><img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'> 3 <i class='bi bi-x-lg'></i> 1 <img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'></div>"
            ></div>
          </small>
        </td>
      </tr>
      `
    }

    const tooltips = document.getElementsByClassName('partida-pilula'),
          tooltipBootstrap = [...tooltips].map(tooltip => new Tooltip(tooltip))
  },
  async inicializarTabela(idCampeonato) {
    const config = configuracaoFetch('GET'),
          response = await executarFetch(`championships/${idCampeonato}`, config),
          championship = response.results,
          formatos = document.getElementsByClassName('formato-chaveamento'),
          formato = championship.format == 3 ? formatos.item(1) : formatos.item(0)
    
    if (championship.format == 3) formatos.item(0).remove()
    else formatos.item(1).remove()

    await this.inicializarArtilharia(formato, idCampeonato)
    if (championship.format == 3) {
      await this.inicializarTabelas(formato, championship, idCampeonato)
      return
    }

    const faseAtualWrapper = formato.querySelector('#fase-atual')

    const fases = ['Fase de grupos', 'Trinta e dois avos de final', 'Dezesseis avos de final', 'Oitavas de final', 'Quartas de final', 'Semi-finais', 'Finais'],
          faseInicial = championship.format == 4 ? 0 : 6 - Math.log2(championship.teamQuantity),
          proximoBotao = formato.querySelector('#proximo'),
          anteriorBotao = formato.querySelector('#anterior')
    
    let faseAtual = faseInicial;
    let faseAtualIsDupla = faseAtual > 0 && faseAtual != 6 ? championship.doubleMatchEliminations : faseAtual == 0 ? true : faseAtual == 6 ? championship.finalDoubleMatch : false

    faseAtualWrapper.textContent = fases[faseInicial]
    this.inicializarEliminatorias(formato, idCampeonato, faseInicial, fases, faseAtualIsDupla)
    
    if (faseAtual - 1 == 0 || faseAtual == faseInicial)
      anteriorBotao.classList.add('invisible')
    if (faseAtual + 1 > 6)
      proximoBotao.classList.add('invisible') 
    
    proximoBotao.addEventListener('click', async () => {
      faseAtual++
      if (faseAtual + 1 > 6)
        proximoBotao.classList.add('invisible')
      
      faseAtualIsDupla = faseAtual > 0 && faseAtual != 6 ? championship.doubleMatchEliminations : faseAtual == 0 ? true : faseAtual == 6 ? championship.finalDoubleMatch : false
      
      anteriorBotao.classList.remove('invisible')
      faseAtualWrapper.textContent = fases[faseAtual]

      loader.show();
      await this.inicializarEliminatorias(formato, idCampeonato, faseAtual, fases, faseAtualIsDupla)
      loader.hide();
    })

    anteriorBotao.addEventListener('click', async () => {
      faseAtual--
      if (faseAtual - 1 == 0 || faseAtual == faseInicial)
        anteriorBotao.classList.add('invisible')
      
      faseAtualIsDupla = faseAtual > 0 && faseAtual != 6 ? championship.doubleMatchEliminations : faseAtual == 0 ? true : faseAtual == 6 ? championship.finalDoubleMatch : false

      proximoBotao.classList.remove('invisible')
      faseAtualWrapper.textContent = fases[faseAtual]

      loader.show();
      await this.inicializarEliminatorias(formato, idCampeonato, faseAtual, fases, faseAtualIsDupla)
      loader.hide();
    })
  },
  async inicializarEliminatorias(formato, idCampeonato, faseAtual, fases, faseAtualIsDupla) {
    const responseEliminatorias = await executarFetch(`championships/${idCampeonato}/matches?phase=${faseAtual + 1}`),
          partidas = responseEliminatorias.results,
          partidasWrapper = formato.querySelector('#partida-rodada-eliminatorias')
          

    console.log(partidas)
    let count = 0;
    if (partidas.length == 0) {
      partidasWrapper.innerHTML = `
        <div class="bg-verde-limao col-12 text-center rounded-custom">
          <h5 class="p-5">Por enquanto, não há partidas nessa fase do campeonato.</h5>
        </div>
      `
      return
    }
    partidasWrapper.innerHTML = ''
    if (faseAtualIsDupla) {
      const partidasDuplas = [];
      
      for (let i = 0; i < partidas.length; i += 2) {
        const currentGame = partidas[i];
        const nextGame = partidas[i + 1];
        partidasDuplas.push({jogoAtual: currentGame, proximoJogo: nextGame});
      }

      for (const partidaDupla of partidasDuplas) {
        count++;
        partidasWrapper.innerHTML += /*html*/`
          <div class="bg-verde-limao p-2 partida-rodada m-2">
            <div class="d-flex gap-3 justify-content-evenly align-items-center bg-secondary texto-verde-limao p-3 rounded ida-volta">
                <div class="mx-2 mx-lg-5">
                    <div class="text-center py-1">
                    <small>${this.convertDateFormat(partidaDupla.jogoAtual.date)}</small><small class="d-block d-lg-inline"> <span class="d-none d-lg-inline">-</span> ${partidaDupla.jogoAtual.local ? partidaDupla.jogoAtual.local : 'Localização não definida'}</small>
                    </div>
                    <div class="row d-flex justify-content-center">
                      <div class="col-5 text-center d-flex justify-content-end">
                        <div class="d-flex align-items-center justify-content-center gap-3">
                          <img src="${partidaDupla.jogoAtual.homeEmblem}" rel="preconnect" alt="${partidaDupla.jogoAtual.homeName}" title="${partidaDupla.jogoAtual.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                          <p class="my-0 fs-4">${partidaDupla.jogoAtual.homeGoals}</p>
                        </div>
                      </div>
                      <div class="col-2 text-center d-flex justify-content-center align-items-center">
                        <i class="bi bi-x-lg fs-2"></i>
                      </div>
                      <div class="col-5 text-center d-flex justify-content-start">
                        <div class="d-flex align-items-center justify-content-center gap-3">
                          <p class="my-0 fs-4">${partidaDupla.jogoAtual.visitorGoals}</p>
                          <img src="${partidaDupla.jogoAtual.visitorEmblem}" rel="preconnect" alt="${partidaDupla.jogoAtual.visitorName}" title="${partidaDupla.jogoAtual.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                        </div>
                      </div>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-center bg-verde-limao px-3 py-2 rounded">
                    <small class="text-nowrap">${fases[faseAtual]} ${count}</small>
                </div>
                <div class="mx-2 mx-lg-5">
                    <div class="text-center py-1">
                      <small>${this.convertDateFormat(partidaDupla.proximoJogo.date)}</small><small class="d-block d-lg-inline"> <span class="d-none d-lg-inline">-</span> ${partidaDupla.proximoJogo.local ? partidaDupla.proximoJogo.local : 'Localização não definida'}</small>
                    </div>
                    <div class="row d-flex justify-content-center">
                      <div class="col-5 text-center d-flex justify-content-end">
                        <div class="d-flex align-items-center justify-content-center gap-3">
                          <img src="${partidaDupla.proximoJogo.homeEmblem}" rel="preconnect" alt="${partidaDupla.proximoJogo.homeName}" title="${partidaDupla.proximoJogo.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                          <p class="my-0 fs-4">${partidaDupla.proximoJogo.homeGoals}</p>
                        </div>
                      </div>
                      <div class="col-2 text-center d-flex justify-content-center align-items-center">
                        <i class="bi bi-x-lg fs-2"></i>
                      </div>
                      <div class="col-5 text-center d-flex justify-content-start">
                        <div class="d-flex align-items-center justify-content-center gap-3">
                          <p class="my-0 fs-4">${partidaDupla.proximoJogo.visitorGoals}</p>
                          <img src="${partidaDupla.proximoJogo.visitorEmblem}" rel="preconnect" alt="${partidaDupla.proximoJogo.visitorName}" title="${partidaDupla.proximoJogo.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        `
      }
      return
    }
    for (const partida of partidas) {
      count++;
      partidasWrapper.innerHTML += /*html*/`
        <div class="bg-verde-limao p-2 partida-rodada m-2">
          <div class="bg-secondary texto-verde-limao text-center p-3 rounded">
              <small class="d-inline justify-content-center bg-verde-limao px-3 py-2 rounded">${fases[faseAtual]} ${count}</small>
              <div class="text-center py-1 mt-2">
                  <small>${this.convertDateFormat(partida.date)}</small><small class="d-block d-lg-inline"> <span class="d-none d-lg-inline">-</span> ${partida.local ? partida.local : 'Localização não definida'}</small>
              </div>
              <div class="row d-flex justify-content-center">
                  <div class="col-5 text-center d-flex justify-content-end">
                      <div class="d-flex align-items-center justify-content-center gap-3">
                          <p class="my-0 d-none d-lg-block">${partida.homeName}</p>
                          <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                          <p class="my-0 ms-2 fs-4">${partida.homeGoals}</p>
                      </div>
                  </div>
                  <div class="col-2 text-center d-flex justify-content-center align-items-center">
                      <i class="bi bi-x-lg fs-2"></i>
                  </div>
                  <div class="col-5 text-center d-flex justify-content-start">
                      <div class="d-flex align-items-center justify-content-center gap-3">
                          <p class="my-0 me-2 fs-4">${partida.visitorGoals}</p>
                          <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                          <p class="my-0 d-none d-lg-block">${partida.visitorName}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
    }
  },
  async inicializarArtilharia(formato, idCampeonato) {
    const responseArtilharia = await executarFetch(`statistics/${idCampeonato}/strikers`),
          artilheiros = responseArtilharia.results,
          tabela = formato.querySelector('#tabela-jogadores'),
          tbody = tabela.getElementsByTagName('tbody').item(0)

    let count = 0;
    for (const artilheiro of artilheiros) {
      count++
      tbody.innerHTML += /*html*/`
      <tr>
        <th scope="row">${count}</th>
        <td>
            <img src="${artilheiro.teamEmblem}" alt="Imagem do time" width="50" height="50" class="rounded-circle">
        </td>
        <td>
            <img src="${artilheiro.picture}" alt="Imagem do Jogador" width="50" height="50" class="rounded-circle">
        </td>
        <td class="d-none d-lg-table-cell">${artilheiro.name}</td>
        <td>${artilheiro.goals}</td>
      </tr>
      `
    }
    if (count == 0)
      tabela.parentElement.classList.add('d-none')

    console.log(tabela);
  },
  init() {
    const urlParams = new URLSearchParams(window.location.search),
          idCampeonato = urlParams.get('id')

    this.inicializarTabela(idCampeonato)
  }
}

chaveamento.init()