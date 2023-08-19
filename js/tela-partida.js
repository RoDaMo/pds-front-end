import '../scss/tela-partida.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/tela-partida.json' assert { type: 'JSON' }
import ingles from './i18n/en/tela-partida.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import JustValidate from 'just-validate'


inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);


const init = async () => {
	const activateLi = (li) => {
		for (const item of abaBotoes) 
            item.classList.remove('active')

		li.classList.add('active')
	}

	const postGoal = async body => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('POST', body),
			response = await executarFetch('matches/goals', configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoPostGol"))
		}
	}

	const matchManagementSystem = () => {
		const selectEventType = matchManagementForm.querySelector('select#select-event-type')

		let eventEndpoint = ''

		selectEventType.addEventListener('change', () => {
			// eventEndpoint = (selectEventType.value == 1) ? 'matches/goals' 
			// 	: (selectEventType.value == 2 || selectEventType == 3) ? 'matches/cards'
			// 	: (selectEventType.value == 4) ? 'matches/substitutions'
			// 	: ''

			if (selectEventType.value) {
				matchManagementForm.insertAdjacentHTML('beforeend', `
					<label for="select-event-team" class="i18 form-label" key="SelectEventTeamLabel">${i18next.t("SelectEventTeamLabel")}</label>
					<select id="select-event-team" class="form-select">
						<option value="" selected class="i18" key="SelectEventTeamPlaceholder">${i18next.t("SelectEventTeamPlaceholder")}</option>
						<option value="1">${match.team1.name}</option>
						<option value="2">${match.team2.name}</option>
					</select>
				`)

				const selectEventTeam = matchManagementForm.querySelector('select#select-event-team')

				let players = []

				selectEventTeam.addEventListener('change', () => {
					players = (selectEventTeam.value == 1) ? playersTeam1 : playersTeam2
				})

				switch (selectEventType.value) {
					// Goal
					case 1:
						if (selectEventTeam.value) {
							matchManagementForm.insertAdjacentHTML('beforeend', `
								<label for="select-event-player" class="i18 form-label" key="SelectEventPlayerLabel">${i18next.t("SelectEventPlayerLabel")}</label>
								<select id="select-event-player" class="form-select">
									<option value="" selected class="i18" key="SelectEventPlayerPlaceholder">${i18next.t("SelectEventPlayerPlaceholder")}</option>
									${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
								</select>

								${(match.sportId == 1) ? `
									<div class="form-group">
										<label for="input-event-time" class="i18" key="InputEventTimeLabel">${i18next.t("InputEventTimeLabel")}</label>
										<input type="number" class="form-control" id="input-event-time">
									</div>
								` : ''}

								<div class="form-check">
									<input class="form-check-input" type="checkbox" value="" id="checkbox-event-assister-player">
									<label class="form-check-label i18" key="CheckboxEventAssisterPlayerLabel" for="checkbox-event-assister-player">${i18next.t("CheckboxEventAssisterPlayerLabel")}</label>
								</div>
							`)

							const checkboxEventAssisterPlayer = matchManagementForm.querySelector('input#checkbox-event-assister-player')

							if (checkboxEventAssisterPlayer.checked) {
								matchManagementForm.insertAdjacentHTML('beforeend', `
									<label for="select-event-assister-player" class="i18 form-label" key="SelectEventAssisterPlayerLabel">${i18next.t("SelectEventAssisterPlayerLabel")}</label>
									<select id="select-event-assister-player" class="form-select">
										<option value="" selected class="i18" key="SelectEventAssisterPlayerPlaceholder">${i18next.t("SelectEventAssisterPlayerPlaceholder")}</option>
										${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
									</select>
								`)
							} else {
								matchManagementForm.querySelector('label[for="select-event-assister-player"]').remove()
								matchManagementForm.querySelector('select#select-event-assister-player').remove()
							}

							const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')
							const selectEventAssisterPlayer = matchManagementForm.querySelector('select#select-event-assister-player')

							const postGoalValidator = new JustValidate(matchManagementForm, {
								validateBeforeSubmitting: true,
							})

							postGoalValidator
								.addField(selectEventPlayer, [
									{
										rule: 'required',
										errorMessage: `<span class="i18" key="JogadorObrigatorio">${i18next.t("JogadorObrigatorio")}</span>`,
									},
									{
										validator: (value, item) => {
											return selectEventPlayer.value != selectEventAssisterPlayer.value
										},
										errorMessage: `<span class="i18" key="JogadoresDiferentes">${i18next.t("JogadoresDiferentes")}</span>`
									}

								])
								.onSuccess(async e => {
									e.preventDefault()

									loader.show()
									await postGoal({
										"MatchId": match.id,
										"PlayerTempId": selectEventPlayer.value,
										"TeamId": selectEventTeam.value,
										"AssisterPlayerTempId": selectEventAssisterPlayer?.value
									})
									loader.hide()
								})
						}
						break;
					// Card 
					case 2 || 3:
							if (selectEventTeam.value) {
								// true = yellowCard, false = redCard
								let cardType = (selectEventType.value == 2) ? true : (selectEventType.value == 3) ? false : ''

								matchManagementForm.insertAdjacentHTML('beforeend', `
									<label for="select-event-player" class="i18 form-label" key="SelectEventPlayerLabel">${i18next.t("SelectEventPlayerLabel")}</label>
									<select id="select-event-player" class="form-select">
										<option value="" selected class="i18" key="SelectEventPlayerPlaceholder">${i18next.t("SelectEventPlayerPlaceholder")}</option>
										${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
									</select>
									${(match.sportId == 1) ? `
										<div class="form-group">
											<label for="input-event-time" class="i18" key="InputEventTimeLabel">${i18next.t("InputEventTimeLabel")}</label>
											<input type="number" class="form-control" id="input-event-time">
										</div>
									` : ''}
								`)

								const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')

								const postCardValidator = new JustValidate(matchManagementForm, {
									validateBeforeSubmitting: true,
								})

								postCardValidator
									.addField(selectEventPlayer, [
										{
											rule: 'required',
											errorMessage: `<span class="i18" key="JogadorObrigatorio">${i18next.t("JogadorObrigatorio")}</span>`,
										}
									])
									.onSuccess(async e => {
										e.preventDefault()

										loader.show()
										await postCard({
											"MatchId": match.id,
											"PlayerTempId": selectEventPlayer.value,
											"TeamId": selectEventTeam.value,
											"CardType": cardType
										})
										loader.hide()
									})
							}
					default:
						break;
				}
			} else {
				matchManagementForm.querySelector('label[for="select-event-team"]').remove()
				matchManagementForm.querySelector('select#select-event-team').remove()
			}
		})
	}

	const changeConfigOptionsContext = (menuSelecionado) => {
		for (const menu of menuConfig) { 
			menu.classList.toggle('d-none', menu.getAttribute('menu') != menuSelecionado)
		}

		if (menuSelecionado != 0) {
			blurWallEvents.classList.add('d-none')
		} else {
			blurWallEvents.classList.remove('d-none')
		}
	} 

	const isMatchOrganizer = async () => {
		let isOrganizer = false
		let isChampionshipOrganizer = false

		isChampionshipOrganizer = (match.championshipId == sessionUserInfo.championshipId) ? true : false

		if (sessionUserInfo.isOrganizer && isChampionshipOrganizer) {
			isOrganizer = true
		} else {
			isOrganizer = false
		}

		return isOrganizer
	}

	const isMatchConfigured = async () => {
		if (matchStartConditionsResults.date && matchStartConditionsResults.configured) {
			return true
		} else {
			return false
		}
	}

	async function carregarPartida() {
		if (!isMatchConfigured) {
			blurWallEvents.classList.remove('d-none')

			// Placeholder blurwall - Team 1
			eventsWrapperTeam1.innerHTML = `
				<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../public/icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../public/icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../public/icons/sports_soccer.svg" alt="">
					</div>
				</div>
			`

			// Placeholder blurwall - Team 2
			eventsWrapperTeam2.innerHTML = `
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../public/icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../public/icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../public/icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
			`
			if (!isMatchOrganizer) {
				blurWallEvents.innerHTML = `
					<div id="blurwall-message-user" class="w-50 text-center">
						<span class="blurwall-message-user-text i18 fs-4 fw-semibold" key="BlurwallMessageUserText">${i18next.t("BlurwallMessageUserText")}</span>
					</div>
				`
			} else {
				if (!matchStartConditionsResults.date) {
					blurWallEvents.insertAdjacentHTML('beforeend', `
						<div class="w-100 text-center">
							<span class="i18" key="DataPartidaNaoChegou">${i18next.t("DataPartidaNaoChegou")}</span>
						</div>
					`)
				}

				if (!matchStartConditionsResults.configured) {
					blurWallEvents.insertAdjacentHTML('beforeend', `
					<div id="blurwall-message-organizer" class="w-50 text-center">
						<span class="blurwall-message-organizer-text i18 fs-4 fw-semibold" key="BlurwallMessageOrganizerText">${i18next.t("BlurwallMessageOrganizerText")}</span>
						<button id="configure-match-btn"><span class="i18" key="ConfigurarPartida">${i18next.t("ConfigurarPartida")}</span></button>
					</div>
					`)
				}

				const configureMatchBtn = document.getElementById('configure-match-btn')

				configureMatchBtn.addEventListener('click', () => {
					// window.location.href = `../link-tabela`
				})
			}
		} else {
			if (isMatchOrganizer) {
				manageMatchBtn.classList.remove('d-none')

				matchManagementSystem()
			}

			// Clear blurwall 
			eventsWrapperTeam1.innerHTML = ''
			eventsWrapperTeam2.innerHTML = ''

			// How to order all the events?
			// Time Marking
			// 1. Get all goals
			// 2. Get all cards
			// 3. Put them in the same array
			// 4. Order the array by time (earliest to latest)
			// 5. Loop through the array
			// 6. Verify if the event is from team 1 or team 2
				// 6.1. If it's a team 1 event, add the event to the team 1 eventsWrapper and add a blank space on the team 2 eventsWrapper
					// 6.1.1. If it's a goal, insert the goal event template
					// 6.1.2. If it's a card, insert the card event template
						// 6.1.2.1. If it's a red card, insert the red card event icon
						// 6.1.2.2. If it's a yellow card, insert the yellow card event icon
				// 6.2. If it's a team 2 event, add the event to the team 2 eventsWrapper and add a blank space on the team 1 eventsWrapper
					// 6.2.1. If it's a goal, insert the goal event template
					// 6.2.2. If it's a card, insert the card event template
						// 6.2.2.1. If it's a red card, insert the red card event icon
						// 6.2.2.2. If it's a yellow card, insert the yellow card event icon
						
			// Get all goals
			const
				matchGoals = await executarFetch(`matches/${matchId}/goals`, configuracaoFetch('GET')),
				matchGoalsResults = matchGoals.results

			// Get all cards
			const
				matchCards = await executarFetch(`matches/${matchId}/cards`, configuracaoFetch('GET')),
				matchCardsResults = matchCards.results
			
			// Put them in the same array
			let matchEvents = []
			matchGoalsResults.forEach(goal => {
				goal.type = 'goal'
				matchEvents.push(goal)
			})
			matchCardsResults.forEach(card => {
				card.type = 'card'
				matchEvents.push(card)
			})
			
			// Order the array by time (earliest to latest)
			matchEvents.sort((a, b) => {
				return a.time - b.time
			})

			// Loop through the array
			matchEvents.forEach(event => {		
				let eventData = ''	
				let eventIllustration = ''	

				if (matchSport == 1) {
					if (event.type == 'goal') {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Gol">${i18next.t("Gol")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-time"><span class="text-muted">${event.Time}</span></div>
						`

						eventIllustration = `
							<img src="../public/icons/sports_soccer.svg" alt="">
						`
					} else if (event.type == 'card') {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Falta">${i18next.t("Falta")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-time"><span class="text-muted">${event.Time}</span></div>
						`

						if (event.cardType == 'red') {
							eventIllustration = `
								<img src="../public/icons/red-card.svg" alt="">
							`
						} else if (event.cardType == 'yellow') {
							eventIllustration = `
								<img src="../public/icons/yellow-card.svg" alt="">
							`
						}
					}
				} else if (matchSport == 2) {
					if (event.type == 'goal') {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Ponto">${i18next.t("Ponto")}</span></div>
						`

						eventIllustration = `
							<img src="../public/icons/sports_volleyball.svg" alt="">
						`
					} else if (event.type == 'card') {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Falta">${i18next.t("Falta")}</span></div>
						`

						if (event.cardType == 'red') {
							eventIllustration = `
								<img src="../public/icons/red-card.svg" alt="">
							`
						} else if (event.cardType == 'yellow') {
							eventIllustration = `
								<img src="../public/icons/yellow-card.svg" alt="">
							`
						}
					}
				}
				// Verify if the event is from team 1 or team 2

				// If it's a team 1 event, add the event to the team 1 eventsWrapper and add a blank space on the team 2 eventsWrapper
				if (event.teamId == match[0].id) {					
					eventsWrapperTeam1.insertAdjacentHTML('beforeend', `
						<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
							<div class="col event-player-name"><span class="fw-semibold text-black text-truncate fs-5 d-block">${event.PlayerTempId}</span></div>
							${(event.type == 'goal') ?
								(event.AssisterPlayerTempId) ? `
									<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">${event.AssisterPlayerTempId}</span></div>
								` : ''
							: ''}
							<div class="col d-flex flex-row event-data">
								${eventData}
							</div>
							<div class="col position-absolute w-auto h-auto event-illustration">
								${eventIllustration}
							</div>
						</div>
					`)

					eventsWrapperTeam2.insertAdjacentHTML('beforeend', `
						<div class="row blank-space"></div>
					`)
				
				// If it's a team 2 event, add the event to the team 2 eventsWrapper and add a blank space on the team 1 eventsWrapper
				} else if (event.teamId == match[1].id) {
					eventsWrapperTeam2.insertAdjacentHTML('beforeend', `
						<div class="row flex-column p-3 my-2 match-details-content-event rounded-5 position-relative">
							<div class="col event-player-name"><span class="fw-semibold text-black text-truncate fs-5 d-block">${event.PlayerTempId}</span></div>
							${(event.type == 'goal') ?
								(event.AssisterPlayerTempId) ? `
									<div class="col event-player-name"><span class="fw-semibold text-black text-truncate d-block">${event.AssisterPlayerTempId}</span></div>
								` : ''
							: ''}
							<div class="col d-flex flex-row event-data">
								${eventData}
							</div>
							<div class="col position-absolute w-auto h-auto event-illustration">
								${eventIllustration}
							</div>
						</div>
					`)

					eventsWrapperTeam1.insertAdjacentHTML('beforeend', `
						<div class="row blank-space"></div>
					`)
				}
			})
		}
	}

    const 
        matchDetailsOptions = document.getElementById('match-details-options'),
        abaBotoes = matchDetailsOptions.children,
        menuConfig = document.getElementsByClassName('menu-config'),
		blankSpaces = document.getElementsByClassName('blank-space'),
		sessionUserInfo = JSON.parse(localStorage.getItem('user-info')),
		parametroUrl = new URLSearchParams(window.location.search),
		matchId = parametroUrl.get('id'),
		eventsTab = document.getElementById('match-details-content-events'),
		eventsWrapperTeam1 = document.getElementById('match-details-content-events-team1'),
		eventsWrapperTeam2 = document.getElementById('match-details-content-events-team2'),
		matchDetails = document.getElementById('match-details'),
		blurWallEvents = document.getElementById('blurwall-events'),
		manageMatchBtn = document.getElementById('manage-match-btn'),
		matchManagementForm = document.getElementById('match-management-form')

	loader.show()
	const 
		dataMatch = await executarFetch(`matches/${matchId}`, configuracaoFetch('GET')),
		match = dataMatch.results
	
	const 
		dataPlayersTeam1 = await executarFetch(`teams/${match[0].id}/players`, configuracaoFetch('GET')),
		playersTeam1 = dataPlayersTeam1.results
	
	const 
		dataPlayersTeam2 = await executarFetch(`teams/${match[1].id}/players`, configuracaoFetch('GET')),
		playersTeam2 = dataPlayersTeam2.results

	const
		matchStartConditions = await executarFetch(`matches/${matchId}/start-conditions`, configuracaoFetch('GET')),
		matchStartConditionsResults = matchStartConditions.results

	const
		teamFetch = await executarFetch(`teams/${match[0].id}`, configuracaoFetch('GET')),
		matchSport = teamFetch.results.sportId
	console.log(match)
	loader.hide()

	for(const blankSpace of blankSpaces) {
		blankSpace.style.height = `${matchDetailsOptions.offsetHeight + 35}px`
	} 

    for (const configMenuOption of abaBotoes) {
		configMenuOption.addEventListener('click', () => {
			activateLi(configMenuOption)
			changeConfigOptionsContext(configMenuOption.getAttribute('menu'))
		})
	}

    changeConfigOptionsContext(0)
	await carregarPartida()
	console.log(sessionUserInfo);
}

document.addEventListener('header-carregado', init)
