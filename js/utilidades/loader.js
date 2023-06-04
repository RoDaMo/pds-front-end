export class Loader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isLoading = false;
  }

  connectedCallback() {
    this.render();
  }

  show() {
    this.isLoading = true;
    this.render();
  }

  hide() {
    this.isLoading = false;
    this.render();
  }

  render() {
    let displayStyle = this.isLoading ? 'block' : 'none';
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${displayStyle};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 9999;
        }

        .spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
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
      <div class="spinner"></div>
    `;
  }
}



customElements.define('app-loader', Loader);