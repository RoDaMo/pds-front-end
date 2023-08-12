import '../scss/tela-partida.scss'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import './utilidades/loader'
import portugues from './i18n/ptbr/tela-partida.json' assert { type: 'JSON' }
import ingles from './i18n/en/tela-partida.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);
const loader = document.createElement('app-loader');
document.body.appendChild(loader);


const init = async () => {
	const activateLi = (li) => {
		for (const item of abaBotoes) 
            item.classList.remove('active')

		li.classList.add('active')
	}

	const changeConfigOptionsContext = (menuSelecionado) => {
		for (const menu of menuConfig) menu.classList.toggle('d-none', menu.getAttribute('menu') != menuSelecionado)
	}

    const 
        matchDetailsOptions = document.getElementById('match-details-options'),
        abaBotoes = matchDetailsOptions.children,
        menuConfig = document.getElementsByClassName('menu-config')

    for (const configMenuOption of abaBotoes) {
		configMenuOption.addEventListener('click', () => {
			activateLi(configMenuOption)
			changeConfigOptionsContext(configMenuOption.getAttribute('menu'))
		})
	}

    changeConfigOptionsContext(0)
}

document.addEventListener('header-carregado', init)
