import '../scss/pagina-usuarios.scss'

// incluir lenis.js

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')

const sportsSection = document.querySelector('.sports-section')
const ssSlider = document.querySelector('.ss-slider')
const ssFirstContentWrapper = document.querySelector('.ss-first-content-wrapper')
const ssFirstContent = document.querySelector('.ss-first-content')
const ssTeamContent = document.querySelectorAll('.ss-team-content')
const ssTeamName = document.querySelectorAll('.ss-team-name')

if (mediaQueryMobile.matches) {
    document.addEventListener('DOMContentLoaded', () => {
        if (ssTeamContent.length == 0) {
            ssFirstContent.classList.add('justify-content-center', 'align-items-center')
            ssFirstContent.innerHTML = `
                <div>
                    <p>Nenhum time por aqui...</p>
                </div>
            `
        }
    })

    ssSlider.classList.replace('w-100', 'vw-100')
    sportsSection.classList.remove('ms-4')
    ssFirstContentWrapper.classList.replace('w-90', 'w-100')
    ssTeamContent.forEach(content => {
        // Só 75% se tiver mais de 1 elemento
        if (ssTeamContent.length > 1) {
            content.classList.replace('w-100', 'w-75')
        } else {
            content.classList.replace('w-100', 'w-87')
        }
         
        content.classList.add('mx-2')
    })
    ssTeamName.forEach(name => {
        name.parentElement.classList.add('w-50')
    })

}