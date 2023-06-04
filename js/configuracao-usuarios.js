import '../scss/configuracao-usuarios.scss'
import JustValidate from 'just-validate'

const configMenu = document.querySelector('.config-menu')
const configMenuList = document.querySelector('.config-menu-list')
const configTitle = document.querySelector('.config-title')
const configOptionsWrapper = document.querySelector('.config-options-wrapper'),
      username = document.getElementById('offcanvasUserName')

const deleteAccountForm = document.querySelector('#delete-account-form')
const deleteAccountUserNameInput = document.querySelector('#delete-account-user-name-input')
const deleteAccountCheckInput = document.querySelector('#delete-account-check-input')

const justifyTouchBtn = document.querySelectorAll('.justify-touch-btn')

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const mediaQueryTablet = window.matchMedia('(max-width: 992px)')
const mediaQueryDesktop = window.matchMedia('(max-width: 1199px)')

const deleteAccountValidator = new JustValidate(deleteAccountForm, {
    validateBeforeSubmitting: true,
})

document.addEventListener('DOMContentLoaded', () => {
    changeConfigOptionsContext(configTitle.innerText)
})

deleteAccountValidator
    .addField(deleteAccountUserNameInput, [
        {
            rule: 'required',
            errorMessage: 'Seu nome de usuário é obrigatório.',
        },
        {
            validator: (value) => username.textContent == value
        }
    ])
    .addField(deleteAccountCheckInput, [
        {
            rule: 'required',
            errorMessage: 'Você deve confirmar a exclusão da conta.',
        },
        {
            validator: (value) => value == 'Excluir Conta' ? true : false,
            errorMessage: 'Escreva "Excluir Conta" para confirmar a exclusão da conta.',
        },
    ])
    // submit
    .onSuccess(async(e) => {
        e.preventDefault()
    })

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
                <div class="row mt-3 justify-mobile-pic">
                    <div class="col-1 position-relative p-0 overflow-hidden rounded-circle config-user-pic-mod-wrapper">
                        <!-- $ Imagem de Pefil do Usuário  ../default-user-image.png - preview? -->
                        <img src="../default-user-image.png" alt="config-user-pic-mod" class="img-fluid position-absolute w-100 h-100" id="config-user-pic-mod">
                    </div>
                    <div class="col-12 col-md mt-2">
                        <div class="d-flex justify-mobile-pic align-items-end h-100">
                            <label for="config-user-pic-input" class="btn play-btn-primary">Alterar Foto</label>
                            <input type="file" class="d-none" id="config-user-pic-input">
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <form id="update-profile-form" class="row">
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

            const updateProfileForm = document.querySelector('#update-profile-form')
            const updateProfileUserNameInput = document.querySelector('#config-user-name-input')
            const updateProfileBioInput = document.querySelector('#config-user-bio-input')
            const updateProfileUserPicInput = document.querySelector('#config-user-pic-input')

            const updateProfileValidator = new JustValidate(updateProfileForm, {
                validateBeforeSubmitting: true,
            })

            updateProfileValidator
                .addField(updateProfileUserNameInput, [
                    {
                        validator: (value) => {
                            return updateProfileBioInput.value.length > 0 ? true : value.length > 0 ? true : false
                        },
                        errorMessage: ' ',
                    },
                ])
                .addField(updateProfileBioInput, [
                    {
                        rule: 'maxLength',
                        value: 150,
                        errorMessage: 'Sua bio deve possuir no máximo 150 caracteres.',
                    },
                    {
                        validator: (value) => {
                            return updateProfileUserNameInput.value.length > 0 ? true : value.length > 0 ? true : false
                        },
                        errorMessage: 'Você deve preencher pelo menos um dos campos.',
                    }
                ])
                .addField(updateProfileUserPicInput, [
                    {
                        rule: 'files',
                        value: {
                            files: {
                                extensions: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
                                maxSize: 5000000,
                                types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'],
                            },
                        },
                        errorMessage: 'Tamanho máximo da imagem: 5mb',
                    },
                    {
                        validator: (value) => {
                            return updateProfileUserNameInput.value.length > 0 || updateProfileBioInput.value.length > 0 ? true : value.length > 0 ? true : false
                        },
                        errorMessage: ' ',
                    }
                ])

                // submit
                .onSuccess(async(e) => {
                    // campo vazio mantem valor original
                    e.preventDefault()
                })

            break

        case 'Conta':

            configOptionsWrapper.innerHTML = `
                    <p class="position-absolute config-title fw-semibold">Conta</p>
                    <h5>Informações</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <form id="update-account-form" class="row">
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
                            <button type="button" data-bs-toggle="modal" data-bs-target="#deleteAccount" class="btn btn-danger mt-3">Excluir Conta</button>
                        </div>
                    </div>
                `

                const updateAccountForm = document.querySelector('#update-account-form')
                const updateAccountRealNameInput = document.querySelector('#config-user-realname-input')

                const updateAccountValidator = new JustValidate(updateAccountForm, {
                    validateBeforeSubmitting: true,
                })

                updateAccountValidator
                    .addField(updateAccountRealNameInput, [
                        {
                            rule: 'required',
                            errorMessage: 'Seu nome real é obrigatório.',
                        },
                    ])
                    // submit
                    .onSuccess(async(e) => {
                        e.preventDefault()
                    })

            break

        case 'Senha':
            configOptionsWrapper.innerHTML = `
                    <p class="position-absolute config-title fw-semibold">Senha</p>
                    <h5>Mudar Senha</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <form id="change-password-form" class="row">
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

                const changePasswordForm = document.querySelector('#change-password-form')
                const changePasswordInput = document.querySelector('#config-user-pass-input')
                const changeNewPasswordInput = document.querySelector('#config-user-newpass-input')

                const changePasswordValidator = new JustValidate(changePasswordForm, {
                    validateBeforeSubmitting: true,
                })

                changePasswordValidator
                    .addField(changePasswordInput, [
                        {
                            rule: 'required',
                            errorMessage: 'Sua senha atual é obrigatória.',
                        },
                    ])
                    .addField(changeNewPasswordInput, [
                        {
                            rule: 'required',
                            errorMessage: 'Sua nova senha é obrigatória.',
                        },
                        {
                            rule: 'customRegexp',
                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{4,}$/,
                            errorMessage: "Sua senha deve conter pelo menos 4 caracteres, uma letra maiúscula, uma letra minúscula e um número.",
                        },
                    ])
            break
        
        // case 'Emails/Sessões':
        //     configOptionsWrapper.innerHTML = ``
        //     break

        default:
            break
    }
}

