import '../scss/configuracao-usuarios.scss'
import '../scss/configuracao-time.scss'
import '../scss/pagina-times.scss'
import JustValidate from 'just-validate'
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import flatpickr from "flatpickr"
import { exibidorImagem } from './utilidades/previewImagem.js'
import { uploadImagem } from './utilidades/uploadImagem'
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import portugues from './i18n/ptbr/configuracao-time.json' assert { type: 'JSON' }
import ingles from './i18n/en/configuracao-time.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const init = async () => {
	const activateLi = (li) => {
		for (const item of abaBotoes) {
			item.classList.remove('active')
		}

		li.classList.add('active')
	}

	const changeConfigOptionsContext = (menuSelecionado) => {
		for (const menu of menuConfig)
			menu.classList.toggle('d-none', menu.getAttribute('menu') != menuSelecionado)
	}

	const inicializarCampos = () => {
		const image = document.getElementById('config-team-pic-mod'),
			imageFile = document.getElementById('config-team-image-input'),
			imageInput = document.getElementById('config-imagem-input-hidden'),
			name = document.getElementById('config-team-name-input'),
			// descricao = document.getElementById('config-team-descricao-input'),
			esporte = document.getElementById('config-team-esporte-input'),
			form = document.getElementById('update-profile-form')
			// quantidadeJogadores = document.getElementById('quantidade-jogadores')



		image.src = team.emblem
		imageInput.value = team.emblem
		name.value = team.name
		// descricao.value = team.description

		// quantidadeJogadores.value = team.numberOfPlayers
		esporte.selectedIndex = team.sportsId - 1

		const validator = new JustValidate(form, {
			validateBeforeSubmitting: true,
		})

		// esporte.addEventListener("change", () => {
		// 	if (esporte.value === "1") {
		// 		quantidadeJogadores.value = ""
		// 		quantidadeJogadores.setAttribute("min", 11)
		// 		quantidadeJogadores.setAttribute("max", 25)
		// 	} else if (esporte.value === "2") {
		// 		quantidadeJogadores.value = ""
		// 		quantidadeJogadores.setAttribute("min", 6)
		// 		quantidadeJogadores.setAttribute("max", 15)
		// 	}

		// 	if (esporte.value) {
		// 		quantidadeJogadores.value = ""
		// 		quantidadeJogadores.disabled = false;
		// 		quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholder")
		// 		quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholder"))
		// 	} else {
		// 		quantidadeJogadores.value = ""
		// 		quantidadeJogadores.disabled = true;
		// 		quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholderDisabled")
		// 		quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholderDisabled"))
		// 	}
		// })

		// quantidadeJogadores.addEventListener("change", () => {
		// 	if (esporte.value === "1") {
		// 		if (quantidadeJogadores.value < 11 || quantidadeJogadores.value > 25) {
		// 			quantidadeJogadores.value = 11
		// 		}
		// 	} else if (esporte.value === "2") {
		// 		if (quantidadeJogadores.value < 6 || quantidadeJogadores.value > 15) {
		// 			quantidadeJogadores.value = 6
		// 		}
		// 	}
		// })

		function validator1() {
			validator
				.addField(name, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="NomeTimeObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
					},
					{
						rule: 'minLength',
						value: 4,
						errorMessage: `<span class="i18" key="NomeTimeMinimo">${i18next.t("NomeTimeMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 40,
						errorMessage: `<span class="i18" key="NomeTimeMaximo">${i18next.t("NomeTimeMaximo")}</span>`,
					},
				])
				.addField(imageFile, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="BrasaoObrigatorio">${i18next.t("BrasaoObrigatorio")}</span>`,
					},
					{
						rule: 'files',
						value: {
							files: {
								extensions: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
								maxSize: 5000000,
								types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
							},
						},
						errorMessage: `<span class="i18" key="ImagemTamanho">${i18next.t("ImagemTamanho")}</span>`,
					}
				], { errorsContainer: document.getElementById('imagem-erro-jv') })
				// .addField(descricao, [
				// 	{
				// 		rule: 'required',
				// 		errorMessage: `<span class="i18" key="DescricaoObrigatoria">${i18next.t("DescricaoObrigatoria")}</span>`,
				// 	},
				// 	{
				// 		rule: 'minLength',
				// 		value: 10,
				// 		errorMessage: `<span class="i18" key="DescricaoMinimo">${i18next.t("DescricaoMinimo")}</span>`,
				// 	},
				// 	{
				// 		rule: 'maxLength',
				// 		value: 2000,
				// 		errorMessage: `<span class="i18" key="DescricaoMaximo">${i18next.t("DescricaoMaximo")}</span>`,
				// 	},
				// ])
				// .addField(quantidadeJogadores, [
				// 	{
				// 		rule: 'required',
				// 		errorMessage: `<span class="i18" key="QuantidadeJogadoresObrigatorio">${i18next.t("QuantidadeJogadoresObrigatorio")}</span>`,
				// 	},
				// 	{
				// 		validator: (value) => {
				// 			if (esporte.value == "2") {
				// 				return value >= 6 && value <= 15
				// 			} else if (esporte.value == "1") {
				// 				return value >= 11 && value <= 25
				// 			}
				// 		},
				// 		errorMessage: `<span class="i18" key="QuantidadeJogadoresInvalido">${i18next.t("QuantidadeJogadoresInvalido")}</span>`,
				// 	},
				// ])
				.onSuccess(async (e) => {
					e.preventDefault()
					// console.log('hello world')
					// limparMensagem(mensagemErro)

					loader.show()
					await putTeam({
						"name": name.value,
						"emblem": imageInput.value,
						// "description": descricao.value,
						'id': teamId,
						'sportsId': team.sportsId,
						// "NumberOfPlayers": parseInt(quantidadeJogadores.value)
					})
					loader.hide()
					// mensagemErro.textContent = ''
				})

			imageFile.addEventListener("change", async () => {
				const isValid = await validator.revalidateField(imageFile)
				if (!isValid) return;

				loader.show()
				const data = await uploadImagem(imageFile, 0, mensagemErro)
				loader.hide()

				if (Array.isArray(data.results))
					return;

				imageInput.value = `${api}img/${data.results}`
				exibidorImagem(image, imageInput.value)
			})
		}
		document.addEventListener('nova-lingua', validator1)
		validator1()
	}

	const putTeam = async body => {
		const callbackServidor = data => {
			mensagemErro.classList.add("text-danger")
			data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
		}

		const data = await executarFetch('teams', configuracaoFetch("PUT", body), callbackServidor, callbackServidor)
		if (!data) return false

		limparMensagem(mensagemErro)
		notificacaoSucesso(data.results[0])
	}

	const vincularJogador = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('POST', { 'teamId': teamId, 'championshipId': parseInt(teamId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) notificacaoSucesso(i18next.t("VinculadoSucesso"))
	}

	const desvincularJogador = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE', { 'teamId': teamId, 'championshipId': parseInt(teamId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
		}
	}

	const listarJogadoresVinculados = async configFetch => {
		loader.show()
		const jogadoresVinculadosWrapper = document.getElementById('jogadores-vinculados'),
			jogadoresVinculados = await executarFetch(`championships/teams?championshipId=${teamId}`, configFetch)

		loader.hide()

		// jogadoresVinculadosWrapper.innerHTML = ''

		if (jogadoresVinculados.results.length >= 1) {
			// jogadoresVinculadosWrapper.innerHTML = `<p><span class="i18" key="SemJogadores">${i18next.t("SemTimes")}</span></p>`
			// return;
			jogadoresVinculadosWrapper.parentElement.classList.remove('d-none')
		}

		for (const jogador of jogadoresVinculados.results) {
			jogadoresVinculadosWrapper.innerHTML +=
				`
				<div class="d-flex w-100 rounded-5 mb-3 mt-5 mt-md-0 ss-list-player-content">

					<div class="position-relative m-3 overflow-hidden rounded-circle ss-player-image">
						<img src="${jogador.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
					</div>

					<span>
						<p class="mt-3 ss-player-name w-100 fs-5 text-nowrap text-truncate d-block">${jogador.name}</p>
						<p class="ss-player-username w-100 fs-6 opacity-75 text-nowrap text-truncate d-block">${jogador.nickname}</p>
					</span>

					<div class="d-flex align-items-center ms-auto me-3">
						<div class="delete-listed-player rounded-4 remover-vinculo-campeonato bg-danger d-flex"><i class="bi bi-trash text-light fs-5 m-auto"></i></div>
					</div>
				</div>
			`
			const botaoDesvincular = document.querySelector('.delete-listed-player')
			botaoDesvincular.addEventListener('click', async () => {
				await desvincularJogador(jogador.id)
				await listarJogadoresVinculados(configFetch)
			})
		}
	}

	const inicializarPaginaJogadores = async () => {
		const botaoVincular = document.getElementById('botao-vincular-jogador'),
			pesquisaWrapper = document.getElementById('pesquisa-jogador'),
			inputPesquisa = document.getElementById('pesquisa-jogador-input'),
			datalistPesquisa = document.getElementById('pesquisa-jogador-lista'),
			configFetch = configuracaoFetch('GET')

		await listarJogadoresVinculados(configFetch)

		const exibirPesquisa = botaoVincular.onclick = () => {
			pesquisaWrapper.classList.toggle('d-none')
			botaoVincular.innerHTML = `<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>`
			botaoVincular.onclick = () => {
				botaoVincular.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarNovoJogador">${i18next.t("AdicionarNovoJogador")}</span>`
				pesquisaWrapper.classList.toggle('d-none')
				document.getElementById('playerStep').innerHTML = ''
				botaoVincular.onclick = exibirPesquisa
			}
		}

		inputPesquisa.addEventListener('input', async () => {
			if (!inputPesquisa.value) {
				datalistPesquisa.innerHTML = ''
				document.getElementById('playerStep').innerHTML = ''
				return;
			}
			const valor = inputPesquisa.value,
				response = await executarFetch(`teams?query=${valor}&sport=${team.sportsId}`, configFetch),
				jogadores = response.results


			datalistPesquisa.innerHTML = ''
			for (const jogador of jogadores) {
				const newOption = document.createElement('li');
				newOption.classList.add('list-group-item', 'bg-verde-limao', 'rounded-5', 'p-3', 'd-flex', 'justify-content-between', 'align-items-center')
				newOption.innerHTML =
					`
					<div class="d-inline-flex align-items-center">
						<div class="position-relative m-auto p-0 overflow-hidden rounded-4 me-2 img-listagem-players">
							<img id="playerListPic" src="${jogador.emblem}" alt="Pic" class="img-fluid position-absolute w-100 h-100">
						</div>
						<p id="playerListName" class="m-auto">${jogador.name}</p>
					</div>
				`
				// const botao = document.createElement('button')
				const addPlayerStep = document.createElement('button')
				addPlayerStep.classList.add('btn', 'btn-primary')
				addPlayerStep.setAttribute('type', 'button')
				addPlayerStep.innerHTML = `<i class="bi bi-chevron-right"></i>`

				addPlayerStep.addEventListener('click', async e => {
					document.getElementById('playerStep').innerHTML = `
						<div class="card bg-verde-limao p-2 border-0">
							<div class="card-body row">
								<div class="col-12">
									<div class="position-relative mx-auto mb-3 p-0 overflow-hidden rounded-circle img-player-step">
										<img id="playerListPic" src="${jogador.emblem}" alt="Pic" class="img-fluid position-absolute w-100 h-100">
									</div>
									<h6 id="playerListName" class="text-center mb-3">${jogador.name}</h6>
								</div>
								<hr>
								<div class="col">
									<form id="vincularJogadorForm">
										<div class="mb-3">
											<div class="form-check">
												<input class="form-check-input" type="checkbox" value="" id="isCaptain">
												<label class="form-check-label" for="flexCheckDefault">
													<span class="i18" key="Capitao">${i18next.t("Capitao")}</span>
												</label>
											</div>
										</div>
										<div class="mb-3">
											<label for="fantasyName" class="form-label">
												<span class="i18" key="NomeFantasia">${i18next.t("NomeFantasia")}</span>
											</label>
											<input type="text" class="form-control i18-placeholder" key="NomeFantasiaPlaceholder" id="fantasyName" placeholder="${i18next.t("NomeFantasiaPlaceholder")}">
										</div>
										<div class="mb-3">
											<label for="playerNumber" class="form-label">
												<span class="i18" key="NumeroJogador">${i18next.t("NumeroJogador")}</span>
											</label>
											<input type="number" class="form-control i18-placeholder" key="NumeroJogadorPlaceholder" id="playerNumber" placeholder="${i18next.t("NumeroJogadorPlaceholder")}">
										</div>
										<button type="submit" class="btn btn-primary i18 mx-auto d-block" key="AddJogador">${i18next.t("AddJogador")}</button>
									<form>
								</div>
							</div>
						</div>
					`

					const isCaptain = document.getElementById('isCaptain')
					const fantasyName = document.getElementById('fantasyName')
					const playerNumber = document.getElementById('playerNumber')

					const validatorPlayerStep = new JustValidate('#vincularJogadorForm', { validateBeforeSubmitting: true })
					
					validatorPlayerStep
						.addField(fantasyName, [
							{
								rule: 'required',
								errorMessage: `<span class="i18" key="NomeFantasiaObrigatorio">${i18next.t("NomeFantasiaObrigatorio")}</span>`,
							},
							{
								rule: 'minLength',
								value: 4,
								errorMessage: `<span class="i18" key="NomeFantasiaMinimo">${i18next.t("NomeFantasiaMinimo")}</span>`,
							},
							{
								rule: 'maxLength',				
								value: 40,
								errorMessage: `<span class="i18" key="NomeFantasiaMaximo">${i18next.t("NomeFantasiaMaximo")}</span>`,
							},
						])
						.addField(playerNumber, [
							{
								rule: 'required',
								errorMessage: `<span class="i18" key="NumeroJogadorObrigatorio">${i18next.t("NumeroJogadorObrigatorio")}</span>`,
							},
							{
								rule: 'minLength',
								value: 1,
								errorMessage: `<span class="i18" key="NumeroJogadorMinimo">${i18next.t("NumeroJogadorMinimo")}</span>`,
							},
							{
								rule: 'maxLength',
								value: 3,
								errorMessage: `<span class="i18" key="NumeroJogadorMaximo">${i18next.t("NumeroJogadorMaximo")}</span>`,
							},
						])
						.onSuccess(async (e) => {
							e.preventDefault()
							const body = {
								'playerId': jogador.id,
								'teamId': teamId,
								'isCaptain': isCaptain.checked,
								'fantasyName': fantasyName.value,
								'playerNumber': playerNumber.value,
							}

							const configFetch = configuracaoFetch('POST', body),
								response = await executarFetch('teams/players', configFetch)

							if (response.succeed) {
								notificacaoSucesso(i18next.t("JogadorVinculadoSucesso"))
								await listarJogadoresVinculados(configFetch)
							}
						})
				})

				newOption.appendChild(addPlayerStep)
				datalistPesquisa.appendChild(newOption)
			}

		})
	}

	const inicializarPaginaExclusao = async () => {
		const formDeletarTime = document.getElementById('delete-team-form'),
			deleteAccountValidator = new JustValidate(formDeletarTime, { validateBeforeSubmitting: true }),
			teamInput = document.getElementById('delete-team-name-input'),
			username = document.getElementById('offcanvasUserName')

		function validor2() {
			deleteAccountValidator
				.addField(usernameInput, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
					},
					{
						validator: (value) => username.textContent == value,
						errorMessage: `<span class="i18" key="NomeUsuarioIncorreto">${i18next.t("NomeTimeIncorreto")}</span>`
					}
				])
				// submit
				.onSuccess(async (e) => {
					e.preventDefault()
					loader.show()
					const configFetch = configuracaoFetch('DELETE'),
						response = await executarFetch(`team/${teamId}`, configFetch)

					loader.hide()

					if (response.succeed) {
						window.location.assign('/index.html');
					}
				})
		}

		document.addEventListener('nova-lingua', validor2)
		validor2()

	}

	//#region coisas chatas

	const configMenu = document.querySelector('.config-menu'),
		configMenuList = document.getElementById('config-menu-list'),
		abaBotoes = configMenuList.children,
		// configTitle = document.querySelector('.config-title'),
		mediaQueryMobile = window.matchMedia('(max-width: 575px)'),
		menuConfig = document.getElementsByClassName('menu-config'),
		mensagemErro = document.getElementById('mensagem-erro'),
		teamId = document.getElementById('usernameTeamManagementId').textContent

	loader.show()
	const dados = await executarFetch(`teams/${teamId}`, configuracaoFetch('GET')),
		team = dados.results
	loader.hide()

	if (mediaQueryMobile.matches) {
		configMenu.parentElement.classList.add('justify-content-center')
		configMenu.classList.add('mb-0')
	}

	for (const configMenuOption of abaBotoes) {
		configMenuOption.addEventListener('click', () => {
			activateLi(configMenuOption)
			changeConfigOptionsContext(configMenuOption.getAttribute('menu'))
		})
	}

	changeConfigOptionsContext(0)
	inicializarCampos()
	await inicializarPaginaJogadores()
	await inicializarPaginaExclusao()
	//#endregion
}


document.addEventListener('header-carregado', init)
