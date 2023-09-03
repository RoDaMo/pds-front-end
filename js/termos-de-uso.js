import portugues from './i18n/ptbr/termos-de-uso.json' assert { type: 'JSON' }
import ingles from './i18n/en/termos-de-uso.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues)
window.dispatchEvent(new Event('pagina-load'))
