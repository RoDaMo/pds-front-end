"use strict";

const navbar = document.querySelector("componente-header");
const homeCards = document.querySelectorAll(".home-card.d-flex");

const mobibarClasses = ["position-fixed", "topx-14", "z-1", "bg-white", "start-50", "translate-middle-x", "w-60", "rounded-4"];
const mobibarLogoClasses = ["w-90", "mb-1", "translate-6-x"];

let mobibarLogo;
let navTogglerClose;
let navTogglerOpen;

let count = 0;

document.firstElementChild.scrollIntoView({ block: "start" });

window.onload = () => {
    mobibarLogo = navbar.querySelector('img[alt="Logo Playoffs"]')
    navTogglerOpen = navbar.querySelector(".navbar-toggler");
    navTogglerClose = navbar.querySelector("#close-offcanvas");
}

// Rellax.JS
let rellax = new Rellax('.rellax', {
    breakpoints:[576, 768, 1201]
}); 

// Trigger / Se um elemento ta na tela
// let observer = new IntersectionObserver(entries => {
// 	if(entries[0].isIntersecting === true) {
// 		document.querySelector(".test").scrollIntoView({
//             behavior: "smooth",
//             block: "center"
//         });
// 	}
// }, {threshold: 0});

// observer.observe(document.querySelector("#scroll-trigger"));

// Mobile navbar changer
// Verificar se ta no começo da página
window.addEventListener("scroll", () => {
    if (window.scrollY === 0){
        homeCards.forEach(card => card.classList.remove("ptx-74"));
        navbar.classList.remove(...mobibarClasses);
        mobibarLogo.classList.remove(...mobibarLogoClasses);
    } else {
        let menuOpen = false;

        homeCards.forEach(card => card.classList.add("ptx-74"));

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
});

document.addEventListener("swiped-up", e => {
    e.preventDefault();

    if (!(count >= homeCards.length-1)) {
        homeCards[count+1].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    
        count++;
        console.log(count);
    }
});

document.addEventListener("swiped-down", e => {
    e.preventDefault();

    if (!(count <= 0)) {
        homeCards[count-1].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    
        count--;
        console.log(count);
    }
});

//74px