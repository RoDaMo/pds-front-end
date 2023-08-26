import { Tooltip } from "bootstrap"

const chaveamento = {
  init() {
    const tooltips = document.getElementsByClassName('partida-pilula')
    const tooltipBootstrap = [...tooltips].map(tooltip => new Tooltip(tooltip))
    const proximaPartida = document.getElementById('proxima-rodada'),
          rodadaAnterior = document.getElementById('anterior-rodada'),
          rodadaAtual = document.getElementById('rodada-atual')

    proximaPartida.addEventListener('click', () => {
      rodadaAtual.textContent = parseInt(rodadaAtual.textContent) + 1
      if (rodadaAtual.textContent != 1) {
        rodadaAnterior.classList.remove('invisible')
      }
      else {
        rodadaAnterior.classList.add('invisible')
      }
    })

    rodadaAnterior.addEventListener('click', () => {
      rodadaAtual.textContent = parseInt(rodadaAtual.textContent) - 1
      if (rodadaAtual.textContent != 1) {
        rodadaAnterior.classList.remove('invisible')
      }
      else {
        rodadaAnterior.classList.add('invisible')
      }
    })
  }
}

chaveamento.init()