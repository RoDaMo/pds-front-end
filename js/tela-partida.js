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
		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoPostGol"))
			await updateScoreboard()
			await loadEvents()
		}
	}

	const postCard = async body => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('POST', body),
			response = await executarFetch('matches/fouls', configFetch, callbackStatus)
		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoPostCartao"))
			await loadEvents()
		}
	}

	const postPenalty = async body => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('POST', body),
			response = await executarFetch('matches/penalties', configFetch, callbackStatus)
		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoPostPenalty"))
			await loadEvents()
		}
	}

	const postMatchReport = async (body) => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('POST', body),
			response = await executarFetch('matches/match-report', configFetch, callbackStatus)
		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoPostSumula"))
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		}
	}

	const endMatchManagementSystem = async () => {
		const postMatchReportValidator = new JustValidate(matchManagementForm, {
			validateBeforeSubmitting: true,
		})

		postMatchReportValidator
			.addField(inputMatchReport, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="SumulaObrigatoria">${i18next.t("SumulaObrigatoria")}</span>`,
				},
				{
					rule: 'files',
					value: {
						files: {
							extensions: ['pdf'],
							maxSize: 20000000,
							types: ['application/pdf'],
						},
					},
					errorMessage: `<span class="i18" key="PdfInvalido">${i18next.t("PdfInvalido")}</span>`,
				}
			])
			.onSuccess(async e => {
				e.preventDefault()

				const body = {
					"MatchId": match.id,
					"MatchReport": hiddenInput.value
				}

				await postMatchReport(body)
			})	


		matchManagementForm.insertAdjacentHTML('beforebegin', `
			<div id="event-admin-label" class="d-flex justify-content-center bg-gray-400 rounded-4 py-1 px-3 mb-2">
				<span class="i18" key="Sumula">${i18next.t("Sumula")}</span>
			</div>
		`)

		const matchReportLink = (match.isSoccer) ? `https://drive.google.com/file/d/19qAP64jlw6MROV6yBN84oX1yBVrkPK1_/view?usp=drivesdk` : ``

		matchManagementForm.insertAdjacentHTML('beforeend', `
			<div class="ex-match-report-wrapper d-flex justify-content-center">
				<a href="${matchReportLink}" class="btn btn-primary mt-3 i18" key="DownloadExampleSumula">${i18next.t("DownloadExampleSumula")}</a>
			</div> 
		
			<hr class="w-75">

			<div class="form-group mt-3">
				<label for="input-match-report" class="i18 form-label mb-0" key="InputMatchReportLabel">${i18next.t("InputMatchReportLabel")}</label>
				<input type="file" class="form-control" id="input-match-report">
			</div>

			<input type="hidden" id="match-report-hidden-input">

			<div class="btn-post-match-report-wrapper d-flex justify-content-center">
				<button type="submit" class="btn-post-match-report btn btn-primary mt-3 i18" key="AdicionarSumula">${i18next.t("AdicionarSumula")}</button>
			</div>
		`)

		const inputMatchReport = matchManagementForm.querySelector('input#input-match-report')
		const hiddenInput = matchManagementForm.querySelector('input#match-report-hidden-input')

		inputMatchReport.addEventListener('change', async () => {
			const isValid = await postMatchReportValidator.revalidateField(inputMatchReport)
			if (!isValid) return;

			if (inputMatchReport.files.length == 0) return;

			loader.show()
			const data = await uploadImagem(inputMatchReport, 2, mensagemErro)
			loader.hide()

			if (Array.isArray(data.results))
				return;

			hiddenInput.value = `${api}img/${data.results}`

			downloadMatchReportLink.href = hiddenInput.value
		})
	}

	const matchManagementSystem = () => {
		matchManagementForm.insertAdjacentHTML('beforebegin', `
			<div id="event-admin-label" class="d-flex justify-content-center bg-gray-400 rounded-4 py-1 px-3 mb-2">
				<span class="i18" key="Eventos">${i18next.t("Eventos")}</span>
			</div>
		`)

		matchManagementForm.insertAdjacentHTML('beforeend', `
			<label for="select-event-type" class="form-label i18 mb-0" key="SelectEventTypeLabel">${i18next.t("SelectEventTypeLabel")}</label>
			<select id="select-event-type" class="form-select">
				<option selected value="" class="i18" key="SelectEventTypePlaceholder">${i18next.t("SelectEventTypePlaceholder")}</option>
				${(!isPenaltyShootout) ? `<option value="1" class="i18" key=${(match.isSoccer) ? "Gol" : "Ponto"}>${(match.isSoccer) ? i18next.t("Gol") : i18next.t("Ponto")}</option>` : ''}
				${(match.isSoccer && !isPenaltyShootout) ? `<option value="2" class="i18" key="Falta">${i18next.t("Falta")}</option>` : ''}
				${(isPenaltyElegible) ? `<option value="3" class="i18" key="Penalti">${i18next.t("Penalti")}</option>` : ''}
			</select>  
		`)

		if (match.isSoccer) {
			if (isOvertimeElegible && !isPenaltyShootout) {
				matchManagementForm.insertAdjacentHTML('afterend', `
					<div id="start-overtime-wrapper" class="d-flex my-1 justify-content-center">
						<button id="start-overtime-btn" data-bs-toggle="modal" data-bs-target="#startOvertimeModal" class="btn btn-danger w-auto"><span class="i18" key="StartOvertime">${i18next.t("StartOvertime")}</span></button>
					</div>
				`)
			}
			
			if (!isPenaltyShootout) {
				matchManagementForm.insertAdjacentHTML('afterend', `
					<div id="end-match-wrapper" class="d-flex my-1 justify-content-center">
						<button id="end-match-btn" data-bs-toggle="modal" data-bs-target="#endMatchModal" class="btn btn-danger w-auto"><span class="i18" key="EndMatch">${i18next.t("EndMatch")}</span></button>
					</div>
				`)
			}
		}
		
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

		const confirmStartOvertimeBtn = document.querySelector('#confirm-start-overtime-btn')

		confirmStartOvertimeBtn.addEventListener('click', async () => {
			await startOvertime()
		})

		const confirmEndMatchBtn = document.querySelector('#confirm-end-match-btn')

		confirmEndMatchBtn.addEventListener('click', async () => {
			await endMatch()
		})

		selectEventType.addEventListener('change', () => {
			resetAllFormFields()

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

								players = (selectEventTeam.value == 1) ? validPlayersTeam1 : validPlayersTeam2

								matchManagementForm.insertAdjacentHTML('beforeend', `
									<div>
										<label for="select-event-player" class="i18 form-label mb-0 mt-3" key="SelectEventPlayerLabel">${i18next.t("SelectEventPlayerLabel")}</label>
										<select id="select-event-player" class="form-select">
											<option value="" selected class="i18" key="SelectEventPlayerPlaceholder">${i18next.t("SelectEventPlayerPlaceholder")}</option>
											${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
										</select>
									</div>

									${(match.isSoccer) ? `
										<div class="form-check mt-2">
											<input class="form-check-input" type="checkbox" value="" id="checkbox-event-assister-player">
											<label class="form-check-label i18 mb-0" key="CheckboxEventAssisterPlayerLabel" for="checkbox-event-assister-player">${i18next.t("CheckboxEventAssisterPlayerLabel")}</label>
										</div>

										<div class="form-check mt-2">
											<input class="form-check-input" type="checkbox" value="" id="checkbox-event-own-goal">
											<label class="form-check-label i18 mb-0" key="CheckboxEventOwnGoalLabel" for="checkbox-event-own-goal">${i18next.t("CheckboxEventOwnGoalLabel")}</label>
										</div>
							
										<div class="input-event-time-wrapper form-group mt-3">
											<label for="input-event-time" class="i18 form-label mb-0" key="InputEventTimeLabel">${i18next.t("InputEventTimeLabel")}</label>
											<input type="number" class="form-control" id="input-event-time">
										</div>
									` : ''}

									${(!match.isSoccer) ? `
										<div class="input-event-point-set-wrapper form-group mt-3">
											<label for="input-event-point-set" class="i18 form-label mb-0" key="InputEventPointSetLabel">${i18next.t("InputEventPointSetLabel")}</label>
											<input min="0" type="number" class="form-control" id="input-event-point-set">
										</div>
									` : ''}

									<div class="btn-post-event-wrapper d-flex justify-content-center">
										<button type="submit" class="btn-post-event btn btn-primary mt-3 i18" key="AdicionarEvento">${i18next.t("AdicionarEvento")}</button>
									</div>
								`)

								const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')
								const checkboxEventOwnGoal = matchManagementForm.querySelector('input#checkbox-event-own-goal')
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

								const selectedPlayer = players.find(player => player.id == selectEventPlayer.value)
								const selectedAssisterPlayer = players.find(player => player.id == selectEventAssisterPlayer?.value)

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
									if (isOvertime) {
										postGoalValidator
											.addField(inputEventTime, [
												{
													validator: (value) => {
														return value <= 120
													},
													errorMessage: `<span class="i18" key="TempoMaximoOvertime">${i18next.t("TempoMaximoOvertime")}</span>`
												},
												{
													validator: (value) => {
														return value >= 90
													},
													errorMessage: `<span class="i18" key="TempoMinimoOvertime">${i18next.t("TempoMinimoOvertime")}</span>`
												}
											])
									} else {
										postGoalValidator
											.addField(inputEventTime, [
												{
													validator: (value) => {
														return value <= 90
													},
													errorMessage: `<span class="i18" key="TempoMaximoPartida">${i18next.t("TempoMaximoPartida")}</span>`
												},
												{
													validator: (value) => {
														return value >= 0
													},
													errorMessage: `<span class="i18" key="TempoMinimoPartida">${i18next.t("TempoMinimoPartida")}</span>`
												}
											])
									}
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

										const playerKey = (selectedPlayer.username == null || selectedPlayer.username == "") ? "PlayerTempId" : "PlayerId"
										const assisterPlayerKey = (selectedAssisterPlayer.username == null || selectedAssisterPlayer.username == "") ? "AssisterPlayerTempId" : "AssisterPlayerId"
										
										const body = {
											"MatchId": match.id,
											"TeamId": selectEventTeam.value,
										}

										body[playerKey] = selectEventPlayer.value

										if (match.isSoccer) {
											body["OwnGoal"] = checkboxEventOwnGoal.checked
											body["Minutes"] = inputEventTime.value

											if (checkboxEventAssisterPlayer.checked) {
												body[assisterPlayerKey] = selectEventAssisterPlayer.value
											}
										} else {
											body["Set"] = inputEventPointSet.value
										}

										loader.show()
										await postGoal(body)
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
											<input min="0" type="number" class="form-control" id="input-event-time">
										</div>
									` : ''}

									<div class="btn-post-event-wrapper d-flex justify-content-center">
										<button type="submit" class="btn-post-event btn btn-primary mt-3 i18" key="AdicionarEvento">${i18next.t("AdicionarEvento")}</button>
									</div>
									
								`)

								const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')
								const inputEventTime = matchManagementForm.querySelector('input#input-event-time')
								const selectEventCardType = matchManagementForm.querySelector('select#select-event-card-type')

								const selectedPlayer = players.find(player => player.id == selectEventPlayer.value)

								if (inputEventTime) {
									postGoalValidator
										.addField(inputEventTime, [
											{
												rule: 'required',
												errorMessage: `<span class="i18" key="TempoObrigatorio">${i18next.t("TempoObrigatorio")}</span>`,
											}
										])
									if (isOvertime) {
										postGoalValidator
											.addField(inputEventTime, [
												{
													validator: (value) => {
														return value <= 120
													},
													errorMessage: `<span class="i18" key="TempoMaximoOvertime">${i18next.t("TempoMaximoOvertime")}</span>`
												},
												{
													validator: (value) => {
														return value >= 90
													},
													errorMessage: `<span class="i18" key="TempoMinimoOvertime">${i18next.t("TempoMinimoOvertime")}</span>`
												}
											])
									} else {
										postGoalValidator
											.addField(inputEventTime, [
												{
													validator: (value) => {
														return value <= 90
													},
													errorMessage: `<span class="i18" key="TempoMaximoPartida">${i18next.t("TempoMaximoPartida")}</span>`
												},
												{
													validator: (value) => {
														return value >= 0
													},
													errorMessage: `<span class="i18" key="TempoMinimoPartida">${i18next.t("TempoMinimoPartida")}</span>`
												}
											])
									}
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

										const playerKey = (selectedPlayer.username == null || selectedPlayer.username == "") ? "PlayerTempId" : "PlayerId"

										const body = {
											"MatchId": match.id,
											"TeamId": selectEventTeam.value,
											"CardType": selectEventCardType.value,
											"Minutes": inputEventTime.value
										}

										body[playerKey] = selectEventPlayer.value

										loader.show()
										await postCard(body)
										loader.hide()
									})
							} else {
								resetSomeLessFormFields()
							}
						})
					// Penalty
					case "3":
						let postPenaltyValidator = new JustValidate(matchManagementForm, {
							validateBeforeSubmitting: true,
						})

						selectEventTeam.addEventListener('change', () => {
						// reset player fields and remove them from DOM if they exist already
							postPenaltyValidator.destroy()

							postPenaltyValidator = new JustValidate(matchManagementForm, {
								validateBeforeSubmitting: true,
							})

							if (selectEventTeam.value) {
								resetSomeFormFields()

								players = (selectEventTeam.value == 1) ? validPlayersTeam1 : validPlayersTeam2

								matchManagementForm.insertAdjacentHTML('beforeend', `
									<div>
										<label for="select-event-player" class="i18 form-label mb-0 mt-3" key="SelectEventPlayerLabel">${i18next.t("SelectEventPlayerLabel")}</label>
										<select id="select-event-player" class="form-select">
											<option value="" selected class="i18" key="SelectEventPlayerPlaceholder">${i18next.t("SelectEventPlayerPlaceholder")}</option>
											${players.map(player => `<option value="${player.id}">${player.name}</option>`)}
										</select>
									</div>

									<div class="form-check mt-2">
										<input class="form-check-input" type="checkbox" value="" id="checkbox-event-penalty-goal">
										<label class="form-check-label i18 mb-0" key="CheckboxEventPenaltyGoal" for="checkbox-event-penalty-goal">${i18next.t("CheckboxEventPenaltyGoal")}</label>
									</div>

									<div class="btn-post-event-wrapper d-flex justify-content-center">
										<button type="submit" class="btn-post-event btn btn-primary mt-3 i18" key="AdicionarEvento">${i18next.t("AdicionarEvento")}</button>
									</div>
								`)

								const selectEventPlayer = matchManagementForm.querySelector('select#select-event-player')
								const checkboxEventPenaltyGoal = matchManagementForm.querySelector('input#checkbox-event-penalty-goal')

								const selectedPlayer = players.find(player => player.id == selectEventPlayer.value)

								postGoalValidator
									.addField(selectEventPlayer, [
										{
											rule: 'required',
											errorMessage: `<span class="i18" key="JogadorObrigatorio">${i18next.t("JogadorObrigatorio")}</span>`,
										},
									])
									.onSuccess(async e => {
										e.preventDefault()

										const playerKey = (selectedPlayer.username == null || selectedPlayer.username == "") ? "PlayerTempId" : "PlayerId"

										const body = {
											"MatchId": match.id,
											"TeamId": selectEventTeam.value,
											"Converted": checkboxEventPenaltyGoal.checked
										}

										body[playerKey] = selectEventPlayer.value

										loader.show()
										await postPenalty(body)
										loader.hide()
									})
							} else {
								resetSomeFormFields()
							}
						})
						break;		
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

	const loadScoreboard = () => {
		matchScoreWrapper.insertAdjacentHTML('beforeend', `
			${match.isSoccer ? `
				<span id="match-score" class="text-black fw-bold">${match.homeGoals} : ${match.visitorGoals}</span>
			` : `
				<span id="match-score" class="text-black fw-bold">${match.homeWinnigSets} : ${match.visitorWinnigSets}</span>
			`}
		`)
		mTeam1NameWrapper.insertAdjacentHTML('beforeend', `
			<span id="m-team1-name" class="m-team-name fw-semibold text-black text-wrap text-center d-block">${match.homeName}</span>
		`)
		mTeam1ImgWrapper.insertAdjacentHTML('beforeend', `
			<img class="m-team-img position-absolute img-fluid w-100 h-100" src="${match.homeEmblem}" alt="">
		`)
		mTeam2NameWrapper.insertAdjacentHTML('beforeend', `
			<span id="m-team2-name" class="m-team-name fw-semibold text-black text-wrap text-center text-end d-block">${match.visitorName}</span>
		`)
		mTeam2ImgWrapper.insertAdjacentHTML('beforeend', `
			<img class="m-team-img position-absolute img-fluid w-100 h-100" src="${match.visitorEmblem}" alt="">
		`)
	}

	const updateScoreboard = async () => {
		const matchScore = document.querySelector('#match-score')

		const 
			dataMatch = await executarFetch(`matches/${matchId}`, configuracaoFetch('GET')),
			match = dataMatch.results

		matchScore.textContent = `${match.homeGoals} : ${match.visitorGoals}`
	}

	const listPlayers = async () => {
		const team1PlayersList = document.querySelector('#match-details-content-players-team1')
		const team2PlayersList = document.querySelector('#match-details-content-players-team2')

		allPlayersTeam1.forEach(player => {
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

		allPlayersTeam2.forEach(player => {
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

	const endMatch = async () => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		let endpoint = ''

		loader.show()
		const championshipData = await executarFetch(`championships/${match.championshipId}`, configuracaoFetch('GET')),
			campeonato = championshipData.results

		endpoint = (campeonato.format == 3) ? 'end-game-league-system' 
		: (campeonato.format == 1) ? 'end-game-knockout' 
		: (campeonato.format == 4) ? 'end-game-group-stage' 
		: ''

		const configFetch = configuracaoFetch('PUT'),
			response = await executarFetch(`matches/${match.id}/${endpoint}`, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoFinalizarPartida"))
		}
	}

	const startOvertime = async () => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('PUT'),
			response = await executarFetch(`matches/${match.id}/prorrogation`, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoStartOvertime"))
		}
	}

	const isPenaltyElegible = () => {
		if (match.isSoccer) {
			if (campeonato.format == 1) {
				const isKnockoutDoubleMatch = () => {
					return (campeonato.doubleMatchEliminations) ? true : false
				}
	
				if (!isKnockoutDoubleMatch) {
					return (match.homeGoals == match.visitorGoals) ? true : false
				} else {
					return (match.homeAggregatedGoals == match.visitorAggregatedGoals) ? true : false
				}
			}
		}
	}

	const isPenaltyShootout = () => {
		if (match.isSoccer) {
			return (allEvents.penalties.length > 0) ? true : false
		}
	}

	const isOvertimeElegible = async () => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('GET'),
			response = await executarFetch(`matches/${match.id}/penalties`, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			if (response.results) {
				return true
			} else {
				return false
			}
		}
	}

	const isOvertime = () => {
		if (match.isSoccer) {
			return (match.overtime) ? true : false
		}
	}

	const loadEvents = async () => {
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
				} else if (event.type == 'penalty') {
					if(event.converted) {
						eventData = `							
							<div class="event-type"><span class="text-muted i18" key="Penalti">${i18next.t("Penalti")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-desc"><span class="text-muted">${i18next.t("ScoredPenalty")}</span></div>
						`

						eventIllustration = `
							<img src="../public/icons/sports_penalty.svg" alt="">
						`
					} else {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Penalti">${i18next.t("Penalti")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-desc"><span class="text-muted">${i18next.t("MissedPenalty")}</span></div>
						`

						eventIllustration = `
							<img src="../public/icons/sports_missed_penalty.svg" alt="">
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
				}
			}

			// Verify if the event is from team 1 or team 2
			if (isTeam1(event.teamId)) {						
				eventPlayer = validPlayersTeam1.find(player => player.id == event.PlayerTempId)
				eventAssisterPlayer = validPlayersTeam1.find(player => player.id == event.AssisterPlayerTempId)

			} else if (isTeam2(event.teamId)) {
				eventPlayer = validPlayersTeam2.find(player => player.id == event.PlayerTempId)
				eventAssisterPlayer = validPlayersTeam2.find(player => player.id == event.AssisterPlayerTempId)
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
					window.location.href = `../pages/tabela-chaveamento.html?id=${match.championshipId}`
				})
			}
		} else {
			if (match.finished) {
				matchReportAccess.insertAdjacentHTML('afterbegin', `
					<div id="match-ended-alert" class="text-center">
						<span class="i18" key="MatchEnded">${i18next.t("MatchEnded")}</span>
					</div>
				`)
			}

			// verify if the match is over and if the match has a match report
			if (match.finished && match.matchReport) {
				matchReportAccess.insertAdjacentHTML('beforeend', `
					<div class="row justify-content-center align-items-center">
						<div class="col-auto">
							<a href="javascript:void(0)" class="d-none i18" id="download-match-report-link">
								<button id="download-match-report-btn" class="btn btn-outline-dark rounded-pill"><span class="i18" key="DownloadMatchReport">${i18next.t("DownloadMatchReport")}</span></button>
							</a>
						</div>
					</div>
				`)

				downloadMatchReportBtn = document.getElementById('download-match-report-btn')
				downloadMatchReportLink = document.getElementById('download-match-report-link')
			}

			if (isMatchOrganizer) {
				manageMatchBtn.classList.remove('d-none')

				(!match.finished) ? matchManagementSystem() : endMatchManagementSystem()
			}

			loadEvents()
			listPlayers()
			loadScoreboard()
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
		matchManagementForm = document.getElementById('match-management-form'),
		matchScoreWrapper = document.getElementById('match-score-wrapper'),
		mTeam1NameWrapper = document.getElementById('m-team1-name-wrapper'),
		mTeam2NameWrapper = document.getElementById('m-team2-name-wrapper'),
		mTeam1ImgWrapper = document.getElementById('m-team1-img-wrapper'),
		mTeam2ImgWrapper = document.getElementById('m-team2-img-wrapper'),
		matchReportAccess = document.getElementById('match-report-access')
	
	let
		downloadMatchReportBtn = null,
		downloadMatchReportLink = null

	loader.show()
	const 
		dataMatch = await executarFetch(`matches/${matchId}`, configuracaoFetch('GET')),
		match = dataMatch.results
	
	const 
		dataValidPlayersTeam1 = await executarFetch(`matches/${match.id}/teams/${match.homeId}/players`, configuracaoFetch('GET')),
		validPlayersTeam1 = dataValidPlayersTeam1.results

	const
		dataAllPlayersTeam1 = await executarFetch(`teams/${match.homeId}/players`, configuracaoFetch('GET')),
		allPlayersTeam1 = dataAllPlayersTeam1.results
	
	const 
		dataValidPlayersTeam2 = await executarFetch(`matches/${match.id}/teams/${match.visitorId}/players`, configuracaoFetch('GET')),
		validPlayersTeam2 = dataValidPlayersTeam2.results

	const 
		dataAllPlayersTeam2 = await executarFetch(`teams/${match.visitorId}/players`, configuracaoFetch('GET')),
		allPlayersTeam2 = dataAllPlayersTeam2.results

	const
		matchStartConditions = await executarFetch(`matches/${matchId}/start-conditions`, configuracaoFetch('GET')),
		matchStartConditionsResults = matchStartConditions.results

	const
		dataCampeonato = await executarFetch(`championships/${match.championshipId}`, configuracaoFetch('GET')),
		campeonato = dataCampeonato.results
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
