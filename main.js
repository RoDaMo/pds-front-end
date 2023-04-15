
import { inicializarInternacionalizacao } from './js/utilidades/internacionalizacao'
import globalEn from './js/i18n/en/main.json' assert { type: 'JSON' };
import globalPt from './js/i18n/ptbr/main.json' assert { type: 'JSON' };
import '/scss/styles.scss'
import * as bootstrap from 'bootstrap'

if (!localStorage.getItem('lng')) {
  localStorage.setItem('lng', 'ptbr')
}

document.addEventListener('DOMContentLoaded', () => inicializarInternacionalizacao(globalEn, globalPt))