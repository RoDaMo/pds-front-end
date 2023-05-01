"use strict";

const navbar = document.querySelector("componente-header");
const homeCards = document.querySelectorAll(".home-card.d-flex");
const homePill = document.querySelector("#home-pill");
const divRows = document.querySelectorAll(".home-row");
const scrollTrigger = document.querySelectorAll(".scroll-trigger");
const dots = document.querySelectorAll(".dot");

const mediaQueryMobile = window.matchMedia('(max-width: 767px)');

const mobibarClasses = ["position-fixed", "topx-14", "z-1", "start-50", "translate-middle-x", "w-60", "rounded-4", "glass-effect"];
const mobibarLogoClasses = ["w-90", "mb-2", "translate-6"];

let mobibarLogo;
let navTogglerClose;
let navTogglerOpen;

// Rellax.JS
let rellax = new Rellax('.rellax', {
    breakpoints:[576, 768, 1201]
}); 

let triggerArr = Array.from(scrollTrigger);

document.firstElementChild.scrollIntoView({ block: "start" });

if (isVisible(scrollTrigger[0])) {
    dots[0].classList.add('dots-active');
}

window.onload = () => {
    mobibarLogo = navbar.querySelector('img[alt="Logo Playoffs"]')
    navTogglerOpen = navbar.querySelector(".navbar-toggler");
    navTogglerClose = navbar.querySelector("#close-offcanvas");
}

function isVisible(el) {
    let rect = el.getBoundingClientRect();
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

// Media Query Mobile
if (mediaQueryMobile.matches) {

    function scrollDownwards() {
        scrollTrigger.forEach(trigger => {
            if (isVisible(trigger)) {
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
            if (isVisible(trigger)) {
                if (triggerArr.indexOf(trigger) == 1 || triggerArr.indexOf(trigger) == 3 || triggerArr.indexOf(trigger) == 5) {
                    scrollTrigger[triggerArr.indexOf(trigger)].parentElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    }

    homeCards[0].parentElement.classList.remove("pt-2");
    homeCards[2].parentElement.classList.remove("mt-3");
    homeCards[0].classList.remove("rounded-4");
    homeCards[0].classList.add("vh-91", "rounded-5", "rounded-bottom-0");

    divRows.forEach(div => {
        div.classList.add("gap-0");
    })

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Mobile navbar changer
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
    
            navTogglerOpen.addEventListener("click", () => {
                navbar.classList.remove(...mobibarClasses);  
                mobibarLogo.classList.remove(...mobibarLogoClasses);
                menuOpen = true;
            });
    
            if (!menuOpen) {
                navbar.classList.add(...mobibarClasses);
                mobibarLogo.classList.add(...mobibarLogoClasses);
            }
    
            navTogglerClose.addEventListener("click", () => {
                if (window.scrollY != 0) {
                    navbar.classList.add(...mobibarClasses);
                    mobibarLogo.classList.add(...mobibarLogoClasses);  
                    menuOpen = false;
                }
            });
        }

        // Page Indicator 
        if (isVisible(scrollTrigger[0])) {
            dots[0].classList.add('dots-active');
        } else {
            dots[0].classList.remove('dots-active');
        }
        
        if (isVisible(scrollTrigger[2])) {
            dots[1].classList.add('dots-active');
        } else {
            dots[1].classList.remove('dots-active');
        }
        
        if (isVisible(scrollTrigger[4])) {
            dots[2].classList.add('dots-active');
        } else {
            dots[2].classList.remove('dots-active');
        }

        if (isVisible(scrollTrigger[6])) {
            dots[3].classList.add('dots-active');
        } else {
            dots[3].classList.remove('dots-active');
        }

    }, {passive: "true"});

    // Scrollend Trigger
    window.addEventListener("scrollend", () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;

        // going downwards
        if (st > lastScrollTop && !(isVisible(scrollTrigger[7]))) {
            scrollDownwards();

        // going upwards
        } else if (st < lastScrollTop && !(isVisible(scrollTrigger[0]))) {
            scrollUpwards();
        }

        lastScrollTop = st <= 0 ? 0 : st;
    });
    
    // Swipe Direction Trigger
    document.addEventListener("swiped-up", e => {
        e.preventDefault();

        if ((isVisible(scrollTrigger[0]))) {
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
        
        if (!(isVisible(scrollTrigger[0]))) {
            scrollUpwards();
        }
        
    });
} else {
    homePill.classList.add("d-none");
}