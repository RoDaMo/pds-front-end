"use strict";

const navbar = document.querySelector("componente-header");
const homeCards = document.querySelectorAll(".home-card.d-flex");
const homePill = document.querySelector("#home-pill");
const divRows = document.querySelectorAll(".home-row");
const scrollTrigger = document.querySelectorAll(".scroll-trigger");

const mediaQueryMobile = window.matchMedia('(max-width: 767px)');

const mobibarClasses = ["position-fixed", "topx-14", "z-1", "bg-white", "start-50", "translate-middle-x", "w-60", "rounded-4", "border", "border-dark-subtle", "border-5"];
const mobibarLogoClasses = ["w-90", "mb-1", "translate-6-x"];

let mobibarLogo;
let navTogglerClose;
let navTogglerOpen;

let count = 0;

document.firstElementChild.scrollIntoView({ block: "start" });
let triggerArr = Array.from(scrollTrigger);

window.onload = () => {
    mobibarLogo = navbar.querySelector('img[alt="Logo Playoffs"]')
    navTogglerOpen = navbar.querySelector(".navbar-toggler");
    navTogglerClose = navbar.querySelector("#close-offcanvas");
}

// Rellax.JS
let rellax = new Rellax('.rellax', {
    breakpoints:[576, 768, 1201]
}); 

// Media Query Mobile
if (mediaQueryMobile.matches) {

    homeCards[0].parentElement.classList.remove("pt-2");
    homeCards[2].parentElement.classList.remove("mt-3");
    homeCards[0].classList.remove("rounded-4");
    homeCards[0].classList.add("vh-91", "rounded-5", "rounded-bottom-0");

    divRows.forEach(div => {
        div.classList.add("gap-0");
    })

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Mobile navbar changer
    // Verificar se ta no começo da página  
    window.addEventListener("scroll", () => {

        if (window.scrollY === 0){
            homeCards[0].classList.remove("ptx-90");
            homeCards[0].classList.add("vh-91");
            homeCards.forEach(card => card.classList.add("rounded-4", "rounded-5"));
            homePill.classList.remove("d-none");
            navbar.classList.remove(...mobibarClasses);
            mobibarLogo.classList.remove(...mobibarLogoClasses);
        } else {
            let menuOpen = false;
    
            homeCards.forEach(card => { 
                card.classList.add("ptx-90");
                card.classList.remove("rounded-4", "rounded-5");
            });

            homeCards[0].classList.remove("vh-91");

            homePill.classList.add("d-none");
    
            navTogglerOpen.addEventListener("click", e => {
                navbar.classList.remove(...mobibarClasses);  
                mobibarLogo.classList.remove(...mobibarLogoClasses);
                menuOpen = true;
            });
    
            if (!menuOpen) {
                navbar.classList.add(...mobibarClasses);
                mobibarLogo.classList.add(...mobibarLogoClasses);
            }
    
            if (window.scrollY > 0) {
                navTogglerClose.addEventListener("click", e => {
                    navbar.classList.add(...mobibarClasses);
                    mobibarLogo.classList.add(...mobibarLogoClasses);  
                    menuOpen = false;
                });
            }
        }

    }, {passive: "true"});

    function checkVisible(el) {
        let rect = el.getBoundingClientRect();
        let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    function scrollDownwards() {
        scrollTrigger.forEach(trigger => {
            if (checkVisible(trigger)) {
                if (triggerArr.indexOf(trigger) == 2 || triggerArr.indexOf(trigger) == 4 || triggerArr.indexOf(trigger) == 6) {
                    scrollTrigger[triggerArr.indexOf(trigger)].parentElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    }

    function scrollUpwards() {
        scrollTrigger.forEach(trigger => {
            if (checkVisible(trigger)) {
                if (triggerArr.indexOf(trigger) == 1 || triggerArr.indexOf(trigger) == 3 || triggerArr.indexOf(trigger) == 5) {
                    scrollTrigger[triggerArr.indexOf(trigger)].parentElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    }

    window.addEventListener("scrollend", () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;

        // going downwards
        if (st > lastScrollTop && !(checkVisible(scrollTrigger[7]))) {
            scrollDownwards();

        // going upwards
        } else if (st < lastScrollTop && !(checkVisible(scrollTrigger[0]))) {
            scrollUpwards();
        }

        lastScrollTop = st <= 0 ? 0 : st;
    });
    
    document.addEventListener("swiped-up", e => {
        e.preventDefault();

        if ((checkVisible(scrollTrigger[0]))) {
            scrollTrigger[2].parentElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else {
            scrollDownwards();
        }
    });
    
    document.addEventListener("swiped-down", e => {
        e.preventDefault();
        
        if (!(checkVisible(scrollTrigger[0]))) {
            scrollUpwards();
        }
        
    });
}

// sim, ta uma bagunza :)