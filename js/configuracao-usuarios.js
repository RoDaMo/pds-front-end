import '../scss/configuracao-usuarios.scss'

const configMenuList = document.querySelector('.config-menu-list')
const configTitle = document.querySelector('.config-title')

configMenuList.addEventListener('click', e => {
    let target = e.target

    if (target.tagName !== 'BUTTON') return

    activateLi(target)

    configTitle.innerText = target.innerText

})

function activateLi(li) {
    for (let item of configMenuList.children) {
        item.classList.remove('active')
    }

    li.classList.add('active')
}
