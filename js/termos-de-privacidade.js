import portugues from './i18n/ptbr/termos-de-privacidade.json' assert { type: 'JSON' }
import ingles from './i18n/en/termos-de-privacidade.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues)
