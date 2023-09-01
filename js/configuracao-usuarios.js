import '../scss/configuracao-usuarios.scss'
import JustValidate from 'just-validate'
import { exibidorImagem } from './utilidades/previewImagem.js'
import { uploadImagem } from './utilidades/uploadImagem'
import { configuracaoFetch, executarFetch, limparMensagem, api } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import portugues from './i18n/ptbr/configuracao-usuario.json' assert { type: 'JSON' }
import ingles from './i18n/en/configuracao-usuario.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

function genericExibition(input, data, image) {
	input.value = `${api}img/${data.results}`
	exibidorImagem(image, input.value)
}

const pegarDados = async () => {
    const config = configuracaoFetch("GET")

    const callbackServidor = data => {
        mensagemErro.classList.add("text-danger")
        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
    }

    loader.show()
    const data = await executarFetch("auth/user", config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
    loader.hide()
    if (!data) return false
    data.results.picture = !data.result?.picture ? '../default-user-image.png' : data.result.picture
    return data.results
}

const configMenu = document.querySelector('.config-menu')
const configMenuList = document.querySelector('.config-menu-list'),
    abaBotoes = configMenuList.children
const configTitle = document.querySelector('.config-title')
const configOptionsWrapper = document.querySelector('.config-options-wrapper')

const deleteAccountForm = document.querySelector('#delete-account-form')
const deleteAccountUserNameInput = document.querySelector('#delete-account-user-name-input')
const deleteAccountCheckInput = document.querySelector('#delete-account-check-input')

const justifyTouchBtn = document.querySelectorAll('.justify-touch-btn')

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const mediaQueryTablet = window.matchMedia('(max-width: 992px)')
const mediaQueryDesktop = window.matchMedia('(max-width: 1199px)')

const mensagemErro = document.getElementById("mensagem-erro")

const deleteAccountValidator = new JustValidate(deleteAccountForm, {
    validateBeforeSubmitting: true,
})


document.addEventListener('header-carregado', async () => {
    await changeConfigOptionsContext("1")
    const username = document.getElementById('offcanvasUserName').textContent

    deleteAccountValidator
        .addField(deleteAccountUserNameInput, [
            {
                rule: 'required',
                errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeUsuarioObrigatorio")}</span>`,
            },
            {
                validator: (value) => username == value,
                errorMessage: `<span class="i18" key="NomeUsuarioInvalido">${i18next.t("NomeUsuarioInvalido")}</span>`
            }
        ])
        // submit
        .onSuccess(async (e) => {
            e.preventDefault()
            loader.show()
            const configFetch = configuracaoFetch('DELETE'),
                response = await executarFetch(`auth/user`, configFetch)

            loader.hide()

            if (response.succeed) {
                window.location.assign('/index.html');
            }
        })
})


if (mediaQueryMobile.matches) {
    configMenu.parentElement.classList.add('justify-content-center')
    configMenu.classList.add('mb-0')
}

for (const configMenuOption of abaBotoes) {
    configMenuOption.addEventListener('click', () => {
        activateLi(configMenuOption)
        configTitle.innerText = configMenuOption.innerText
        changeConfigOptionsContext(configMenuOption.getAttribute('menu'))
    })
}

function activateLi(li) {
    for (const item of configMenuList.children) {
        item.classList.remove('active')
    }

    li.classList.add('active')
}

async function changeConfigOptionsContext(t) {
    loader.show()
    const dados = await pegarDados()
    loader.hide()
    document.getElementById('biografia').textContent = dados.bio
    document.getElementById('email').textContent = dados.email
    document.getElementById('nome-usuario').textContent = dados.userName
    document.getElementById('nome').textContent = dados.nome

    if (dados.profileImg) {
        exibidorImagem(document.getElementById("config-user-pic"), dados.profileImg)
    } else {
        exibidorImagem(document.getElementById("config-user-pic"), '../default-user-image.png')
    }

    switch (parseInt(t)) {
        case 1:
            configOptionsWrapper.innerHTML = /*html*/`
                <h5 class="i18 text-center" key="Perfil">${i18next.t("Perfil")}</h5>
                <hr class="my-2">
                <div class="row mt-5 m-auto justify-mobile-pic">
                    <div class="col-1 position-relative p-0 overflow-hidden rounded-circle border border-2 config-user-pic-mod-wrapper">
                        <!-- $ Imagem de Pefil do Usuário  ../default-user-image.png - preview? -->
                        <img src="../default-user-image.png" alt="config-user-pic-mod" class="img-fluid position-absolute w-100 h-100" id="config-user-pic-mod">
                    </div>
                    <div class="col-12 col-md">

                        <div class="row flex-column justify-mobile-pic justify-content-start align-items-center my-auto upload-container h-100">
                            <div class="col d-flex justify-content-center d-none d-lg-flex">
                                <div class="upload-drop-zone justify-content-center w-75 rounded-5" id="config-user-drop-zone">
                                    <span class="i18 my-3 text-muted" key="DropZoneText">${i18next.t("DropZoneText")}</span>
                                </div>
                            </div>

                            <span class="d-none my-2 d-lg-block i18" key="Ou">${i18next.t("Ou")}</span>

                            <div class="col d-flex align-items-center my-auto upload-image-drop-label">
                                <label for="config-team-image-input" class="btn play-btn-primary mt-3 mt-md-0 i18" key="AlterarFoto">${i18next.t("AlterarFoto")}</label>
                            </div>
                        </div>
                        <div class="text-danger" id="erros-imagem"></div>

                    </div>
                </div>

                <div class="mt-4">
                    <form id="update-profile-form" class="row">
                        <div class="col-12 mt-3">
                            <label for="config-user-name-input" class="form-label i18" key="NomeUsuario">${i18next.t("NomeUsuario")}</label>
                            <input maxLength="20" type="text" class="form-control width-config-input i18-placeholder" key="NomeUsuario" id="config-user-name-input" placeholder="${i18next.t("NomeUsuario")}">
                        </div>
                        <div class="col-12 mt-3">
                            <label for="config-user-bio-input" class="form-label">Bio</label>
                            <textarea maxLength="100" class="form-control rounded-4 width-config-input" id="config-user-bio-input" rows="3" placeholder="Bio"></textarea>
                        </div>

                        <input type="file" class="d-none" id="config-user-pic-input" accept=".jpeg, .jpg, .png, .webp, .gif, .bmp, .tiff">
                        <input type="hidden" name="logo" id="emblema">

                        <div class="col-12 mt-4 justify-touch-btn">
                            <button type="submit" class="btn play-btn-primary i18" key="Salvar" id='salvar'>${i18next.t("Salvar")}</button>
                        </div>
                    </form>
                </div>
            `
            const updateProfileForm = document.querySelector('#update-profile-form')
            const updateProfileUserNameInput = document.querySelector('#config-user-name-input')
            const updateProfileBioInput = document.querySelector('#config-user-bio-input')
            const updateProfileUserPicInput = document.querySelector('#config-user-pic-input')
            const emblema = document.getElementById("emblema")
            const configUserDropZone = document.querySelector('#config-user-drop-zone')

            const dropZones = document.querySelectorAll(".upload-drop-zone")

            for	(const dropZone of dropZones) {
                dropZone.addEventListener("dragover", e => {
                    e.preventDefault()
                    dropZone.classList.add("dragover")
                })

                dropZone.addEventListener("dragleave", e => {
                    e.preventDefault()
                    dropZone.classList.remove("dragover")
                })

                dropZone.addEventListener("drop", async e => {
                    e.preventDefault()
                    dropZone.classList.remove("dragover")
                })	
            }

            updateProfileUserNameInput.value = dados.userName
            updateProfileBioInput.value = dados.bio
            emblema.value = dados.profileImg

            if (dados.profileImg) {
                exibidorImagem(document.getElementById("config-user-pic-mod"), dados.profileImg)
            } else {
                exibidorImagem(document.getElementById("config-user-pic-mod"), '../default-user-image.png')
            }


            const updateProfileValidator = new JustValidate(updateProfileForm, {
                validateBeforeSubmitting: true,
            })

            function case1() {
                async function postPerfil(endpoint, body) {
                    const config = configuracaoFetch("PUT", body)

                    const callbackServidor = data => {
                        mensagemErro.classList.add("text-danger")
                        data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
                    }

                    loader.show()
                    const data = await executarFetch(endpoint, config, (res) => mensagemErro.textContent = res.results[0], callbackServidor)
                    loader.hide()
                    if (!data) return false

                    notificacaoSucesso(data.results[0])
                    return true
                }

                updateProfileValidator
                    .addField(updateProfileUserNameInput, [
                        {
                            rule: 'required',
                            errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t('NomeUsuarioObrigatorio')}</span>`,
                        },
                        {
                            rule: 'minLength',
                            value: 4,
                            errorMessage: `<span class="i18" key="NomeUsuarioMinimo">${i18next.t("NomeUsuarioMinimo")}</span>`,
                        },
                        {
                            rule: 'maxLength',
                            value: 20,
                            errorMessage: `<span class="i18" key="NomeUsuarioMaximo">${i18next.t("NomeUsuarioMaximo")}</span>`,
                        },
                        {
                            rule: 'customRegexp',
                            value: /^[A-Za-z0-9_-]*$/,
                            errorMessage: `<span class="i18" key="NomeUsuarioInvalidoInput">${i18next.t("NomeUsuarioInvalidoInput")}</span>`,
                        },
                    ])
                    .addField(updateProfileBioInput, [
                        {
                            rule: 'minLength',
                            value: 10,
                            errorMessage: `<span class="i18" key="BioMin">${i18next.t("BioMin")}</span>`,
                        },
                        {
                            rule: 'maxLength',
                            value: 100,
                            errorMessage: `<span class="i18" key="BioMax">${i18next.t("BioMax")}</span>`,
                        },
                        {
                            validator: (value) => {
                                return updateProfileUserNameInput.value.length > 0 ? true : value.length > 0
                            },
                            errorMessage: `<span class="i18" key="Preencher">${i18next.t("Preencher")}</span>`,
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
                                }
                            }
                        }
                    ], { errorsContainer: document.getElementById('erros-imagem') })
                    // submit
                    .onSuccess(async (e) => {
                        // campo vazio mantem valor original
                        e.preventDefault()
                        limparMensagem(mensagemErro)

                        loader.show()
                        await postPerfil("userconfigurations", {
                            "Username": updateProfileUserNameInput.value,
                            "Bio": updateProfileBioInput.value,
                            "Picture": emblema.value
                        })
                        loader.hide()
                    })
                
            }
                
            document.addEventListener('nova-lingua', case1)
            case1()

            configUserDropZone.addEventListener("drop", async e => {
				loader.show()
				const data = await uploadImagem(e.dataTransfer, 3, mensagemErro)
				loader.hide()
	
				if (Array.isArray(data.results))
					return;
	
                genericExibition(emblema, data, document.getElementById("config-user-pic-mod"))
			})

            updateProfileUserPicInput.addEventListener("change", async () => {
                const isValid = await updateProfileValidator.revalidateField(updateProfileUserPicInput)
                if (!isValid) return;

                loader.show()
                const data = await uploadImagem(updateProfileUserPicInput, 1, mensagemErro)
                loader.hide()

                if (Array.isArray(data.results))
                    return;

                emblema.value = `${api}img/${data.results}`
                exibidorImagem(document.getElementById("config-user-pic-mod"), emblema.value)
            })


            break

        case 2:
            configOptionsWrapper.innerHTML = /*html*/`
                    <h5 class="i18 text-center" key="Conta">${i18next.t("Conta")}</h5>
                    <hr class="my-2">
                    
                    <div class="mt-1">
                        <form id="update-account-form" class="row">
                            <span id="mensagem-erro-nome"></span>
                            <div class="col-12 mt-3">
                                <label for="config-user-realname-input" class="form-label i18" key="NomeReal">${i18next.t("NomeReal")}</label>
                                <input maxLength="100" type="text" class="form-control width-config-input i18-placeholder" key="NomeReal" id="config-user-realname-input" placeholder="${i18next.t("NomeReal")}">
                            </div>
                            <div class="col-12 mt-4 justify-touch-btn">
                                <button type="submit" class="btn play-btn-primary i18" key="Salvar">${i18next.t("Salvar")}</button>
                            </div>
                        </form>
                    </div>

                    <h5 class="text-danger text-center mt-5 i18" key="ExcluirConta">${i18next.t("ExcluirConta")}</h5>
                    <hr class="my-2">
                    
                    <div class="mt-1">
                        <p class="text-danger fs-6">
                            <span class="i18" key="Ao"> ${i18next.t("Ao")} </span>
                           
                            <span class="fw-bold i18" key="Processo"> ${i18next.t("Processo")} </span> <span class="i18" key="ExclusaoTexto">${i18next.t("ExclusaoTexto")}</span> <br><br>
                            <span class="i18" key="Certificar">${i18next.t("Certificar")}</span>
                        </p>

                        <!-- modal -->
                        <div class="justify-touch-btn">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#deleteAccount" class="btn btn-danger mt-3 i18" key="ExcluirConta">${i18next.t("ExcluirConta")}</button>
                        </div>
                    </div>
                `

            const updateAccountForm = document.querySelector('#update-account-form')
            const updateAccountRealNameInput = document.querySelector('#config-user-realname-input')
            const mensagemErroNome = document.getElementById('mensagem-erro-nome')

            updateAccountRealNameInput.value = dados.name

            async function postName(endpoint, body) {
                const callbackServidor = data => {
                    mensagemErroNome.classList.add("text-danger")
                    data.results.forEach(element => mensagemErroNome.innerHTML += `${element}<br>`);
                }

                loader.show()
                const data = await executarFetch(endpoint, configuracaoFetch("PUT", body), callbackServidor, callbackServidor)
                loader.hide()
                if (!data) return false

                notificacaoSucesso(data.results[0])
                return true
            }


            function case2() {

                const updateAccountValidator = new JustValidate(updateAccountForm, {
                    validateBeforeSubmitting: true,
                })
                updateAccountValidator
                    .addField(updateAccountRealNameInput, [
                        {
                            rule: 'required',
                            errorMessage: `<span class="i18" key="NomeRealObrigatorio">${i18next.t("NomeRealObrigatorio")}</span>`,
                        },
                        {
                            rule: 'minLength',
                            value: 4,
                            errorMessage: `<span class="i18" key="NomeRealMinimo">${i18next.t("NomeRealMinimo")}</span>`,
                        },
                        {
                            rule: 'maxLength',
                            value: 200,
                            errorMessage: `<span class="i18" key="NomeRealMaximo">${i18next.t("NomeRealMaximo")}</span>`,
                        },
                    ])
                    // submit
                    .onSuccess(async (e) => {
                        e.preventDefault()
                        limparMensagem(mensagemErroNome)

                        await postName("userconfigurations", {
                            "Name": updateAccountRealNameInput.value,
                        })
                    })
            }

            document.addEventListener('nova-lingua', case2)
            case2()

            break

        case 3:
            configOptionsWrapper.innerHTML = /*html*/`
                    <h5 class="i18 text-center" key="MudarSenha">${i18next.t("MudarSenha")}</h5>
                    <hr class="my-2">
                    
                    <div class="mt-1">
                        <form id="change-password-form" class="row">
                            <span id="mensagem-erro-redefinicao"></span>
                            <div class="col-12 mt-3">
                                <label for="config-user-pass-input" class="form-label i18" key="SenhaAtual">${i18next.t("SenhaAtual")}</label>
                                <div class="col col-md-9 mt-1 d-flex position-relative">
                                    <div class="input-wrapper w-100">
                                        <input type="password" class="form-control i18-placeholder"   key="SenhaAtual" id="config-user-pass-input" name="config-user-pass-input" placeholder="${i18next.t("SenhaAtual")}" autocomplete="on">
                                    </div>
                                    <div id="olhos">
                                        <i id="olho-aberto" class="btn btn-success rounded-0 rounded-end bi bi-eye text-light position-absolute end-0"></i>
                                        <i id="olho-fechado" class="btn btn-success rounded-0 rounded-end bi bi-eye-slash text-light position-absolute end-0 d-none"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 mt-3">
                                <label for="config-user-pass-input" class="form-label i18" key="NovaSenha">${i18next.t("NovaSenha")}</label>
                                <div class="col col-md-9 mt-1 d-flex position-relative">
                                    <div class="input-wrapper w-100">
                                        <input type="password" class="form-control i18-placeholder" key="NovaSenha" id="config-user-newpass-input" name="config-user-newpass-input" placeholder="${i18next.t("NovaSenha")}" autocomplete="on">
                                    </div>
                                    <div id="olhos-nova-senha">
                                        <i id="olho-aberto-nova-senha" class="btn btn-success rounded-0 rounded-end bi bi-eye text-light position-absolute end-0"></i>
                                        <i id="olho-fechado-nova-senha" class="btn btn-success rounded-0 rounded-end bi bi-eye-slash text-light position-absolute end-0 d-none"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5 col-lg-3 mt-4 justify-touch-btn">
                                <button type="submit" class="btn play-btn-primary i18" key="SalvarSenha">${i18next.t("SalvarSenha")}</button>
                            </div>
                            <div class="col form-text text-success mt-auto mb-0 pb-0 justify-touch-btn">
                                <a href="recuperar-senha.html" class="fs-6 fw-semibold i18" key="RecuperarSenha">${i18next.t("RecuperarSenha")}</a>
                            </div>
                        </form>
                    </div>
                `

            const olhos = document.getElementById("olhos")
            const olhosNovaSenha = document.getElementById("olhos-nova-senha")
            const olhoAberto = document.getElementById("olho-aberto")
            const olhoAbertoNovaSenha = document.getElementById("olho-aberto-nova-senha")
            const olhoFechado = document.getElementById("olho-fechado")
            const olhoFechadoNovaSenha = document.getElementById("olho-fechado-nova-senha")
            const mensagemErroRedefinicao = document.getElementById('mensagem-erro-redefinicao')

            const visualizarSenha = (olhos, olhoAberto, olhoFechado, senha) => {
                olhos.addEventListener('click', () => {
                    senha.type == "password" ? senha.type = "text" : senha.type = "password"
                    olhoAberto.classList.toggle("d-none")
                    olhoFechado.classList.toggle("d-none")
                })
            }

            const changePasswordForm = document.querySelector('#change-password-form')
            const changePasswordInput = document.querySelector('#config-user-pass-input')
            const changeNewPasswordInput = document.querySelector('#config-user-newpass-input')

            visualizarSenha(olhos, olhoAberto, olhoFechado, changePasswordInput)
            visualizarSenha(olhosNovaSenha, olhoAbertoNovaSenha, olhoFechadoNovaSenha, changeNewPasswordInput)

            const changePasswordValidator = new JustValidate(changePasswordForm, {
                validateBeforeSubmitting: true,
            })

            function case3() {
                changePasswordValidator
                    .addField(changePasswordInput, [
                        {
                            rule: 'required',
                            errorMessage: `<span class="i18" key="SenhaAtualObrigatoria">${i18next.t("SenhaAtualObrigatoria")}</span>`,
                        },
                    ])
                    .addField(changeNewPasswordInput, [
                        {
                            rule: 'required',
                            errorMessage: `<span class="i18" key="NovaSenhaObrigatoria">${i18next.t("NovaSenhaObrigatoria")}</span>`,
                        },
                        {
                            rule: 'customRegexp',
                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{4,}$/,
                            errorMessage: `<span class="i18" key="SenhaInvalida">${i18next.t("SenhaInvalida")}</span>`,
                        },
                    ])
                    .onSuccess(async (e) => {
                        limparMensagem(mensagemErro)

                        const resultado = await postRedefinirSenha("userconfigurations/updatepassword", {
                            "NewPassword": changeNewPasswordInput.value,
                            "CurrentPassword": changePasswordInput.value
                        })

                        if (resultado) {
                            document.getElementById('change-password-form').reset()
                        }
                    })
            }

            const postRedefinirSenha = async (endpoint, body) => {
                const config = configuracaoFetch("PUT", body)
                limparMensagem(mensagemErroRedefinicao)

                const callbackServidor = data => {
                    mensagemErroRedefinicao.classList.add("text-danger")
                    data.results.forEach(element => mensagemErroRedefinicao.innerHTML += `${element}<br>`);
                }

                loader.show()
                const data = await executarFetch(endpoint, config, callbackServidor, callbackServidor)
                loader.hide()
                if (!data) return false

                notificacaoSucesso(data.results[0])
                return true
            }
            document.addEventListener('nova-lingua', case3)
            case3()

            break

        // case 'Emails/Sessões':
        //     configOptionsWrapper.innerHTML = ``
        //     break

        default:
            break
    }
}

