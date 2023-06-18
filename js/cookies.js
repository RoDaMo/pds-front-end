import portugues from './i18n/ptbr/cookies.json' assert { type: 'JSON' }
import ingles from './i18n/en/cookies.json' assert { type: 'JSON' }
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues)
