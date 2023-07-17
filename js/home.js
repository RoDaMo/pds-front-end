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

let navbar
let offcanvasNavbar 

if (isVisible(scrollTrigger[0])) {
    dots[0].classList.add('dots-active')
}

document.addEventListener("DOMContentLoaded", () => {
    navbar = navbarComponente.querySelector(".navbar")
    offcanvasNavbar = navbarComponente.querySelector("#offcanvasNavbar")

    navbarComponente.firstElementChild.classList.remove("bg-white", "pb-1")
})

function isVisible(el) {
    let rect = el.getBoundingClientRect()
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

// Media Query Mobile
if (mediaQueryMobile.matches) {

    homeCards[0].parentElement.classList.remove("pt-2")
    homeCards[2].parentElement.classList.remove("mt-3")
    homeCards[2].classList.add("padding-home-4")
    homeCards[2].classList.remove("p-5")
    homeCards[0].classList.remove("rounded-4", "pt-5")
    homeCards[0].classList.add("vh-91", "rounded-5", "rounded-bottom-0", "card-bg", "padding-home-4", "home-grad")
    homeCards[1].classList.add("card-bg")

    extraOptions.forEach(option => option.classList.replace("w-90", "w-100"))

    rodamoLogo.classList.add("w-25")

    featWrapper.classList.add("card-bg2")
    featWrapper.parentElement.classList.add("px-2")
    
    feats.forEach(feat => feat.querySelector("p").classList.add("fs-5"))

    if (window.matchMedia('(max-width: 376px)').matches) {
        feats[3].querySelector("i").classList.remove("feat-lift")
        feats[2].querySelector("i").classList.remove("feat-lift")
    }
    // feats[4].querySelector("i").classList.add("feat-lift2")
    
    divRows.forEach(div => {
        div.classList.add("gap-0")
    })

    // Mobile navbar changer
    document.addEventListener("scroll", () => {
        if (window.scrollY === 0){
            homeCards[0].classList.remove("ptx-90")
            homeCards[0].classList.add("vh-91")
            homeCards.forEach(card => card.classList.add("rounded-4", "rounded-5"))
            homePill.classList.remove("d-none")
        } else {   
            homeCards.forEach(card => { 
                card.classList.add("ptx-90")
                card.classList.remove("rounded-4", "rounded-5")
            })

            homeCards[0].classList.remove("vh-91")

            homePill.classList.add("d-none")
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
