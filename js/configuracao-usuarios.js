import '../scss/configuracao-usuarios.scss'

const configMenu = document.querySelector('.config-menu')
const configMenuList = document.querySelector('.config-menu-list')
const configTitle = document.querySelector('.config-title')
const configOptionsWrapper = document.querySelector('.config-options-wrapper')

const justifyTouchBtn = document.querySelectorAll('.justify-touch-btn')

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const mediaQueryTablet = window.matchMedia('(max-width: 992px)')
const mediaQueryDesktop = window.matchMedia('(max-width: 1199px)')

if (mediaQueryMobile.matches) {
    configMenu.parentElement.classList.add('justify-content-center')
    configMenu.classList.add('mb-0')
}

configMenuList.addEventListener('click', e => {
    let target = e.target

    if (target.tagName !== 'BUTTON') return

    activateLi(target)

    configTitle.innerText = target.innerText

    changeConfigOptionsContext(target.innerText)

})

function activateLi(li) {
    for (let item of configMenuList.children) {
        item.classList.remove('active')
    }

    li.classList.add('active')
}

function changeConfigOptionsContext(t) {
    switch (t) {
        case 'Perfil':
            configOptionsWrapper.innerHTML = `
                <p class="position-absolute config-title fw-semibold">Perfil</p>
                <h5>Informações</h5>
                <hr>
                <div class="row mt-3">
                    <div class="col-1 position-relative p-0 overflow-hidden rounded-circle config-user-pic-mod-wrapper">
                        <!-- $ Imagem de Pefil do Usuário  ../default-user-image.png - preview? -->
                        <img src="https://www.rd.com/wp-content/uploads/2019/09/Cute-cat-lying-on-his-back-on-the-carpet.-Breed-British-mackerel-with-yellow-eyes-and-a-bushy-mustache.-Close-up-e1573490045672.jpg" alt="config-user-pic-mod" class="img-fluid position-absolute w-100 h-100" id="config-user-pic-mod">
                    </div>
                    <div class="col-12 col-md mt-2">
                        <div class="d-flex align-items-end h-100">
                            <label for="config-user-pic-input" class="btn play-btn-primary">Alterar Foto</label>
                            <input type="file" class="d-none" id="config-user-pic-input">
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <form action="" class="row">
                        <div class="col-12 mt-3">
                            <label for="config-user-name-input" class="form-label">Nome de Usuário</label>
                            <input type="text" class="form-control width-config-input" id="config-user-name-input" placeholder="Nome de Usuário">
                        </div>
                        <div class="col-12 mt-3">
                            <label for="config-user-bio-input" class="form-label">Bio</label>
                            <textarea class="form-control rounded-4 width-config-input" id="config-user-bio-input" rows="3" placeholder="Bio"></textarea>
                        </div>
                        <div class="col-12 mt-4 justify-touch-btn">
                            <button type="submit" class="btn play-btn-primary">Atualizar Perfil</button>
                        </div>
                    </form>
                </div>
            `
            break

        case 'Conta':
            configOptionsWrapper.innerHTML = `
                    <p class="position-absolute config-title fw-semibold">Conta</p>
                    <h5>Informações</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <form action="" class="row">
                            <div class="col-12 mt-3">
                                <label for="config-user-realname-input" class="form-label">Nome Real</label>
                                <input type="text" class="form-control width-config-input" id="config-user-realname-input" placeholder="Nome Real">
                            </div>
                            <div class="col-12 mt-4 justify-touch-btn">
                                <button type="submit" class="btn play-btn-primary">Atualizar Conta</button>
                            </div>
                        </form>
                    </div>

                    <h5 class="text-danger mt-5">Excluir Conta</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <p class="text-danger fs-6">
                            Ao clicar no botão de excluir conta, você estará dando início ao processo de 
                            <span class="fw-bold"> exclusão permanente da sua conta </span> e não será possível voltar atrás. <br><br>
 
                            Certifique-se de que realmente deseja prosseguir antes de tomar essa decisão.
                        </p>

                        <!-- modal -->
                        <div class="justify-touch-btn">
                            <button class="btn btn-danger mt-3">Excluir Conta</button>
                        </div>
                    </div>
                `
            break

        case 'Senha':
            configOptionsWrapper.innerHTML = `
                    <p class="position-absolute config-title fw-semibold">Senha</p>
                    <h5>Mudar Senha</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <form action="" class="row">
                            <div class="col-12 mt-3">
                                <label for="config-user-pass-input" class="form-label">Senha Atual</label>
                                <input type="password" class="form-control width-config-input" id="config-user-pass-input" name="config-user-pass-input" placeholder="Senha Atual" autocomplete="on">
                            </div>
                            <div class="col-12 mt-3">
                                <label for="config-user-pass-input" class="form-label">Nova Senha</label>
                                <input type="password" class="form-control width-config-input" id="config-user-newpass-input" name="config-user-newpass-input" placeholder="Nova Senha" autocomplete="on">
                            </div>
                            <div class="col-md-5 col-lg-3 mt-4 justify-touch-btn">
                                <button type="submit" class="btn play-btn-primary">Atualizar Senha</button>
                            </div>
                            <div class="col form-text text-success mt-auto mb-0 pb-0 justify-touch-btn">
                                <a href="recuperar-senha.html" class="fs-6 fw-semibold">Recuperar senha</a>
                            </div>
                        </form>
                    </div>
                `
            break
        
        // case 'Emails/Sessões':
        //     configOptionsWrapper.innerHTML = ``
        //     break

        default:
            break
    }
}