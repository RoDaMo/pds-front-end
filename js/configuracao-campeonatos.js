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

inicializarInternacionalizacao(ingles, portugues);

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
		const image = document.getElementById('config-championship-pic-mod'),
			imageFile = document.getElementById('config-championship-image-input'),
			imageInput = document.getElementById('config-imagem-input-hidden'),
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
			form = document.getElementById('update-profile-form'),
			quantidadeJogadores = document.getElementById('quantidade-jogadores')

		const optionDefault = () => {
			const optionDefault = document.createElement('option')
			optionDefault.value = ""
			optionDefault.innerHTML = `<span class="i18" key="SelecioneOpcao">${i18next.t("SelecioneOpcao")}</span>`
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
			if (formato.value === "1") {
				resetQuantidade()
				for (let i = 1; i <= 18; i++) {
					if (i % 2 === 0) {
						adicionarOpcao(i + 2)
					}
				}
			}
			else {
				resetQuantidade()
				for (let i = 1; i <= 6; i++) {
					adicionarOpcao(2 ** i)
				}
			}
		})

		image.src = campeonato.logo
		imageInput.value = campeonato.logo
		name.value = campeonato.name
		descricao.value = campeonato.description
		dataInicial.value = campeonato.initialDate
		dataFinal.value = campeonato.finalDate
		formato.selectedIndex = campeonato.format
		formato.dispatchEvent(new Event('change'))

		for (const option of numero.options) {
			if (option.value == campeonato.teamQuantity) {
				numero.selectedIndex = option.index
				break;
			}
		}

		nacao.value = campeonato.nation
		estado.value = campeonato.state
		cidade.value = campeonato.city
		bairro.value = campeonato.neighborhood
		quantidadeJogadores.value = campeonato.numberOfPlayers
		esporte.selectedIndex = campeonato.sportsId - 1

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
			} else {
				quantidadeJogadores.value = ""
				quantidadeJogadores.disabled = true;
				quantidadeJogadores.setAttribute("key", "QuantidadeJogadoresPlaceholderDisabled")
				quantidadeJogadores.setAttribute("placeholder", i18next.t("QuantidadeJogadoresPlaceholderDisabled"))
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
				.addField(nacao, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="PaisObrigatorio">${i18next.t("PaisObrigatorio")}</span>`,
					},
					{
						rule: 'minLength',
						value: 4,
						errorMessage: `<span class="i18" key="PaisMinimo">${i18next.t("PaisMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 40,
						errorMessage: `<span class="i18" key="PaisMaximo">${i18next.t("PaisMaximo")}</span>`,
					},
				])
				.addField(estado, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="EstadoObrigatorio">${i18next.t("EstadoObrigatorio")}</span>`,
					},
					{
						rule: 'minLength',
						value: 4,
						errorMessage: `<span class="i18" key="EstadoMinimo">${i18next.t("EstadoMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 40,
						errorMessage: `<span class="i18" key="EstadoMaximo">${i18next.t("EstadoMaximo")}</span>`,
					},
				])
				.addField(cidade, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="CidadeObrigatoria">${i18next.t("CidadeObrigatoria")}</span>`,
					},
					{
						rule: 'minLength',
						value: 4,
						errorMessage: `<span class="i18" key="CidadeMinimo">${i18next.t("CidadeMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 40,
						errorMessage: `<span class="i18" key="CidadeMaximo">${i18next.t("CidadeMaximo")}</span>`,
					},
				])
				.addField(bairro, [
					{
						rule: 'required',
						errorMessage: `<span class="i18" key="BairroObrigaorio">${i18next.t("BairroObrigaorio")}</span>`,
					},
					{
						rule: 'minLength',
						value: 4,
						errorMessage: `<span class="i18" key="BairroMinimo">${i18next.t("BairroMinimo")}</span>`,
					},
					{
						rule: 'maxLength',
						value: 40,
						errorMessage: `<span class="i18" key="BairroMaximo">${i18next.t("BairroMaximo")}</span>`,
					},
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

					loader.show()
					await putCampeonato({
						"name": name.value,
						"initialDate": dataInicial.value,
						"finalDate": dataFinal.value,
						"teamQuantity": parseInt(numero.value),
						"logo": imageInput.value,
						"description": descricao.value,
						"Format": parseInt(formato.value),
						"Nation": nacao.value,
						"State": estado.value,
						"City": cidade.value,
						"Neighborhood": bairro.value,
						'id': championshipId,
						'sportsId': campeonato.sportsId,
						'rules': linkRegulamento.href,
						"NumberOfPlayers": parseInt(quantidadeJogadores.value)
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

			regulamento.addEventListener("change", async () => {
				const isValid = await validator.revalidateField(regulamento)
				if (!isValid) return;

				if (regulamento.files.length == 0) return;

				loader.show()
				const data = await uploadImagem(regulamento, 2, mensagemErro)
				loader.hide()

				if (Array.isArray(data.results))
					return;

				regulamento.value = `${api}img/${data.results}`

				linkRegulamento.href = imageInput.value;
				linkRegulamento.classList.toggle('d-none', false)
			})
		}
		document.addEventListener('nova-lingua', validator1)
		validator1()
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

		if (response.succeed) notificacaoSucesso(i18next.t("VinculadoSucesso"))
	}

	const desvincularTime = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE', { 'teamId': teamId, 'championshipId': parseInt(championshipId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
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

		const keySport = timesVinculados.results.sportsId == 1 ? "Futebol" : "Volei"

		for (const time of timesVinculados.results) {
			const newOption = document.createElement('div');
			newOption.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'ss-list-player-content')
			newOption.innerHTML = `
				<div class="col-auto my-auto position-relative mx-auto ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
					<img src="${time.emblem}" alt="teamImage" class="img-fluid position-absolute mw-100 h-100">
				</div>

				<div class="col-auto ss-player-info-wrapper text-center text-md-start ms-md-1 my-auto d-flex flex-column">
					<p class="ss-player-name w-auto text-center text-md-start text-nowrap text-truncate d-block">${time.name}</p>
					<div class="ss-player-data d-flex flex-row mt-2 bg-primary px-2 py-1 rounded-pill mx-md-auto ms-md-0">
						<p class="fs-6 mb-0 text-white text-opacity-75">${keySport}</p>
					</div>
				</div>
			`

			const botaoDesvincularWrapper = document.createElement('div')
			botaoDesvincularWrapper.classList.add('col-auto', 'd-flex', 'mt-3', 'mt-md-auto', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-2')
			botaoDesvincularWrapper.innerHTML = `<button type="button" class="delete-listed-thing justify-content-center align-items-center rounded-4 remover-vinculo-campeonato btn btn-danger d-flex"><i class="bi bi-trash text-light fs-5"></i></button>`

			newOption.appendChild(botaoDesvincularWrapper)
			timesVinculadosWrapper.appendChild(newOption)

			botaoDesvincularWrapper.addEventListener('click', async () => {
				await desvincularTime(time.id)
				await listarTimesVinculados(configFetch)
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

    botaoVincularSuborg.addEventListener('click', () => {
      if (botaoVincularSuborg.classList.contains('cancelar')) {
        botaoVincularSuborg.classList.remove('cancelar');
        botaoVincularSuborg.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarSubOrg">${i18next.t("Adicionar sub-organizadores")}</span>`
        pesquisaSuborg.classList.add('d-none');
      } else {
        botaoVincularSuborg.classList.add('cancelar');
        botaoVincularSuborg.innerHTML = '<i class="bi bi-x-circle px-2"></i> <span class="i18" key="Cancelar">Cancelar</span>';
        pesquisaSuborg.classList.remove('d-none');
      }
    });


	





	


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
		championshipId = document.getElementById('usernameChampionshipId').textContent

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

	changeConfigOptionsContext(0)
	inicializarCampos()
	await inicializarPaginaTimes()
	await inicializarPaginaExclusao()
	//#endregion
}

document.addEventListener('header-carregado', init)
