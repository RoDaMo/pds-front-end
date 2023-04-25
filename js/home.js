"use strict";

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

// Verificar se ta no começo da página
window.addEventListener("scroll", () => {
    if (window.scrollY === 0){
        // remove classList navbar 
    } else {
        // add classList navbar
    }
});
