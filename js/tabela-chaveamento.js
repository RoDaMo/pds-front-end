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

    return `${day}/${month}/${year}`;
  },
  async inicializarTabela(idCampeonato) {
    const config = configuracaoFetch('GET'),
          response = await executarFetch(`championships/${idCampeonato}`, config),
          championship = response.results,
          formatos = document.getElementsByClassName('formato-chaveamento')
    
    for (const formato of formatos) {
      if (formato.id != championship.format)
        formato.remove()
    }

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

    const formato = formatos.item(0),
          tbody = formato.getElementsByTagName('tbody').item(0),
          responseTimes = await executarFetch(`statistics/${idCampeonato}/classifications`),
          times = responseTimes.results
    
    this.inicializarArtilharia(formato, idCampeonato)
    
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