 window.addEventListener('pagina-load', () => {
  document.body.classList.add('loaded');
});

// - z-index: 9999; removed
export class preLoader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <style>
      .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease-in-out;
        opacity: 1;
        pointer-events: auto;
        z-index: 99999;
      }

      body.loaded .preloader {
        opacity: 0;
        pointer-events: none;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #333;
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
        <div class="preloader d-flex align-items-center justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
      `;
    }
  }
  
  window.customElements.define('componente-preloader', preLoader);

