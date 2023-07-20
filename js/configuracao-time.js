import '../scss/configuracao-usuarios.scss'
import '../scss/configuracao-time.scss'
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
			descricao = document.getElementById('config-team-descricao-input'),
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

		image.src = team.logo
		imageInput.value = team.logo
		name.value = team.name
		descricao.value = team.description

		for (const option of numero.options) {
			if (option.value == team.teamQuantity) {
				numero.selectedIndex = option.index
				break;
			}
		}

		quantidadeJogadores.value = team.numberOfPlayers
		esporte.selectedIndex = team.sportsId - 1

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
						"logo": imageInput.value,
						"description": descricao.value,
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

		const configFetch = configuracaoFetch('POST', { 'teamId': teamId, 'championshipId': parseInt(teamId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) notificacaoSucesso(i18next.t("VinculadoSucesso"))
	}

	const desvincularTime = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE', { 'teamId': teamId, 'championshipId': parseInt(teamId) }),
			response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
		}
	}

	const listarTimesVinculados = async configFetch => {
		loader.show()
		const timesVinculadosWrapper = document.getElementById('times-vinculados'),
			timesVinculados = await executarFetch(`championships/teams?championshipId=${teamId}`, configFetch)

		loader.hide()

		timesVinculadosWrapper.innerHTML = ''

		if (timesVinculados.results.length == 0) {
			timesVinculadosWrapper.innerHTML = `<p><span class="i18" key="SemTimes">${i18next.t("SemTimes")}</span></p>`
			return;
		}

		for (const time of timesVinculados.results) {
			const newOption = document.createElement('li');
			newOption.classList.add('list-group-item', 'bg-verde-limao', 'd-flex', 'justify-content-between', 'align-items-center')
			newOption.innerHTML =
				`
				<div>
					<img src="${time.emblem}" class="img-listagem-times">
					${time.name}
				</div>
			`
			const botao = document.createElement('button')
			botao.classList.add('btn', 'btn-danger', 'remover-vinculo-campeonato', 'btn-sm')
			botao.setAttribute('type', 'button')
			botao.setAttribute('title', `Remover ${time.name} do campeonato`)
			botao.innerHTML = `<i class="bi bi-x-lg"></i>`
			botao.addEventListener('click', async () => {
				await desvincularTime(time.id)
				await listarTimesVinculados(configFetch)
			})

			newOption.appendChild(botao)
			timesVinculadosWrapper.appendChild(newOption)
		}
	}

	const inicializarPaginaTimes = async () => {
		const botaoVincular = document.getElementById('botao-vincular-time'),
			pesquisaWrapper = document.getElementById('pesquisa-time'),
			inputPesquisa = document.getElementById('pesquisa-time-input'),
			datalistPesquisa = document.getElementById('pesquisa-time-lista'),
			configFetch = configuracaoFetch('GET')

		await listarTimesVinculados(configFetch)

		const exibirPesquisa = botaoVincular.onclick = () => {
			pesquisaWrapper.classList.toggle('d-none')
			botaoVincular.innerHTML = `<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>`
			botaoVincular.onclick = () => {
				botaoVincular.innerHTML = `<span class="i18" key="VincularNovo">${i18next.t("VincularNovo")}</span>`
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
				response = await executarFetch(`teams?query=${valor}&sport=${team.sportsId}`, configFetch),
				times = response.results


			datalistPesquisa.innerHTML = ''
			for (const time of times) {
				const newOption = document.createElement('li');
				newOption.classList.add('list-group-item', 'bg-verde-limao', 'd-flex', 'justify-content-between', 'align-items-center')
				newOption.innerHTML =
					`
					<div>
						<img src="${time.emblem}" alt="Logo" class="img-listagem-times">
						${time.name}
					</div>
				`
				const botao = document.createElement('button')
				botao.classList.add('btn', 'btn-primary', 'adicionar-vinculo-campeonato', 'btn-sm')
				botao.setAttribute('type', 'button')
				botao.setAttribute('title', `${i18next.t("Adicionar")} ${time.name} ${i18next.t("AoCampeonato")}`)
				botao.innerHTML = `<i class="bi bi-plus-lg"></i>`
				botao.addEventListener('click', async () => {
					await vincularTime(time.id)
					datalistPesquisa.innerHTML = ''
					inputPesquisa.innerHTML = ''
					await listarTimesVinculados(configFetch)
				})

				newOption.appendChild(botao)
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
						response = await executarFetch(`championships/${teamId}`, configFetch)

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
		configTitle = document.querySelector('.config-title'),
		mediaQueryMobile = window.matchMedia('(max-width: 575px)'),
		menuConfig = document.getElementsByClassName('menu-config'),
		mensagemErro = document.getElementById('mensagem-erro'),
		teamId = document.getElementById('usernameChampionshipId').textContent

	loader.show()
	const dados = await executarFetch(`championships/${teamId}`, configuracaoFetch('GET')),
		team = dados.results
	loader.hide()

	if (mediaQueryMobile.matches) {
		configMenu.parentElement.classList.add('justify-content-center')
		configMenu.classList.add('mb-0')
	}

	for (const configMenuOption of abaBotoes) {
		configMenuOption.addEventListener('click', () => {
			activateLi(configMenuOption)
			configTitle.innerText = configMenuOption.innerText
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
