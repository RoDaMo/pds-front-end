import Lenis from '@studio-freight/lenis'
import '../scss/home.scss'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { inicializarInternacionalizacao } from "./utilidades/internacionalizacao"
import portugues from './i18n/ptbr/home.json' assert { type: 'JSON' }
import ingles from './i18n/en/home.json' assert { type: 'JSON' }
import i18next from 'i18next'

inicializarInternacionalizacao(ingles, portugues);

Aos.init({
    disable: 'phone'
})

const navbarComponente = document.querySelector("componente-header")
const homeCards = document.querySelectorAll(".home-card.d-flex")
const homePill = document.querySelector("#home-pill")
const homeSubText = document.querySelector(".home-subtext")
const homeTitle = document.querySelector(".home-title")
const homeBtn = document.querySelector(".home-btn")
const divRows = document.querySelectorAll(".home-row")
const feats = document.querySelectorAll(".feats")
const scrollTrigger = document.querySelectorAll(".scroll-trigger")
const dotsWrapper = document.querySelector(".dots-wrapper")
const featWrapper = document.querySelector(".feat-wrapper")
const dots = document.querySelectorAll(".dot")
const toTopBtn = document.getElementById("gotop")
const rodamoLogo = document.querySelector("img[alt='Rodamo Logo']")

const footerCta = document.querySelectorAll(".footer-cta")
const extraOptions = document.querySelectorAll(".extra-options")

const homeNoise = document.querySelector(".home-noise")
const noiseSvgs = document.querySelectorAll(".noise-svg");

const firstTitleBg = document.querySelector(".first-title-bg")

const mediaQueryMobile = window.matchMedia('(max-width: 575px)')
const mediaQueryTablet = window.matchMedia('(max-width: 992px)')
const mediaQueryOnlyTablet = window.matchMedia('(min-width: 576px) and (max-width: 992px)')
const mediaQueryDesktopDown = window.matchMedia('(max-width: 1199px)')
const mediaQueryDesktopUp = window.matchMedia('(min-width: 1200px)')
const mobilePortrait = window.matchMedia("(orientation: portrait)")

// const mobibarClasses = ["position-fixed", "topx-14", "z-1", "start-50", "translate-middle-x", "w-60", "rounded-4", "glass-effect"]
const mobibarComponenteClasses = ["position-fixed", "z-1", "w-100", "rounded-0", "mt-0", "shadow-none", "navbar-blur"]

const mobibarLogoClasses = ["mt-0"]

let lenis = new Lenis({
    wheelMultiplier: 0.4,
    smoothWheel: true,
    touchMultiplier: 0.6,
    smoothTouch: true,
    syncTouch: true,
    normalizeWheel: true,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
  
requestAnimationFrame(raf)

let mobibarLogo
let navbar
let offcanvasNavbar 

toTopBtn.style.display = "none"

if (isVisible(scrollTrigger[0])) {
    dots[0].classList.add('dots-active')
}

document.addEventListener("DOMContentLoaded", () => {
    mobibarLogo = navbarComponente.querySelector('img[alt="Logo Playoffs"]')
    navbar = navbarComponente.querySelector(".navbar")
    offcanvasNavbar = navbarComponente.querySelector("#offcanvasNavbar")

    navbarComponente.firstElementChild.classList.remove("bg-white", "pb-1")
})

function isVisible(el) {
    let rect = el.getBoundingClientRect()
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

lenis.on("scroll", () => {
    // To top button appearing
    if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
    ) {
        toTopBtn.style.display = "block"
    } else {
        toTopBtn.style.display = "none"
    }

    if (
        document.body.scrollTop > 585 ||
        document.documentElement.scrollTop > 585
    ) {
        navbarComponente.querySelectorAll(".nav-item").forEach(item => item.firstElementChild.classList.add("text-dark"))
        if(navbarComponente.querySelector(".bi-caret-left-fill")) {
            navbarComponente.querySelector(".bi-caret-left-fill").style.setProperty('--custom-white', "black")
        }

    } else {
        navbarComponente.querySelectorAll(".nav-item").forEach(item => item.firstElementChild.classList.remove("text-dark"))
        if(navbarComponente.querySelector(".bi-caret-left-fill")) {
            navbarComponente.querySelector(".bi-caret-left-fill").style.setProperty('--custom-white', "white")
        }
    }
})

toTopBtn.addEventListener("click", () => {
    lenis.scrollTo(0, {lock: true, duration: 2})
})

let menuOpen = false

// Media Query Mobile
if (mediaQueryMobile.matches) {

    let startY = 0
    let endY = 0


    window.addEventListener("touchstart", e => {
        startY = e.touches[0].clientY
    })

    // Scrollend Trigger
    window.addEventListener("touchend", e => {
        endY = e.changedTouches[0].clientY

        console.log(endY, startY);

        setTimeout(() => {
            if (endY > startY && !(isVisible(scrollTrigger[0]))) {
                scrollTrigger.forEach(trigger => {
                    if (isVisible(trigger) && trigger.classList.contains("bottom-trigger")) {
                        lenis.scrollTo(trigger.parentElement, {duration: 0.7})
                    }
                })
            } else if (endY < startY && !(isVisible(scrollTrigger[7]))) {
                scrollTrigger.forEach(trigger => {
                    if (isVisible(trigger) && trigger.classList.contains("top-trigger")) {
                        lenis.scrollTo(trigger.parentElement, {duration: 0.7})
                    }
                })
            }
        }, 120);

    })

    homeCards[0].parentElement.classList.remove("pt-2")
    homeCards[2].parentElement.classList.remove("mt-3")
    homeCards[2].classList.add("padding-home-4")
    homeCards[2].classList.remove("p-5")
    homeCards[0].classList.remove("rounded-4", "pt-5")
    homeCards[0].classList.add("vh-91", "rounded-5", "rounded-bottom-0", "card-bg", "padding-home-4", "home-grad")
    homeCards[1].classList.add("card-bg")

    extraOptions.forEach(option => option.classList.replace("w-90", "w-100"))

    rodamoLogo.classList.add("w-25")

    featWrapper.classList.add("card-bg2", "glass-effect")
    
    feats.forEach(feat => feat.querySelector("p").classList.add("fs-5"))

    if (window.matchMedia('(max-width: 376px)').matches) {
        feats[3].querySelector("i").classList.remove("feat-lift")
        feats[2].querySelector("i").classList.remove("feat-lift")
    }
    // feats[4].querySelector("i").classList.add("feat-lift2")
    
    divRows.forEach(div => {
        div.classList.add("gap-0")
    })

    document.addEventListener("DOMContentLoaded", () => {

        offcanvasNavbar.addEventListener("show.bs.offcanvas", () => {
            menuOpen = true
            lenis.stop()
        })

        offcanvasNavbar.addEventListener("hide.bs.offcanvas", () => {
            menuOpen = false
            lenis.start()
        })
    })

    // Mobile navbar changer
    lenis.on("scroll", () => {
        navbar.classList.add("pt-1")

        offcanvasNavbar.addEventListener("show.bs.offcanvas", () => {
            navbarComponente.classList.remove(...mobibarComponenteClasses)  
            mobibarLogo.classList.remove(...mobibarLogoClasses)  
            menuOpen = true
            lenis.stop()
        })

        offcanvasNavbar.addEventListener("hide.bs.offcanvas", () => {
            if (window.scrollY != 0) {
                navbarComponente.classList.add(...mobibarComponenteClasses)
                mobibarLogo.classList.add(...mobibarLogoClasses)  

                menuOpen = false
            } else {
                menuOpen = false
            }
            lenis.start()
        })

        if (!menuOpen) {
            navbarComponente.classList.add(...mobibarComponenteClasses)
            mobibarLogo.classList.add(...mobibarLogoClasses)

            if (window.scrollY === 0){
                homeCards[0].classList.remove("ptx-90")
                homeCards[0].classList.add("vh-91")
                homeCards.forEach(card => card.classList.add("rounded-4", "rounded-5"))
                homePill.classList.remove("d-none")
                navbarComponente.classList.remove(...mobibarComponenteClasses)
                mobibarLogo.classList.remove(...mobibarLogoClasses)
            } else {   
                homeCards.forEach(card => { 
                    card.classList.add("ptx-90")
                    card.classList.remove("rounded-4", "rounded-5")
                })
    
                homeCards[0].classList.remove("vh-91")
    
                homePill.classList.add("d-none")
            }
        } 

        

        // Page Indicator 
        if (isVisible(scrollTrigger[0])) {
            dots[0].classList.add('dots-active')
        } else {
            dots[0].classList.remove('dots-active')
        }
        
        if (isVisible(scrollTrigger[2])) {
            dots[1].classList.add('dots-active')
        } else {
            dots[1].classList.remove('dots-active')
        }
        
        if (isVisible(scrollTrigger[4])) {
            dots[2].classList.add('dots-active')
        } else {
            dots[2].classList.remove('dots-active')
        }

        if (isVisible(scrollTrigger[6])) {
            dots[3].classList.add('dots-active')
        } else {
            dots[3].classList.remove('dots-active')
        }

    }, {passive: "false"})

    // Mobile Orientation Change
    // mobilePortrait.addEventListener("change", e => {
    //     if(!e.matches) {
    //         navbar.classList.remove("position-fixed")
    //     } else {
    //         // Landscape
    //     }
    // })

    // homeSubText.innerHTML = `
    //     Se você é um apaixonado por esportes e quer organizar o seu próprio campeonato, 
    //     temos uma excelente dica para você!


    //     <br><br> Quer saber o que é? Arrasta pra cima! 
    // `

} else {
    function noiseHandler() {
        const FTBHeight = homeCards[0].parentElement.offsetHeight + navbarComponente.offsetHeight

        firstTitleBg.style.height = `${FTBHeight + 85}px`
        firstTitleBg.style.marginTop = `-${navbarComponente.offsetHeight + 40}px`

        homeNoise.style.height = `${FTBHeight + 85}px`
    }

    noiseHandler()


    homeCards[3].classList.remove("card-bg")
    homeCards[3].classList.add("my-5")

    footerCta.forEach(cta => {
        cta.classList.replace("feats", "feats-2")
        cta.parentElement.classList.replace("mt-4", "mt-5")
        cta.classList.add("h-90")
    })

    footerCta[1].parentElement.classList.remove("mb-auto")

    navbarComponente.classList.add("position-relative", "z-1")

    rodamoLogo.classList.add("w-50")

    homePill.classList.add("d-none")
    dotsWrapper.classList.add("d-none")

    featWrapper.classList.remove("mt-1")
    featWrapper.classList.add("mt-5")

    homeTitle.classList.add("text-center")
    homeBtn.closest(".row").classList.add("justify-content-center", "mt-4")
    homeBtn.closest(".row").firstElementChild.classList.add("w-auto")
    homeSubText.classList.add("text-center", "w-75")
    homeSubText.parentElement.classList.add("justify-content-center")

    homeCards[1].querySelector("h2").classList.add("mt-5", "mbr-8")

    feats.forEach(feat => feat.classList.add("mb-5"))

    // homeSubText.innerHTML = `
    //     Se você ama esportes e quer organizar o seu próprio campeonato, 
    //     temos uma excelente dica para você!


    //     <br><br> Não perca mais tempo procurando por soluções complicadas para organizar o seu campeonato.
    //     <br> Com a Playoffs, você pode criar e personalizar campeonatos de acordo com sua necessidade.
    // `


    document.addEventListener("DOMContentLoaded", () => {
        noiseHandler()
    
        if (mediaQueryDesktopUp.matches) {
            offcanvasNavbar.addEventListener("show.bs.offcanvas", () => {
                lenis.destroy()
            })
        
            offcanvasNavbar.addEventListener("hide.bs.offcanvas", () => {
                lenis = new Lenis({
                    wheelMultiplier: 0.4,
                    smoothWheel: true,
                    touchMultiplier: 0.6,
                    smoothTouch: true,
                    syncTouch: true,
                    normalizeWheel: true,
                })
                lenis.start()
            })

            lenis.on("scroll", () => {
                if (!menuOpen) {
                    navbarComponente.classList.add(...mobibarComponenteClasses)
                    mobibarLogo.classList.add(...mobibarLogoClasses)
        
                    if (window.scrollY === 0){
                        navbarComponente.classList.remove(...mobibarComponenteClasses)
                        mobibarLogo.classList.remove(...mobibarLogoClasses)
                    }
                } 
            })
        } else if (mediaQueryOnlyTablet.matches) {

            offcanvasNavbar.addEventListener("show.bs.offcanvas", () => {
                navbarComponente.classList.remove(...mobibarComponenteClasses)  
                mobibarLogo.classList.remove(...mobibarLogoClasses)  

                noiseSvgs.forEach(svg => svg.classList.toggle("z-1"))
                homeTitle.classList.toggle("z-1")
                homeSubText.classList.toggle("z-1")
        
                menuOpen = true
                lenis.stop()
            })
        
            offcanvasNavbar.addEventListener("hide.bs.offcanvas", () => {
                noiseSvgs.forEach(svg => svg.classList.toggle("z-1"))
                homeTitle.classList.toggle("z-1")
                homeSubText.classList.toggle("z-1")
        
                if (window.scrollY != 0) {
                    navbarComponente.classList.add(...mobibarComponenteClasses)
                    mobibarLogo.classList.add(...mobibarLogoClasses)  
                    menuOpen = false
                } else {
                    menuOpen = false
                }
        
                lenis.start()
            })

            lenis.on("scroll", () => {
                if (!menuOpen) {
                    navbarComponente.classList.add(...mobibarComponenteClasses)
                    mobibarLogo.classList.add(...mobibarLogoClasses)
        
                    if (window.scrollY === 0){
                        navbarComponente.classList.remove(...mobibarComponenteClasses)
                        mobibarLogo.classList.remove(...mobibarLogoClasses)
                    }
                } 
            })

                
        }
    })
}


window.addEventListener("resize", () => {
    if(mediaQueryDesktopDown.matches) {
        homeTitle.classList.add("display-2")
        homeTitle.classList.remove("display-1")
    } else {
        homeTitle.classList.add("display-1")
        homeTitle.classList.remove("display-2")
    }
})

if (localStorage.getItem('autenticado') == 'true') {
    const elementosParaEsconder =  document.getElementsByClassName('esconder-botao-logado')
    elementosParaEsconder.item(0).classList.add('invisible')
    elementosParaEsconder.item(1).classList.add('d-none')
}
