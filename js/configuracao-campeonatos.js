import '../scss/configuracao-usuarios.scss'
import '../scss/configuracao-campeonato.scss'
import '../scss/pagina-times.scss'

import JustValidate from 'just-validate'
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import flatpickr from "flatpickr"
import { exibidorImagem } from './utilidades/previewImagem.js'
import { uploadImagem } from './utilidades/uploadImagem'
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import portugues from './i18n/ptbr/configuracao-campeonato.json' assert { type: 'JSON' }
import ingles from './i18n/en/configuracao-campeonato.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import * as bootstrap from 'bootstrap'

inicializarInternacionalizacao(ingles, portugues);


const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const doubleMatchWrapper = document.getElementById('double-match-wrapper')

const dropZones = document.querySelectorAll(".upload-drop-zone")

for	(const dropZone of dropZones) {
	dropZone.addEventListener("dragover", e => {
		e.preventDefault()
		dropZone.classList.add("dragover")
	})

	dropZone.addEventListener("dragleave", e => {
		e.preventDefault()
		dropZone.classList.remove("dragover")
	})

	dropZone.addEventListener("drop", async e => {
		e.preventDefault()
		dropZone.classList.remove("dragover")
	})	
}

function genericExibition(input, data, image) {
	input.value = `${api}img/${data.results}`
	exibidorImagem(image, input.value)
}


const init = async () => {

	const usuarioAtual = await executarFetch('auth/user', configuracaoFetch('GET'))

	document.getElementById('reload-ficar-aqui').addEventListener('click', () => location.reload())

	if(usuarioAtual.results.isSubOrganizer){
		document.getElementById('exclusao-campeonato').classList.add('d-none')
		document.getElementById('btn-suborg').classList.add('d-none')
	}

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
		const image = document.getElementById('config-championship-pic-mod'),
			imageFile = document.getElementById('config-championship-image-input'),
			imageInput = document.getElementById('config-imagem-input-hidden'),
			hiddenRegulamento = document.getElementById('config-regulamento-input-hidden'),
			name = document.getElementById('config-championship-name-input'),
			descricao = document.getElementById('config-championship-descricao-input'),
			regulamento = document.getElementById('config-championship-regulamento-input'),
			dataInicial = document.getElementById('config-championship-data-inicial-input'),
			dataFinal = document.getElementById('config-championship-data-final-input'),
			formato = document.getElementById('config-championship-formato-input'),
			numero = document.getElementById('config-championship-numero-input'),
			nacao = document.getElementById('config-championship-nacao-input'),
			estado = document.getElementById('config-championship-estado-input'),
			cidade = document.getElementById('config-championship-cidade-input'),
			bairro = document.getElementById('config-championship-bairro-input'),
			linkRegulamento = document.getElementById('regulamento-existente'),
			esporte = document.getElementById('config-championship-esporte-input'),
			quantidadeJogadores = document.getElementById('quantidade-jogadores'),
			configChampionshipDropZone = document.getElementById('config-championship-drop-zone')

		// Double Match Checkboxes
		const doubleMatchPontosCorridos = document.createElement('div')
		doubleMatchPontosCorridos.classList.add('form-check', 'mt-2')
		doubleMatchPontosCorridos.innerHTML = `
			<label class="form-check-label" for="double-match-pc">
				<span class="i18 text-black" key="DoubleMatchPC">${i18next.t("DoubleMatchPC")}</span>
			</label>

			<input class="form-check-input" type="checkbox" value="" id="double-match-pc">
		`

		let PCCheckboxElem = null

		const doubleMatchEliminatorias = document.createElement('div')
		doubleMatchEliminatorias.classList.add('form-check', 'mt-2')
		doubleMatchEliminatorias.innerHTML = `
			<label class="form-check-label" for="double-match-eliminatorias">
				<span class="i18 text-black" key="DoubleMatchEliminatorias">${i18next.t("DoubleMatchEliminatorias")}</span>
			</label>
			
			<input class="form-check-input" type="checkbox" value="" id="double-match-eliminatorias">
		`

		let eliminatoriasCheckboxElem = null

		const doubleMatchFinal = document.createElement('div')
		doubleMatchFinal.classList.add('form-check', 'mt-2')
		doubleMatchFinal.innerHTML = `
			<label class="form-check-label" for="double-match-final">
				<span class="i18 text-black" key="DoubleMatchFinal">${i18next.t("DoubleMatchFinal")}</span>
			</label>

			<input class="form-check-input" type="checkbox" value="" id="double-match-final">
		`

		let finalCheckboxElem = null

		const doubleMatchFaseDeGrupos = document.createElement('div')
		doubleMatchFaseDeGrupos.classList.add('form-check', 'mt-2')
		doubleMatchFaseDeGrupos.innerHTML = `
			<label class="form-check-label" for="double-match-FG">
				<span class="i18 text-black" key="DoubleMatchFG">${i18next.t("DoubleMatchFG")}</span>
			</label>

			<input class="form-check-input" type="checkbox" value="" id="double-match-FG">
		`

		let FGCheckboxElem = null

		const optionDefault = () => {
			const optionDefault = document.createElement('option')
			optionDefault.value = ""
			optionDefault.classList.add('i18')
			optionDefault.text = i18next.t("SelecioneOpcao")
			optionDefault.setAttribute("key", "SelecioneOpcao")
			numero.appendChild(optionDefault)
		}

		const adicionarOpcao = (value) => {
			const option = document.createElement('option')
			option.value = value
			option.text = value
			numero.appendChild(option)
		}

		const resetQuantidade = () => {
			numero.innerHTML = ""
			optionDefault()
		}

		formato.addEventListener("change", () => {
			if (formato.value === "3") {
				resetQuantidade()
				for (let i = 1; i <= 18; i++) {
					if (i % 2 === 0) {
						adicionarOpcao(i + 2)
					}
				}
			}
			else if(formato.value === "4"){
				resetQuantidade()
				for (let i = 2; i <= 6; i++) {
					adicionarOpcao(2 ** i)
				}
			}
			else {
				resetQuantidade()
				for (let i = 1; i <= 6; i++) {
					adicionarOpcao(2 ** i)
				}
			}

			doubleMatchWrapper.innerHTML = ""

			changeTeamQTDStatus()

			verifyDoubleMatch()
		})

		function changeTeamQTDStatus() {
			if (esporte.value && formato.value) {
				numero.value = ""
				numero.disabled = false;
				numero.setAttribute("key", "QuantidadePlaceholder")
				numero.setAttribute("placeholder", i18next.t("QuantidadePlaceholder"))
				numero.classList.remove("text-muted")
			} else {
				numero.value = ""
				numero.disabled = true;
				numero.firstElementChild.textContent = i18next.t("QuantidadePlaceholderDisabled")
				numero.classList.add("text-muted")
			}
		}
		
		function verifyDoubleMatch() {
			
			if (formato.value === "3") {
				doubleMatchWrapper.appendChild(doubleMatchPontosCorridos)
				PCCheckboxElem = document.getElementById('double-match-pc')
				
				if (campeonato.doubleStartLeagueSystem) {
					PCCheckboxElem.checked = true
				}

			} else if (formato.value === "1") {
				if (esporte.value === "1") {
					doubleMatchWrapper.appendChild(doubleMatchEliminatorias)
					eliminatoriasCheckboxElem = document.getElementById('double-match-eliminatorias')

					doubleMatchWrapper.appendChild(doubleMatchFinal)
					finalCheckboxElem = document.getElementById('double-match-final')
					

					if (campeonato.doubleMatchEliminations) {
						eliminatoriasCheckboxElem.checked = true
					}

					if (campeonato.finalDoubleMatch) {
						finalCheckboxElem.checked = true
					}
				}
			} else if (formato.value === "4") {
				doubleMatchWrapper.appendChild(doubleMatchFaseDeGrupos)
				FGCheckboxElem = document.getElementById('double-match-FG')

				if (campeonato.doubleMatchGroupStage) {
					FGCheckboxElem.checked = true
				}
		
				if (esporte.value === "1") {
					doubleMatchWrapper.appendChild(doubleMatchEliminatorias)
					eliminatoriasCheckboxElem = document.getElementById('double-match-eliminatorias')

					doubleMatchWrapper.appendChild(doubleMatchFinal)
					finalCheckboxElem = document.getElementById('double-match-final')

					if (campeonato.doubleMatchEliminations) {
						eliminatoriasCheckboxElem.checked = true
					}

					if (campeonato.finalDoubleMatch) {
						finalCheckboxElem.checked = true
					}
				}
				
			}
		}

		image.src = campeonato.logo
		imageInput.value = campeonato.logo
		name.value = campeonato.name
		descricao.value = campeonato.description
		dataInicial.value = campeonato.initialDate
		dataFinal.value = campeonato.finalDate
		formato.value = campeonato.format
		formato.dispatchEvent(new Event('change'))

		for (const option of numero.options) {
			if (option.value == campeonato.teamQuantity) {
				numero.selectedIndex = option.index
				break;
			}
		}

		quantidadeJogadores.value = campeonato.numberOfPlayers
		esporte.selectedIndex = campeonato.sportsId - 1


		checkBracketCreationAvailability()

		console.log(campeonato.teams.length);
		console.log(campeonato.teamQuantity);
		console.log(campeonato)

		if (campeonato.rules) {
			linkRegulamento.classList.remove('d-none')
			linkRegulamento.href = campeonato.rules
		}

		let lng = localStorage.getItem('lng')

		flatpickr(dataInicial, {
			dateFormat: "Y-m-d",
			locale: lng === 'ptbr' ? Portuguese : ingles,
			altInput: true,
		})

		flatpickr(dataFinal, {
			dateFormat: "Y-m-d",
			locale: lng === 'ptbr' ? Portuguese : ingles,
			altInput: true,
		})

		document.addEventListener('nova-lingua', event => {
			let lng = localStorage.getItem('lng')

			flatpickr(dataInicial, {
				dateFormat: "Y-m-d",
				locale: lng === 'ptbr' ? Portuguese : ingles,
				altInput: true,
			})

			flatpickr(dataFinal, {
				dateFormat: "Y-m-d",
				locale: lng === 'ptbr' ? Portuguese : ingles,
				altInput: true,
			})

		})

		const validator = new JustValidate(form, {
			validateBeforeSubmitting: true,
		})

		esporte.addEventListener("change", () => {

			doubleMatchWrapper.innerHTML = ""

    		changeTeamQTDStatus()

			if (esporte.value === "1") {
				quantidadeJogadores.value = ""
				quantidadeJogadores.setAttribute("min", 11)
				quantidadeJogadores.setAttribute("max", 25)
			} else if (esporte.value === "2") {
				quantidadeJogadores.value = ""
				quantidadeJogadores.setAttribute("min", 6)
				quantidadeJogadores.setAttribute("max", 15)
			}

			if (esporte.value) {
				quantidadeJogadores.value = ""
				quantidadeJogadores.disabled = false;
				quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholder")
				quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholder"))

				formato.disabled = false;
				formato.value = ""
				formato.firstElementChild.textContent = i18next.t("FormatoPlaceholder")
				formato.classList.remove("text-muted")
			} else {
				doubleMatchWrapper.innerHTML = ""

				quantidadeJogadores.value = ""
				quantidadeJogadores.disabled = true;
				quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholderDisabled")
				quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholderDisabled"))

				formato.disabled = true;
				formato.value = ""
				formato.firstElementChild.textContent = i18next.t("FormatoPlaceholderDisabled")
				formato.classList.add("text-muted")
			}
		})

		quantidadeJogadores.addEventListener("change", () => {
			if (esporte.value === "1") {
				if (quantidadeJogadores.value < 11 || quantidadeJogadores.value > 25) {
					quantidadeJogadores.value = 11
				}
			} else if (esporte.value === "2") {
				if (quantidadeJogadores.value < 6 || quantidadeJogadores.value > 15) {
					quantidadeJogadores.value = 6
				}
			}
		})
		function validator1() {
			validator
				.addField(name, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="NomeCampeonatoObrigatorio">${i18next.t("NomeCampeonatoObrigatorio")}</span>`,
					},
					{
						rule: 'minLength',
						value: 4,
						errorMessage: `<span class="i18" key="NomeCampeonatoMinimo">${i18next.t("NomeCampeonatoMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 40,
						errorMessage: `<span class="i18" key="NomeCampeonatoMaximo">${i18next.t("NomeCampeonatoMaximo")}</span>`,
					},
				])
				.addField(dataInicial, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="DataInicialObrigatoria">${i18next.t("DataInicialObrigatoria")}</span>`,
					},
					{
						validator: (value) => {
							const dataInicial = new Date(value)
							const dataAtual = new Date()
							dataAtual.setDate(dataAtual.getDate() - 1)
							return dataInicial >= dataAtual
						},
						errorMessage: `<span class="i18" key="DataInicialMaiorIgual">${i18next.t("DataInicialMaiorIgual")}</span>`
					}
				])
				.addField(dataFinal, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="DataFinalObrigatoria">${i18next.t("DataFinalObrigatoria")}</span>`,
					},
					{
						validator: (value, context) => {
							const dataInicial = new Date(document.getElementById("config-championship-data-inicial-input").value)
							const dataFinal = new Date(value)
							return dataFinal >= dataInicial
						},
						errorMessage: `<span class="i18" key="DataFinalMaiorIgual">${i18next.t("DataFinalMaiorIgual")}</span>`,
					}
				])
				.addField(formato, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="FormatoObrigatorio">${i18next.t("FormatoObrigatorio")}</span>`,
					},
				])
				.addField(numero, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="QuantidadeObrigatoria">${i18next.t("QuantidadeObrigatoria")}</span>`,
					},
				])
				.addField(imageFile, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="LogoObrigatoria">${i18next.t("LogoObrigatoria")}</span>`,
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
				.addField(regulamento, [
					{
						rule: 'files',
						value: {
							files: {
								extensions: ['pdf'],
								maxSize: 20000000,
								types: ['application/pdf'],
							},
						},
						errorMessage: `<span class="i18" key="ImagemTamanho">${i18next.t("PdfInvalido")}</span>`,
					}
				])
				.addField(descricao, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="DescricaoObrigatoria">${i18next.t("DescricaoObrigatoria")}</span>`,
					},
					{
						rule: 'minLength',
						value: 10,
						errorMessage: `<span class="i18" key="DescricaoMinimo">${i18next.t("DescricaoMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 2000,
						errorMessage: `<span class="i18" key="DescricaoMaximo">${i18next.t("DescricaoMaximo")}</span>`,
					},
				])
				.addField(quantidadeJogadores, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="QuantidadeJogadoresObrigatorio">${i18next.t("QuantidadeJogadoresObrigatorio")}</span>`,
					},
					{
						validator: (value) => {
							if (esporte.value == "2") {
								return value >= 6 && value <= 15
							} else if (esporte.value == "1") {
								return value >= 11 && value <= 25
							}
						},
						errorMessage: `<span class="i18" key="QuantidadeJogadoresInvalido">${i18next.t("QuantidadeJogadoresInvalido")}</span>`,
					},
				])
				.onSuccess(async (e) => {
					e.preventDefault()
					// console.log('hello world')
					// limparMensagem(mensagemErro)

					let PCStatus = false
					let eliminatoriasStatus = false
					let finalStatus = false
					let FGStatus = false

					if (formato.value == "3") {
						if (PCCheckboxElem.checked) {
							PCStatus = true
						}
					} else if (formato.value == "1") {
						if(esporte.value == "1") {
							if (eliminatoriasCheckboxElem.checked) {
								eliminatoriasStatus = true
							}
							if (finalCheckboxElem.checked) {
								finalStatus = true
							}
						}
					} else if (formato.value == "4") {
						if (FGCheckboxElem.checked) {
							FGStatus = true
						}

						if (esporte.value == "1") {
							if (eliminatoriasCheckboxElem.checked) {
								eliminatoriasStatus = true
							}
							if (finalCheckboxElem.checked) {
								finalStatus = true
							}
						}
					}


					loader.show()
					console.log(linkRegulamento.href)
					await putCampeonato({
						"name": name.value,
						"initialDate": dataInicial.value,
						"finalDate": dataFinal.value,
						"teamQuantity": parseInt(numero.value),
						"logo": imageInput.value,
						"description": descricao.value,
						"Format": parseInt(formato.value),
						'id': championshipId,
						'sportsId': campeonato.sportsId,
						'rules': linkRegulamento.href,
						"NumberOfPlayers": parseInt(quantidadeJogadores.value),
						"DoubleStartLeagueSystem": PCStatus,
						"DoubleMatchEliminations": (parseInt(numero.value) === 2 || (parseInt(formato.value) === 4 && parseInt(numero.value) === 4)) ? false : eliminatoriasStatus,
						"FinalDoubleMatch": finalStatus,
						"DoubleMatchGroupStage": FGStatus,
					})
					loader.hide()
					// mensagemErro.textContent = ''
					location.reload()

					checkBracketCreationAvailability()
				})

			configChampionshipDropZone.addEventListener("drop", async e => {
				loader.show()
				const data = await uploadImagem(e.dataTransfer, 3, mensagemErro)
				loader.hide()
	
				if (Array.isArray(data.results))
					return;
	
				genericExibition(imageInput, data, image)
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

			regulamento.addEventListener("change", async () => {
				const isValid = await validator.revalidateField(regulamento)
				if (!isValid) return;

				

				loader.show()
				const data = await uploadImagem(regulamento, 2, mensagemErro)
				loader.hide()

				if (Array.isArray(data.results))
					return;

				hiddenRegulamento.value = `${api}img/${data.results}`

				console.log(hiddenRegulamento.value);

				linkRegulamento.href = hiddenRegulamento.value;
				linkRegulamento.classList.toggle('d-none', false)
			})
		}
		document.addEventListener('nova-lingua', validator1)
		validator1()
	}

	const createBracket = async championshipId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		let endpoint = ''

		// a elegância
		endpoint = (campeonato.format == 3) ? 'bracketing/league-system' 
			: (campeonato.format == 1) ? 'bracketing/knockout' 
			: (campeonato.format == 4) ? 'bracketing/group-stage' 
			: ''

		loader.show()
		const configFetch = configuracaoFetch('POST', parseInt(championshipId)),
			response = await executarFetch(endpoint, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoCriacaoChaveamento"))

			modalCreateSuccessBracketBT.show()
			modalCreateSuccessBracket.querySelector('#modal-link-chaveamento').href = '/pages/tabela-chaveamento.html?id=' + championshipId

			if (document.getElementById('botao-vincular-time').querySelector('span').getAttribute('key') == "Cancelar") {
				document.getElementById('botao-vincular-time').click()
			}

			bracketExists(championshipId)
		}
	}

	const deleteBracket = async championshipId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
		const configFetch = configuracaoFetch('DELETE'),
			response = await executarFetch(`bracketing/delete/${championshipId}`, configFetch, callbackStatus)

		loader.hide()

		if (response.succeed) {
			notificacaoSucesso(i18next.t("SucessoExclusaoChaveamento"))

			modalDeleteBracketBT.hide()

			await bracketExists(championshipId)
			await checkBracketCreationAvailability()
		}
	}

	const disableForm = () => {
		let formElements = form.elements;
		
		for (let i = 0; i < formElements.length; i++) {
			formElements[i].disabled = true;
		}
	}

	const disableTeamsManipulation = () => {
		document.getElementById('botao-vincular-time').disabled = true
		document.querySelectorAll('.delete-listed-thing').forEach(btn => btn.disabled = true)
	}

	const enableTeamsManipulation = () => {
		document.getElementById('botao-vincular-time').disabled = false
		document.querySelectorAll('.delete-listed-thing').forEach(btn => btn.disabled = false)
	}

	const enableForm = () => {
		let formElements = form.elements;
		
		for (let i = 0; i < formElements.length; i++) {
			formElements[i].disabled = false;
		}
	}

	const bracketExists = async championshipId => {
		const configFetch = configuracaoFetch('GET')

		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		loader.show()
			const response = await executarFetch(`bracketing/exists/${championshipId}`, configFetch, callbackStatus)
		loader.hide()

		if (response.succeed) {
			const linkChaveamento = document.getElementById('link-bracket-btn-wrapper');
			if (response.results) {
				// se estiver criado, bloquear a edição do campeonado 
				disableForm()
				disableTeamsManipulation()

				bracketBtnWrapper.innerHTML = `
					<button data-bs-toggle="modal" data-bs-target="#bracketDeleteModal" id="delete-bracket-btn" class="btn btn-danger border-0 d-flex justify-content-center align-items-center">
						<i class="bi bi-trash me-2"></i>
						<span class="i18 fw-semibold" key="ExcluirChaveamento">${i18next.t("ExcluirChaveamento")}</span>
					</button>
				` 
				confirmDeleteBracketBtn.addEventListener('click', async () => {
					await deleteBracket(campeonato.id)
				})

				linkChaveamento.href = '/pages/tabela-chaveamento.html?id=' + campeonato.id
			} else {
				// se não estiver criado, permitir a edição do campeonato
				enableForm()
				enableTeamsManipulation()
				
				bracketBtnWrapper.innerHTML = `
				<button disabled data-bs-toggle="modal" data-bs-target="#bracketCreateModal" id="create-bracket-btn" class="btn border-0 d-flex justify-content-center align-items-center chaveamento-btn">
				<i class="bi bi-diagram-2 me-2"></i>
				<span class="i18 fw-semibold" key="CriarChaveamento">${i18next.t("CriarChaveamento")}</span>
				</button> 
				`
				confirmCreateBracketBtn.addEventListener('click', async () => {
					await createBracket(campeonato.id)

					bracketCreateModalBT.hide()
				}, { once: true })
				
				linkChaveamento.classList.add('d-none')
			}
		}
	}

	const putCampeonato = async body => {
		const callbackServidor = data => {
			mensagemErro.classList.add("text-danger")
			data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
		}

		const data = await executarFetch('championships', configuracaoFetch("PUT", body), callbackServidor, callbackServidor)
		if (!data) return false

		limparMensagem(mensagemErro)
		notificacaoSucesso(data.results[0])
	}

	const vincularTime = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('POST', { 'teamId': teamId, 'championshipId': parseInt(championshipId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) { 
			notificacaoSucesso(i18next.t("VinculadoSucesso"))

			checkBracketCreationAvailability()
		}
	}

	const desvincularTime = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE', { 'teamId': teamId, 'championshipId': parseInt(championshipId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("DesvinculadoSucesso"))

			checkBracketCreationAvailability()
		}
	}

	const listarTimesVinculados = async configFetch => {
		loader.show()
		const timesVinculadosWrapper = document.getElementById('times-vinculados'),
			timesVinculados = await executarFetch(`championships/teams?championshipId=${championshipId}`, configFetch)

		loader.hide()

		timesVinculadosWrapper.innerHTML = ''

		if (timesVinculados.results.length == 0) {
			timesVinculadosWrapper.innerHTML = `<p class="p-2 text-center"><span class="i18" key="SemTimes">${i18next.t("SemTimes")}</span></p>`
			return;
		}


		for (const time of timesVinculados.results) {
			const newOption = document.createElement('div');
			newOption.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'ss-list-player-content')
			newOption.innerHTML = `
				<div class="col-auto my-auto position-relative mx-auto border border-2 ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
					<img src="${time.emblem}" alt="teamImage" class="img-fluid position-absolute mw-100 h-100">
				</div>

                <span class="d-none team-id">${time.id}</span>

				<div class="col-auto ss-player-info-wrapper text-center mb-0 text-md-start ms-md-1 mt-auto mt-md-0 d-flex flex-column">
					<p class="ss-player-name text-center text-md-start text-nowrap text-truncate d-block">${time.name}</p>
					<div class="ss-player-data2 row justify-content-center align-items-center d-flex flex-column flex-md-row mt-2 mx-md-auto ms-md-0">
						<button class="col link-ss-list-team py-1 px-4 mb-2 mb-md-0 me-md-2 btn border-0"><i class="bi text-white bi-box-arrow-up-right"></i></button>
					</div>
				</div>

				<div class="col-auto d-flex justify-content-center w-100 d-md-none">
					<hr class="w-50 opacity-25 m-0 mb-2"></hr>
				</div>

			`

			const botaoDesvincularWrapper = document.createElement('div')
			botaoDesvincularWrapper.classList.add('col-auto', 'd-flex', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-2')
			botaoDesvincularWrapper.innerHTML = `<button type="button" class="delete-listed-thing justify-content-center align-items-center rounded-4 remover-vinculo-campeonato btn btn-danger d-flex"><i class="bi bi-trash text-light fs-5"></i></button>`

			newOption.appendChild(botaoDesvincularWrapper)
			timesVinculadosWrapper.appendChild(newOption)

			botaoDesvincularWrapper.firstElementChild.addEventListener('click', async () => {
				await desvincularTime(time.id)
				await listarTimesVinculados(configFetch)
			})

			const linkSSListTeam = document.querySelectorAll('.link-ss-list-team')
			linkSSListTeam.forEach(content => {
				content.addEventListener('click', () => {
					const teamId = content.parentElement.parentElement.parentElement.querySelector('.team-id').textContent
					window.location.href = `pagina-times.html?id=${teamId}`
				})
			})
		}
	}

	const inicializarPaginaTimes = async () => {
		const botaoVincular = document.getElementById('botao-vincular-time'),
			pesquisaWrapper = document.getElementById('pesquisa-time'),
			inputPesquisa = document.getElementById('pesquisa-time-input'),
			datalistPesquisa = document.getElementById('pesquisa-time-lista'),
			configFetch = configuracaoFetch('GET')

		await listarTimesVinculados(configFetch)

		const pesquisaTimeValidator = new JustValidate(pesquisaWrapper, { validateBeforeSubmitting: true })

		function pesquisaTimeValidator1() {
			pesquisaTimeValidator
				.addField(inputPesquisa, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="PesquisaTimeObrigatorio">${i18next.t("PesquisaTimeObrigatorio")}</span>`,
					},
				])
				.onSuccess(async (e) => {
					e.preventDefault()
					await listarTimesVinculados(configFetch)
				})
		}

		const exibirPesquisa = botaoVincular.onclick = () => {
			pesquisaTimeValidator1()

			pesquisaWrapper.classList.toggle('d-none')
			botaoVincular.innerHTML = `<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>`
			botaoVincular.onclick = () => {
				botaoVincular.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="VincularNovo">${i18next.t("VincularNovo")}</span>`
				pesquisaWrapper.classList.toggle('d-none')
				botaoVincular.onclick = exibirPesquisa
			}
		}

		inputPesquisa.addEventListener('input', async () => {
			if (!inputPesquisa.value) {
				datalistPesquisa.innerHTML = ''
				return;
			}
			const valor = inputPesquisa.value,
				response = await executarFetch(`teams?query=${valor}&sport=${campeonato.sportsId}&championshipId=${championshipId}`, configFetch),
				times = response.results


			datalistPesquisa.innerHTML = ''
			for (const time of times) {
				const newOption = document.createElement('div');
				newOption.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'ss-list-player-content')
				newOption.innerHTML = `
					<div class="col-auto my-auto position-relative mx-auto ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
						<img src="${time.emblem}" alt="teamImage" class="img-fluid position-absolute mw-100 h-100">
					</div>
					
					<div class="col-auto ss-player-info-wrapper text-center text-md-start ms-md-1 my-auto d-flex flex-column">
						<p class="ss-player-name w-auto text-center text-md-start text-nowrap text-truncate d-block">${time.name}</p>
					</div>
				`

				const addTeamButtonWrapper = document.createElement('div')
				addTeamButtonWrapper.classList.add('col-auto', 'd-flex', 'mt-3', 'mt-md-auto', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-2')
				addTeamButtonWrapper.innerHTML = `<button type="button" class="add-listed-thing justify-content-center align-items-center rounded-4 adicionar-vinculo-campeonato btn btn-primary d-flex"><i class="bi bi-plus-lg text-light fs-5"></i></button>`

				newOption.appendChild(addTeamButtonWrapper)

				addTeamButtonWrapper.addEventListener('click', async () => {
					await vincularTime(time.id)
					datalistPesquisa.innerHTML = ''
					inputPesquisa.innerHTML = ''
					await listarTimesVinculados(configFetch)
				})

				datalistPesquisa.appendChild(newOption)
			}

		})
	}

	const botaoVincularSuborg = document.getElementById('botao-vincular-suborg');
	const pesquisaSuborg = document.getElementById('pesquisa-suborg');

	document.getElementById('btn-suborg').addEventListener('click', () => exibirSuborg())

	
	botaoVincularSuborg.addEventListener('click', () => {
		if (botaoVincularSuborg.classList.contains('cancelar')) {
			botaoVincularSuborg.classList.remove('cancelar');
			botaoVincularSuborg.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarSubOrg"></span>`;
			pesquisaSuborg.classList.add('d-none');
		} else {
			botaoVincularSuborg.classList.add('cancelar');
			botaoVincularSuborg.innerHTML = '<i class="bi bi-x-circle px-2"></i><span class="i18" key="Cancelar"></span>';
			pesquisaSuborg.classList.remove('d-none');
		}
		updateText(); 
	});

	const updateText = async() => {
		const i18Elements = document.querySelectorAll('.i18');
		i18Elements.forEach((element) => {
		  const key = element.getAttribute('key');
		  const translation = i18next.t(key);
		  element.textContent = translation;
		});

		const pesquisaInput = document.getElementById("pesquisa-suborg-input")
		pesquisaInput.addEventListener('keyup', async() =>{
			const response = await executarFetch(`organizer?username=${pesquisaInput.value ? pesquisaInput.value : null}`, configuracaoFetch("GET"))
			console.log(response)
			document.getElementById('suborg-vinculados').innerHTML = ""
			for(const result of response.results){
				const newOption = document.createElement('div');
				newOption.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'ss-list-player-content')
				newOption.innerHTML = `
					<div class="col-auto my-auto position-relative mx-auto ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
						<img src="${result.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
					</div>
					
					<div class="col-auto ss-player-info-wrapper text-center text-md-start ms-md-1 my-auto d-flex flex-column">
						<p class="ss-player-name w-auto text-center text-md-start text-nowrap text-truncate d-block">${result.name}</p>
					</div>
					<div class="col-auto d-flex mt-3 mt-md-auto my-auto mx-auto ms-md-auto me-md-2">
						<button id="vincular-suborg" type="button" class="add-listed-thing justify-content-center align-items-center rounded-4 adicionar-player-step btn btn-primary d-flex"><i class="bi bi-plus text-light fs-5"></i></button>
					</div>
					`
				
				document.getElementById('suborg-vinculados').appendChild(newOption)
				document.getElementById("vincular-suborg").addEventListener('click', async() => {
					const config = configuracaoFetch("POST", {
						'organizerId': result.id,
						'championshipId': championshipId
					})
					await executarFetch(`organizer`, config)
					pesquisaInput.value = ""
					document.getElementById('suborg-vinculados').innerHTML = ""
					exibirSuborg()
				})
			}
		})

	}

	const exibirSuborg = async() => {
		const response = await executarFetch(`organizer/championship/${campeonato.id}`, configuracaoFetch("GET"))
		console.log(response)
		document.getElementById('suborganizadores-ja-vinculados').innerHTML = ""
		for(const result of response.results){
			console.log(result)
			const newOption = document.createElement('div');
			newOption.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'ss-list-player-content')
			newOption.innerHTML = `
				<div class="col-auto my-auto position-relative mx-auto ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
					<img src="${result.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
				</div>
				
				<div class="col-auto ss-player-info-wrapper text-center text-md-start ms-md-1 my-auto d-flex flex-column">
					<p class="ss-player-name w-auto text-center text-md-start text-nowrap text-truncate d-block">${result.name}</p>
				</div>
			`
			const botaoDesvincularWrapper = document.createElement('div')
			botaoDesvincularWrapper.classList.add('col-auto', 'd-flex', 'mt-3', 'mt-md-auto', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-2')
			botaoDesvincularWrapper.innerHTML = `<button type="button" class="delete-listed-thing justify-content-center align-items-center rounded-4 remover-vinculo-campeonato btn btn-danger d-flex"><i class="bi bi-trash text-light fs-5"></i></button>`

			document.getElementById('suborganizadores-ja-vinculados').appendChild(newOption)
			if(usuarioAtual.results.id !== result.id) newOption.appendChild(botaoDesvincularWrapper)

			botaoDesvincularWrapper.addEventListener('click', async() => {
				const callbackStatus = (data) => {
					notificacaoErro(data.results)
				}
		
				const configFetch = configuracaoFetch('DELETE', {'organizerId': result.id, 'championshipId': parseInt(championshipId)}),
					response = await executarFetch('organizer', configFetch, callbackStatus)
				console.log(response)
		
				if (response.succeed) {
					notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
					exibirSuborg()
				}
			})
		}

	}

	const inicializarPaginaExclusao = async () => {
		const formDeletarCampeonato = document.getElementById('delete-championship-form'),
			deleteAccountValidator = new JustValidate(formDeletarCampeonato, { validateBeforeSubmitting: true }),
			usernameInput = document.getElementById('delete-user-name-input'),
			username = document.getElementById('offcanvasUserName')

		function validor2() {
			deleteAccountValidator
				.addField(usernameInput, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeUsuarioObrigatorio")}</span>`,
					},
					{
						validator: (value) => username.textContent == value,
						errorMessage: `<span class="i18" key="NomeUsuarioIncorreto">${i18next.t("NomeUsuarioIncorreto")}</span>`
					}
				])
				// submit
				.onSuccess(async (e) => {
					e.preventDefault()
					loader.show()
					const configFetch = configuracaoFetch('DELETE'),
						response = await executarFetch(`championships/${championshipId}`, configFetch)

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
		championshipId = document.getElementById('usernameChampionshipId').textContent,
		confirmCreateBracketBtn = document.getElementById('confirm-create-bracket-btn'),
		confirmDeleteBracketBtn = document.getElementById('confirm-delete-bracket-btn'),
		modalCreateSuccessBracket = document.getElementById('modalCriacaoChaveamentoSucesso'),
		modalDeleteBracket = document.getElementById('bracketDeleteModal'),
		bracketCreateModal = document.getElementById('bracketCreateModal'),
		bracketBtnWrapper = document.getElementById('bracket-btn-wrapper'),
		form = document.getElementById('update-profile-form'),
		linkBracketBtnWrappers = document.querySelectorAll('.link-bracket-btn-wrapper')
		
        let modalCreateSuccessBracketBT = new bootstrap.Modal(modalCreateSuccessBracket, {keyboard: false})

		let modalDeleteBracketBT = new bootstrap.Modal(modalDeleteBracket, {keyboard: false})

		let bracketCreateModalBT = new bootstrap.Modal(bracketCreateModal, {keyboard: false})

	loader.show()
	const dados = await executarFetch(`championships/${championshipId}`, configuracaoFetch('GET')),
		campeonato = dados.results
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

	const checkBracketCreationAvailability = async () => {
		const createBracketBtn = document.getElementById('create-bracket-btn')
		

		const dados = await executarFetch(`championships/${championshipId}`, configuracaoFetch('GET')),
		campeonato = dados.results

		if (createBracketBtn) {
			if (campeonato.teamQuantity == campeonato.teams.length) {
				createBracketBtn.disabled = false
				bracketBtnWrapper.querySelector("#qtd-teams-not-enough").remove()
			} else {
				createBracketBtn.disabled = true
				// clear error message
				if (bracketBtnWrapper.querySelector("#qtd-teams-not-enough")) {
					bracketBtnWrapper.querySelector("#qtd-teams-not-enough").remove()
				}
				bracketBtnWrapper.insertAdjacentHTML('beforeend', `<span id="qtd-teams-not-enough" class="i18 tiny-text" key="QuantidadeTimesInsuficiente">${i18next.t("QuantidadeTimesInsuficiente")}</span>`)
			}
		}
	}

	// confirmCreateBracketBtn.addEventListener('click', async () => {
	// 	await createBracket(campeonato.id)

	// 	bracketCreateModalBT.hide()
	// })

	for (const linkBracketBtnWrapper of linkBracketBtnWrappers) {
		linkBracketBtnWrapper.setAttribute('href', `tabela-chaveamento.html?id=${campeonato.id}`)
	}

	changeConfigOptionsContext(0)
	inicializarCampos()
	await inicializarPaginaTimes().then(async () => {
		await bracketExists(campeonato.id)
	})
	await inicializarPaginaExclusao()
	await checkBracketCreationAvailability()
	//#endregion


}

document.addEventListener('header-carregado', init)
