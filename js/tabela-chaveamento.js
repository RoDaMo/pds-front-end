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

const config = configuracaoFetch('GET'),
  response = await executarFetch(`championships/${idCampeonato}`, config),
  championshipData = response.results

const sessionUserInfo = JSON.parse(localStorage.getItem('user-info'))

const configMatchModal = document.getElementById('configMatchModal')

let configMatchModalBT = new bootstrap.Modal(configMatchModal, {keyboard: false})

configMatchModal.addEventListener('shown.bs.modal', async () => {
  // set data-lenis-prevent to html
  document.documentElement.setAttribute('data-lenis-prevent', 'true')
})

configMatchModal.addEventListener('hidden.bs.modal', async () => {
  // set data-lenis-prevent to html
  document.documentElement.removeAttribute('data-lenis-prevent')
})

const isOrganizer = () => {
  let isOrganizer = false
  let isChampionshipOrganizer = false

  isChampionshipOrganizer = (idCampeonato == sessionUserInfo.championshipId) ? true : false

  if (sessionUserInfo.isOrganizer && isChampionshipOrganizer) {
    isOrganizer = true
  } else {
    isOrganizer = false
  }

  return true
}

const configureMatch = async (matchId, championshipData) => {
  const callbackStatus = (data) => {
    notificacaoErro(data.results)
  }

  const configMatchForm = document.querySelector('#config-match-form')

  const configMatchValidator = new JustValidate(configMatchForm, {
    validateBeforeSubmitting: true,
  })

  // get match data
  const matchData = await executarFetch(`matches/${matchId}`, configuracaoFetch('GET')),
    match = matchData.results

  // get match team 1
  const team1Data = await executarFetch(`teams/${match.homeId}`, configuracaoFetch('GET')),
    team1 = team1Data.results
    
  // get match team 2
  const team2Data = await executarFetch(`teams/${match.visitorId}`, configuracaoFetch('GET')),
    team2 = team2Data.results


  configMatchForm.innerHTML = ''

  configMatchForm.insertAdjacentHTML('beforeend', `
    <div class="row mt-3 justify-content-center">
      <h4 class="text-center rounded-4 text-bg-dark fw-normal config-match-section-label i18" key="Uniformes">${i18next.t("Uniformes")}</h4>
      <span class="i18 mb-0 text-black text-center" key="MatchHomeUniformLabel">${i18next.t("MatchHomeUniformLabel")}</span>
      <div class="col-12 text-center text-black"><span>${team1.name}</span></div>
      <div class="col-6 form-check d-flex flex-column justify-content-center align-items-center">
        <img class="img-fluid border border-2 mb-2 rounded-5 team-uniform-img" src="${team1.uniformHome}" alt="">
        <input value="${team1.uniformHome}" class="rounded-pill w-25 form-check-input m-auto" type="radio" id="check-team1-home-uniform" name="team1-uniform-radio" checked>
      </div>
      <div class="col-6 form-check d-flex flex-column justify-content-center align-items-center">
        <img class="img-fluid border border-2 rounded-5 mb-2 team-uniform-img" src="${team1.uniformAway}" alt="">
        <input value="${team1.uniformAway}" class="rounded-pill w-25 form-check-input m-auto" type="radio" id="check-team1-away-uniform" name="team1-uniform-radio">
      </div>
    </div>
    <hr class="rounded-pill opacity-50 text-black mx-auto w-50">
    <div class="row mt-3">
      <span class="i18 mb-0 text-black text-center" key="MatchAwayUniformLabel">${i18next.t("MatchAwayUniformLabel")}</span>
      <div class="col-12 text-center text-black"><span>${team2.name}</span></div>
      <div class="col-6 form-check d-flex flex-column justify-content-center align-items-center">
        <img class="img-fluid border border-2 rounded-5 mb-2 team-uniform-img" src="${team2.uniformHome}" alt="">
        <input value="${team2.uniformHome}" class="rounded-pill w-25 form-check-input m-auto" type="radio" id="check-team2-home-uniform" name="team2-uniform-radio">
      </div>
      <div class="col-6 form-check d-flex flex-column justify-content-center align-items-center">
        <img class="img-fluid border border-2 rounded-5 mb-2 team-uniform-img" src="${team2.uniformAway}" alt="">
        <input value="${team2.uniformAway}" class="rounded-pill w-25 form-check-input m-auto" type="radio" id="check-team2-away-uniform" name="team2-uniform-radio" checked>
      </div>
    </div>

    <div class="row justify-content-center mt-5"><h4 class="text-center config-match-section-label rounded-3 text-bg-dark fw-normal i18" key="InfosPartida">${i18next.t("InfosPartida")}</h4></div>
    <div class="row">
      <div class="col">
        <label for="match-arbitrator" class="i18 form-label mb-0 text-black" key="MatchArbitratorLabel">${i18next.t("MatchArbitratorLabel")}</label>
        <input type="text" id="match-arbitrator" class="form-control" placeholder="${i18next.t("MatchArbitratorPlaceholder")}">
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md">
        <label for="match-date" class="i18 form-label mb-0 text-black" key="MatchDateLabel">${i18next.t("MatchDateLabel")}</label>
        <input type="text" id="match-date" class="form-control" placeholder="${i18next.t("MatchDatePlaceholder")}">
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md">
        <label for="match-zipcode" class="i18 form-label mb-0 text-black" key="MatchZipcodeLabel">${i18next.t("MatchZipcodeLabel")}</label>
        <input type="text" id="match-zipcode" max="" class="form-control" placeholder="${i18next.t("MatchZipcodePlaceholder")}">
      </div>
      <div class="col-12 col-md">
        <label for="match-city" class="i18 form-label mb-0 text-black" key="MatchCityLabel">${i18next.t("MatchCityLabel")}</label>
        <input type="text" id="match-city" class="form-control" placeholder="${i18next.t("MatchCityPlaceholder")}">
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md">
        <label for="match-road" class="i18 form-label mb-0 text-black" key="MatchStreetLabel">${i18next.t("MatchStreetLabel")}</label>
        <input type="text" id="match-road" class="form-control" placeholder="${i18next.t("MatchStreetPlaceholder")}">
      </div>
      <div class="col-12 col-md">
        <label for="match-location-number" class="i18 form-label mb-0 text-black" key="MatchLocationNumberLabel">${i18next.t("MatchLocationNumberLabel")}</label>
        <input type="text" id="match-location-number" class="form-control" placeholder="${i18next.t("MatchLocationNumberPlaceholder")}">
    </div>
  `)

  const checkTeam1HomeUniform = configMatchForm.querySelector('#check-team1-home-uniform')
  const checkTeam1AwayUniform = configMatchForm.querySelector('#check-team1-away-uniform')
  const checkTeam2HomeUniform = configMatchForm.querySelector('#check-team2-home-uniform')
  const checkTeam2AwayUniform = configMatchForm.querySelector('#check-team2-away-uniform')

  const getHomeUniform = () => {
    if (checkTeam1HomeUniform.checked) {
      return checkTeam1HomeUniform.value
    } else if (checkTeam1AwayUniform.checked) {
      return checkTeam1AwayUniform.value
    } else {
      return null
    }
  }

  const getVisitorUniform = () => {
    if (checkTeam2HomeUniform.checked) {
      return checkTeam2HomeUniform.value
    } else if (checkTeam2AwayUniform.checked) {
      return checkTeam2AwayUniform.value
    } else {
      return null
    }
  }

  const matchArbitrator = configMatchForm.querySelector('#match-arbitrator')
  const matchDate = configMatchForm.querySelector('#match-date')
  const matchZipcode = configMatchForm.querySelector('#match-zipcode')
  const matchCity = configMatchForm.querySelector('#match-city')
  const matchRoad = configMatchForm.querySelector('#match-road')
  const matchLocationNumber = configMatchForm.querySelector('#match-location-number')

  // fill inputs with match data
  if (match.arbitrator) {
    matchArbitrator.value = match.arbitrator
    matchDate.value = match.date
    matchZipcode.value = match.cep
    matchCity.value = match.city
    matchRoad.value = match.road
    matchLocationNumber.value = match.number
  }

  matchZipcode.addEventListener('keyup', () => {        
    if (matchZipcode.value.length > 8) {
      matchZipcode.value = matchZipcode.value.slice(0, 8)
    }
  }) 

  let cepURL = 'https://viacep.com.br/ws/'
  let cepType = '/json/'

  matchZipcode.addEventListener('blur', async () => {
    let cep = matchZipcode.value
    cep = cep.replace(/\D/g, "")
    
    if (cep != "") {
      let validacep = /^[0-9]{8}$/
      if (validacep.test(cep)) {
        matchCity.value = "...";
        matchRoad.value = "...";
        matchCity.disabled = true;
        matchRoad.disabled = true;
        const response = await fetch(cepURL + cep + cepType)
        const data = await response.json()
        if (!("erro" in data)) {
          matchCity.value = data.localidade;
          matchRoad.value = data.logradouro;
          matchCity.disabled = false;
          matchRoad.disabled = false;
        }
        else {
          matchCity.value = "";
          matchRoad.value = "";
          matchCity.disabled = false;
          matchRoad.disabled = false;
          notificacaoErro(i18next.t("CEPInvalido"))
        }
      }
      else {
        matchCity.value = "";
        matchRoad.value = "";
        matchCity.disabled = false;
        matchRoad.disabled = false;
        notificacaoErro(i18next.t("CEPInvalido"))
      }
    }
    else {
      matchCity.value = "";
      matchRoad.value = "";
      matchCity.disabled = false;
      matchRoad.disabled = false;
    }
  })

  let lng = localStorage.getItem('lng')

  flatpickr(matchDate, {
      dateFormat: "Z",
      altFormat: "d/m/Y H:i",
      time_24hr: true,
      locale: lng === 'ptbr' ? Portuguese : ingles,
      altInput: true,
      enableTime: true,
      minDate: championshipData.initialDate,
      maxDate: championshipData.finalDate
  })

  document.addEventListener('nova-lingua', event => {
      let lng = localStorage.getItem('lng')

      flatpickr(matchDate, {
        dateFormat: "Z",
        altFormat: "d/m/Y H:i",
        time_24hr: true,
        locale: lng === 'ptbr' ? Portuguese : ingles,
        altInput: true,
        enableTime: true,
        minDate: championshipData.initialDate,
        maxDate: championshipData.finalDate
      })
      
      configMatchValidator.revalidate()

  })

  configMatchValidator
    .addField(matchArbitrator, [
      {
        rule: 'required',
        errorMessage: `<span class="i18" key="ArbitroObrigatorio">${i18next.t("ArbitroObrigatorio")}</span>`,
      },
    ])
    .addField(matchDate, [
      {
        rule: 'required',
        errorMessage: `<span class="i18" key="DataObrigatoria">${i18next.t("DataObrigatoria")}</span>`,
      },
    ])
    .addField(matchZipcode, [
      {
        rule: 'required',
        errorMessage: `<span class="i18" key="CEPObrigatorio">${i18next.t("CEPObrigatorio")}</span>`,
      },
    ])
    .addField(matchCity, [
      {
        rule: 'required',
        errorMessage: `<span class="i18" key="CidadeObrigatoria">${i18next.t("CidadeObrigatoria")}</span>`,
      },
    ])
    .addField(matchRoad, [
      {
        rule: 'required',
        errorMessage: `<span class="i18" key="RuaObrigatoria">${i18next.t("RuaObrigatoria")}</span>`,
      },
    ])
    .addField(matchLocationNumber, [
      {
        rule: 'required',
        errorMessage: `<span class="i18" key="NumeroObrigatorio">${i18next.t("NumeroObrigatorio")}</span>`,
      },
    ])
    .onSuccess(async e => {
      e.preventDefault()

      const body = {
        "Id": matchId,
        "Cep": matchZipcode.value,
        "City": matchCity.value,
        "Road": matchRoad.value,
        "Number": matchLocationNumber.value,
        "HomeUniform": getHomeUniform(),
        "VisitorUniform": getVisitorUniform(),
        "Date": matchDate.value,
        "Arbitrator": matchArbitrator.value,
      }

      loader.show()
      await putMatch(body)
      loader.hide()
    })
}

const putMatch = async (body) => {
  const callbackStatus = (data) => {
    notificacaoErro(data.results)
  }

  loader.show()
  const configFetch = configuracaoFetch('PUT', body),
    response = await executarFetch(`matches`, configFetch, callbackStatus)
    
  loader.hide()

  if (response.succeed) {
    notificacaoSucesso(i18next.t("SucessoConfigurarPartida"))

    configMatchModalBT.hide()
  }
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
          <div class="row justify-content-center align-items-center mx-2 bg-primary px-3 rounded-5">
            <div class="text-center py-1">
              <small>${this.convertDateFormat(partida.date)}</small>
            </div>
            <a href="/pages/tela-partida.html?id=${partida.id}" class="text-decoration-none match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center ${classesCustom}">
              <div class="row justify-content-center align-items-center">
                <div class="col-4 text-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                    <p class="my-0 ms-2 fs-4">${partida.homeGoals}</p>
                  </div>
                </div>
                <div class="col-4 text-center">
                  <i class="bi bi-x-lg fs-2"></i>
                </div>
                <div class="col-4 text-center">
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="my-0 me-2 fs-4">${partida.visitorGoals}</p>
                    <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                  </div>
                </div>
              </div>
            </a>
            <span class="d-none match-id">${partida.id}</span>
            ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
              <div class="row justify-content-center align-items-center config-match-btn-wrapper">
                <button data-bs-toggle="modal" data-bs-target="#configMatchModal" class="btn w-auto border-0 d-flex justify-content-center align-items-center config-match-btn">
                  <i class="bi bi-pencil-square px-4 py-1 text-white rounded-pill"></i>
                </button> 
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
      <div class="row justify-content-center align-items-center mx-2 bg-primary px-3 rounded-5 partida-rodada-${rodada}">
        <div class="text-center py-1">
          <small>${this.convertDateFormat(partida.date)}</small>
        </div>
        <a href="/pages/tela-partida.html?id=${partida.id}" class="text-decoration-none match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
          <div class="row justify-content-center align-items-center">
            <div class="col-4 text-center">
              <div class="d-flex align-items-center justify-content-center">
                <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                <p class="my-0 ms-2 fs-4">${partida.homeGoals}</p>
              </div>
            </div>
            <div class="col-4 text-center">
              <i class="bi bi-x-lg fs-2"></i>
            </div>
            <div class="col-4 text-center">
              <div class="d-flex align-items-center justify-content-center">
                <p class="my-0 me-2 fs-4">${partida.visitorGoals}</p>
                <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
              </div>
            </div>
          </div>
        </a>
        <span class="d-none match-id">${partida.id}</span>
        ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
          <div class="row justify-content-center align-items-center config-match-btn-wrapper">
            <button data-bs-toggle="modal" data-bs-target="#configMatchModal" class="btn w-auto border-0 d-flex justify-content-center align-items-center config-match-btn">
              <i class="bi bi-pencil-square px-4 py-1 text-white rounded-pill"></i>
            </button> 
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
    this.inicializarEliminatorias(formato, idCampeonato, faseInicial, fases, faseAtualIsDupla, championship)
    
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
    rowGrupos.classList.add('row', 'gap-lg-4')

    let count = 0;
    for (const grupo of grupos) {
      count++;
      rowGrupos.innerHTML += /*html*/`
      <div class="col d-flex flex-column-reverse flex-lg-column gap-3 px-0">
        <div class="bg-verde-limao p-3 borda-leve table-responsive tabela-customizada-wrapper col">
          <h3>Grupo ${count}</h3>
          <table class="table table-hover table-bordered tabela-customizada">
            <thead>
                <tr class="border-bottom-0 border-top-0">
                    <th scope="col" class="col border-0 d-none d-lg-table-cell"></th>
                    <th scope="col" class="col-1 border-0 coluna-fixa"></th>
                    <th scope="col" class="col-2 border-0 d-none d-lg-table-cell"></th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">P</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">V</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">J</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">SG</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">GP</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">CA</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">CV</th>
                    <th scope="col" class="col-1 border-start-0 border-end-0 cabecalho-customizado">Ult. Jogos</th>
                </tr>
            </thead>
            <tbody id="tbody-${count}">
            </tbody>
          </table>
        </div>
      </div>
      <div class="bg-secondary col-lg-3 col-12 borda-leve borda-top-lg p-3 mb-lg-0 mb-3">
        <div class="d-flex flex-row justify-content-between texto-verde-limao">
            <button id="anterior-rodada-${count}" class="seta-botao-rodada btn btn-secondary px-2 rounded-circle invisible"><i class="bi bi-caret-left"></i></button>
            <h3 id="rodada-text-${count}"><span id="rodada-atual-${count}">1</span>º Rodada</h3>
            <button id="proxima-rodada-${count}" class="seta-botao-rodada btn btn-secondary px-2 rounded-circle"><i class="bi bi-caret-right"></i></button>
        </div>
        <div class="mt-3 d-flex flex-column gap-4 fase-grupos-rodadas">
            
        </div>
      </div>
      `
      const tbody = rowGrupos.querySelector(`#tbody-${count}`)
      let countTimes = 0
      for (const time of grupo) {
        countTimes++
        const estatisticas = [[time.goalBalance,time.proGoals,time.yellowCard,time.redCard], [time.winningSets,time.losingSets,time.proPoints,time.pointsAgainst], time.points,time.wins, time.amountOfMatches]

        tbody.innerHTML += /*html*/`
          <tr class="border-top-0">
            <th scope="row" class="border-end-0 border-start-0 d-none d-lg-table-cell">${countTimes}</th>
            <td class="border-start-0 border-end-0 coluna-fixa">
              <img src="${time.emblem}" width="40" height="40" class="rounded-circle">
            </td>
            <td class="d-none d-lg-table-cell border-start-0 align-content-center">${time.name}</td>
            <td>${estatisticas[2]}</td>
            <td>${estatisticas[3]}</td>
            <td>${estatisticas[4]}</td>
            <td>${estatisticas[campeonato.sportsId - 1][0]}</td>
            <td>${estatisticas[campeonato.sportsId - 1][1]}</td>
            <td>${estatisticas[campeonato.sportsId - 1][2]}</td>
            <td>${estatisticas[campeonato.sportsId - 1][3]}</td>
            <td>
              <small class="badge rounded-pill text-bg-secondary badge-ultima-partida d-inline-flex gap-3">
                <div 
                  class="vencedor partida-pilula col-2" 
                  data-bs-toggle="tooltip" 
                  data-bs-html="true"
                  data-bs-title="<div class='align-items-center'><img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'> 3 <i class='bi bi-x-lg'></i> 1 <img src='https://playoffs-api.up.railway.app/img/ffc82e3d-4002-4fe1-bcbd-62fc78bcb880' rel='preconnect' width='40' height='40' class='time-vencedor rounded-circle'></div>"
                ></div>
                <div class="perdedor partida-pilula col-2" data-bs-toggle="tooltip" data-bs-title="Default tooltip"></div>
                <div class="neutro partida-pilula col-2" data-bs-toggle="tooltip" data-bs-title="Default tooltip"></div>
              </small>
            </td>
          </tr>
        `
      }
    }

    containerGrupos.appendChild(rowGrupos)
    partidasWrapper.appendChild(containerGrupos)
    partidasWrapper.innerHTML += /*html*/`
      <div class="container p-3 borda-leve bg-verde-limao">
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
        <div class="bg-verde-limao col-12 text-center rounded-custom">
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
          <div class="bg-verde-limao p-2 m-2 rounded-custom">
            <div class="d-flex gap-3 justify-content-evenly align-items-center bg-secondary texto-verde-limao p-3 rounded ida-volta">
                <div class="row justify-content-center align-items-center mx-2 bg-primary px-3 rounded-5">
                  <div class="text-center py-1">
                    <small>${this.convertDateFormat(partidaDupla.jogoAtual.date)}</small><small class="d-block d-lg-inline"><span class="d-none d-lg-inline">-</span> ${partidaDupla.jogoAtual.local ? partidaDupla.jogoAtual.local : 'Localização não definida'}</small>
                  </div>
                  <a href="/pages/tela-partida.html?id=${partidaDupla.jogoAtual.id}" class="text-decoration-none match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
                    <div class="row justify-content-center align-items-center">
                      <div class="col-4 text-center">
                        <div class="d-flex align-items-center justify-content-center">
                          <img src="${partidaDupla.jogoAtual.homeEmblem}" rel="preconnect" alt="${partidaDupla.jogoAtual.homeName}" title="${partidaDupla.jogoAtual.homeName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                          <p class="my-0 ms-2 fs-4">${partidaDupla.jogoAtual.homeGoals}</p>
                        </div>
                      </div>
                      <div class="col-4 text-center">
                        <i class="bi bi-x-lg fs-2"></i>
                      </div>
                      <div class="col-4 text-center">
                        <div class="d-flex align-items-center justify-content-center">
                          <p class="my-0 me-2 fs-4">${partidaDupla.jogoAtual.visitorGoals}</p>
                          <img src="${partidaDupla.jogoAtual.visitorEmblem}" rel="preconnect" alt="${partidaDupla.jogoAtual.visitorName}" title="${partidaDupla.jogoAtual.visitorName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                        </div>
                      </div>
                    </div>
                  </a>
                  <span class="d-none match-id">${partidaDupla.jogoAtual.id}</span>
                  ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
                    <div class="row justify-content-center align-items-center config-match-btn-wrapper">
                      <button data-bs-toggle="modal" data-bs-target="#configMatchModal" class="btn w-auto border-0 d-flex justify-content-center align-items-center config-match-btn">
                        <i class="bi bi-pencil-square px-4 py-1 text-white rounded-pill"></i>
                      </button> 
                    </div>
                  ` : ''}
                </div>

                <div class="d-flex align-items-center justify-content-center bg-verde-limao px-3 py-2 rounded">
                    <small class="text-nowrap">${fases[faseAtual]} ${count}</small>
                </div>

                <div class="row justify-content-center align-items-center mx-2 bg-primary px-3 rounded-5">
                  <div class="text-center py-1">
                    <small>${this.convertDateFormat(partidaDupla.proximoJogo.date)}</small><small class="d-block d-lg-inline"><span class="d-none d-lg-inline">-</span> ${partidaDupla.jogoAtual.local ? partidaDupla.jogoAtual.local : 'Localização não definida'}</small>
                  </div>
                  <a href="/pages/tela-partida.html?id=${partidaDupla.proximoJogo.id}" class="text-decoration-none match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
                    <div class="row justify-content-center align-items-center">
                      <div class="col-4 text-center">
                        <div class="d-flex align-items-center justify-content-center">
                          <img src="${partidaDupla.proximoJogo.homeEmblem}" rel="preconnect" alt="${partidaDupla.proximoJogo.homeName}" title="${partidaDupla.proximoJogo.homeName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                          <p class="my-0 ms-2 fs-4">${partidaDupla.proximoJogo.homeGoals}</p>
                        </div>
                      </div>
                      <div class="col-4 text-center">
                        <i class="bi bi-x-lg fs-2"></i>
                      </div>
                      <div class="col-4 text-center">
                        <div class="d-flex align-items-center justify-content-center">
                          <p class="my-0 me-2 fs-4">${partidaDupla.proximoJogo.visitorGoals}</p>
                          <img src="${partidaDupla.proximoJogo.visitorEmblem}" rel="preconnect" alt="${partidaDupla.proximoJogo.visitorName}" title="${partidaDupla.proximoJogo.visitorName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                        </div>
                      </div>
                    </div>
                  </a>
                  <span class="d-none match-id">${partidaDupla.proximoJogo.id}</span>
                  ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
                    <div class="row justify-content-center align-items-center config-match-btn-wrapper">
                      <button data-bs-toggle="modal" data-bs-target="#configMatchModal" class="btn w-auto border-0 d-flex justify-content-center align-items-center config-match-btn">
                        <i class="bi bi-pencil-square px-4 py-1 text-white rounded-pill"></i>
                      </button> 
                    </div>
                  ` : ''}
                </div>

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
        <div class="row justify-content-center align-items-center mx-2 bg-primary px-3 rounded-5">
          <div class="text-center py-1">
            <small>${this.convertDateFormat(partida.date)}</small>
          </div>
          <a href="/pages/tela-partida.html?id=${partida.id}" class="text-decoration-none match-link-wrapper p-2 rounded-5 my-1 d-flex justify-content-center align-items-center">
            <div class="row justify-content-center align-items-center">
              <div class="col-4 text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <img src="${partida.homeEmblem}" rel="preconnect" alt="${partida.homeName}" title="${partida.homeName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                  <p class="my-0 ms-2 fs-4">${partida.homeGoals}</p>
                </div>
              </div>
              <div class="col-4 text-center">
                <i class="bi bi-x-lg fs-2"></i>
              </div>
              <div class="col-4 text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <p class="my-0 me-2 fs-4">${partida.visitorGoals}</p>
                  <img src="${partida.visitorEmblem}" rel="preconnect" alt="${partida.visitorName}" title="${partida.visitorName}" width="50" height="50" class="img-fluid border border-2 rounded-circle">
                </div>
              </div>
            </div>
          </a>
          <span class="d-none match-id">${partida.id}</span>
          ${(isOrganizer() && (championshipData.status == 0 || championshipData.status == 3)) ? `
            <div class="row justify-content-center align-items-center config-match-btn-wrapper">
              <button data-bs-toggle="modal" data-bs-target="#configMatchModal" class="btn w-auto border-0 d-flex justify-content-center align-items-center config-match-btn">
                <i class="bi bi-pencil-square px-4 py-1 text-white rounded-pill"></i>
              </button> 
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
  async init() {
    this.inicializarTabela(idCampeonato)
  }
}

chaveamento.init()