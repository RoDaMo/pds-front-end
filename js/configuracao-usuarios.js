import '../scss/configuracao-usuarios.scss'
import JustValidate from 'just-validate'
import {exibidorImagem} from '../js/utilidades/previewImagem'
import { uploadImagem } from './utilidades/uploadImagem'
import { configuracaoFetch, executarFetch, limparMensagem } from "./utilidades/configFetch"
import { notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import portugues from './i18n/ptbr/configuracao-usuario.json' assert { type: 'JSON' }
import ingles from './i18n/en/configuracao-usuario.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const pegarDados = async() => {
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
const configMenuList = document.querySelector('.config-menu-list')
const configTitle = document.querySelector('.config-title')
const configOptionsWrapper = document.querySelector('.config-options-wrapper')
let username = document.getElementById('offcanvasUserName')

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


document.addEventListener('DOMContentLoaded', async () => {
    changeConfigOptionsContext("1")
    await new Promise(r => setTimeout(r, 2000))
    if (!username) {
		await new Promise(r => setTimeout(r, 100))
		username = document.getElementById('usernameChampionshipId').textContent
	};

    deleteAccountValidator
        .addField(deleteAccountUserNameInput, [
            {
                rule: 'required',
                errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeUsuarioObrigatorio")}</span>`,
            },
            {
                validator: (value) => username.textContent == value
            }
        ])
        // submit
        .onSuccess(async(e) => {
            e.preventDefault()
        })
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

    changeConfigOptionsContext(target.getAttribute('menu'))
})

function activateLi(li) {
    for (let item of configMenuList.children) {
        item.classList.remove('active')
    }

    li.classList.add('active')
}

async function changeConfigOptionsContext(t) {
    const dados = await pegarDados()
    console.log(dados)
    document.getElementById('biografia').textContent = dados.bio
    document.getElementById('email').textContent = dados.email
    document.getElementById('nome-usuario').textContent = dados.userName
    document.getElementById('nome').textContent = dados.nome
    exibidorImagem(document.getElementById("config-user-pic"), dados.profileImg)
    
    switch(parseInt(t)) {
        case 1:
            configOptionsWrapper.innerHTML = /*html*/`
                <p class="position-absolute config-title fw-semibold i18" key="Perfil">${i18next.t("Perfil")}</p>
                <h5 class="i18" key="Informacoes">${i18next.t("Informacoes")}</h5>
                <hr>
                <div class="row mt-3 justify-mobile-pic">
                    <div class="col-1 position-relative p-0 overflow-hidden rounded-circle config-user-pic-mod-wrapper">
                        <!-- $ Imagem de Pefil do Usuário  ../default-user-image.png - preview? -->
                        <img src="../default-user-image.png" alt="config-user-pic-mod" class="img-fluid position-absolute w-100 h-100" id="config-user-pic-mod">
                    </div>
                    <div class="col-12 col-md mt-2">
                        <div class="d-flex justify-mobile-pic align-items-end h-100">
                            <label for="config-user-pic-input" class="btn play-btn-primary i18" key="AlterarFoto">${i18next.t("AlterarFoto")}</label>
                            <input type="file" class="d-none" id="config-user-pic-input">
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <form id="update-profile-form" class="row">
                        <div class="col-12 mt-3">
                            <label for="config-user-name-input" class="form-label i18" key="NomeUsuario">${i18next.t("NomeUsuario")}</label>
                            <input type="text" class="form-control width-config-input i18-placeholder" key="NomeUsuario" id="config-user-name-input" placeholder="${i18next.t("NomeUsuario")}">
                        </div>
                        <div class="col-12 mt-3">
                            <label for="config-user-bio-input" class="form-label">Bio</label>
                            <textarea class="form-control rounded-4 width-config-input" id="config-user-bio-input" rows="3" placeholder="Bio"></textarea>
                        </div>
                        <input type="hidden" name="logo" id="emblema">
                        <div class="col-12 mt-4 justify-touch-btn">
                            <button type="submit" class="btn play-btn-primary i18" key="AtualizarPerfil" id='salvar'>${i18next.t("AtualizarPerfil")}</button>
                        </div>
                    </form>
                </div>
            `
            const updateProfileForm = document.querySelector('#update-profile-form')
            const updateProfileUserNameInput = document.querySelector('#config-user-name-input')
            const updateProfileBioInput = document.querySelector('#config-user-bio-input')
            const updateProfileUserPicInput = document.querySelector('#config-user-pic-input')

            updateProfileUserNameInput.value = dados.userName
            updateProfileBioInput.value = dados.bio
            exibidorImagem(document.getElementById("config-user-pic-mod"), dados.profileImg)
            const emblema = document.getElementById("emblema")

            updateProfileUserPicInput.addEventListener("change", async() => {
                loader.show()
                const data = await uploadImagem(updateProfileUserPicInput, 1, mensagemErro)
            
                emblema.value = `https://playoffs-api.up.railway.app/img/${data.results}`
                exibidorImagem(document.getElementById("config-user-pic-mod"), emblema.value)
                loader.hide()
            })

            updateProfileForm.addEventListener("submit", async(e) => {
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
                        errorMessage: `<span class="i18" key="BioMax">${i18next.t("BioMax")}</span>`,
                    },
                    {
                        validator: (value) => {
                            return updateProfileUserNameInput.value.length > 0 ? true : value.length > 0 ? true : false
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
                            },
                        },
                        errorMessage: `<span class="i18" key="ImagemTamanho">${i18next.t("ImagemTamanho")}</span>`,
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

        case 2:

            configOptionsWrapper.innerHTML = /*html*/`
                    <p class="position-absolute config-title fw-semibold i18" key="Conta">${i18next.t("Conta")}</p>
                    <h5 class="i18" key="Informacoes">${i18next.t("Informacoes")}</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <form id="update-account-form" class="row">
                            <div class="col-12 mt-3">
                                <label for="config-user-realname-input" class="form-label i18" key="NomeReal">${i18next.t("NomeReal")}</label>
                                <input type="text" class="form-control width-config-input i18-placeholder" key="NomeReal" id="config-user-realname-input" placeholder="${i18next.t("NomeReal")}">
                            </div>
                            <div class="col-12 mt-4 justify-touch-btn">
                                <button type="submit" class="btn play-btn-primary i18" key="AtualizarConta">${i18next.t("AtualizarConta")}</button>
                            </div>
                        </form>
                    </div>

                    <h5 class="text-danger mt-5 i18" key="ExcluirConta">${i18next.t("ExcluirConta")}</h5>
                    <hr>
                    
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

                const excluirConta = document.getElementById('excluir-conta')
                

                document.getElementById('delete-account-user-name-input').addEventListener('keyup', async() => {
                    limparMensagem(document.getElementById("nome-usuario"))
                    if(!(deleteAccountUserNameInput.value === dados.userName)){
                        document.getElementById("nome-usuario").textContent = `<span class="i18" key="NomeUsuarioInvalido">${i18next.t("NomeUsuarioInvalido")}</span>`
                    } 
                })

                document.getElementById('delete-account-check-input').addEventListener('keyup', async() => {
                    limparMensagem(document.getElementById("texto-excluir"))
                    if(!(deleteAccountCheckInput.value === "Excluir Conta")){
                        document.getElementById("texto-excluir").textContent = `<span class="i18" key="TextoInvalido">${i18next.t("TextoInvalido")}</span>`
                    } 
                })

                excluirConta.addEventListener('click', async(e) => {
                    e.preventDefault()
                    if(document.getElementById("texto-excluir").textContent === '' && document.getElementById("nome-usuario").textContent === ''){
                        const config = configuracaoFetch("DELETE")
                    
                        const callbackServidor = data => {
                            document.getElementById("erro-excluir").classList.add("text-danger")
                            data.results.forEach(element => document.getElementById("erro-excluir").innerHTML += `${element}<br>`);
                        }

                        loader.show()
                        const data = await executarFetch("auth/user", config, (res) => document.getElementById("erro-excluir").textContent = res.results[0], callbackServidor)
                        if (!data) return false
                        window.location.assign("/")
                    }
                    else{
                        document.getElementById("erro-excluir").innerHTML = `<span class="i18" key="PreenchaCorretamente">${i18next.t("PreenchaCorretamente")}</span>`
                        return
                    }
                })
                
                const updateAccountForm = document.querySelector('#update-account-form')
                const updateAccountRealNameInput = document.querySelector('#config-user-realname-input')

                updateAccountRealNameInput.value = dados.name

                updateAccountForm.addEventListener('submit', async(e) => {
                    e.preventDefault()
                    limparMensagem(mensagemErro)

                    await postName("userconfigurations", {
                        "Name": updateAccountRealNameInput.value,
                    })
                })

                async function postName(endpoint, body) {
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

                const updateAccountValidator = new JustValidate(updateAccountForm, {
                    validateBeforeSubmitting: true,
                })

                updateAccountValidator
                    .addField(updateAccountRealNameInput, [
                        {
                            rule: 'required',
                            errorMessage: `<span class="i18" key="NomeRealObrigatorio">${i18next.t("NomeRealObrigatorio")}</span>`,
                        },
                    ])
                    // submit
                    .onSuccess(async(e) => {
                        e.preventDefault()
                    })

            break

        case 3:
            configOptionsWrapper.innerHTML = /*html*/`
                    <p class="position-absolute config-title fw-semibold i18" key="Senha">${i18next.t("Senha")}</p>
                    <h5 class="i18" key="MudarSenha">${i18next.t("MudarSenha")}</h5>
                    <hr>
                    
                    <div class="mt-1">
                        <form id="change-password-form" class="row">
                            <div class="col-12 mt-3">
                                <label for="config-user-pass-input" class="form-label i18" key="SenhaAtual">${i18next.t("SenhaAtual")}</label>
                                <input type="password" class="form-control width-config-input i18-placeholder" key="SenhaAtual" id="config-user-pass-input" name="config-user-pass-input" placeholder="${i18next.t("SenhaAtual")}" autocomplete="on">
                            </div>
                            <div class="col-12 mt-3">
                                <label for="config-user-pass-input" class="form-label i18" key="NovaSenha">${i18next.t("NovaSenha")}</label>
                                <input type="password" class="form-control width-config-input i18-placeholder" key="NovaSenha" id="config-user-newpass-input" name="config-user-newpass-input" placeholder="${i18next.t("NovaSenha")}" autocomplete="on">
                            </div>
                            <div class="col-md-5 col-lg-3 mt-4 justify-touch-btn">
                                <button type="submit" class="btn play-btn-primary i18" key="AtualizarSenha">${i18next.t("AtualizarSenha")}</button>
                            </div>
                            <div class="col form-text text-success mt-auto mb-0 pb-0 justify-touch-btn">
                                <a href="recuperar-senha.html" class="fs-6 fw-semibold i18" key="RecuperarSenha">${i18next.t("RecuperarSenha")}</a>
                            </div>
                        </form>
                    </div>
                `

                const changePasswordForm = document.querySelector('#change-password-form')
                const changePasswordInput = document.querySelector('#config-user-pass-input')
                const changeNewPasswordInput = document.querySelector('#config-user-newpass-input')

                const form = document.getElementById("change-password-form")

                form.addEventListener('submit', async(e) => {
                    limparMensagem(mensagemErro)

                    const resultado = await postRedefinirSenha("userconfigurations/updatepassword", {
                        "NewPassword": changeNewPasswordInput.value,
                        "CurrentPassword": changePasswordInput.value
                    })

                    if (resultado){
                        form.reset()
                    }
                })

                const postRedefinirSenha = async(endpoint, body) => {
                    console.log(body)
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

                const changePasswordValidator = new JustValidate(changePasswordForm, {
                    validateBeforeSubmitting: true,
                })

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
            break
        
        // case 'Emails/Sessões':
        //     configOptionsWrapper.innerHTML = ``
        //     break

        default:
            break
    }
}

