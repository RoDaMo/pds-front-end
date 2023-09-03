import '../scss/tela-partida.scss'
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
import './utilidades/loader'
import portugues from './i18n/ptbr/tela-partida.json' assert { type: 'JSON' }
import ingles from './i18n/en/tela-partida.json' assert { type: 'JSON' }
import i18next, { t } from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import JustValidate from 'just-validate'
import { uploadImagem } from './utilidades/uploadImagem'
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);


const init = async () => {
	const activateLi = (li) => {
		for (const item of abaBotoes) 
            item.classList.remove('active')

		li.classList.add('active')
	}

	const getValidPlayers = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('GET'),
			response = await executarFetch(`matches/${match.id}/teams/${teamId}/players`, configFetch, callbackStatus)

		if (response.succeed) {
			return response.results
		}
	}

	const insertOvertimeBtn = async () => {
		if (await isExtraElegible() && !isPenaltyShootout() && !isOvertime()) {
			document.querySelector('#start-overtime-wrapper')?.remove()

			extraManagement.insertAdjacentHTML('afterbegin', `
				<div id="start-overtime-wrapper" class="d-flex my-2 justify-content-center">
					<button id="start-overtime-btn" data-bs-toggle="modal" data-bs-target="#startOvertimeModal" class="btn lvl1-color w-auto"><span class="i18" key="StartOvertime">${i18next.t("StartOvertime")}</span></button>
				</div>
			`)

			thereIsAnything = true
		} else {
			document.querySelector('#start-overtime-wrapper')?.remove()
		}
	}

	const insertPenaltyShootoutBtn = async () => {
		if (await isExtraElegible() && isOvertime() && !isPenaltyShootout()) {
			document.querySelector('#start-penalty-shootout-wrapper')?.remove()

			extraManagement.insertAdjacentHTML('afterbegin', `
				<div id="start-penalty-shootout-wrapper" class="d-flex my-2 justify-content-center">
					<button id="start-penalty-shootout-btn" data-bs-toggle="modal" data-bs-target="#startPenaltyShootoutModal" class="btn lvl1-color w-auto"><span class="i18" key="StartPenaltyShootout">${i18next.t("StartPenaltyShootout")}</span></button>
				</div>
			`)
		} else {
			document.querySelector('#start-penalty-shootout-wrapper')?.remove()
		}

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
			await insertOvertimeBtn()
			await insertPenaltyShootoutBtn()

			validPlayersTeam1 = await getValidPlayers(match.homeId)
			validPlayersTeam2 = await getValidPlayers(match.visitorId)

			document.querySelector('#match-management-form-type').querySelector('select#select-event-type').value = ""
			resetMatchManagementForm()

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

			validPlayersTeam1 = await getValidPlayers(match.homeId)
			validPlayersTeam2 = await getValidPlayers(match.visitorId)

			document.querySelector('#match-management-form-type').querySelector('select#select-event-type').value = ""
			resetMatchManagementForm()

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

			document.querySelector('#match-management-form-type').querySelector('select#select-event-type').value = ""
			resetMatchManagementForm()

			await loadEvents()
			await loadPenaltiesScoreboard()

			if (await hasMatchEnded()) {
				window.location.reload()
			}
		}
	}

	const putMatchReport = async (body) => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('PUT', body),
			response = await executarFetch('matches/add-match-report', configFetch, callbackStatus)
		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoPostSumula"))
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		}
	}

	const endMatchManagementSystem = async () => {
		matchManagementForm.insertAdjacentHTML('beforeend', `
			<form id="match-report-management-form"></form>
		`)

		const matchReportManagementForm = matchManagementForm.querySelector('#match-report-management-form')

		matchManagementForm.insertAdjacentHTML('beforebegin', `
			<div id="event-admin-label" class="d-flex justify-content-center lvl2-color rounded-4 py-1 px-3 mb-2">
				<span class="i18" key="Sumula">${i18next.t("Sumula")}</span>
			</div>
		`)

		const matchReportLink = (match.isSoccer) ? `https://drive.google.com/file/d/19qAP64jlw6MROV6yBN84oX1yBVrkPK1_/view?usp=drivesdk` : ``

		matchReportManagementForm.insertAdjacentHTML('beforeend', `
			<div class="ex-match-report-wrapper d-flex justify-content-center">
				<a href="${matchReportLink}" class="btn btn-primary mt-3 i18" key="DownloadExampleSumula">${i18next.t("DownloadExampleSumula")}</a>
			</div> 
		
			<hr class="w-75 mx-auto">

			<div class="form-group mt-3">
				<label for="input-match-report" class="i18 form-label mb-0" key="InputMatchReportLabel">${i18next.t("InputMatchReportLabel")}</label>
				<input type="file" class="form-control" id="input-match-report">
			</div>

			<input type="hidden" id="match-report-hidden-input">

			<div class="btn-post-match-report-wrapper d-flex justify-content-center">
				<button type="submit" class="btn-post-match-report btn btn-primary mt-3 i18" key="AdicionarSumula">${i18next.t("AdicionarSumula")}</button>
			</div>
		`)

		const inputMatchReport = matchReportManagementForm.querySelector('input#input-match-report')
		const hiddenInput = matchReportManagementForm.querySelector('input#match-report-hidden-input')

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

			if (downloadMatchReportLink) [
				downloadMatchReportLink.href = hiddenInput.value
			]

			console.log(hiddenInput.value);
		})

		const postMatchReportValidator = new JustValidate(matchReportManagementForm, {
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
					"Id": match.id,
					"MatchReport": hiddenInput.value
				}

				await putMatchReport(body)
			})	
	}

	const resetMatchManagementForm = () => {
		matchManagementForm.querySelector('div.input-event-point-set-wrapper')?.remove()
		matchManagementForm.querySelector('label[for="select-event-team"]')?.remove()
		matchManagementForm.querySelector('select#select-event-team')?.remove()
		matchManagementForm.querySelector('label[for="select-event-player"]')?.remove()
		matchManagementForm.querySelector('select#select-event-player')?.remove()
		matchManagementForm.querySelector('label[for="select-event-assister-player"]')?.remove()
		matchManagementForm.querySelector('select#select-event-assister-player')?.remove()
		matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()
		matchManagementForm.querySelectorAll('div.form-check')?.forEach(div => div.remove())
		matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
		matchManagementForm.querySelector('select#select-event-card-type')?.remove()
		matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
		matchManagementForm.querySelector('input#checkbox-event-own-goal')?.remove()
		matchManagementForm.querySelector('label[for="checkbox-event-own-goal"]')?.remove()	
		matchManagementForm.querySelector('input#checkbox-event-assister-player')?.remove()
		matchManagementForm.querySelector('label[for="checkbox-event-assister-player"]')?.remove()
	}

	const matchManagementSystem = () => {

		matchManagementForm.insertAdjacentHTML('beforebegin', `
			<div id="event-admin-label" class="d-flex justify-content-center lvl2-color rounded-4 py-1 px-3 mb-2">
				<span class="i18" key="Eventos">${i18next.t("Eventos")}</span>
			</div>
		`)

		matchManagementForm.insertAdjacentHTML('beforebegin', `
			<div id="match-management-form-type">
				<label for="select-event-type" class="form-label i18 mb-0" key="SelectEventTypeLabel">${i18next.t("SelectEventTypeLabel")}</label>
				<select id="select-event-type" class="form-select">
					<option selected value="" class="i18" key="SelectEventTypePlaceholder">${i18next.t("SelectEventTypePlaceholder")}</option>
					${(!isPenaltyShootout() ? `<option value="1" class="i18" key="${(match.isSoccer ? "Gol" : "Ponto")}">${(match.isSoccer ? i18next.t("Gol") : i18next.t("Ponto"))}</option>` : '')}
					${(match.isSoccer && !isPenaltyShootout()) ? `<option value="2" class="i18" key="Falta">${i18next.t("Falta")}</option>` : ''}
					${(isPenaltyShootout()) ? `<option value="3" class="i18" key="Penalti">${i18next.t("Penalti")}</option>` : ''}
				</select>  
			</div>
		`)

		const matchManagementFormType = document.querySelector('#match-management-form-type')

		if (match.isSoccer) {
			if (!isPenaltyShootout()) {
				extraManagement.insertAdjacentHTML('beforeend', `
					<div id="end-match-wrapper" class="d-flex flex-column align-items-center flex-md-row my-2 justify-content-center">
						<div class="m-2">
							<button id="end-match-btn" data-bs-toggle="modal" data-bs-target="#endMatchModal" class="btn btn-danger w-auto"><span class="i18" key="EndMatch">${i18next.t("EndMatch")}</span></button>
						</div>

						${match.isSoccer ? `
							<div class="m-2">
								<button id="wo-end-match-btn" data-bs-toggle="modal" data-bs-target="#woEndMatchModal" class="btn btn-danger w-auto"><span class="i18" key="EndMatchWO">${i18next.t("EndMatchWO")}</span></button>
							</div>
						` : ''}
					</div>
				`)

				thereIsAnything = true
			}

			insertOvertimeBtn()
			insertPenaltyShootoutBtn()

			if (thereIsAnything) {
				extraManagement.insertAdjacentHTML('beforebegin', `
					<div id="extra-admin-label" class="d-flex mt-4 justify-content-center lvl2-color rounded-4 py-1 px-3 mb-2">
						<span class="i18" key="OtherOptions">${i18next.t("OtherOptions")}</span>
					</div>
				`)
			}
		}
		
		const selectEventType = matchManagementFormType.querySelector('select#select-event-type')

		// reset form fields and remove them from DOM if they exist already
		const resetAllFormFields = () => {
			matchManagementForm.querySelector('div.input-event-point-set-wrapper')?.remove()
			matchManagementForm.querySelector('label[for="select-event-team"]')?.remove()
			matchManagementForm.querySelector('select#select-event-team')?.remove()
			matchManagementForm.querySelector('label[for="select-event-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-player')?.remove()
			matchManagementForm.querySelector('label[for="select-event-assister-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-assister-player')?.remove()
			matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()
			matchManagementForm.querySelectorAll('div.form-check')?.forEach(div => div.remove())
			matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
			matchManagementForm.querySelector('select#select-event-card-type')?.remove()
			matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
			matchManagementForm.querySelector('input#checkbox-event-own-goal')?.remove()
			matchManagementForm.querySelector('label[for="checkbox-event-own-goal"]')?.remove()	
			matchManagementForm.querySelector('input#checkbox-event-assister-player')?.remove()
			matchManagementForm.querySelector('label[for="checkbox-event-assister-player"]')?.remove()
			
		}

		const resetSomeFormFields = () => {
			matchManagementForm.querySelector('div.input-event-point-set-wrapper')?.remove()
			matchManagementForm.querySelector('label[for="select-event-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-player')?.remove()
			matchManagementForm.querySelector('label[for="select-event-assister-player"]')?.remove()
			matchManagementForm.querySelector('select#select-event-assister-player')?.remove()
			matchManagementForm.querySelectorAll('div.form-check')?.forEach(div => div.remove())
			matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
			matchManagementForm.querySelector('select#select-event-card-type')?.remove()
			matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
			matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()
			matchManagementForm.querySelector('input#checkbox-event-own-goal')?.remove()
			matchManagementForm.querySelector('label[for="checkbox-event-own-goal"]')?.remove()	
			matchManagementForm.querySelector('input#checkbox-event-assister-player')?.remove()
			matchManagementForm.querySelector('label[for="checkbox-event-assister-player"]')?.remove()
		}

		const resetSomeLessFormFields = () => {
			matchManagementForm.querySelector('div.input-event-point-set-wrapper')?.remove()
			matchManagementForm.querySelector('div.btn-post-event-wrapper')?.remove()
			matchManagementForm.querySelector('label[for="select-event-card-type"]')?.remove()
			matchManagementForm.querySelector('select#select-event-card-type')?.remove()
			matchManagementForm.querySelector('div.input-event-time-wrapper')?.remove()
			matchManagementForm.querySelector('input#checkbox-event-own-goal')?.remove()
			matchManagementForm.querySelector('label[for="checkbox-event-own-goal"]')?.remove()	
			matchManagementForm.querySelector('input#checkbox-event-assister-player')?.remove()
			matchManagementForm.querySelector('label[for="checkbox-event-assister-player"]')?.remove()
			matchManagementForm.querySelectorAll('div.form-check')?.forEach(div => div.remove())
		}

		const confirmStartOvertimeBtn = document.querySelector('#confirm-start-overtime-btn')

		confirmStartOvertimeBtn.addEventListener('click', async () => {
			await startOvertime()
		})

		const confirmStartPenaltyShootoutBtn = document.querySelector('#confirm-start-penalty-shootout-btn')

		confirmStartPenaltyShootoutBtn.addEventListener('click', async () => {
			await startPenaltyShootout()
		})

		const confirmEndMatchBtn = document.querySelector('#confirm-end-match-btn')

		confirmEndMatchBtn.addEventListener('click', async () => {
			await endMatch()
		})

		woTeamForm.insertAdjacentHTML('beforeend', `
			<label for="select-wo-team" class="i18 form-label mt-3 mb-0" key="SelectWOTeamLabel">${i18next.t("SelectWOTeamLabel")}</label>
			<select id="select-wo-team" class="form-select">
				<option value="" selected class="i18" key="SelectWOTeamPlaceholder">${i18next.t("SelectWOTeamPlaceholder")}</option>
				<option value="${match.homeId}">${match.homeName}</option>
				<option value="${match.visitorId}">${match.visitorName}</option>
			</select>
		`)

		const selectWOTeam = woTeamForm.querySelector('select#select-wo-team')

		const woEndMatchValidator = new JustValidate(woTeamForm, {
			validateBeforeSubmitting: true,
		})

		woEndMatchValidator
			.addField(selectWOTeam, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="TeamWORequired">${i18next.t("TeamWORequired")}</span>`,
				}
			])
			.onSuccess(async e => {
				e.preventDefault()

				await woEndMatch(selectWOTeam.value)
			})


		selectEventType.addEventListener('change', () => {
			resetAllFormFields()

			document.querySelector('#goal-management-form')?.remove()
			document.querySelector('#card-management-form')?.remove()
			document.querySelector('#penalty-management-form')?.remove()

			if (selectEventType.value) {
				let players = []
				
				switch (selectEventType.value) {
					// Goal
					case "1":

						matchManagementForm.insertAdjacentHTML('beforeend', `
							<form id="goal-management-form"></form>
						`)

						const goalManagementForm = matchManagementForm.querySelector('#goal-management-form')

						goalManagementForm.insertAdjacentHTML('beforeend', `
							<label for="select-event-team" class="i18 form-label mt-3 mb-0" key="SelectEventTeamLabel">${i18next.t("SelectEventTeamLabel")}</label>
							<select id="select-event-team" class="form-select">
								<option value="" selected class="i18" key="SelectEventTeamPlaceholder">${i18next.t("SelectEventTeamPlaceholder")}</option>
								<option value="${match.homeId}">${match.homeName}</option>
								<option value="${match.visitorId}">${match.visitorName}</option>
							</select>
						`)

						const selectEventTeam = goalManagementForm.querySelector('select#select-event-team')

						let postGoalValidator = new JustValidate(goalManagementForm, {
							validateBeforeSubmitting: true,
						})

						selectEventTeam.addEventListener('change', () => {
						// reset player fields and remove them from DOM if they exist already
							postGoalValidator.destroy()

							postGoalValidator = new JustValidate(goalManagementForm, {
								validateBeforeSubmitting: true,
							})

							if (selectEventTeam.value) {
								resetSomeFormFields()

								players = (selectEventTeam.value == match.homeId) ? validPlayersTeam1 : validPlayersTeam2

								goalManagementForm.insertAdjacentHTML('beforeend', `
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
											<input min="0" type="number" class="form-control" id="input-event-time">
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

								let selectEventAssisterPlayer = null
								let selectedAssisterPlayer = null
								let inputEventPointSet = document.getElementById("input-event-point-set")

								if(checkboxEventAssisterPlayer)
								{
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
	
											selectEventAssisterPlayer = matchManagementForm.querySelector('select#select-event-assister-player')
	
											selectEventAssisterPlayer?.addEventListener('change', () => {
												selectedAssisterPlayer = players.find(player => player.id == selectEventAssisterPlayer.value)
												postGoalValidator.revalidate()
											})
	
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

								}
								
								

								const inputEventTime = matchManagementForm.querySelector('input#input-event-time')

								let selectedPlayer = null

								selectEventPlayer.addEventListener('change', () => {
									selectedPlayer = players.find(player => player.id == selectEventPlayer.value)
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
									if (isOvertime()) {
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
										const assisterPlayerKey = (selectedAssisterPlayer?.username == null || selectedAssisterPlayer?.username == "") ? "AssisterPlayerTempId" : "AssisterPlayerId"
										
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

						matchManagementForm.insertAdjacentHTML('beforeend', `
							<form id="card-management-form"></form>
						`)

						const cardManagementForm = matchManagementForm.querySelector('#card-management-form')

						cardManagementForm.insertAdjacentHTML('beforeend', `
							<label for="select-event-team" class="i18 form-label mt-3 mb-0" key="SelectEventTeamLabel">${i18next.t("SelectEventTeamLabel")}</label>
							<select id="select-event-team" class="form-select">
								<option value="" selected class="i18" key="SelectEventTeamPlaceholder">${i18next.t("SelectEventTeamPlaceholder")}</option>
								<option value="${match.homeId}">${match.homeName}</option>
								<option value="${match.visitorId}">${match.visitorName}</option>
							</select>
						`)

						const selectEventTeamCard = cardManagementForm.querySelector('select#select-event-team')

						let postCardValidator = new JustValidate(cardManagementForm, {
							validateBeforeSubmitting: true,
						})

						selectEventTeamCard.addEventListener('change', () => {
							// reset player fields and remove them from DOM if they exist already
							postCardValidator.destroy()

							postCardValidator = new JustValidate(cardManagementForm, {
								validateBeforeSubmitting: true,
							})

							resetSomeFormFields()

							if (selectEventTeamCard.value) {

								players = (selectEventTeamCard.value == match.homeId) ? validPlayersTeam1 : validPlayersTeam2

								cardManagementForm.insertAdjacentHTML('beforeend', `
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

								let selectedPlayer = null

								selectEventPlayer.addEventListener('change', () => {
									selectedPlayer = players.find(player => player.id == selectEventPlayer.value)
								})

								if (inputEventTime) {
									postCardValidator
										.addField(inputEventTime, [
											{
												rule: 'required',
												errorMessage: `<span class="i18" key="TempoObrigatorio">${i18next.t("TempoObrigatorio")}</span>`,
											}
										])
									if (isOvertime()) {
										postCardValidator
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
										postCardValidator
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
											"TeamId": selectEventTeamCard.value,
											"YellowCard": selectEventCardType.value === 'true',
											"Minutes": parseInt(inputEventTime.value)
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
						break;
					// Penalty
					case "3":

						matchManagementForm.insertAdjacentHTML('beforeend', `
							<form id="penalty-management-form"></form>
						`)

						const penaltyManagementForm = matchManagementForm.querySelector('#penalty-management-form')

						penaltyManagementForm.insertAdjacentHTML('beforeend', `
							<label for="select-event-team" class="i18 form-label mt-3 mb-0" key="SelectEventTeamLabel">${i18next.t("SelectEventTeamLabel")}</label>
							<select id="select-event-team" class="form-select">
								<option value="" selected class="i18" key="SelectEventTeamPlaceholder">${i18next.t("SelectEventTeamPlaceholder")}</option>
								<option value="${match.homeId}">${match.homeName}</option>
								<option value="${match.visitorId}">${match.visitorName}</option>
							</select>
						`)

						const selectEventTeamPenalty = penaltyManagementForm.querySelector('select#select-event-team')

						let postPenaltyValidator = new JustValidate(penaltyManagementForm, {
							validateBeforeSubmitting: true,
						})

						selectEventTeamPenalty.addEventListener('change', () => {
						// reset player fields and remove them from DOM if they exist already
							postPenaltyValidator.destroy()

							postPenaltyValidator = new JustValidate(penaltyManagementForm, {
								validateBeforeSubmitting: true,
							})

							if (selectEventTeamPenalty.value) {
								resetSomeFormFields()

								players = (selectEventTeamPenalty.value == match.homeId) ? validPlayersTeam1 : validPlayersTeam2


								penaltyManagementForm.insertAdjacentHTML('beforeend', `
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

								let selectedPlayer = null

								selectEventPlayer.addEventListener('change', () => {
									selectedPlayer = players.find(player => player.id == selectEventPlayer.value)
								})

								postPenaltyValidator
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
											"TeamId": selectEventTeamPenalty.value,
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
			if (!isMatchConfigured()) {
				blurWallEvents?.classList.remove('d-none')
			}
		}
	} 

	const isMatchOrganizer = () => {
		let isOrganizer = false
		let isChampionshipOrganizer = false

		isChampionshipOrganizer = (match.championshipId == sessionUserInfo?.championshipId) ? true : false

		if (sessionUserInfo?.isOrganizer && isChampionshipOrganizer) {
			isOrganizer = true
		} else {
			isOrganizer = false
		}

		return isOrganizer
	}

	const isMatchConfigured = () => {
		if (match.arbitrator == null || match.arbitrator == "" || match.cep == null || match.cep == "" || match.city == null || match.city == "") {
			return false
		} else {
			return true
		}
	}

	const loadPenaltiesScoreboard = async () => {
		const penaltiesScore = document.querySelector('#penalties-score')

		const
			matchEvents = await executarFetch(`matches/${matchId}/get-all-events`, configuracaoFetch('GET')),
			matchEventsResults = matchEvents.results

		let team1PenaltiesScore = matchEventsResults.filter(event => event.penalty && event.teamId == match.homeId && event.converted).length
		let team2PenaltiesScore = matchEventsResults.filter(event => event.penalty && event.teamId == match.visitorId && event.converted).length

		penaltiesScore.textContent = `(${team1PenaltiesScore} : ${team2PenaltiesScore})`
	}

	const loadScoreboard = () => {
		matchScoreWrapper.insertAdjacentHTML('beforeend', `
			${match.isSoccer ? `
				<span id="match-score" class="fw-bold">${match.homeGoals} : ${match.visitorGoals}</span>
			` : `
				<span id="match-score" class="fw-bold">${match.homeWinnigSets} : ${match.visitorWinnigSets}</span>
			`}
		`)
		mTeam1NameWrapper.insertAdjacentHTML('beforeend', `
			<span id="m-team1-name" class="m-team-name fw-semibold text-wrap text-center d-block">${match.homeName}</span>
		`)
		mTeam1ImgWrapper.insertAdjacentHTML('beforeend', `
			<img class="m-team-img position-absolute img-fluid w-100 h-100" src="${match.homeEmblem}" alt="">
		`)
		mTeam2NameWrapper.insertAdjacentHTML('beforeend', `
			<span id="m-team2-name" class="m-team-name fw-semibold text-wrap text-center text-end d-block">${match.visitorName}</span>
		`)
		mTeam2ImgWrapper.insertAdjacentHTML('beforeend', `
			<img class="m-team-img position-absolute img-fluid w-100 h-100" src="${match.visitorEmblem}" alt="">
		`)

		document.dispatchEvent(new Event('scoreboard-carregado', { bubbles: true }))
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

		const coachTeam1Content = document.querySelector('#match-details-content-coach-team1')
		const coachTeam2Content = document.querySelector('#match-details-content-coach-team2')

		const getPlayerPosition = (position) => {
			let positionName = ""

			switch (position) {
				case 1:
					positionName = `${i18next.t("Goleiro")}`
					break;
				case 2:
					positionName = `${i18next.t("Zagueiro")}`
					break;
				case 3:
					positionName = `${i18next.t("Lateral")}`
					break;
				case 4:
					positionName = `${i18next.t("Volante")}`
					break;
				case 5:
					positionName = `${i18next.t("MeioCampista")}`
					break;
				case 6:
					positionName = `${i18next.t("MeiaAtacante")}`
					break;
				case 7:
					positionName = `${i18next.t("Ala")}`
					break;
				case 8:
					positionName = `${i18next.t("Ponta")}`
					break;
				case 9:
					positionName = `${i18next.t("Centroavante")}`
					break;
				case 10:
					positionName = `${i18next.t("Levantador")}`
					break;
				case 11:
					positionName = `${i18next.t("Central")}`
					break;
				case 12:
					positionName = `${i18next.t("Libero")}`
					break;
				case 13:
					positionName = `${i18next.t("Ponteiro")}`
					break;
				case 14:
					positionName = `${i18next.t("Oposto")}`
					break;
				default:
					positionName = `${i18next.t("SemPosicao")}`
					break;
			}

			return positionName
		}

		allPlayersTeam1.forEach(player => {
			team1PlayersList.insertAdjacentHTML('beforeend', `
				<div class="row row-cols-1 row-cols-md-2 align-items-center p-2 flex-column flex-md-row my-2 rounded-5 match-details-content-player lvl1-color">
					<div class="col m-player-img-wrapper me-md-2 me-0 position-relative d-flex justify-content-center overflow-hidden border border-2 rounded-circle">
						<img class="m-player-img position-absolute img-fluid w-100 h-100" src="${player.picture}" alt="">
					</div>
					<div class="row col justify-content-center align-items-center flex-column w-auto m-player-info">
						<div class="col p-0 text-center text-md-start">
							<span class="m-player-name m-truncated-text-width fw-semibold text-truncate d-block">${player.name}</span>
						</div>
						<div class="col p-0 text-center text-md-start">
							<span class="m-player-position m-truncated-text-width text-muted text-truncate d-block i18">${getPlayerPosition(player.playerPosition)}</span>
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
				<div class="row row-cols-1 row-cols-md-2 align-items-center p-2 flex-column flex-md-row my-2 rounded-5 match-details-content-player lvl1-color">
					<div class="col m-player-img-wrapper order-1 order-md-2 ms-md-2 ms-0 position-relative d-flex justify-content-center overflow-hidden border border-2 rounded-circle">
						<img class="m-player-img position-absolute img-fluid w-100 h-100" src="${player.picture}" alt="">
					</div>
					<div class="row col order-2 order-md-1 justify-content-center align-items-center flex-column w-auto m-player-info">
						<div class="col p-0 text-center text-md-end">
							<span class="m-player-name m-truncated-text-width fw-semibold text-truncate d-block">${player.name}</span>
						</div>
						<div class="col p-0 text-center text-md-end">
							<span class="m-player-position m-truncated-text-width text-muted text-truncate d-block i18">${getPlayerPosition(player.playerPosition)}</span>
						</div>
						<div class="col p-0 text-center text-md-end">
							<span class="m-player-number m-truncated-text-width text-muted text-truncate d-block">${player.number}</span>
						</div>
					</div>
				</div>
			`)
		})

		coachTeam1Content.insertAdjacentHTML('beforeend', `
			<div class="row row-cols-1 row-cols-md-2 align-items-center p-2 flex-column flex-md-row my-2 rounded-5 lvl2-color match-details-content-coach">
				<div class="col m-player-img-wrapper me-md-2 me-0 position-relative d-flex justify-content-center overflow-hidden border border-2 rounded-circle">
					<img class="m-player-img position-absolute img-fluid w-100 h-100" src="${coachTeam1.picture}" alt="">
				</div>
				<div class="row col justify-content-center align-items-center flex-column w-auto m-player-info">
					<div class="col p-0 text-center text-md-start">
						<span class="m-player-name m-truncated-text-width fw-semibold text-truncate d-block">${coachTeam1.name}</span>
					</div>
					<div class="col p-0 text-center text-md-start">
						<span class="m-player-position m-truncated-text-width text-muted text-truncate d-block i18">${i18next.t("Tecnico")}</span>
					</div>
				</div>
			</div>
		`)

		coachTeam2Content.insertAdjacentHTML('beforeend', `
			<div class="row row-cols-1 row-cols-md-2 align-items-center p-2 flex-column flex-md-row my-2 rounded-5 lvl2-color match-details-content-coach">
				<div class="col m-player-img-wrapper order-1 order-md-2  me-md-2 me-0 position-relative d-flex justify-content-center overflow-hidden border border-2 rounded-circle">
					<img class="m-player-img position-absolute img-fluid w-100 h-100" src="${coachTeam2.picture}" alt="">
				</div>
				<div class="row col order-2 order-md-1 justify-content-center align-items-center flex-column w-auto m-player-info">
					<div class="col p-0 text-center text-md-end">
						<span class="m-player-name m-truncated-text-width fw-semibold text-truncate d-block">${coachTeam2.name}</span>
					</div>
					<div class="col p-0 text-center text-md-end">
						<span class="m-player-position m-truncated-text-width text-muted text-truncate d-block i18">${i18next.t("Tecnico")}</span>
					</div>
				</div>
			</div>
		`)
				
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
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		}
	}

	const woEndMatch = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('PUT'),
			response = await executarFetch(`matches/${match.id}/teams/${teamId}/wo`, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoWO"))
			setTimeout(() => {
				window.location.reload()
			}, 2000)
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
			loader.show()
			window.location.reload()
			loader.hide()
		}
	}

	const startPenaltyShootout = async () => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('PUT'),
			response = await executarFetch(`matches/${match.id}/penalties`, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoStartPenaltyShootout"))
			loader.show()
			window.location.reload()
			loader.hide()
		}
	}

	const isExtraElegible = async () => {
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

	const isPenaltyShootout = () => {
		if (match.isSoccer) {
			return (match.penalties) ? true : false
		}
	}

	const isOvertime = () => {
		if (match.isSoccer) {
			return (match.prorrogation) ? true : false
		}
	}

	const hasMatchEnded = async () => {
		const 
			dataMatch = await executarFetch(`matches/${matchId}`, configuracaoFetch('GET')),
			match = dataMatch.results

		if (match.isSoccer) {
			if (match.finished) {
				return true
			} else {
				return false
			}
		}
	}

	const loadEvents = async () => {
		// Clear blurwall 
		eventsWrapperTeam1.innerHTML = ''
		eventsWrapperTeam2.innerHTML = ''

		const
			matchEvents = await executarFetch(`matches/${matchId}/get-all-events`, configuracaoFetch('GET')),
			matchEventsResults = matchEvents.results

		const isTeam1 = teamId => {
			return teamId == match.homeId
		}

		const isTeam2 = teamId => {
			return teamId == match.visitorId
		}

		// Loop through the array
		matchEventsResults.forEach(event => {		
			let eventData = ''	
			let eventIllustration = ''	

			let eventPlayer

			if (match.isSoccer) {
				if (event.goal) {
					if (event.ownGoal) {
						eventData = `
							<div class="event-type"><span class="text-muted text-truncate i18" key="GolContra">${i18next.t("GolContra")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-time"><span class="text-muted">${event.minutes}"</span></div>
						`

						eventIllustration = `
							<img src="../icons/sports_soccer_red.svg" alt="">
						`
					} else {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Gol">${i18next.t("Gol")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-time"><span class="text-muted">${event.minutes}"</span></div>
						`

						eventIllustration = `
							<img src="../icons/sports_soccer.svg" alt="">
						`
					}
				} else if (event.foul) {
					eventData = `
						<div class="event-type"><span class="text-muted i18" key="Falta">${i18next.t("Falta")}</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">${event.minutes}"</span></div>
					`

					if (!event.yellowCard) {
						eventIllustration = `
							<img src="../icons/red_card.svg" alt="">
						`
					} else if (event.yellowCard) {
						eventIllustration = `
							<img src="../icons/yellow_card.svg" alt="">
						`
					}
				} else if (event.penalty) {
					if(event.converted) {
						eventData = `							
							<div class="event-type"><span class="text-muted i18" key="Penalti">${i18next.t("Penalti")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-desc"><span class="text-muted">${i18next.t("ScoredPenalty")}</span></div>
						`

						eventIllustration = `
							<img src="../icons/sports_penalty.png" alt="">
						`
					} else {
						eventData = `
							<div class="event-type"><span class="text-muted i18" key="Penalti">${i18next.t("Penalti")}</span></div>
							<i class="bi bi-dot"></i>
							<div class="event-desc"><span class="text-muted">${i18next.t("MissedPenalty")}</span></div>
						`

						eventIllustration = `
							<img src="../icons/sports_missed_penalty.png" alt="">
						`
					}
				}
			} else {
				if (event.goal) {
					eventData = `
						<div class="event-type"><span class="text-muted i18" key="Ponto">${i18next.t("Ponto")}</span></div>
					`

					eventIllustration = `
						<img src="../icons/sports_volleyball.svg" alt="">
					`
				}
			}


			let eventTemplate = `
				<div class="row row-cols-md-2 row-cols-1 p-3 my-2 match-details-content-event lvl2-color align-items-center rounded-5">
					<div class="col">
						<div class="row flex-column">
							<div class="col event-player-name"><span class="fw-semibold text-truncate text-center text-md-start m-truncated-text-width d-block">${event.name}</span></div>
							${(event.goal) ?
								(event.assisterName != null) ? `
									<div class="col event-player-name"><span class="fw-semibold text-center opacity-75 text-md-start m-truncated-text-width text-truncate fs-6 d-block">${event.assisterName}</span></div>
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
				if (match.isSoccer && event.goal && event.ownGoal) {
					eventsWrapperTeam2.insertAdjacentHTML('beforeend', eventTemplate)

					eventsWrapperTeam1.insertAdjacentHTML('beforeend', `
						<div class="row w-auto blank-space"></div>
					`)
				} else {		
					eventsWrapperTeam1.insertAdjacentHTML('beforeend', eventTemplate)

					eventsWrapperTeam2.insertAdjacentHTML('beforeend', `
						<div class="row w-auto blank-space"></div>
					`)
				}
			} else if (isTeam2(event.teamId)) {
				if (match.isSoccer && event.goal && event.ownGoal) {
					eventsWrapperTeam1.insertAdjacentHTML('beforeend', eventTemplate)

					eventsWrapperTeam2.insertAdjacentHTML('beforeend', `
						<div class="row w-auto blank-space"></div>
					`)
				} else {
					eventsWrapperTeam2.insertAdjacentHTML('beforeend', eventTemplate)

					eventsWrapperTeam1.insertAdjacentHTML('beforeend', `
						<div class="row w-auto blank-space"></div>
					`)
					}
			}

			blankSpaceSetter()

		})
	}

	const hasDateArrived = () => {
		const matchDate = new Date(match.date)
		const currentDate = new Date()

		return (matchDate < currentDate) ? true : false
	}

	async function carregarPartida() {
		if (!(isMatchConfigured()) || !(hasDateArrived())) {
			blurWallEvents.classList.remove('d-none')

			// Placeholder blurwall - Team 1
			eventsWrapperTeam1.innerHTML = `
				<div class="row flex-column p-3 my-2 match-details-content-event lvl2-color rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event lvl2-color rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event lvl2-color rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../icons/sports_soccer.svg" alt="">
					</div>
				</div>
			`

			// Placeholder blurwall - Team 2
			eventsWrapperTeam2.innerHTML = `
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event lvl2-color rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row flex-column p-3 my-2 match-details-content-event lvl2-color rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
				<div class="row flex-column p-3 my-2 match-details-content-event lvl2-color rounded-5 position-relative">
					<div class="col event-player-name"><span class="fw-semibold text-truncate d-block">Goal Maker</span></div>
					<div class="col d-flex flex-row event-data">
						<div class="event-type"><span class="text-muted">Gol</span></div>
						<i class="bi bi-dot"></i>
						<div class="event-time"><span class="text-muted">"32</span></div>
					</div>
					<div class="col position-absolute w-auto h-auto event-illustration">
						<img src="../icons/sports_soccer.svg" alt="">
					</div>
				</div>
				<div class="row blank-space"></div>
			`

			if (!hasDateArrived()) {
				blurWallEvents.insertAdjacentHTML('beforeend', `
					<div class="w-100 text-center my-3">
						<span class="i18" key="DataPartidaNaoChegou">${i18next.t("DataPartidaNaoChegou")}</span>
					</div>
				`)
			}

			if (!isMatchConfigured()) {
				if (!isMatchOrganizer()) {
					blurWallEvents.insertAdjacentHTML('beforeend', `
						<div id="blurwall-message-user" class="w-75 text-center">
							<span class="blurwall-message-user-text i18 fs-4 fw-semibold" key="BlurwallMessageUserText">${i18next.t("BlurwallMessageUserText")}</span>
						</div>
					`)
				} else {
					blurWallEvents.insertAdjacentHTML('beforeend', `
						<div id="blurwall-message-organizer" class="w-75 text-center">
							<div>
								<span class="blurwall-message-organizer-text i18 fs-4 fw-semibold" key="BlurwallMessageOrganizerText">${i18next.t("BlurwallMessageOrganizerText")}</span>
							</div>
							<br>
							<div>
								<button id="configure-match-btn" class="btn lvl3-color"><span class="i18" key="ConfigurarPartida">${i18next.t("ConfigurarPartida")}</span></button>
							</div>
						</div>
					`)
	
	
					const configureMatchBtn = document.getElementById('configure-match-btn')
	
					configureMatchBtn.addEventListener('click', () => {
						window.location.href = `../pages/tabela-chaveamento.html?id=${match.championshipId}`
					})
				}
			}

			blankSpaceSetter()
		} else if (isMatchConfigured() && hasDateArrived()) {

			if (match.finished) {
				matchReportAccess.insertAdjacentHTML('afterbegin', `
					<div id="match-ended-alert" class="text-center">
						<span class="i18" key="MatchEnded">${i18next.t("MatchEnded")}</span>
					</div>
				`)
			}

			// verify if the match is over and if the match has a match report
			if (match.finished && (match.matchReport != null)) {
				matchReportAccess.insertAdjacentHTML('beforeend', `
					<div class="row justify-content-center align-items-center">
						<div class="col-auto">
							<a href="javascript:void(0)" class="d-none text-decoration-none" id="download-match-report-link">
								<button id="download-match-report-btn" class="btn btn-outline-dark rounded-pill"><span class="i18" key="DownloadMatchReport">${i18next.t("DownloadMatchReport")}</span></button>
							</a>
						</div>
					</div>
				`)

				downloadMatchReportBtn = document.getElementById('download-match-report-btn')
				downloadMatchReportLink = document.getElementById('download-match-report-link')

				downloadMatchReportLink.setAttribute('href', match.matchReport)	

				downloadMatchReportLink.classList.remove('d-none')
			}

			if (isMatchOrganizer()) {
				manageMatchBtn.classList.remove('d-none')

				if (!match.finished) {
					matchManagementSystem()
				} else if (match.isSoccer && match.finished) {
					endMatchManagementSystem()
				}
			}

			loadEvents()			
		}

		listPlayers()
		loadScoreboard()
		
		if (match.isSoccer && isExtraElegible() && isPenaltyShootout()) {
			penaltiesScoreWrapper.classList.remove('d-none')
			loadPenaltiesScoreboard()
		}
	}

	const blankSpaceSetter = () => {
		const blankSpaces = document.getElementsByClassName('blank-space')
		const matchDetailsContentEvent = document.querySelector('.match-details-content-event')
		
		const eventHeight = matchDetailsContentEvent.offsetHeight
		const eventWidth = matchDetailsContentEvent.offsetWidth

		if (window.innerWidth < 768) {
			for(const blankSpace of blankSpaces) {
				blankSpace.style.height = `${eventWidth + 15}px`
			} 
		} else {
			for(const blankSpace of blankSpaces) {
				blankSpace.style.height = `${eventHeight + 15}px`
			}
		}
	}

    const 
        matchDetailsOptions = document.getElementById('match-details-options'),
        abaBotoes = matchDetailsOptions.children,
        menuConfig = document.getElementsByClassName('menu-config'),
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
		matchReportAccess = document.getElementById('match-report-access'),
		extraManagement = document.getElementById('extra-management'),
		woTeamForm = document.getElementById('wo-team-form'),
		mensagemErro = document.getElementById("mensagem-erro"),
		penaltiesScoreWrapper = document.getElementById('penalties-score-wrapper')

	
	let downloadMatchReportBtn = null
	let downloadMatchReportLink = null

	let thereIsAnything = false


	loader.show()
	const 
		dataMatch = await executarFetch(`matches/${matchId}`, configuracaoFetch('GET')),
		match = dataMatch.results
	
	let validPlayersTeam1 = await getValidPlayers(match.homeId)
	let validPlayersTeam2 = await getValidPlayers(match.visitorId)

	const dataTeam1 = await executarFetch(`teams/${match.homeId}`, configuracaoFetch('GET')),
		team1 = dataTeam1.results

	const dataTeam2 = await executarFetch(`teams/${match.visitorId}`, configuracaoFetch('GET')),
		team2 = dataTeam2.results

	const coachTeam1 = team1.technician
	const coachTeam2 = team2.technician

	const
		dataAllPlayersTeam1 = await executarFetch(`teams/${match.homeId}/players`, configuracaoFetch('GET')),
		allPlayersTeam1 = dataAllPlayersTeam1.results

	const 
		dataAllPlayersTeam2 = await executarFetch(`teams/${match.visitorId}/players`, configuracaoFetch('GET')),
		allPlayersTeam2 = dataAllPlayersTeam2.results

	const
		dataCampeonato = await executarFetch(`championships/${match.championshipId}`, configuracaoFetch('GET')),
		campeonato = dataCampeonato.results

	const
		allEvents = await executarFetch(`matches/${matchId}/get-all-events`, configuracaoFetch('GET')),
		allEventsResults = allEvents.results

		console.log(match);
	loader.hide()

    for (const configMenuOption of abaBotoes) {
		configMenuOption.addEventListener('click', () => {
			activateLi(configMenuOption)
			changeConfigOptionsContext(configMenuOption.getAttribute('menu'))
		})
	}

    changeConfigOptionsContext(0)
	await carregarPartida()
	window.dispatchEvent(new Event('pagina-load'))
}

document.addEventListener('header-carregado', init)
