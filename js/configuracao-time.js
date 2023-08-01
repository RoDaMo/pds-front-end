import '../scss/configuracao-usuarios.scss'
import '../scss/configuracao-time.scss'
import '../scss/pagina-times.scss'
import JustValidate from 'just-validate'
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
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
			esporte = document.getElementById('config-team-esporte-input'),
			form = document.getElementById('update-profile-form'),
			home = document.getElementById("home"),
			homeInput = document.getElementById("uniforme-casa"),
			homeFile = document.getElementById("uniforme-1"),
			away = document.getElementById("away"),
			awayInput = document.getElementById("uniforme-fora"),
			awayFile = document.getElementById("uniforme-2")



		image.src = team.emblem
		imageInput.value = team.emblem
		name.value = team.name
		home.src = team.uniformHome
		away.src = team.uniformAway
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
				.onSuccess(async (e) => {
					e.preventDefault()

					loader.show()
					const resultado = await putTeam({
						'id': teamId,
						"emblem": imageInput.value,
						"uniformHome": document.getElementById("uniforme-1").value ? document.getElementById("uniforme-1").value : document.getElementById("home").src,
						"uniformAway": document.getElementById("uniforme-2").value ? document.getElementById("uniforme-2").value : document.getElementById("away").src,
						'sportsId': esporte.value.toString(),
						"name": name.value,
					})

					console.log(resultado)
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

			homeInput.addEventListener("change", async () => {
				loader.show()
				const data = await uploadImagem(homeInput, 3, mensagemErro)
				loader.hide()

				if (Array.isArray(data.results))
					return;

				homeFile.value = `${api}img/${data.results}`
				exibidorImagem(home, homeFile.value)
			})

			awayInput.addEventListener("change", async () => {

				loader.show()
				const data = await uploadImagem(awayInput, 3, mensagemErro)
				loader.hide()

				if (Array.isArray(data.results))
					return;

				awayFile.value = `${api}img/${data.results}`
				exibidorImagem(away, awayFile.value)
			})
		}
		document.addEventListener('nova-lingua', validator1)
		validator1()
	}

	const putTeam = async body => {
		console.log(body)
		const callbackServidor = data => {
			mensagemErro.classList.add("text-danger")
			data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
		}

		const data = await executarFetch('teams', configuracaoFetch("PUT", body), callbackServidor, callbackServidor)
		console.log(data)
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

	const desvincularJogador = async playerId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE'),
			response = await executarFetch(`players/${playerId}`, configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
		}
	}

	const desvincularCampeonato = async championshipId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE', {'championshipId': parseInt(championshipId), 'teamId': parseInt(teamId),  }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)
		console.log(response)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
		}
	}

	const listarJogadoresVinculados = async () => {
		loader.show()
		const jogadoresVinculadosWrapper = document.getElementById('jogadores-vinculados'),
			jogadoresVinculados = await executarFetch(`teams/${team.id}/players`, configuracaoFetch("GET"))

		loader.hide()

		console.log(jogadoresVinculados)

		jogadoresVinculadosWrapper.innerHTML = ''

		if (jogadoresVinculados.results.length >= 1) {
			// jogadoresVinculadosWrapper.innerHTML = `<p><span class="i18" key="SemJogadores">${i18next.t("SemTimes")}</span></p>`
			// return;
			jogadoresVinculadosWrapper.parentElement.classList.remove('d-none')
		}

		for (const jogador of jogadoresVinculados.results) {
			const jogadoresVinculadosContent = document.createElement('div');
			jogadoresVinculadosContent.classList.add('d-flex', 'w-100', 'rounded-5', 'mb-3', 'mt-5', 'mt-md-0', 'ss-list-player-content')
			
			jogadoresVinculadosContent.innerHTML = /*html*/`
				<div class="d-flex w-100 rounded-5 mb-3 mt-md-0 ss-list-player-content">
					<div class="position-relative m-3 me-2 overflow-hidden rounded-circle ss-player-image">
						<img src="${jogador.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
					</div>

					<span class="text-start">
						<p class="mt-3 ss-player-name w-100 fs-5 text-nowrap text-truncate d-block">${jogador.name}</p>
						<p class="ss-player-username w-100 fs-6 opacity-75 text-nowrap text-truncate d-block">${jogador.artisticName}</p>
					</span>
				</div>

			`

			const botaoDesvincularWrapper = document.createElement('div')
			botaoDesvincularWrapper.classList.add('d-flex', 'align-items-center', 'ms-auto', 'me-3')
			botaoDesvincularWrapper.innerHTML = `<button type="button" class="delete-listed-player rounded-4 remover-vinculo-campeonato btn btn-danger d-flex"><i class="bi bi-trash text-light fs-5 m-auto"></i></button>`
			
			jogadoresVinculadosContent.appendChild(botaoDesvincularWrapper)
			jogadoresVinculadosWrapper.appendChild(jogadoresVinculadosContent)

			botaoDesvincularWrapper.addEventListener('click', async e => {
				await desvincularJogador(jogador.id)
				await listarJogadoresVinculados()
			})

			if(mediaQueryMobile.matches) {
				document.querySelectorAll('.ss-player-name').forEach(element => {
					element.classList.remove('fs-5')
				})
			}
		}
	}

	const listarCampeonatosVinculados = async configFetch => {
		loader.show()
		const campeonatosVinculadosWrapper = document.getElementById('campeonatos-vinculados'),
			campeonatosVinculados = await executarFetch(`teams/championship/${teamId}`, configFetch)

		loader.hide()

		console.log(campeonatosVinculados)

		campeonatosVinculadosWrapper.innerHTML = ''

		if (!campeonatosVinculadosWrapper.hasChildNodes()) {
			campeonatosVinculadosWrapper.innerHTML = `<p class="p-5 text-center"><span class="i18" key="SemCampeonatos">${i18next.t("SemCampeonatos")}</span></p>`
			return;
		}

		for (const campeonato of campeonatosVinculados.results) {
			const campeonatosVinculadosContent = document.createElement('div');
			campeonatosVinculadosContent.classList.add('d-flex', 'w-100', 'rounded-5', 'mb-3', 'mt-5', 'mt-md-0', 'ss-list-player-content')

			campeonatosVinculadosContent.innerHTML = `
				<div class="d-flex w-100 rounded-5 mb-3 mt-md-0 ss-list-player-content">
					<div class="position-relative m-3 me-2 overflow-hidden rounded-circle ss-player-image">
						<img src="${campeonato.logo}" alt="champImage" class="img-fluid position-absolute mw-100 h-100">
					</div>

					<span class="text-start">
						<p class="mt-3 ss-player-name w-100 fs-5 text-nowrap text-truncate d-block">${campeonato.name}</p>
					</span>
				</div>

			`

			const botaoDesvincularWrapper = document.createElement('div')
			botaoDesvincularWrapper.classList.add('d-flex', 'align-items-center', 'ms-auto', 'me-3')
			botaoDesvincularWrapper.innerHTML = `<button type="button" class="delete-listed-player rounded-4 remover-vinculo-campeonato btn btn-danger d-flex"><i class="bi bi-trash text-light fs-5 m-auto"></i></button>`
			
			campeonatosVinculadosContent.appendChild(botaoDesvincularWrapper)
			campeonatosVinculadosWrapper.appendChild(campeonatosVinculadosContent)

			botaoDesvincularWrapper.addEventListener('click', async e => {
				await desvincularCampeonato(campeonato.id)
				await listarCampeonatosVinculados(configFetch)
			})
		}
	}

	const inicializarPaginaJogadores = async () => {
		const botaoVincular = document.getElementById('botao-vincular-jogador'),
			pesquisaWrapper = document.getElementById('pesquisa-jogador'),
			inputPesquisa = document.getElementById('pesquisa-jogador-input'),
			datalistPesquisa = document.getElementById('pesquisa-jogador-lista'),
			botaoVincularJogadorTemporario = document.getElementById("botao-vincular-jogador-temporario"),
			formularioJogadorTemporario = document.getElementById("formulario-jogador-temporario"),
			configFetch = configuracaoFetch('GET')

		await listarJogadoresVinculados()

		const exibirPesquisa = botaoVincular.onclick = () => {
			pesquisaWrapper.classList.toggle('d-none')
			botaoVincular.innerHTML = `
				<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>
			`
			
			botaoVincular.onclick = () => {
				botaoVincular.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarNovoJogador">${i18next.t("AdicionarNovoJogador")}</span>
				`
				pesquisaWrapper.classList.toggle('d-none')
				document.getElementById('playerStep').innerHTML = ''
				botaoVincular.onclick = exibirPesquisa
			}
		}

		const exibirFormJogadorTemporario = botaoVincularJogadorTemporario.onclick = () => {
			formularioJogadorTemporario.classList.toggle('d-none')
			botaoVincularJogadorTemporario.innerHTML = `
				<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>
			`

			if(team.sportsId === 1){
				document.getElementById("posicao").innerHTML = ""
				document.getElementById("posicao").innerHTML += `
					<option value="1">Goleiro</option>
					<option value="2">Zagueiro</option>
					<option value="3">Lateral</option>
					<option value="4">Volante</option>
					<option value="5">Meio-Campista</option>
					<option value="6">Meia-Atacante</option>
					<option value="7">Ala</option>
					<option value="8">Ponta</option>
					<option value="9">Centroavante</option>
				` 
			}else{
				document.getElementById("posicao").innerHTML = ""
				document.getElementById("posicao").innerHTML += `
					<option value="10">Levantador</option>
					<option value="11">Central</option>
					<option value="12">Líbero</option>
					<option value="13">Ponteiro</option>
					<option value="14">Oposto</option>
				` 
			}
			
			botaoVincularJogadorTemporario.onclick = () => {
				botaoVincularJogadorTemporario.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarNovoJogadorTemp">${i18next.t("AdicionarNovoJogadorTemp")}</span>
				`
				formularioJogadorTemporario.classList.toggle('d-none')
				botaoVincularJogadorTemporario.onclick = exibirFormJogadorTemporario
			}

			const postJogadorTemporario = async(endpoint, body) => {
				const callbackServidor = data => {
					mensagemErro.classList.add("text-danger")
					data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
				}
			
				loader.show()
				console.log(body)
				const data = await executarFetch(endpoint, configuracaoFetch("POST", body), callbackServidor, callbackServidor)
				loader.hide()
			
				if (!data) return false
			
				notificacaoSucesso(data.results[0])
				return true
			}

			document.getElementById("formulario-jogador-temporario").addEventListener("submit", async(e) => {
				console.log("form enviado")
				e.preventDefault()
				limparMensagem(mensagemErro)

				loader.show();

				const resultado = await postJogadorTemporario("playertempprofiles", {
					"name": document.getElementById("nome-jogador").value,
					"artisticName": document.getElementById("nome-artistico").value,
					"number": parseInt(document.getElementById("numero").value),
					"email": document.getElementById("email-jogador").value,
					"teamsId": parseInt(team.id),
					"playerPosition": parseInt(document.getElementById("posicao").value)
				})

				if (resultado) {
					formularioJogadorTemporario.reset()
				}

				loader.hide();

				listarJogadoresVinculados()

			})
		}

		inputPesquisa.addEventListener('input', async () => {
			if (!inputPesquisa.value) {
				datalistPesquisa.innerHTML = ''
				document.getElementById('playerStep').innerHTML = ''
				return;
			}
			const valor = inputPesquisa.value,
				response = await executarFetch(`players?query=${valor}&sport=${team.sportsId}`, configFetch),
				jogadores = response.results


			datalistPesquisa.innerHTML = ''
			for (const jogador of jogadores) {
				const newOption = document.createElement('li');
				newOption.classList.add('list-group-item', 'bg-verde-limao', 'border-0', 'mb-3', 'rounded-5', 'p-3', 'd-flex', 'justify-content-between', 'align-items-center')
				newOption.innerHTML =
					`
					<div class="d-inline-flex align-items-center">
						<div class="position-relative m-auto p-0 overflow-hidden rounded-4 me-2 img-listagem-players">
							<img id="playerListPic" src="${jogador.emblem}" alt="Pic" class="img-fluid position-absolute w-100 h-100">
						</div>
						<p id="playerListName" class="m-auto w-75 d-block text-truncate">${jogador.name}</p>
					</div>
				`
				const addPlayerStep = document.createElement('button')
				addPlayerStep.classList.add('btn', 'btn-primary', 'rounded-4')
				addPlayerStep.setAttribute('type', 'button')
				addPlayerStep.innerHTML = `<i class="bi bi-chevron-right fs-5 m-auto"></i>`

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
											<input type="number" class="form-control i18-placeholder" key="NumeroJogadorPlaceholder" id="playerNumber" min="0" placeholder="${i18next.t("NumeroJogadorPlaceholder")}">
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
							{
								rule: 'customRegexp',
								value: /^[A-Za-z0-9_-]*$/,
								errorMessage: `<span class="i18" key="NomeFantasiaInvalido">${i18next.t("NomeFantasiaInvalido")}</span>`,
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

	const inicializarPaginaCampeonatos = async () => {
		const configFetch = configuracaoFetch('GET')
		await listarCampeonatosVinculados(configFetch)
	}


	const inicializarPaginaExclusao = async () => {
		const formDeletarTime = document.getElementById('delete-team-form'),
			deleteAccountValidator = new JustValidate(formDeletarTime, { validateBeforeSubmitting: true }),
			teamInput = document.getElementById('delete-team-name-input')
			// username = document.getElementById('offcanvasUserName')

		function validor2() {
			deleteAccountValidator
				// .addField(usernameInput, [
				// 	{
				// 		rule: 'required',
				// 		errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
				// 	},
				// 	{
				// 		validator: (value) => username.textContent == value,
				// 		errorMessage: `<span class="i18" key="NomeUsuarioIncorreto">${i18next.t("NomeTimeIncorreto")}</span>`
				// 	}
				// ])
				.addField(teamInput, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="NomeTimeObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
					},
					{
						validator: (value) => team.name == value,
						errorMessage: `<span class="i18" key="NomeTimeIncorreto">${i18next.t("NomeTimeIncorreto")}</span>`
					}
				])
				// submit
				.onSuccess(async (e) => {
					e.preventDefault()
					loader.show()
					const configFetch = configuracaoFetch('DELETE'),
						response = await executarFetch(`teams/${teamId}`, configFetch)

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
	console.log(team)
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
	await inicializarPaginaCampeonatos()
	await inicializarPaginaExclusao()
	//#endregion
}


document.addEventListener('header-carregado', init)
