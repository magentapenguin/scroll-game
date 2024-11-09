class AutoreloaderUi extends HTMLElement {
    constructor() {
        super();
        this.ui = null;
        this.error = false;
        this.visible = false;
        this.reloading = false;
    }
    connectedCallback() {
        this.innerHTML = `
        <style>
            .autoreloader-ui {
                position: fixed;
                top: 0;
                right: 0;
                z-index: 1000000;
                color: var(--color, white);
                margin: 1rem;
                border-radius: 1rem 0 0 0;
                display: none;
                font-size: 1.5rem;
                font-weight: bold;
                text-shadow: 0 0 3px var(--bg), 0 0 6px var(--bg), 0 0 9px var(--bg);
            }
            .autoreloader-ui.error .icon {
                color: #a80000;
            }
            @media (prefers-color-scheme: dark) {
                .autoreloader-ui.error .icon {
                    color: #f11;
                }
            }
            .autoreloader-ui.visible {
                display: block;
            }
            .autoreloader-ui.visible:not(.error) {
                cursor: pointer;
            }
        </style>
        <div class="autoreloader-ui"></div>
        `;
        this.ui = this.querySelector('.autoreloader-ui');
        setInterval(() => this.render(), 50);
        this.addEventListener('click', () => {
            this.reloading = true;
            location.reload();
        });

    }
    getData() {
        return window.autoreloader ?? { shouldReload: false, noConnection: true };
    }

    render() {
        const { shouldReload, noConnection } = this.getData();
        this.ui.innerHTML = `
        ${noConnection ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="icon"><!--!Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path d="M320 32c-27.2 0-48.7 23.1-46.8 50.2l14.9 208C289.3 307 303.2 320 320 320s30.7-13 31.9-29.7l14.9-208C368.7 55.1 347.2 32 320 32zM241.3 84.5c-1.2-17.4 3.3-33.9 11.9-47.6C159.4 51 75.1 94.1 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9c51.3-49.2 116.2-84.3 188.5-99.1l-1.4-19.3zm157.4 0l-1.4 19.3c72.3 14.8 137.2 49.9 188.5 99.1c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C564.9 94.1 480.6 51 386.8 37c8.6 13.7 13.1 30.1 11.9 47.6zM129.5 264c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c23.6-20.8 51.6-36.7 82.4-46.2l-4.7-65.1C204.4 212 163.4 234.1 129.5 264zm260.9-63.3l-4.6 65.1c30.8 9.4 58.8 25.4 82.4 46.2c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2c-33.9-29.9-74.9-52-120.1-63.3zM384 416a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></svg> No connection' : ''}
        ${this.reloading ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon spin"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"/></svg> Reloading' : ''}
        ${shouldReload &&!this.reloading ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"/></svg> Reload Required' : ''}`
        this.ui.classList.toggle('error', noConnection);
        this.ui.classList.toggle('visible', shouldReload || noConnection);
    }
}
customElements.define('autoreloader-ui', AutoreloaderUi);