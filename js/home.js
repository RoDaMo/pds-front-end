"use strict";

const navbar = document.querySelector("componente-header");
const homeCards = document.querySelectorAll(".home-card.d-flex");
const homePill = document.querySelector("#home-pill");

const mediaQueryMobile = window.matchMedia('(max-width: 767px)');

const mobibarClasses = ["position-fixed", "topx-14", "z-1", "bg-white", "start-50", "translate-middle-x", "w-60", "rounded-4", "border", "border-dark-subtle", "border-5"];
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

// Mobile JS

// Media Query Mobile
if (mediaQueryMobile.matches) {

    homeCards[0].classList.remove("rounded-4");
    homeCards[0].classList.add("vh-90", "rounded-5", "rounded-bottom-0");

    // Mobile navbar changer
    // Verificar se ta no começo da página  
    window.addEventListener("scroll", () => {

        // let obsCards = new IntersectionObserver(entries => {
        //     if(entries[0].isIntersecting === true && entries[1].isIntersecting === true) {
        //         console.log("true");
        //     } else {console.log("false")}
        // }, {threshold: 0});
        
        // obsCards.observe(homeCards[1], homeCards[2]);

        if (window.scrollY === 0){
            homeCards[0].classList.remove("ptx-90");
            homeCards[0].classList.add("vh-90");
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

            homeCards[0].classList.remove("vh-90");

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
}

// identificar os cards que estão na tela (função isonscreen() | iteração if (isonscreen(element[i], element[i+1])) { if (elem1.getBoundingclientrect().top > elem2.top   })
// fazer verificação do tamanho efetivo dos dois
// comparar e realizar a operação de ScrollIntoView