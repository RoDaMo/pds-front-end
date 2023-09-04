import portugues from './i18n/ptbr/sobre-nos.json' assert { type: 'JSON' }
import ingles from './i18n/en/sobre-nos.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues)

window.dispatchEvent(new Event('pagina-load'))
