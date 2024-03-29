import '../scss/configuracao-usuarios.scss'
import '../scss/configuracao-time.scss'
import '../scss/pagina-times.scss'
import JustValidate from 'just-validate'
import { executarFetch, configuracaoFetch, limparMensagem, api } from './utilidades/configFetch'
import { exibidorImagem } from './utilidades/previewImagem.js'
import { uploadImagem } from './utilidades/uploadImagem'
import { notificacaoErro, notificacaoSucesso } from "./utilidades/notificacoes"
import './utilidades/loader'
import portugues from './i18n/ptbr/configuracao-time.json' assert { type: 'JSON' }
import ingles from './i18n/en/configuracao-time.json' assert { type: 'JSON' }
import i18next from "i18next";
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"

inicializarInternacionalizacao(ingles, portugues);

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const dropZones = document.querySelectorAll(".upload-drop-zone")

for (const dropZone of dropZones) {
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

function genericExibition(input, data, image) {
    input.value = `${api}img/${data.results}`
    exibidorImagem(image, input.value)
}

const loader = document.createElement('app-loader');
document.body.appendChild(loader);

const init = async () => {
    const activateLi = (li) => {
        for (const item of abaBotoes) {
            item.classList.remove('active')
        }

        li.classList.add('active')
    }

    const changeConfigOptionsContext = (menuSelecionado) => {
        for (const menu of menuConfig)
            menu.classList.toggle('d-none', menu.getAttribute('menu') != menuSelecionado)
    }

    const inicializarCampos = () => {
        const image = document.getElementById('config-team-pic-mod'),
            imageFile = document.getElementById('config-team-image-input'),
            imageInput = document.getElementById('config-imagem-input-hidden'),
            name = document.getElementById('config-team-name-input'),
            esporte = document.getElementById('config-team-esporte-input'),
            form = document.getElementById('update-profile-form'),
            home = document.getElementById("home"),
            homeInput = document.getElementById("uniforme-casa"),
            homeFile = document.getElementById("uniforme-1"),
            away = document.getElementById("away"),
            awayInput = document.getElementById("uniforme-fora"),
            awayFile = document.getElementById("uniforme-2"),
            configTeamDropZone = document.getElementById("config-team-drop-zone")
            


        image.src = team.emblem
        imageInput.value = team.emblem
        name.value = team.name
        home.src = team.uniformHome
        away.src = team.uniformAway
        esporte.selectedIndex = team.sportsId - 1

        const validator = new JustValidate(form, {
            validateBeforeSubmitting: true,
        })

        function validator1() {
            validator
                .addField(name, [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="NomeTimeObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
                    },
                    {
                        rule: 'minLength',
                        value: 4,
                        errorMessage: `<span class="i18" key="NomeTimeMinimo">${i18next.t("NomeTimeMinimo")}</span>`,
                    },
                    {
                        rule: 'maxLength',
                        value: 40,
                        errorMessage: `<span class="i18" key="NomeTimeMaximo">${i18next.t("NomeTimeMaximo")}</span>`,
                    },
                ])
                .addField(imageFile, [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="BrasaoObrigatorio">${i18next.t("BrasaoObrigatorio")}</span>`,
                    },
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
                    }
                ], { errorsContainer: document.getElementById('imagem-erro-jv') })
                .addField(homeInput, [
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
                    }
                ], { errorsContainer: document.getElementById('uniforme-erro-jv') })
                .addField(awayInput, [
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
                    }
                ], { errorsContainer: document.getElementById('uniforme-erro-jv') })
                .addField(esporte, [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="EsporteObrigatorio">${i18next.t("EsporteObrigatorio")}</span>`,
                    },
                ])
                .onSuccess(async (e) => {
                    e.preventDefault()

                    loader.show()
                    const resultado = await putTeam({
                        'id': teamId,
                        "emblem": imageInput.value,
                        "uniformHome": document.getElementById("uniforme-1").value ? document.getElementById("uniforme-1").value : document.getElementById("home").src,
                        "uniformAway": document.getElementById("uniforme-2").value ? document.getElementById("uniforme-2").value : document.getElementById("away").src,
                        'sportsId': esporte.value.toString(),
                        "name": name.value,
                    })

                    console.log(resultado)
                    loader.hide()

                    // mensagemErro.textContent = ''
                })

            configTeamDropZone.addEventListener("drop", async e => {
                loader.show()
                const data = await uploadImagem(e.dataTransfer, 3, mensagemErro)
                loader.hide()
    
                if (Array.isArray(data.results))
                    return;
    
                genericExibition(imageInput, data, image)
            })

            imageFile.addEventListener("change", async () => {
                const isValid = await validator.revalidateField(imageFile)
                if (!isValid) return;

                loader.show()
                const data = await uploadImagem(imageFile, 0, mensagemErro)
                loader.hide()

                if (Array.isArray(data.results))
                    return;

                genericExibition(imageInput, data, image)
            })

            homeInput.addEventListener("change", async () => {
                loader.show()
                const data = await uploadImagem(homeInput, 3, mensagemErro)
                loader.hide()

                if (Array.isArray(data.results))
                    return;

                homeFile.value = `${api}img/${data.results}`
                exibidorImagem(home, homeFile.value)
            })

            awayInput.addEventListener("change", async () => {

                loader.show()
                const data = await uploadImagem(awayInput, 3, mensagemErro)
                loader.hide()

                if (Array.isArray(data.results))
                    return;

                awayFile.value = `${api}img/${data.results}`
                exibidorImagem(away, awayFile.value)
            })
        }
        document.addEventListener('nova-lingua', validator1)
        validator1()
    }

    const putTeam = async body => {
        console.log(body)
        const callbackServidor = data => {
            mensagemErro.classList.add("text-danger")
            data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`)
        }

        const data = await executarFetch('teams', configuracaoFetch("PUT", body), callbackServidor, callbackServidor)
        console.log(data)
        if (!data) return false

        limparMensagem(mensagemErro)
        notificacaoSucesso(data.results[0])
    }

    const vincularJogador = async teamId => {
        const callbackStatus = (data) => {
            notificacaoErro(data.results)
        }

        const configFetch = configuracaoFetch('POST', { 'teamId': teamId, 'championshipId': parseInt(teamId) }),
            response = await executarFetch('teams/championship', configFetch, callbackStatus)

        if (response.succeed) notificacaoSucesso(i18next.t("VinculadoSucesso"))
    }

    const desvincularJogador = async playerId => {
        const callbackStatus = (data) => {
            notificacaoErro(data.results)
        }

        const configFetch = configuracaoFetch('DELETE'),
            response = await executarFetch(`players/${playerId}`, configFetch, callbackStatus)

        if (response.succeed) {
            notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
        }
    }

    const desvincularCampeonato = async championshipId => {
        const callbackStatus = (data) => {
            notificacaoErro(data.results)
        }

        const configFetch = configuracaoFetch('DELETE', {'championshipId': parseInt(championshipId), 'teamId': parseInt(teamId)}),
            response = await executarFetch('teams/championship', configFetch, callbackStatus)
        console.log(response)

        if (response.succeed) {
            notificacaoSucesso(i18next.t("DesvinculadoSucesso"))
        }
    }

    const listarJogadoresVinculados = async configFetch => {
        loader.show()
        const jogadoresVinculadosWrapper = document.getElementById('jogadores-vinculados'),
            jogadoresVinculados = await executarFetch(`teams/${team.id}/players`, configuracaoFetch("GET"))

        loader.hide()

        console.log(jogadoresVinculados)

        jogadoresVinculadosWrapper.innerHTML = ''

        if (jogadoresVinculados.results.length >= 1) {
            // jogadoresVinculadosWrapper.innerHTML = `<p><span class="i18" key="SemJogadores">${i18next.t("SemTimes")}</span></p>`
            // return;
            jogadoresVinculadosWrapper.parentElement.classList.remove('d-none')
        }

        for (const jogador of jogadoresVinculados.results) {
            const jogadoresVinculadosContent = document.createElement('div');
            jogadoresVinculadosContent.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'lvl2-primary-bg')

            if (jogador.picture === null || jogador.picture === '' || jogador.picture === undefined) {
                jogador.picture = '../default-user-image.png'
            }

            switch (jogador.playerPosition) {
                case 1:
                    jogador.playerPos = `<span class="i18" key="Goleiro">${i18next.t("Goleiro")}</span>`
                    break;
                case 2:
                    jogador.playerPos = `<span class="i18" key="Zagueiro">${i18next.t("Zagueiro")}</span>`
                    break;
                case 3:
                    jogador.playerPos = `<span class="i18" key="Lateral">${i18next.t("Lateral")}</span>`
                    break;
                case 4:
                    jogador.playerPos = `<span class="i18" key="Volante">${i18next.t("Volante")}</span>`
                    break;
                case 5:
                    jogador.playerPos = `<span class="i18" key="MeioCampista">${i18next.t("MeioCampista")}</span>`
                    break;
                case 6:
                    jogador.playerPos = `<span class="i18" key="MeiaAtacante">${i18next.t("MeiaAtacante")}</span>`
                    break;
                case 7:
                    jogador.playerPos = `<span class="i18" key="Ala">${i18next.t("Ala")}</span>`
                    break;
                case 8:
                    jogador.playerPos = `<span class="i18" key="Ponta">${i18next.t("Ponta")}</span>`
                    break;
                case 9:
                    jogador.playerPos = `<span class="i18" key="Centroavante">${i18next.t("Centroavante")}</span>`
                    break;
                case 10:
                    jogador.playerPos = `<span class="i18" key="Levantador">${i18next.t("Levantador")}</span>`
                    break;
                case 11:
                    jogador.playerPos = `<span class="i18" key="Central">${i18next.t("Central")}</span>`
                    break;
                case 12:
                    jogador.playerPos = `<span class="i18" key="Libero">${i18next.t("Libero")}</span>`
                    break;
                case 13:
                    jogador.playerPos = `<span class="i18" key="Ponteiro">${i18next.t("Ponteiro")}</span>`
                    break;
                case 14:
                    jogador.playerPos = `<span class="i18" key="Oposto">${i18next.t("Oposto")}</span>`
                    break;
                default:
                    jogador.playerPos = `<span class="i18" key="SemPosicao">${i18next.t("SemPosicao")}</span>`
                    break;
            }

            jogadoresVinculadosContent.innerHTML = /*html*/`
                <div class="col-auto my-auto position-relative mx-auto ms-md-3 p-0 border border-2 overflow-hidden rounded-circle me-md-2 ss-player-image">
                    <a href="/pages/pagina-usuarios.html?id=${jogador.id}">
                        <img src="${jogador.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
                    </a>
                </div>

                <div class="col-auto ss-player-info-wrapper text-center mb-3 mb-md-0 text-md-start ms-md-1 mt-auto d-flex flex-column">
                    <a href="/pages/pagina-usuarios.html?id=${jogador.id}" class="ss-player-name text-center text-md-start text-nowrap text-truncate d-block">${jogador.name}</a>
                    <p class="mb-0 ss-player-username text-center text-md-start opacity-75 text-nowrap text-truncate d-block">${jogador.artisticName}</p>

                    <div class="ss-player-data2 row justify-content-center align-items-center flex-column flex-md-row mt-2 mx-md-auto ms-md-0">
                        <p class="col col-md-auto w-auto ss-player-data-number px-2 py-1 fs-6 mb-0 lvl0-color text-opacity-75">${jogador.number}</p>
                        <i class="col col-md-auto bi bi-dot p-0 d-none d-md-block mx-auto"></i>
                        <hr class="ss-player-data-hr rounded-pill d-block m-0 my-2 d-md-none">
                        <p class="col col-md-auto w-auto ss-player-data-position px-2 py-1 fs-6 mb-0 lvl0-color text-opacity-75">${jogador.playerPos}</p>
                    </div>
                </div>

            `

            const botaoDesvincularWrapper = document.createElement('div');
            botaoDesvincularWrapper.classList.add('col-auto', 'd-flex', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-2', 'gap-2');
            botaoDesvincularWrapper.innerHTML = `
                <button title="Tornar Capitão" type="button" class="btn-capitao justify-content-center align-items-center rounded-4 btn btn-dark d-flex delete-listed-thing"><i class="bi bi-star-fill"></i></button>
                <button title="Excluir Jogador" type="button" class="btn-desvincular justify-content-center align-items-center rounded-4 remover-vinculo-campeonato btn btn-danger d-flex delete-listed-thing" ><i class="bi bi-trash   fs-5"></i></button>
            `;

            if(!jogador.isCaptain) botaoDesvincularWrapper.querySelector('.btn-capitao').style.opacity = 0.5

            jogadoresVinculadosContent.appendChild(botaoDesvincularWrapper);
            jogadoresVinculadosWrapper.appendChild(jogadoresVinculadosContent);

            // jogadoresVinculadosContent.classList.add('cursor-pointer', 'list-hover-darken')

            // jogadoresVinculadosContent.addEventListener('click', () => {
            //     window.location.href = `pagina-usuarios.html?id=${jogador.id}`
            // })

            const botaoDesvincular = botaoDesvincularWrapper.querySelector('.btn-desvincular');
            botaoDesvincular.addEventListener('click', async e => {
                await desvincularJogador(jogador.id);
                await listarJogadoresVinculados(configFetch);
            });

            const botaoCapitao = botaoDesvincularWrapper.querySelector('.btn-capitao');
            botaoCapitao.addEventListener('click', async() => {
                const callbackStatus = (data) => {
                    notificacaoErro(data.results);
                }
        
                const configFetch = configuracaoFetch('PUT'),
                    response = await executarFetch(`players/${jogador.id}`, configFetch, callbackStatus);
                console.log(response);
        
                if (response.succeed) {
                    notificacaoSucesso(i18next.t("Capitao"));
                    listarJogadoresVinculados();
                }
            });

            if(mediaQueryMobile.matches) {
                document.querySelectorAll('.ss-player-name').forEach(element => {
                    element.classList.remove('fs-5')
                })
            }
        }
    }

    const listarCampeonatosVinculados = async configFetch => {
        loader.show()
        const campeonatosVinculadosWrapper = document.getElementById('campeonatos-vinculados'),
            campeonatosVinculados = await executarFetch(`teams/championship/${teamId}`, configFetch)

        loader.hide()

        console.log(campeonatosVinculados)

        campeonatosVinculadosWrapper.innerHTML = ''

        for (const campeonato of campeonatosVinculados.results) {

            let championshipFormat = ''

            championshipFormat = (campeonato.format == 3) ? `<span class="i18" key="PontosCorridos">${i18next.t("PontosCorridos")}</span>` 
                : (campeonato.format == 1) ? `<span class="i18" key="Eliminatorias">${i18next.t("Eliminatorias")}</span>` 
                : (campeonato.format == 4) ? `<span class="i18" key="GruposEliminatorias">${i18next.t("GruposEliminatorias")}</span>` 
                : ''

            const campeonatosVinculadosContent = document.createElement('div');
            campeonatosVinculadosContent.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'lvl2-primary-bg')

            campeonatosVinculadosContent.innerHTML = `
                <div class="col-auto my-auto position-relative mx-auto border border-2 ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
                    <img src="${campeonato.logo}" alt="champImage" class="img-fluid position-absolute mw-100 h-100">
                </div>

                <div class="col-auto d-flex justify-content-center ss-player-info-wrapper text-center mb-0 mb-md-0 text-md-start ms-md-1 mt-0 d-flex flex-column">
                    <p class="ss-player-name text-center text-md-start text-nowrap text-truncate d-block">${campeonato.name}</p>
                    
                    <div class="ss-player-data2 row justify-content-center align-items-center d-flex flex-column flex-md-row mt-2 mx-md-auto ms-md-0">
                        <p class="col col-md-auto w-auto ss-player-data-position px-2 py-1 fs-6 mb-0 lvl0-color text-opacity-75">${championshipFormat}</p>
                    </div>
                </div>

                <div class="col-auto d-flex justify-content-center w-100 d-md-none">
                    <hr class="w-50 opacity-25 m-0 mt-1 mb-2"></hr>
                </div>
            `

            const botaoDesvincularWrapper = document.createElement('div')
            botaoDesvincularWrapper.classList.add('col-auto', 'd-flex', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-0')
            botaoDesvincularWrapper.innerHTML = `<button type="button" data-bs-toggle="modal" data-bs-target="#exitChampionshipModal" class="delete-listed-thing justify-content-center align-items-center rounded-4 remover-vinculo-campeonato btn btn-danger d-flex"><i class="bi bi-box-arrow-right   text-center ms-1 fs-4"></i></i></button>`
            
            campeonatosVinculadosContent.appendChild(botaoDesvincularWrapper)
            campeonatosVinculadosWrapper.appendChild(campeonatosVinculadosContent)

            campeonatosVinculadosContent.classList.add('cursor-pointer', 'list-hover-darken')

            campeonatosVinculadosContent.addEventListener('click', () => {
                window.location.href = `pagina-campeonatos.html?id=${campeonato.id}`
            })

            const confirmExitChamtionshipBtn = document.querySelector('#confirm-exit-championship-btn')

            confirmExitChamtionshipBtn.addEventListener('click', async e => {
                await desvincularCampeonato(campeonato.id)
                await listarCampeonatosVinculados(configFetch)
            })
        }

        if (!campeonatosVinculadosWrapper.hasChildNodes()) {
            campeonatosVinculadosWrapper.innerHTML = `<p class="p-1 pt-3 text-center"><span class="i18" key="SemCampeonatos">${i18next.t("SemCampeonatos")}</span></p>`
            return;
        }
    }

    const inicializarPaginaJogadores = async () => {
        const botaoVincular = document.getElementById('botao-vincular-jogador'),
            pesquisaWrapper = document.getElementById('pesquisa-jogador'),
            inputPesquisa = document.getElementById('pesquisa-jogador-input'),
            datalistPesquisa = document.getElementById('pesquisa-jogador-lista'),
            botaoVincularJogadorTemporario = document.getElementById("botao-vincular-jogador-temporario"),
            formularioJogadorTemporario = document.getElementById("formulario-jogador-temporario"),
            tempPlayerImage = document.getElementById('temp-player-pic-mod'),
            tempPlayerImageFile = document.getElementById('temp-player-image-input'),
            tempPlayerImageInput = document.getElementById('temp-player-input-hidden'),
            playerStep = document.getElementById('playerStep'),
            playerTempDropZone = document.getElementById('player-temp-drop-zone'),

            configFetch = configuracaoFetch('GET')

        await listarJogadoresVinculados()

        const pesquisaJNValidator = new JustValidate(pesquisaWrapper, { validateBeforeSubmitting: true })

        function pesquisaJNValidator1() {
            pesquisaJNValidator
                .addField(inputPesquisa, [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="PesquisaJogadorObrigatorio">${i18next.t("PesquisaJogadorObrigatorio")}</span>`,
                    },
                ])
                .onSuccess(async (e) => {
                    e.preventDefault()
                })
        }

        let isJNOpen = false
        let isJTOpen = false

        let selectPositionElem = null

        function fecharJogadorNormal() {
            pesquisaWrapper.classList.add('d-none')
            botaoVincular.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarNovoJogador">${i18next.t("AdicionarNovoJogador")}</span>
            `
            document.getElementById('playerStep').innerHTML = ''
        }

        function abrirJogadorNormal() {
            pesquisaWrapper.classList.remove('d-none')
            botaoVincular.innerHTML = `<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>
            `
        }

        function fecharJogadorTemporario() {
            formularioJogadorTemporario.classList.add('d-none')
            botaoVincularJogadorTemporario.innerHTML = `<i class="bi bi-plus-circle px-2"></i><span class="i18" key="AdicionarNovoJogadorTemp">${i18next.t("AdicionarNovoJogadorTemp")}</span>
            `
        }

        function abrirJogadorTemporario() {
            formularioJogadorTemporario.classList.remove('d-none')
            botaoVincularJogadorTemporario.innerHTML = `<span class="i18" key="Cancelar">${i18next.t("Cancelar")}</span>
            `
        }

        const exibirPesquisaNormal = () => {

            pesquisaJNValidator1()

            if (!isJNOpen && isJTOpen) {
                fecharJogadorTemporario()
                isJTOpen = false

                abrirJogadorNormal()
                isJNOpen = true
            } else if (!isJNOpen && !isJTOpen) {
                abrirJogadorNormal()
                isJNOpen = true
            } else if (isJNOpen && !isJTOpen) {
                fecharJogadorNormal()
                isJNOpen = false
            }
        }

        botaoVincular.addEventListener('click', exibirPesquisaNormal)

        const exibirPesquisaTemporario = () => {

            if (!isJTOpen && isJNOpen) {
                fecharJogadorNormal()
                isJNOpen = false

                abrirJogadorTemporario()
                isJTOpen = true
            } else if (!isJTOpen && !isJNOpen) {
                abrirJogadorTemporario()
                isJTOpen = true
            } else if (isJTOpen && !isJNOpen) {
                fecharJogadorTemporario()
                isJTOpen = false
            }

            selectPositionElem = document.getElementById('posicao')

        }

        botaoVincularJogadorTemporario.addEventListener('click', exibirPesquisaTemporario)

        function resetPositionOptions() {
            if(team.sportsId === 1){
                selectPositionElem.innerHTML = ""
                selectPositionElem.innerHTML += `
                    <option value="1"><span class="i18" key="Goleiro">${i18next.t("Goleiro")}</span></option>
                    <option value="2"><span class="i18" key="Zagueiro">${i18next.t("Zagueiro")}</span></option>
                    <option value="3"><span class="i18" key="Lateral">${i18next.t("Lateral")}</span></option>
                    <option value="4"><span class="i18" key="Volante">${i18next.t("Volante")}</span></option>
                    <option value="5"><span class="i18" key="MeioCampista">${i18next.t("MeioCampista")}</span></option>
                    <option value="6"><span class="i18" key="MeiaAtacante">${i18next.t("MeiaAtacante")}</span></option>
                    <option value="7"><span class="i18" key="Ala">${i18next.t("Ala")}</span></option>
                    <option value="8"><span class="i18" key="Ponta">${i18next.t("Ponta")}</span></option>
                    <option value="9"><span class="i18" key="Centroavante">${i18next.t("Centroavante")}</span></option>
                ` 
            }else{
                selectPositionElem.innerHTML = ""
                selectPositionElem.innerHTML += `
                    <option value="10"><span class="i18" key="Levantador">${i18next.t("Levantador")}</span></option>
                    <option value="11"><span class="i18" key="Central">${i18next.t("Central")}</span></option>
                    <option value="12"><span class="i18" key="Libero">${i18next.t("Libero")}</span></option>
                    <option value="13"><span class="i18" key="Ponteiro">${i18next.t("Ponteiro")}</span></option>
                    <option value="14"><span class="i18" key="Oposto">${i18next.t("Oposto")}</span></option>
                ` 
            }
        }

        botaoVincularJogadorTemporario.onclick = () => {
            resetPositionOptions()
        }

        document.addEventListener('nova-lingua', resetPositionOptions)

        const postJogadorTemporario = async(endpoint, body) => {
            const callbackServidor = data => {
                mensagemErro.classList.add("text-danger")
                data.results.forEach(element => mensagemErro.innerHTML += `${element}<br>`);
            }
        
            loader.show()
            console.log(body)
            const data = await executarFetch(endpoint, configuracaoFetch("POST", body), callbackServidor, callbackServidor)
            loader.hide()
        
            if (!data) return false
        
            notificacaoSucesso(data.results[0])
            return true
        }

        const jogadorTempFrom = document.getElementById("formulario-jogador-temporario")

        const jogadorTempValidator = new JustValidate(jogadorTempFrom, { validateBeforeSubmitting: true })

        // drag and drop de imagem
        playerTempDropZone.addEventListener("drop", async e => {
            loader.show()
            const data = await uploadImagem(e.dataTransfer, 3, mensagemErro)
            loader.hide()

            if (Array.isArray(data.results))
                return;

            genericExibition(tempPlayerImageInput, data, tempPlayerImage)
        })
            

        tempPlayerImageFile.addEventListener("change", async () => {
            loader.show()
            const data = await uploadImagem(tempPlayerImageFile, 3, mensagemErro)
            loader.hide()

            if (Array.isArray(data.results))
                return;

            genericExibition(tempPlayerImageInput, data, tempPlayerImage)
        })
        
        document.getElementById("numero").addEventListener('change', e => {
            if(e.target.value.length > 2) e.target.value = e.target.value.slice(0, 2)
        })

        function jogadorTempValidator1() {
            jogadorTempValidator
                .addField(tempPlayerImageInput, [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="ImagemJogadorObrigatoria">${i18next.t("ImagemJogadorObrigatoria")}</span>`,
                    },
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
                    }
                ], { errorsContainer: document.getElementById('imagem-erro-jt') })
                .addField(document.getElementById("nome-jogador"), [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="NomeJogadorObrigatorio">${i18next.t("NomeJogadorObrigatorio")}</span>`,
                    },
                    {
                        rule: 'minLength',
                        value: 4,
                        errorMessage: `<span class="i18" key="NomeJogadorMinimo">${i18next.t("NomeJogadorMinimo")}</span>`,
                    },
                    {
                        rule: 'maxLength',
                        value: 40,
                        errorMessage: `<span class="i18" key="NomeJogadorMaximo">${i18next.t("NomeJogadorMaximo")}</span>`,
                    },
                ])
                .addField(document.getElementById("nome-artistico"), [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="NomeArtisticoObrigatorio">${i18next.t("NomeArtisticoObrigatorio")}</span>`,
                    },
                    {
                        rule: 'minLength',
                        value: 4,
                        errorMessage: `<span class="i18" key="NomeArtisticoMinimo">${i18next.t("NomeArtisticoMinimo")}</span>`,
                    },
                    {
                        rule: 'maxLength',
                        value: 15,
                        errorMessage: `<span class="i18" key="NomeArtisticoMaximo">${i18next.t("NomeArtisticoMaximo")}</span>`,
                    },
                ])
                .addField(document.getElementById("numero"), [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="NumeroJogadorObrigatorio">${i18next.t("NumeroJogadorObrigatorio")}</span>`,
                    },
                    {
                        rule: 'minLength',
                        value: 1,
                        errorMessage: `<span class="i18" key="NumeroJogadorMinimo">${i18next.t("NumeroJogadorMinimo")}</span>`,
                    },
                    {
                        rule: 'maxLength',
                        value: 2,
                        errorMessage: `<span class="i18" key="NumeroJogadorMaximo">${i18next.t("NumeroJogadorMaximo")}</span>`,
                    },
                ])
                .addField(document.getElementById("email-jogador"), [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="EmailJogadorObrigatorio">${i18next.t("EmailJogadorObrigatorio")}</span>`,
                    },
                    {
                        rule: 'email',
                        errorMessage: `<span class="i18" key="EmailJogadorInvalido">${i18next.t("EmailJogadorInvalido")}</span>`,
                    },
                ])
                .addField(document.getElementById("posicao"), [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="PosicaoJogadorObrigatorio">${i18next.t("PosicaoJogadorObrigatorio")}</span>`,
                    },
                ])
                .onSuccess(async (e) => {
                    e.preventDefault()
                    limparMensagem(mensagemErro)

                    loader.show()

                    const resultado = await postJogadorTemporario("playertempprofiles", {
                        "name": document.getElementById("nome-jogador").value,
                        "artisticName": document.getElementById("nome-artistico").value,
                        "number": parseInt(document.getElementById("numero").value),
                        "email": document.getElementById("email-jogador").value,
                        "teamsId": parseInt(team.id),
                        "playerPosition": parseInt(document.getElementById("posicao").value),
                        "picture": document.getElementById("temp-player-input-hidden").value,
                    })

                    if (resultado) {
                        formularioJogadorTemporario.reset()
                        tempPlayerImage.src = "../default-user-image.png"
                        tempPlayerImageInput.value = ""
                    }

                    loader.hide();

                    listarJogadoresVinculados()

                })
        }
    
        jogadorTempValidator1()
        document.addEventListener('nova-lingua', jogadorTempValidator1)

        inputPesquisa.addEventListener('input', async () => {
            if (!inputPesquisa.value) {
                datalistPesquisa.innerHTML = ''
                document.getElementById('playerStep').innerHTML = ''
                playerStep.parentElement.classList.add('d-none')
                return;
            }
            const valor = inputPesquisa.value,
                response = await executarFetch(`players?username=${valor}`, configFetch),

                // fetch pra testes --
                // response = await executarFetch(`teams?query=${valor}&sport=1`, configFetch),
                // ------------------

                jogadores = response.results
            console.log(jogadores)

            datalistPesquisa.innerHTML = ''
            for (const jogador of jogadores) {
                const newOption = document.createElement('div');
                newOption.classList.add('row', 'rounded-5', 'mx-1', 'px-0', 'py-3', 'mb-2', 'lvl2-primary-bg')
                newOption.innerHTML = `
                    <div class="col-auto my-auto position-relative mx-auto ms-md-3 p-0 overflow-hidden rounded-circle me-md-2 ss-player-image">
                        <img src="${jogador.picture}" alt="playerImage" class="img-fluid position-absolute mw-100 h-100">
                    </div>
                    
                    <div class="col-auto ss-player-info-wrapper text-center text-md-start ms-md-1 my-auto d-flex flex-column">
                        <p class="ss-player-name w-auto text-center text-md-start text-nowrap text-truncate d-block">${jogador.name}</p>
                    </div>
                `

                const addPlayerStepWrapper = document.createElement('div')
                addPlayerStepWrapper.classList.add('col-auto', 'd-flex', 'mt-3', 'mt-md-auto', 'my-auto', 'mx-auto', 'ms-md-auto', 'me-md-2')
                addPlayerStepWrapper.innerHTML = `<button type="button" class="add-listed-thing justify-content-center align-items-center rounded-4 adicionar-player-step btn btn-primary d-flex"><i class="bi bi-plus   fs-5"></i></button>`

                newOption.appendChild(addPlayerStepWrapper)

                addPlayerStepWrapper.addEventListener('click', async e => {
                    document.getElementById('playerStep').innerHTML = `
                        <div class="card lvl2-primary-bg p-2 border-0">
                            <div class="card-body row">
                                <div class="col-12">
                                    <div class="position-relative mx-auto mb-3 p-0 overflow-hidden rounded-circle img-player-step">
                                        <img src="${jogador.picture}" alt="Pic" class="img-fluid position-absolute w-100 h-100">
                                    </div>
                                    <h6 class="text-center mb-3">${jogador.name}</h6>
                                </div>
                                <hr>
                                <div class="col">
                                    <form id="vincularJogadorForm">
                                        
                                        <div class="mb-3">
                                            <label for="fantasyName" class="form-label">
                                                <span class="i18" key="NomeArtistico">${i18next.t("NomeArtistico")}</span>
                                            </label>
                                            <input type="text" class="form-control i18-placeholder" key="NomeArtisticoPlaceholder" id="fantasyName" placeholder="${i18next.t("NomeArtisticoPlaceholder")}">
                                        </div>
                                        <div class="mb-3">
                                            <label for="playerNumber" class="form-label">
                                                <span class="i18" key="NumeroJogador">${i18next.t("NumeroJogador")}</span>
                                            </label>
                                            <input type="number" class="form-control i18-placeholder" key="NumeroJogadorPlaceholder" id="playerNumber" min="0" placeholder="${i18next.t("NumeroJogadorPlaceholder")}">
                                        </div>
                                        <div class="mb-3">
                                            <label for="playerPosition" class="form-label">
                                                <span class="i18" key="PosicaoJogadorLabel">${i18next.t("PosicaoJogadorLabel")}</span>
                                            </label>
                                            <select class="w-100 form-select rounded-4" id="playerPosition" name="playerPosition"></select>
                                        </div>
                                        <button type="submit" class="btn btn-primary i18 mx-auto d-block" key="AddJogador">${i18next.t("AddJogador")}</button>
                                    <form>
                                </div>
                            </div>
                        </div>
                    `

                    playerStep.parentElement.classList.remove('d-none')

                    selectPositionElem = document.getElementById('playerPosition')
                    resetPositionOptions()
                    
                    const isCaptain = document.getElementById('isCaptain')
                    const fantasyName = document.getElementById('fantasyName')
                    const playerNumber = document.getElementById('playerNumber')

                    const validatorPlayerStep = new JustValidate('#vincularJogadorForm', { validateBeforeSubmitting: true })
                    
                    validatorPlayerStep
                        .addField(fantasyName, [
                            {
                                rule: 'required',
                                errorMessage: `<span class="i18" key="NomeArtisticoObrigatorio">${i18next.t("NomeArtisticoObrigatorio")}</span>`,
                            },
                            {
                                rule: 'minLength',
                                value: 4,
                                errorMessage: `<span class="i18" key="NomeArtisticoMinimo">${i18next.t("NomeArtisticoMinimo")}</span>`,
                            },
                            {
                                rule: 'maxLength',              
                                value: 15,
                                errorMessage: `<span class="i18" key="NomeArtisticoMaximo">${i18next.t("NomeArtisticoMaximo")}</span>`,
                            },
                            {
                                rule: 'customRegexp',
                                value: /^[a-zA-Z0-9 ]*$/,
                                errorMessage: `<span class="i18" key="NomeArtisticoInvalido">${i18next.t("NomeArtisticoInvalido")}</span>`,
                            },
                        ])
                        .addField(playerNumber, [
                            {
                                rule: 'required',
                                errorMessage: `<span class="i18" key="NumeroJogadorObrigatorio">${i18next.t("NumeroJogadorObrigatorio")}</span>`,
                            },
                            {
                                rule: 'minLength',
                                value: 1,
                                errorMessage: `<span class="i18" key="NumeroJogadorMinimo">${i18next.t("NumeroJogadorMinimo")}</span>`,
                            },
                            {
                                rule: 'maxLength',
                                value: 3,
                                errorMessage: `<span class="i18" key="NumeroJogadorMaximo">${i18next.t("NumeroJogadorMaximo")}</span>`,
                            },
                        ])
                        .onSuccess(async (e) => {
                            e.preventDefault()
                            const body = {
                                'artisticName': fantasyName.value,
                                'number': parseInt(playerNumber.value),
                                'playerTeamId': parseInt(teamId),
                                'playerPosition': parseInt(selectPositionElem.value),
                                'iscaptain': false,     
                                "id": jogador.id
                            }

                            const configFetch = configuracaoFetch('PUT', body),
                                response = await executarFetch('players', configFetch)

                            if (response.succeed) {
                                notificacaoSucesso(i18next.t("JogadorVinculadoSucesso"))
                                await listarJogadoresVinculados(configFetch)
                                inputPesquisa.value = ''
                                newOption.parentNode.removeChild(newOption)
                                document.getElementById('playerStep').innerHTML = ''
                            }
                        })
                })

                datalistPesquisa.appendChild(newOption)
            }

        })
    }

    const inicializarPaginaCampeonatos = async () => {
        const configFetch = configuracaoFetch('GET')
        await listarCampeonatosVinculados(configFetch)
    }

    const inicializarPaginaExclusao = async () => {
        const formDeletarTime = document.getElementById('delete-team-form'),
            deleteAccountValidator = new JustValidate(formDeletarTime, { validateBeforeSubmitting: true }),
            teamInput = document.getElementById('delete-team-name-input')
            // username = document.getElementById('offcanvasUserName')

        function validor2() {
            deleteAccountValidator
                // .addField(usernameInput, [
                //  {
                //      rule: 'required',
                //      errorMessage: `<span class="i18" key="NomeUsuarioObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
                //  },
                //  {
                //      validator: (value) => username.textContent == value,
                //      errorMessage: `<span class="i18" key="NomeUsuarioIncorreto">${i18next.t("NomeTimeIncorreto")}</span>`
                //  }
                // ])
                .addField(teamInput, [
                    {
                        rule: 'required',
                        errorMessage: `<span class="i18" key="NomeTimeObrigatorio">${i18next.t("NomeTimeObrigatorio")}</span>`,
                    },
                    {
                        validator: (value) => team.name == value,
                        errorMessage: `<span class="i18" key="NomeTimeIncorreto">${i18next.t("NomeTimeIncorreto")}</span>`
                    }
                ])
                // submit
                .onSuccess(async (e) => {
                    e.preventDefault()
                    loader.show()
                    const configFetch = configuracaoFetch('DELETE'),
                        response = await executarFetch(`teams/${teamId}`, configFetch)

                    loader.hide()

                    if (response.succeed) {
                        window.location.assign('/index.html');
                    }
                })
        }

        document.addEventListener('nova-lingua', validor2)
        validor2()

    }

    //#region coisas chatas

    const configMenu = document.querySelector('.config-menu'),
        configMenuList = document.getElementById('config-menu-list'),
        abaBotoes = configMenuList.children,
        mediaQueryMobile = window.matchMedia('(max-width: 575px)'),
        menuConfig = document.getElementsByClassName('menu-config'),
        mensagemErro = document.getElementById('mensagem-erro'),
        teamId = document.getElementById('usernameTeamManagementId').textContent

    loader.show()
    const dados = await executarFetch(`teams/${teamId}`, configuracaoFetch('GET')),
        team = dados.results
    console.log(team)
    loader.hide()

    if (mediaQueryMobile.matches) {
        configMenu.parentElement.classList.add('justify-content-center')
        configMenu.classList.add('mb-0')
    }

    for (const configMenuOption of abaBotoes) {
        configMenuOption.addEventListener('click', () => {
            activateLi(configMenuOption)
            changeConfigOptionsContext(configMenuOption.getAttribute('menu'))
        })
    }

    changeConfigOptionsContext(0)
    inicializarCampos()
    await inicializarPaginaJogadores()
    await inicializarPaginaCampeonatos()
    await inicializarPaginaExclusao()
    //#endregion
    window.dispatchEvent(new Event('pagina-load'))
}

document.addEventListener('header-carregado', init)
