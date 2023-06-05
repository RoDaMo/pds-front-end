import '../scss/configuracao-usuarios.scss'
import '../scss/configuracao-campeonato.scss'
import JustValidate from 'just-validate'
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
// import Dropzone from 'dropzone'
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
// import '../node_modules/dropzone/dist/dropzone.css'
import flatpickr from "flatpickr"
import { exibidorImagem } from '../js/utilidades/previewImagem'
import { uploadImagem } from './utilidades/uploadImagem'
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import portugues from './i18n/ptbr/configuracao-campeonato.json' assert { type: 'JSON' }
import ingles from './i18n/en/configuracao-campeonato.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

document.querySelector('#lingua').addEventListener('change', event => {
    const selectedIndex = event.target.selectedIndex;
    localStorage.setItem('lng', event.target.children[selectedIndex].value);
    document.body.dispatchEvent(new Event('nova-lingua', { bubbles: true }))
})

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const init = async () => {
	const activateLi = (li) => {
		for (const item of configMenuList.children) {
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
					form = document.getElementById('update-profile-form')

		const optionDefault = () => {
				const optionDefault = document.createElement('option')
				optionDefault.value = 0
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
			if(formato.value === "1"){
				resetQuantidade()
				for(let i = 1; i <= 18; i++){
					if(i % 2 === 0){
						adicionarOpcao(i + 2)	
					}
				}
			}
			else{
				resetQuantidade()
				for(let i = 1; i <= 6; i++){
					adicionarOpcao(2 ** i)
				}
			}
		})

		console.log(campeonato)
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
				console.log('entrou', option.value, option.index)
				numero.selectedIndex = option.index
				break;
			}
		}

		nacao.value = campeonato.nation
		estado.value = campeonato.state
		cidade.value = campeonato.city
		bairro.value = campeonato.neighborhood
		esporte.selectedIndex = campeonato.sportsId - 1

		if (campeonato.rules) {
			linkRegulamento.classList.remove('d-none')
			linkRegulamento.href = campeonato.rules
		}

		flatpickr(dataInicial, {
			dateFormat: "Y-m-d",
			locale: Portuguese,
			altInput: true,
		})

		flatpickr(dataFinal, {
			dateFormat: "Y-m-d",
			locale: Portuguese,
			altInput: true,
		})

		imageFile.addEventListener("change", async () => {
			loader.show()
			const data = await uploadImagem(imageFile, 0, mensagemErro)
			loader.hide()

			imageInput.value = `${api}img/${data.results}`
			exibidorImagem(image, imageInput.value)
		})

		regulamento.addEventListener("change", async () => {
			const data = await uploadImagem(regulamento, 2, mensagemErro)
			imageInput.value = `${api}img/${data.results}`

			linkRegulamento.href = imageInput.value;
			linkRegulamento.classList.toggle('d-none', false)
		})
		

		const validator = new JustValidate(form, {
			validateBeforeSubmitting: true,
		})

		validator
			.addField(name, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="NomeCampeonatObrigatorio">${i18next.t("NomeCampeonatObrigatorio")}</span>`,
				},
			])
			.addField(dataInicial, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="DataInicialObrigatoria">${i18next.t("DataInicialObrigatoria")}</span>`,
				},
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
					errorMessage:  `<span class="i18" key="FormatoObrigatorio">${i18next.t("FormatoObrigatorio")}</span>`,
				},
			])
			.addField(numero, [
				{
					rule: 'required',
					errorMessage:`<span class="i18" key="QuantidadeObrigatoria">${i18next.t("QuantidadeObrigatoria")}</span>`,
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
					errorMessage:`<span class="i18" key="ImagemTamanho">${i18next.t("ImagemTamanho")}</span>`,
				}
			])
			.addField(nacao, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="PaisObrigatorio">${i18next.t("PaisObrigatorio")}</span>`,
				},
			])
			.addField(estado, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="EstadoObrigatorio">${i18next.t("EstadoObrigatorio")}</span>`,
				},
			])
			.addField(cidade, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="CidadeObrigatoria">${i18next.t("CidadeObrigatoria")}</span>`,
				},
			])
			.addField(bairro, [
				{
					rule: 'required',
					errorMessage: `<span class="i18" key="BairroObrigaorio">${i18next.t("BairroObrigaorio")}</span>`,
				},
			])
			.addField(descricao, [
				{
					rule: 'required',
					errorMessage:  `<span class="i18" key="DescricaoObrigatoria">${i18next.t("DescricaoObrigatoria")}</span>`,
				},
			])
			.onSuccess(async (e) => {
				e.preventDefault()
				// console.log('hello world')
				limparMensagem(mensagemErro)

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
					'rules': linkRegulamento.href
				})

				mensagemErro.textContent = ''
			})
	}

	const putCampeonato = async body => {
    const config = configuracaoFetch("PUT", body)
		console.log(config)
    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
    }

    const data = await executarFetch('championships', config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    if (!data) return false

    notificacaoSucesso(data.results[0])
	}

	const vincularTime = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('POST', { 'teamId': teamId, 'championshipId': parseInt(championshipId)}),
					response = await executarFetch('teams/championship', configFetch, callbackStatus)

		if (response.succeed) {
			notificacaoSucesso(i18next.t("VinculadoSucesso"))
		}
	}

	const desvincularTime = async teamId => {
		const callbackStatus = (data) => {
			notificacaoErro(data.results)
		}

		const configFetch = configuracaoFetch('DELETE', { 'teamId': teamId, 'championshipId': parseInt(championshipId)}),
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
					
		listarTimesVinculados(configFetch)

		const exibirPesquisa = botaoVincular.onclick = () => {
			pesquisaWrapper.classList.toggle('d-none')
			botaoVincular.innerHTML = `<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>`
			botaoVincular.onclick = () => {
				botaoVincular.innerHTML =  `<span class="i18" key="VincularNovo">${i18next.t("VincularNovo")}</span>`
				pesquisaWrapper.classList.toggle('d-none')
				botaoVincular.onclick = exibirPesquisa
			}
		}

		inputPesquisa.addEventListener('input', async () => {
			if (!inputPesquisa.value) {
				datalistPesquisa.innerHTML = ''
				return;
			}
			// loader.show()
			const valor = inputPesquisa.value,
						response = await executarFetch(`teams?query=${valor}&sport=${campeonato.sportsId}`, configFetch),
						times = response.results

			// loader.hide()

			datalistPesquisa.innerHTML = ''
			for (const time of times) {
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
		const formDeletarCampeonato = document.getElementById('delete-championship-form'),
					deleteAccountValidator = new JustValidate(formDeletarCampeonato, { validateBeforeSubmitting: true }),
					usernameInput = document.getElementById('delete-user-name-input'),
					deleteCampeonato = document.getElementById('delete-championship-check-input'),
					username = document.getElementById('offcanvasUserName')

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
			.addField(deleteCampeonato, [
					{
							rule: 'required',
							errorMessage:  `<span class="i18" key="ConfirmarExclusao">${i18next.t("ConfirmarExclusao")}</span>`,
					},
					{
							validator: (value) => value == 'Excluir Campeonato' ? true : false,
							errorMessage: `<span class="i18" key="Escreva">${i18next.t("Escreva")}</span>`,
					},
			])
			// submit
			.onSuccess(async(e) => {
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

	//#region coisas chatas

	const configMenu = document.querySelector('.config-menu'),
				configMenuList = document.querySelector('.config-menu-list'),
				configTitle = document.querySelector('.config-title'),
				mediaQueryMobile = window.matchMedia('(max-width: 575px)'),
				menuConfig = document.getElementsByClassName('menu-config'),
				mensagemErro = document.getElementById('mensagem-erro')

	let championshipId = document.getElementById('usernameChampionshipId')?.textContent

	if (!championshipId) {
		await new Promise(r => setTimeout(r, 300))
		championshipId = document.getElementById('usernameChampionshipId').textContent
	};
	loader.show()
	const dados = await executarFetch(`championships/${championshipId}`, configuracaoFetch('GET')),
				campeonato = dados.results
	
	loader.hide()

	if (mediaQueryMobile.matches) {
		configMenu.parentElement.classList.add('justify-content-center')
		configMenu.classList.add('mb-0')
	}

	configMenuList.addEventListener('click', e => {
		const target = e.target

		if (target.tagName !== 'BUTTON') return

		activateLi(target)
		configTitle.innerText = target.innerText
		changeConfigOptionsContext(target.getAttribute('menu'))
	})

	changeConfigOptionsContext(0)
	inicializarCampos()
	inicializarPaginaTimes()
	inicializarPaginaExclusao()
	//#endregion
}

document.addEventListener('DOMContentLoaded', init)
