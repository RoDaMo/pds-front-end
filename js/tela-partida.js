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

		// reset form fields and remove them from DOM if they exist already
		const resetAllFormFields = () => {
			matchManagementForm.querySelector('label[for="select-event-team"]')?.remove()
			matchManagementForm.querySelector('select#select-event-team')?.remove()
			matchManagementForm.querySelector('label[for="select-event-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-player')?.remove()
			matchManagementForm.querySelector('label[for="select-event-assister-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-assister-player')?.remove()
			matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()
			matchManagementForm.querySelector('div.form-check')?.remove()
			matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
			matchManagementForm.querySelector('select#select-event-card-type')?.remove()
			matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
		}

		const resetSomeFormFields = () => {
			matchManagementForm.querySelector('label[for="select-event-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-player')?.remove()
			matchManagementForm.querySelector('label[for="select-event-assister-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-assister-player')?.remove()
			matchManagementForm.querySelector('div.form-check')?.remove()
			matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
			matchManagementForm.querySelector('select#select-event-card-type')?.remove()
			matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
			matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()
		}

		const resetSomeLessFormFields = () => {
			matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
			matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
			matchManagementForm.querySelector('select#select-event-card-type')?.remove()
			matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()

		}

		// let eventEndpoint = ''

		selectEventType.addEventListener('change', () => {
			resetAllFormFields()
			// eventEndpoint = (selectEventType.value == 1) ? 'matches/goals' 
			// 	: (selectEventType.value == 2 || selectEventType == 3) ? 'matches/cards'
			// 	: (selectEventType.value == 4) ? 'matches/substitutions'
			// 	: ''

			// reset form fields and remove them from DOM if they exist already

			if (selectEventType.value) {
				matchManagementForm.insertAdjacentHTML('beforeend', `
					<label for="select-event-team" class="i18 form-label mt-3 mb-0" key="SelectEventTeamLabel">${i18next.t("SelectEventTeamLabel")}</label>
					<select id="select-event-team" class="form-select">
						<option value="" selected class="i18" key="SelectEventTeamPlaceholder">${i18next.t("SelectEventTeamPlaceholder")}</option>
						<option value="${match.homeId}">${match.homeName}</option>
						<option value="${match.visitorId}">${match.VisitorName}</option>
					</select>
				`)

				const selectEventTeam = matchManagementForm.querySelector('select#select-event-team')

				let players = []

				switch (selectEventType.value) {
					// Goal
					case "1":
						let postGoalValidator = new JustValidate(matchManagementForm, {
							validateBeforeSubmitting: true,
						})

						selectEventTeam.addEventListener('change', () => {
						// reset player fields and remove them from DOM if they exist already
							postGoalValidator.destroy()

							postGoalValidator = new JustValidate(matchManagementForm, {
								validateBeforeSubmitting: true,
							})

							if (selectEventTeam.value) {
								resetSomeFormFields()

								players = (selectEventTeam.value == 1) ? playersTeam1 : playersTeam2

								matchManagementForm.insertAdjacentHTML('beforeend', `
									<div>
										<label for="select-event-player" class="i18 form-label mb-0 mt-3" key="SelectEventPlayerLabel">${i18next.t("SelectEventPlayerLabel")}</label>
										<select id="select-event-player" class="form-select">
											<option value="" selected class="i18" key="SelectEventPlayerPlaceholder">${i18next.t("SelectEventPlayerPlaceholder")}</option>
											${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
										</select>
									</div>

									<div class="form-check mt-2">
										<input class="form-check-input" type="checkbox" value="" id="checkbox-event-assister-player">
										<label class="form-check-label i18 mb-0" key="CheckboxEventAssisterPlayerLabel" for="checkbox-event-assister-player">${i18next.t("CheckboxEventAssisterPlayerLabel")}</label>
									</div>

									${(match.isSoccer) ? `
										<div class="input-event-time-wrapper form-group mt-3">
											<label for="input-event-time" class="i18 form-label mb-0" key="InputEventTimeLabel">${i18next.t("InputEventTimeLabel")}</label>
											<input type="number" class="form-control" id="input-event-time">
										</div>
									` : ''}

									<div class="btn-post-event-wrapper d-flex justify-content-center">
										<button type="submit" class="btn-post-event btn btn-primary mt-3 i18" key="AdicionarEvento">${i18next.t("AdicionarEvento")}</button>
									</div>
								`)

								const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')

								const checkboxEventAssisterPlayer = matchManagementForm.querySelector('input#checkbox-event-assister-player')

								checkboxEventAssisterPlayer.addEventListener('change', () => {
									if (checkboxEventAssisterPlayer.checked) {
										matchManagementForm.querySelector('div.form-check').insertAdjacentHTML('beforebegin', `
											<div>
												<label for="select-event-assister-player" class="i18 form-label mb-0 mt-2" key="SelectEventAssisterPlayerLabel">${i18next.t("SelectEventAssisterPlayerLabel")}</label>
												<select id="select-event-assister-player" class="form-select">
													<option value="" selected class="i18" key="SelectEventAssisterPlayerPlaceholder">${i18next.t("SelectEventAssisterPlayerPlaceholder")}</option>
													${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
												</select>
											</div>
										`)

										postGoalValidator
												.addField(matchManagementForm.querySelector("select#select-event-assister-player"), [
													{
														validator: (value) => {
															return value != selectEventPlayer.value
														},
														errorMessage: `<span class="i18" key="JogadoresDiferentes">${i18next.t("JogadoresDiferentes")}</span>`
													},
													{
														rule: 'required',
														errorMessage: `<span class="i18" key="JogadorAssistenteObrigatorio">${i18next.t("JogadorAssistenteObrigatorio")}</span>`
													}
												])
									} else {
										postGoalValidator.removeField(matchManagementForm.querySelector('select#select-event-assister-player'))

										matchManagementForm.querySelector('label[for="select-event-assister-player"]').remove()
										matchManagementForm.querySelector('select#select-event-assister-player').remove()
									}
								})

								const selectEventAssisterPlayer = matchManagementForm.querySelector('select#select-event-assister-player')
								const inputEventTime = matchManagementForm.querySelector('input#input-event-time')

								selectEventAssisterPlayer?.addEventListener('change', () => {
									postGoalValidator.revalidate()
								})

								// selectEventPlayer.addEventListener('change', () => {
								// 	postGoalValidator.revalidate()
								// })

								if (inputEventTime) {
									postGoalValidator
										.addField(inputEventTime, [
											{
												rule: 'required',
												errorMessage: `<span class="i18" key="TempoObrigatorio">${i18next.t("TempoObrigatorio")}</span>`,
											}
										])
								} 

								postGoalValidator
									.addField(selectEventPlayer, [
										{
											rule: 'required',
											errorMessage: `<span class="i18" key="JogadorObrigatorio">${i18next.t("JogadorObrigatorio")}</span>`,
										},
										{
											validator: (value) => {
												return value != selectEventAssisterPlayer?.value
											},
											errorMessage: `<span class="i18" key="JogadoresDiferentes">${i18next.t("JogadoresDiferentes")}</span>`
										},
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
							} else {
								resetSomeFormFields()
							}
						})
						break;
					// Card 
					case "2":
						let postCardValidator = new JustValidate(matchManagementForm, {
							validateBeforeSubmitting: true,
						})

						selectEventTeam.addEventListener('change', () => {
							// reset player fields and remove them from DOM if they exist already
							postCardValidator.destroy()

							postCardValidator = new JustValidate(matchManagementForm, {
								validateBeforeSubmitting: true,
							})

							resetSomeFormFields()

							if (selectEventTeam.value) {
								// true = yellowCard, false = redCard
								// let cardType = (selectEventType.value == 2) ? true : (selectEventType.value == 3) ? false : ''

								matchManagementForm.insertAdjacentHTML('beforeend', `
									<div>
										<label for="select-event-player" class="i18 form-label mb-0 mt-3" key="SelectEventPlayerLabel">${i18next.t("SelectEventPlayerLabel")}</label>
										<select id="select-event-player" class="form-select">
											<option value="" selected class="i18" key="SelectEventPlayerPlaceholder">${i18next.t("SelectEventPlayerPlaceholder")}</option>
											${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
										</select>
									</div>

									<div>
										<label for="select-event-card-type" class="i18 form-label mb-0 mt-3" key="SelectEventCardTypeLabel">${i18next.t("SelectEventCardTypeLabel")}</label>
										<select id="select-event-card-type" class="form-select">
											<option value="" selected class="i18" key="SelectEventCardTypePlaceholder">${i18next.t("SelectEventCardTypePlaceholder")}</option>
											<option value="true" class="i18" key="SelectEventCardTypeYellow">${i18next.t("SelectEventCardTypeYellow")}</option>
											<option value="false" class="i18" key="SelectEventCardTypeRed">${i18next.t("SelectEventCardTypeRed")}</option>
										</select>
									</div>

									${(match.isSoccer) ? `
										<div class="input-event-time-wrapper form-group mt-3">
											<label for="input-event-time" class="i18 form-label mb-0" key="InputEventTimeLabel">${i18next.t("InputEventTimeLabel")}</label>
											<input type="number" class="form-control" id="input-event-time">
										</div>
									` : ''}

									<div class="btn-post-event-wrapper d-flex justify-content-center">
										<button type="submit" class="btn-post-event btn btn-primary mt-3 i18" key="AdicionarEvento">${i18next.t("AdicionarEvento")}</button>
									</div>
									
								`)

								const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')
								const inputEventTime = matchManagementForm.querySelector('input#input-event-time')
								const selectEventCardType = matchManagementForm.querySelector('select#select-event-card-type')

								if (inputEventTime) {
									postCardValidator
										.addField(inputEventTime, [
											{
												rule: 'required',
												errorMessage: `<span class="i18" key="TempoObrigatorio">${i18next.t("TempoObrigatorio")}</span>`,
											}
										])
								}

								postCardValidator
									.addField(selectEventPlayer, [
										{
											rule: 'required',
											errorMessage: `<span class="i18" key="JogadorObrigatorio">${i18next.t("JogadorObrigatorio")}</span>`,
										}
									])
									.addField(selectEventCardType, [
										{
											rule: 'required',
											errorMessage: `<span class="i18" key="CartaoObrigatorio">${i18next.t("CartaoObrigatorio")}</span>`,
										}
									])
									.onSuccess(async e => {
										e.preventDefault()

										loader.show()
										await postCard({
											"MatchId": match.id,
											"PlayerTempId": selectEventPlayer.value,
											"TeamId": selectEventTeam.value,
											"CardType": selectEventCardType.value,
										})
										loader.hide()
									})
							} else {
								resetSomeLessFormFields()
							}
						})
					default:
						break;
				}
			} else {
				resetAllFormFields()
			}
		})
	}

	const changeConfigOptionsContext = (menuSelecionado) => {
		for (const menu of menuConfig) { 
			menu.classList.toggle('d-none', menu.getAttribute('menu') != menuSelecionado)
		}

		if (menuSelecionado != 0) {
			blurWallEvents?.classList.add('d-none')
		} else {
			blurWallEvents?.classList.remove('d-none')
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

	const listPlayers = async () => {
		const team1PlayersList = document.querySelector('#match-details-content-players-team1')
		const team2PlayersList = document.querySelector('#match-details-content-players-team2')

		playersTeam1.forEach(player => {
			team1PlayersList.insertAdjacentHTML('beforeend', `
				<div class="row row-cols-1 row-cols-md-2 align-items-center p-2 flex-column flex-md-row my-2 rounded-5 match-details-content-player">
					<div class="col m-player-img-wrapper me-md-2 me-0 position-relative d-flex justify-content-center overflow-hidden border border-2 rounded-circle">
						<img class="m-player-img position-absolute img-fluid w-100 h-100" src="${player.picture}" alt="">
					</div>
					<div class="row col justify-content-center align-items-center flex-column w-auto m-player-info">
						<div class="col p-0 text-center text-md-start">
							<span class="m-player-name m-truncated-text-width fw-semibold text-black text-truncate d-block">${player.name}</span>
						</div>
						<div class="col p-0 text-center text-md-start">
							<span class="m-player-position m-truncated-text-width text-muted text-truncate d-block">${playerPosition}</span>
						</div>
						<div class="col p-0 text-center text-md-start">
							<span class="m-player-number m-truncated-text-width text-muted text-truncate d-block">${player.number}</span>
						</div>
					</div>
				</div>
			`)
		})

		playersTeam2.forEach(player => {
			team2PlayersList.insertAdjacentHTML('beforeend', `
				<div class="row row-cols-1 row-cols-md-2 align-items-center p-2 flex-column flex-md-row my-2 rounded-5 match-details-content-player">
					<div class="col m-player-img-wrapper order-1 order-md-2 ms-md-2 ms-0 position-relative d-flex justify-content-center overflow-hidden border border-2 rounded-circle">
						<img class="m-player-img position-absolute img-fluid w-100 h-100" src="${player.picture}" alt="">
					</div>
					<div class="row col order-2 order-md-1 justify-content-center align-items-center flex-column w-auto m-player-info">
						<div class="col p-0 text-center text-md-end">
							<span class="m-player-name m-truncated-text-width fw-semibold text-black text-truncate d-block">${player.name}</span>
						</div>
						<div class="col p-0 text-center text-md-end">
							<span class="m-player-position m-truncated-text-width text-muted text-truncate d-block">${playerPosition}</span>
						</div>
						<div class="col p-0 text-center text-md-end">
							<span class="m-player-number m-truncated-text-width text-muted text-truncate d-block">${player.number}</span>
						</div>
					</div>
				</div>
			`)
		})
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

			const isTeam1 = teamId => {
				return teamId == matchTeam1Id
			}

			const isTeam2 = teamId => {
				return teamId == matchTeam2Id
			}

			// Loop through the array
			matchEvents.forEach(event => {		
				let eventData = ''	
				let eventIllustration = ''	

				let eventPlayer
				let eventAssisterPlayer

				if (match.isSoccer) {
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
								<img src="../public/icons/red_card.svg" alt="">
							`
						} else if (event.cardType == 'yellow') {
							eventIllustration = `
								<img src="../public/icons/yellow_card.svg" alt="">
							`
						}
					}
				} else if (!match.isSoccer) {
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
								<img src="../public/icons/red_card.svg" alt="">
							`
						} else if (event.cardType == 'yellow') {
							eventIllustration = `
								<img src="../public/icons/yellow_card.svg" alt="">
							`
						}
					}
				}

				// Verify if the event is from team 1 or team 2
				if (isTeam1(event.teamId)) {						
					eventPlayer = playersTeam1.find(player => player.id == event.PlayerTempId)
					eventAssisterPlayer = playersTeam1.find(player => player.id == event.AssisterPlayerTempId)

				} else if (isTeam2(event.teamId)) {
					eventPlayer = playersTeam2.find(player => player.id == event.PlayerTempId)
					eventAssisterPlayer = playersTeam2.find(player => player.id == event.AssisterPlayerTempId)
				}

				let eventTemplate = `
					<div class="row row-cols-md-2 row-cols-1 p-3 my-2 match-details-content-event align-items-center rounded-5">
						<div class="col">
							<div class="row flex-column">
								<div class="col event-player-name"><span class="fw-semibold text-black text-truncate text-center text-md-start m-truncated-text-width d-block">${eventPlayer.name}</span></div>
								${(event.type == 'goal') ?
									(event.AssisterPlayerTempId) ? `
										<div class="col event-player-name"><span class="fw-semibold text-black text-center text-md-start m-truncated-text-width text-truncate d-block">${eventAssisterPlayer.name}</span></div>
									` : ''
								: ''}
								<div class="col d-flex flex-row event-data">
									${eventData}
								</div>
							</div>
						</div>
						<div class="col d-flex align-items-center pe-0 event-illustration">
							${eventIllustration}
						</div>
					</div>
				`

				if (isTeam1(event.teamId)) {					
					eventsWrapperTeam1.insertAdjacentHTML('beforeend', eventTemplate)

					eventsWrapperTeam2.insertAdjacentHTML('beforeend', `
						<div class="row w-auto blank-space"></div>
					`)
				} else if (isTeam2(event.teamId)) {
					eventsWrapperTeam2.insertAdjacentHTML('beforeend', eventTemplate)

					eventsWrapperTeam1.insertAdjacentHTML('beforeend', `
						<div class="row w-auto blank-space"></div>
					`)
				}
			})

			listPlayers()
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
		dataPlayersTeam1 = await executarFetch(`teams/${match.homeId}/players`, configuracaoFetch('GET')),
		playersTeam1 = dataPlayersTeam1.results
	
	const 
		dataPlayersTeam2 = await executarFetch(`teams/${match.visitorId}/players`, configuracaoFetch('GET')),
		playersTeam2 = dataPlayersTeam2.results

	const
		matchStartConditions = await executarFetch(`matches/${matchId}/start-conditions`, configuracaoFetch('GET')),
		matchStartConditionsResults = matchStartConditions.results
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
