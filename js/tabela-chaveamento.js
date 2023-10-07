import { Tooltip } from "bootstrap"
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import JustValidate from 'just-validate'
import i18next, { t } from "i18next";
import portugues from './i18n/ptbr/tabela-chaveamento.json' assert { type: 'JSON' }
import ingles from './i18n/en/tabela-chaveamento.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import * as bootstrap from 'bootstrap'
import flatpickr from "flatpickr"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const urlParams = new URLSearchParams(window.location.search),
      idCampeonato = urlParams.get('id')

let championshipData = null
;(async () => {
  const response = await executarFetch(`championships/${idCampeonato}`, configuracaoFetch('GET'))
  championshipData = response.results
})()

const sessionUserInfo = JSON.parse(localStorage.getItem('user-info'))

console.log(sessionUserInfo);

const isOrganizer = () => {
  let isOrganizer = false
  let isChampionshipOrganizer = false

  isChampionshipOrganizer = (idCampeonato == sessionUserInfo?.championshipId) ? true : false

  if (sessionUserInfo?.isOrganizer && isChampionshipOrganizer) {
    isOrganizer = true
  } else {
    isOrganizer = false
  }

  return isOrganizer
}

const chaveamento = {
  inicializarRodadas(idCampeonato, formato, classesCustom, limiteRodadas) {
    const listarRodadas = async (rodada) => {
      const partidasWrapper = formato.querySelector('#wrapper-partidas'),
            responsePartidas = await executarFetch(`championships/${idCampeonato}/matches?round=${rodada}`),
            partidas = responsePartidas.results
  
      partidasWrapper.innerHTML = ''
  
      for (const partida of partidas) {
        partidasWrapper.innerHTML += /*html*/`
          <div class="row justify-content-center align-items-center match-details-wrapper lvl2-color px-3 mx-0 rounded-5">
            <div class="text-center py-1">
              <small>${this.convertDateFormat(partida.date)}</small>
            </div>
            <a href="/pages/tela-partida.html?id=${partida.id}" class="text-decoration-none match-link-wrapper lvl3-color p-2 rounded-5 my-1 mb-3 d-flex justify-content-center align-items-center ${classesCustom}">
              <div class="row justify-content-center align-items-center">
                <div class="col-4 text-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                    <p class="my-0 ms-2 fs-4">${partida.finished ? partida.homeGoals : ''}</p>
                  </div>
                </div>
                <div class="col-auto text-center">
                  <i class="bi bi-x-lg fs-6"></i>
                </div>
                <div class="col-4 text-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="my-0 me-2 fs-4">${partida.finished ? partida.visitorGoals : ''}</p>
                    <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                  </div>
                </div>
              </div>
            </a>
            <span class="d-none match-id">${partida.id}</span>
            ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
              <div class="row justify-content-center align-items-center config-match-btn-wrapper">
                <a class="w-auto p-0" href="/pages/configuracao-partida.html?idM=${partida.id}&idC=${idCampeonato}">
                  <button class="btn pt-0 border-0 d-flex justify-content-center align-items-center config-match-btn">
                    <i class="bi bi-pencil-square lvl2-primary-bg px-4 py-1 rounded-pill"></i>
                  </button> 
                </a>
              </div>
            ` : ''}
          </div>
        `
      }

      const configMatchBtns = document.getElementsByClassName('config-match-btn')
      for (const configMatchBtn of configMatchBtns) {
        configMatchBtn.addEventListener('click', () => {
          const matchId = configMatchBtn.parentElement.parentElement.querySelector('.match-id').textContent
          configureMatch(matchId, championshipData)
        })
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
  gerarHtmlPartidaFaseGrupos(partida, rodada) {
    return /*html*/`
      <div class="row justify-content-center align-items-center match-details-wrapper lvl2-color px-3 mx-0 rounded-5 partida-rodada-${rodada} d-none">
        <div class="text-center py-1">
          <small>${this.convertDateFormat(partida.date)}</small>
        </div>
        <a href="/pages/tela-partida.html?id=${partida.id}" class="text-decoration-none match-link-wrapper lvl3-color p-2 rounded-5 my-1 mb-3 d-flex justify-content-center align-items-center">
          <div class="row justify-content-center align-items-center">
            <div class="col-4 text-center">
              <div class="d-flex align-items-center justify-content-center">
                <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                <p class="my-0 ms-2 fs-4">${partida.finished ? partida.homeGoals : ''}</p>
              </div>
            </div>
            <div class="col-auto text-center">
              <i class="bi bi-x-lg fs-6"></i>
            </div>
            <div class="col-4 text-center">
              <div class="d-flex align-items-center justify-content-center">
                <p class="my-0 me-2 fs-4">${partida.finished ? partida.visitorGoals : ''}</p>
                <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
              </div>
            </div>
          </div>
        </a>
        <span class="d-none match-id">${partida.id}</span>
        ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
          <div class="row justify-content-center align-items-center config-match-btn-wrapper">
            <a class="w-auto p-0" href="/pages/configuracao-partida.html?idM=${partida.id}&idC=${idCampeonato}">
              <button class="btn pt-0 border-0 d-flex justify-content-center align-items-center config-match-btn">
                <i class="bi bi-pencil-square lvl2-primary-bg px-4 py-1 rounded-pill"></i>
              </button> 
            </a>
          </div>
        ` : ''}
      </div>
    `
  },
  async carregarRodadasFasesGrupos(limiteRodadas, idCampeonato) {
    const fetchPromises = Array.from({ length: limiteRodadas }, (_, i) => executarFetch(`championships/${idCampeonato}/matches?round=${i + 1}`))

    const responses = await Promise.all(fetchPromises)
    const rodadas = responses.map(response => response.results)
    const gruposWrappers = document.getElementsByClassName('fase-grupos-rodadas')
    let count = 0
    for (const partidas of rodadas) {
      count++
      const htmls = [];
      for (let i = 0; i < partidas.length; i += 2) {
        const primeiraPartida = partidas[i]
        const segundaPartida = partidas[i + 1]
        htmls.push({ primeiraPartida: this.gerarHtmlPartidaFaseGrupos(primeiraPartida, count), segundaPartida: this.gerarHtmlPartidaFaseGrupos(segundaPartida, count) }) 
      }

      for (let i = 0; i < gruposWrappers.length; i++) {
        const grupo = gruposWrappers[i]
        grupo.innerHTML += htmls[i].primeiraPartida
        grupo.innerHTML += htmls[i].segundaPartida
      }
    }

    const configMatchBtns = document.getElementsByClassName('config-match-btn')
    for (const configMatchBtn of configMatchBtns) {
      configMatchBtn.addEventListener('click', () => {
        const matchId = configMatchBtn.parentElement.parentElement.querySelector('.match-id').textContent
        configureMatch(matchId, championshipData)
      })
    }

    for (const partida of document.getElementsByClassName('partida-rodada-1')) {
      partida.classList.remove('d-none');
    }

    count = 0;
    for (const grupo of gruposWrappers) {
      count++;
      const proximaPartida = document.getElementById(`proxima-rodada-${count}`),
            rodadaAnterior = document.getElementById(`anterior-rodada-${count}`),
            rodadaAtual = document.getElementById(`rodada-atual-${count}`)

      const updateUI = (novoValor) => {
        proximaPartida.classList[novoValor == limiteRodadas ? 'add' : 'remove']('invisible');
        rodadaAnterior.classList[novoValor != 1 ? 'remove' : 'add']('invisible');
        rodadaAtual.textContent = novoValor;
      }

      proximaPartida.addEventListener('click', () => {
        const valorAntigo = parseInt(rodadaAtual.textContent)
        const novoValor = valorAntigo + 1;
        updateUI(novoValor);
    
        grupo.querySelectorAll(`.partida-rodada-${valorAntigo}`).forEach(el => el.classList.add('d-none'))
        grupo.querySelectorAll(`.partida-rodada-${novoValor}`).forEach(el => el.classList.remove('d-none'))
      })

      rodadaAnterior.addEventListener('click', () => {
        const valorAntigo = parseInt(rodadaAtual.textContent)
        const novoValor = valorAntigo - 1;
        if (novoValor < 0)
          return;
        
        updateUI(novoValor);
    
        grupo.querySelectorAll(`.partida-rodada-${valorAntigo}`).forEach(el => el.classList.add('d-none'))
        grupo.querySelectorAll(`.partida-rodada-${novoValor}`).forEach(el => el.classList.remove('d-none'))
      })
    }
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
    let html = ``
    for (const time of times) {
      count++
      const estatisticas = [[time.goalBalance,time.proGoals,time.yellowCard,time.redCard], [time.winningSets,time.losingSets,time.proPoints,time.pointsAgainst], time.points,time.wins, time.amountOfMatches]
      
      html += /* html */`
      <tr class="border-top-0"> <!-- 1 -->
        <th scope="row" class="border-end-0 border-start-0 d-none d-lg-table-cell">${count}</th>
        <td class="border-start-0 border-end-0 coluna-fixa">
          <a href="/pages/pagina-times.html?id=${time.teamId}">
            <img src="${time.emblem}" width="40" height="40" class="rounded-circle">
          </a>
        </td>
        <td class=" d-none d-lg-table-cell border-start-0 align-content-center">
          <a href="/pages/paginas-times.html?id=${time.teamId}" class="text-decoration-none">
            ${time.name}
          </a>
        </td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[2]}</td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[3]}</td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[4]}</td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[championship.sportsId - 1][0]}</td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[championship.sportsId - 1][1]}</td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[championship.sportsId - 1][2]}</td>
        <td class="text-center fs-5 fw-semibold">${estatisticas[championship.sportsId - 1][3]}</td>
        <td>
          <small class="badge rounded-pill text-bg-secondary badge-ultima-partida d-inline-flex gap-3">`
          
        if (time.lastMatches.length > 0) {
          for (let i = 0; i < time.lastMatches.length; i++) {
            const partida = time.lastMatches[i];
            const resultado = time.lastResults[i]
            const classe = resultado.won ? 'vencedor' : resultado.lose ? 'perdedor' : 'neutro'
            const classeOposta = resultado.won ? 'perdedor' : resultado.lose ? 'vencedor' : 'neutro'
  
            html += /*html*/ `
              <div 
                class="${classe} partida-pilula col-2" 
                data-bs-toggle="tooltip" 
                data-bs-html="true"
                data-bs-title="<div class='align-items-center'><img src='${partida.homeEmblem}' alt='${partida.homeName}' rel='preconnect' width='40' height='40' class='time-${partida.homeId == time.teamId ? classe : classeOposta} rounded-circle'> ${partida.finished ? partida.homeGoals : ""} <i class='bi bi-x-lg'></i> ${partida.finished ? partida.visitorGoals : ""} <img src='${partida.visitorEmblem}' alt='${partida.visitorName}' rel='preconnect' width='40' height='40' class='time-${partida.visitorId == time.teamId ? classe : classeOposta} rounded-circle'></div>"
              ></div>
            `
          }
        }
        else {
          html += `Nenhuma`
        }
        html +=
        `
          </small>
        </td>
      </tr>
      `
    }
    tbody.innerHTML = html;

    const tooltips = document.getElementsByClassName('partida-pilula'),
          tooltipBootstrap = [...tooltips].map(tooltip => new Tooltip(tooltip))
  },
  async inicializarTabela(idCampeonato) {
    const config = configuracaoFetch('GET'),
          response = await executarFetch(`championships/${idCampeonato}`, config),
          championship = response.results,
          formatos = document.getElementsByClassName('formato-chaveamento'),
          formato = championship.format == 3 ? formatos.item(1) : formatos.item(0)
    
    await this.inicializarArtilharia(formato, idCampeonato)
    if (championship.format == 3) {
      formatos.item(0).remove()
      await this.inicializarTabelas(formato, championship, idCampeonato)
      return
    }
    else formatos.item(1).remove()

    const faseAtualWrapper = formato.querySelector('#fase-atual')

    const fases = ['Fase de grupos', 'Trinta e dois avos de final', 'Dezesseis avos de final', 'Oitavas de final', 'Quartas de final', 'Semi-finais', 'Final'],
          faseInicial = championship.format == 4 ? 0 : 7 - Math.log2(championship.teamQuantity),
          proximoBotao = formato.querySelector('#proximo'),
          anteriorBotao = formato.querySelector('#anterior')
    
    let faseAtual = faseInicial;
    let faseAtualIsDupla = faseAtual > 0 && faseAtual != 6 ? championship.doubleMatchEliminations : faseAtual == 0 ? true : faseAtual == 6 ? championship.finalDoubleMatch : false

    faseAtualWrapper.textContent = fases[faseInicial]
    await this.inicializarEliminatorias(formato, idCampeonato, faseInicial, fases, faseAtualIsDupla, championship)
    
    if (faseAtual - 1 == 0 || faseAtual == faseInicial)
      anteriorBotao.classList.add('invisible')
    if (faseAtual + 1 > 6)
      proximoBotao.classList.add('invisible') 
    
    proximoBotao.addEventListener('click', async () => {
      if(faseAtual === 0){
        switch(championship.teamQuantity){
          case 64: 
            faseAtual += 2
            break
          case 32: 
            faseAtual += 3
            break
          case 16: 
            faseAtual += 4
            break
          case 8: 
            faseAtual += 5
            break
          case 4: 
            faseAtual += 6
            break
          default: 
            console.log('default')
        }
      }
      else{
        faseAtual++
      }
      if (faseAtual + 1 > 6)
        proximoBotao.classList.add('invisible')
      
      faseAtualIsDupla = faseAtual > 0 && faseAtual != 6 ? championship.doubleMatchEliminations : faseAtual == 0 ? true : faseAtual == 6 ? championship.finalDoubleMatch : false
      
      anteriorBotao.classList.remove('invisible')
      faseAtualWrapper.textContent = fases[faseAtual]

      loader.show();
      await this.inicializarEliminatorias(formato, idCampeonato, faseAtual, fases, faseAtualIsDupla, championship)
      loader.hide();
    })

    anteriorBotao.addEventListener('click', async () => {
      if(championship.format === 4){
        switch(championship.teamQuantity){
          case 64:
            (faseAtual === 2) ? faseAtual = 0 : faseAtual--
            break
          case 32:
            (faseAtual === 3) ? faseAtual = 0 : faseAtual--
            break
          case 16: 
            (faseAtual === 4) ? faseAtual = 0 : faseAtual--
            break
          case 8: 
            (faseAtual === 5) ? faseAtual = 0 : faseAtual--
            break
          case 4: 
            (faseAtual === 6) ? faseAtual = 0 : faseAtual--
            break
          default:
            console.log('default')
        }
      }
      else{
        faseAtual--
      }
      if (faseAtual == faseInicial)
        anteriorBotao.classList.add('invisible')
      
      faseAtualIsDupla = faseAtual > 0 && faseAtual != 6 ? championship.doubleMatchEliminations : faseAtual == 0 ? true : faseAtual == 6 ? championship.finalDoubleMatch : false

      proximoBotao.classList.remove('invisible')
      faseAtualWrapper.textContent = fases[faseAtual]

      loader.show();
      await this.inicializarEliminatorias(formato, idCampeonato, faseAtual, fases, faseAtualIsDupla, championship)
      loader.hide();
    })

  },
  async inicializarFaseGrupos(partidas, partidasWrapper, campeonato) {
    partidasWrapper.classList.remove('bg-verde-limao')
    partidasWrapper.classList.add('gap-3', 'd-flex', 'flex-column')

    const grupos = [];

    for (let i = 0; i < partidas.length; i += 4) {
      const grupo = [
        partidas[i],
        partidas[i + 1],
        partidas[i + 2],
        partidas[i + 3]
      ];
      grupos.push(grupo);
    }

    const containerGrupos = document.createElement('div')
    containerGrupos.classList.add('container')
    const rowGrupos = document.createElement('div')
    rowGrupos.classList.add('row', 'gap-lg-3')

    let count = 0;
    for (const grupo of grupos) {
      count++;
      rowGrupos.innerHTML += /*html*/`
      <div class="col d-flex flex-column-reverse flex-lg-column gap-3 px-0">
        <div class="p-3 rounded-5 table-responsive lvl1-color tabela-customizada-wrapper col">
          <h3>Grupo ${count}</h3>
          <table class="table table-hover table-bordered tabela-customizada">
            <thead>
                <tr class="border-bottom-0 border-top-0">
                    <th scope="col" class="col border-0 d-none d-lg-table-cell"></th>
                    <th scope="col" class="col-1 border-0 coluna-fixa"></th>
                    <th scope="col" class="col-2 border-0 d-none d-lg-table-cell"></th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">P</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">V</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">J</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">SG</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">GP</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">CA</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">CV</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado text-center">Ult. Jogos</th>
                </tr>
            </thead>
            <tbody id="tbody-${count}">
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-lg-3 col-12 rounded-5 matches-round-data-wrapper lvl1-color borda-top-lg p-3 mb-lg-0 mb-3">
        <div class="row row-cols-3 flex-row justify-content-center align-items-center">
          <div class="col-12 d-flex justify-content-center align-items-center">
              <h4 id="rodada-text-${count}"><span id="rodada-atual-${count}">1</span>º Rodada</h4>
          </div>
          <div class="col-6 d-flex justify-content-center align-items-center">
              <button id="anterior-rodada-${count}" class="seta-botao-rodada lvl2-color btn px-3 py-2 w-100 invisible"><i class="bi bi-caret-left"></i></button>
          </div>
          <div class="col-6 d-flex justify-content-center align-items-center">
              <button id="proxima-rodada-${count}" class="seta-botao-rodada lvl2-color btn px-3 py-2 w-100"><i class="bi bi-caret-right"></i></button>
          </div>
        </div>
        <div class="mt-3 d-flex flex-column gap-4 fase-grupos-rodadas">
            
        </div>
      </div>
      `
      const tbody = rowGrupos.querySelector(`#tbody-${count}`)
      let countTimes = 0
      let html = '';
      for (const time of grupo) {
        countTimes++
        const estatisticas = [[time.goalBalance,time.proGoals,time.yellowCard,time.redCard], [time.winningSets,time.losingSets,time.proPoints,time.pointsAgainst], time.points,time.wins, time.amountOfMatches]

        html += /*html*/`
          <tr class="border-top-0">
            <th scope="row" class="border-end-0 border-start-0 d-none d-lg-table-cell">${countTimes}</th>
            <td class="border-start-0 border-end-0 coluna-fixa">
              <a href="/pages/pagina-times.html?id=${time.teamId}">
                <img src="${time.emblem}" width="40" height="40" class="rounded-circle">
              </a>
            </td>
            <td class="d-none d-lg-table-cell border-start-0 align-content-center">
              <a href="/pages/paginas-times.html?id=${time.teamId}" class="text-decoration-none">
                ${time.name}
              </a>
            </td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[2]}</td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[3]}</td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[4]}</td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[campeonato.sportsId - 1][0]}</td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[campeonato.sportsId - 1][1]}</td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[campeonato.sportsId - 1][2]}</td>
            <td class="text-center fs-5 fw-semibold">${estatisticas[campeonato.sportsId - 1][3]}</td>
            <td>
              <small class="badge rounded-pill text-bg-secondary badge-ultima-partida d-inline-flex gap-3">`

        if (time.lastMatches.length > 0) {
          for (let i = 0; i < time.lastMatches.length; i++) {
            const partida = time.lastMatches[i];
            const resultado = time.lastResults[i]
            const classe = resultado.won ? 'vencedor' : resultado.lose ? 'perdedor' : 'neutro'
            const classeOposta = resultado.won ? 'perdedor' : resultado.lose ? 'vencedor' : 'neutro'
  
            html += /*html*/ `
              <div 
                class="${classe} partida-pilula col-2" 
                data-bs-toggle="tooltip" 
                data-bs-html="true"
                data-bs-title="<div class='align-items-center'><img src='${partida.homeEmblem}' alt='${partida.homeName}' rel='preconnect' width='40' height='40' class='time-${partida.homeId == time.teamId ? classe : classeOposta} rounded-circle'> ${partida.finished ? partida.homeGoals : ""} <i class='bi bi-x-lg'></i> ${partida.finished ? partida.visitorGoals : ""} <img src='${partida.visitorEmblem}' alt='${partida.visitorName}' rel='preconnect' width='40' height='40' class='time-${partida.visitorId == time.teamId ? classe : classeOposta} rounded-circle'></div>"
              ></div>
            `
          }
        }
        else {
          html += `Nenhuma`
        }
        
        html += `
              </small>
            </td>
          </tr>
        `
      }
      tbody.innerHTML = html;
    }


    containerGrupos.appendChild(rowGrupos)
    partidasWrapper.appendChild(containerGrupos)
    partidasWrapper.innerHTML += /*html*/`
      <div class="container p-3 rounded-5 lvl1-color legenda-wrapper">
        <div class="legenda me-2 d-inline-block">
          <div class="d-inline-block vencedor" style="width: 10px; height: 10px;"></div>
          Derrota
        </div>
        <div class="legenda me-2 d-inline-block">
          <div class="d-inline-block perdedor" style="width: 10px; height: 10px;"></div>
          Vitória
        </div>
        <div class="legenda d-inline-block">
          <div class="d-inline-block neutro" style="width: 10px; height: 10px;"></div>
          Empate/Ainda não ocorreu
        </div>
        <div class="d-block" id="legendas-estatisticas-esportes">

        </div>
      </div>
    `
    const estatisticas = [
      [['P', 'Pontos'],['V', 'Vitórias'],['J', 'Jogos'],['SG','Saldo de Gols'],['GP','Gols Pró'],['CA','Cartões Amarelos'],['CV','Cartões Vermelhos'],['Ult. Jogos','Últimos Jogos']],
      [['P', 'Pontos'],['V', 'Vitórias'],['J', 'Jogos'],['SV','Sets Vencidos'],['SD','Sets Derrotados'],['PP','Pontos Pró'],['PC','Pontos Contra'],['Ult. Jogos','Últimos Jogos']]
    ]

    this.inicializarLegendas(estatisticas[campeonato.sportsId - 1])

    const colunasEstatisticas = document.getElementsByClassName('cabecalho-customizado')
    for (let i = 0; i < 8; i++) {
      const element = estatisticas[campeonato.sportsId - 1][i][0];
      colunasEstatisticas.item(i).textContent = element;
    }
    await this.carregarRodadasFasesGrupos(campeonato.doubleMatchGroupStage ? 6 : 3, campeonato.id)
    const tooltips = document.getElementsByClassName('partida-pilula'),
    tooltipBootstrap = [...tooltips].map(tooltip => new Tooltip(tooltip))
    // this.inicializarRodadas(campeonato.id, partidasWrapper, 'col', campeonato.doubleMatchGroupStage ? (campeonato.teamQuantity - 1) * 2 : campeonato.teamQuantity - 1)
  },
  async inicializarEliminatorias(formato, idCampeonato, faseAtual, fases, faseAtualIsDupla, campeonato) {
    const endpoint = faseAtual == 0 ? `statistics/${idCampeonato}/classifications` : `championships/${idCampeonato}/matches?phase=${faseAtual}`,
          responseEliminatorias = await executarFetch(endpoint),
          partidas = responseEliminatorias.results,
          partidasWrapper = formato.querySelector('#partida-rodada-eliminatorias')
          
    let count = 0;
    partidasWrapper.innerHTML = ''
    if (partidas.length == 0) {
      partidasWrapper.innerHTML = `
        <div class="lvl2-color col-12 text-center rounded-5">
          <h5 class="p-5">Por enquanto, não há partidas nessa fase do campeonato.</h5>
        </div>
      `
      return
    }
    if (faseAtual == 0) {
      this.inicializarFaseGrupos(partidas, partidasWrapper, campeonato)
      return;
    }

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
          <div class="d-flex gap-3 justify-content-evenly align-items-center lvl2-color mb-3 p-3 rounded ida-volta">
              <div class="row justify-content-center align-items-center mx-2 px-3 pb-3 rounded-5">
                <div class="text-center py-1">
                  <small>${this.convertDateFormat(partidaDupla.jogoAtual.date)}</small><small class="d-block d-lg-inline"><span class="d-none d-lg-inline">-</span> ${partidaDupla.jogoAtual.road ? partidaDupla.jogoAtual.road : 'Localização não definida'}</small>
                </div>
                <a href="/pages/tela-partida.html?id=${partidaDupla.jogoAtual.id}" class="text-decoration-none lvl3-color match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
                  <div class="row justify-content-center align-items-center">
                    <div class="col-4 text-center">
                      <div class="d-flex align-items-center justify-content-center">
                        <img src="${partidaDupla.jogoAtual.homeEmblem}" rel="preconnect" alt="${partidaDupla.jogoAtual.homeName}" title="${partidaDupla.jogoAtual.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                        <p class="my-0 ms-2 fs-4">${partidaDupla.jogoAtual.finished ? partidaDupla.jogoAtual.homeGoals : ''}</p>
                      </div>
                    </div>
                    <div class="col-4 text-center">
                      <i class="bi bi-x-lg fs-6"></i>
                    </div>
                    <div class="col-4 text-center">
                      <div class="d-flex align-items-center justify-content-center">
                        <p class="my-0 me-2 fs-4">${partidaDupla.jogoAtual.finished ? partidaDupla.jogoAtual.visitorGoals : ''}</p>
                        <img src="${partidaDupla.jogoAtual.visitorEmblem}" rel="preconnect" alt="${partidaDupla.jogoAtual.visitorName}" title="${partidaDupla.jogoAtual.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                      </div>
                    </div>
                  </div>
                </a>
                <span class="d-none match-id">${partidaDupla.jogoAtual.id}</span>
                ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
                  <div class="row justify-content-center align-items-center config-match-btn-wrapper">
                    <a class="w-auto p-0" href="/pages/configuracao-partida.html?idM=${partida.id}&idC=${idCampeonato}">
                      <button class="btn pt-0 border-0 d-flex justify-content-center align-items-center config-match-btn">
                        <i class="bi bi-pencil-square lvl2-primary-bg px-4 py-1 rounded-pill"></i>
                      </button> 
                    </a>
                  </div>
                ` : ''}
              </div>

              <div class="d-flex align-items-center justify-content-center lvl3-color mb-3 px-3 py-2 rounded">
                  <small class="text-nowrap">${fases[faseAtual]} ${count}</small>
              </div>

              <div class="row justify-content-center align-items-center mx-2 px-3 pb-3 rounded-5">
                <div class="text-center py-1">
                  <small>${this.convertDateFormat(partidaDupla.proximoJogo.date)}</small><small class="d-block d-lg-inline"><span class="d-none d-lg-inline">-</span> ${partidaDupla.jogoAtual.road ? partidaDupla.jogoAtual.road : 'Localização não definida'}</small>
                </div>
                <a href="/pages/tela-partida.html?id=${partidaDupla.proximoJogo.id}" class="text-decoration-none lvl3-color match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
                  <div class="row justify-content-center align-items-center">
                    <div class="col-4 text-center">
                      <div class="d-flex align-items-center justify-content-center">
                        <img src="${partidaDupla.proximoJogo.homeEmblem}" rel="preconnect" alt="${partidaDupla.proximoJogo.homeName}" title="${partidaDupla.proximoJogo.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                        <p class="my-0 ms-2 fs-4">${partidaDupla.proximoJogo.finished ? partidaDupla.proximoJogo.homeGoals : ''}</p>
                      </div>
                    </div>
                    <div class="col-4 text-center">
                      <i class="bi bi-x-lg fs-6"></i>
                    </div>
                    <div class="col-4 text-center">
                      <div class="d-flex align-items-center justify-content-center">
                        <p class="my-0 me-2 fs-4">${partidaDupla.proximoJogo.finished ? partidaDupla.proximoJogo.visitorGoals : ''}</p>
                        <img src="${partidaDupla.proximoJogo.visitorEmblem}" rel="preconnect" alt="${partidaDupla.proximoJogo.visitorName}" title="${partidaDupla.proximoJogo.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                      </div>
                    </div>
                  </div>
                </a>
                <span class="d-none match-id">${partidaDupla.proximoJogo.id}</span>
                ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
                  <div class="row justify-content-center align-items-center config-match-btn-wrapper">
                    <a class="w-auto p-0" href="/pages/configuracao-partida.html?idM=${partida.id}&idC=${idCampeonato}">
                      <button class="btn pt-0 border-0 d-flex justify-content-center align-items-center config-match-btn">
                        <i class="bi bi-pencil-square lvl2-primary-bg px-4 py-1 rounded-pill"></i>
                      </button> 
                    </a>
                  </div>
                ` : ''}
              </div>

          </div>

        `
      }

      const configMatchBtns = document.getElementsByClassName('config-match-btn')
      for (const configMatchBtn of configMatchBtns) {
        configMatchBtn.addEventListener('click', () => {
          const matchId = configMatchBtn.parentElement.parentElement.querySelector('.match-id').textContent
          configureMatch(matchId, championshipData)
        })
      }

      return
    }

    for (const partida of partidas) {
      count++;
      partidasWrapper.innerHTML += /*html*/`
        <div class="row justify-content-center align-items-center mx-2 lvl2-color px-3 pb-3 mb-3 rounded-5">
          <div class="text-center py-1">
            <small>${this.convertDateFormat(partida.date)}</small>
          </div>
          <a href="/pages/tela-partida.html?id=${partida.id}" class="text-decoration-none match-link-wrapper lvl3-color p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
            <div class="row justify-content-center align-items-center">
              <div class="col-4 text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid rounded-circle">
                  <p class="my-0 ms-2 fs-4">${partida.homeGoals}</p>
                </div>
              </div>
              <div class="col-4 text-center">
                <i class="bi bi-x-lg fs-6"></i>
              </div>
              <div class="col-4 text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <p class="my-0 me-2 fs-4">${partida.visitorGoals}</p>
                  <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid rounded-circle">
                </div>
              </div>
            </div>
          </a>
          <span class="d-none match-id">${partida.id}</span>
          ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
            <div class="row justify-content-center align-items-center config-match-btn-wrapper">
              <a class="w-auto p-0" href="/pages/configuracao-partida.html?idM=${partida.id}&idC=${idCampeonato}">
                <button class="btn pt-0 border-0 d-flex justify-content-center align-items-center config-match-btn">
                  <i class="bi bi-pencil-square lvl2-primary-bg px-4 py-1 rounded-pill"></i>
                </button> 
              </a>
            </div>
          ` : ''}
        </div>
      `
    }

    const configMatchBtns = document.getElementsByClassName('config-match-btn')
    for (const configMatchBtn of configMatchBtns) {
      configMatchBtn.addEventListener('click', () => {
        const matchId = configMatchBtn.parentElement.parentElement.querySelector('.match-id').textContent
        configureMatch(matchId, championshipData)
      })
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
      console.log(artilheiro)
      tbody.innerHTML += /*html*/`
      <tr>
        <th scope="row" class="text-center">${count}</th>
        <td>
          <a href="/pages/pagina-times.html?id=${artilheiro.teamId}">
            <img src="${artilheiro.teamEmblem}" alt="Imagem do time" width="50" height="50" class="rounded-circle">
          </a>
        </td>
        <td>
          <a href="/pages/pagina-usuarios.html?id=${artilheiro.id}">
            <img src="${artilheiro.picture}" alt="Imagem do Jogador" width="50" height="50" class="rounded-circle">
          </a>
        </td>
        <td class="d-none d-lg-table-cell">
          <a href="/pages/pagina-usuarios.html?id=${artilheiro.id}">
            ${artilheiro.name}
          </a>
        </td>
        <td class="text-center fs-5 fw-semibold">${artilheiro.goals}</td>
      </tr>
      `
    }
    if (count == 0)
      tabela.parentElement.classList.add('d-none')

    console.log(tabela);
  },
  async init() {
    await this.inicializarTabela(idCampeonato)
    window.dispatchEvent(new Event('pagina-load'))
  }
}

chaveamento.init()