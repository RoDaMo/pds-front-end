import i18next from 'i18next';
import utilidadesEn from '../i18n/en/utilidades.json' assert { type: 'JSON' };
import utilidadesPt from '../i18n/ptbr/utilidades.json' assert { type: 'JSON' };

export const inicializarInternacionalizacao = (ingles, portugues) => {
  const lng = localStorage.getItem('lng');

  if (i18next.isInitialized) {
    i18next.addResources('en', 'translation', ingles)
    console.log('inicializado')
    i18next.addResources('ptbr', 'translation', portugues)
  } 
  else {
    console.log('nao inicializado')
    i18next.init({
      lng: lng,
      debug: true,
      defaultNS: 'translation',
      resources: {
        en: {
          translation: { ...ingles, ...utilidadesEn }
        },
        ptbr: {
          translation: { ...portugues, ...utilidadesPt }
        }
      },
    });
    console.log('lng', lng)
  }

  mudarLinguagem()
  document.addEventListener('nova-lingua', () => {
    i18next.changeLanguage(localStorage.getItem('lng'))
    mudarLinguagem()
  })
}

export const mudarLinguagem = () => {
  document.title = i18next.t('TituloPagina')
  for(const elemento of document.getElementsByClassName('i18')) {
    elemento.textContent = i18next.t(elemento.getAttribute('key'))
  }
  
  for (const elemento of document.getElementsByClassName('i18-placeholder')) {
    elemento.setAttribute('placeholder', i18next.t(elemento.getAttribute('key')))
  }
}
