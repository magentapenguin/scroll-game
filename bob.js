export default class Bob extends HTMLElement {
    constructor() {
        ;
        super();
        this.intersected = false;
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.intersectionRatio > 0.4) {
                    this.intersected = true;
                    this.setAttribute('data-found', 'true');
                    this.classList.add('seen');
                    this.observer.disconnect();
                }
            }
        }, {});
    }
    connectedCallback() {
        this.intersected = false;
        this.setAttribute('data-found', 'false');
        this.setAttribute('data-dead', 'false');
        this.innerHTML = `
        <div class="bob">
    <style>
        .bob {
            cursor: pointer;
            width: min-content;
            height: min-content;
        }
            bo-b {
                --bob: #461652;
                position: relative;
            }
            </style>
    <div class="bob-eyes">
        <style>
            .bob-eyes-move {
                --x: 320px;
                --y: 256px;
                position: absolute;
            }
            .bob-eyes {
                transform: translate(25%,100%);
                position: relative;
                width: 2rem;
                z-index: 1;
                aspect-ratio: 640 / 512;
            }
            .bob-eyes svg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .bob-eyes-move {
                transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%));
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M586.072 253.486c0 99.041-54.876 179.329-122.569 179.329-67.693 0-122.569-80.288-122.569-179.329 0-99.041 54.876-179.329 122.569-179.329 67.693 0 122.569 80.288 122.569 179.329Zm-284.623-3.29c0 99.041-54.876 179.329-122.569 179.329-67.693 0-122.569-80.288-122.569-179.329 0-99.041 54.876-179.329 122.569-179.329 67.693 0 122.569 80.288 122.569 179.329Z" fill="#fff" stroke="#fff"/>
            <path fill="#102" d="M64 256c0-46.8 14.3-87.9 35.8-116.6C121.3 110.8 148.6 96 176 96s54.7 14.8 76.2 43.4C273.7 168.1 288 209.2 288 256s-14.3 87.9-35.8 116.6S203.4 416 176 416s-54.7-14.8-76.2-43.4S64 302.8 64 256zm256-129.3c-5-9.1-10.5-17.6-16.6-25.7-30.6-40.8-75.3-69-127.4-69S79.2 60.2 48.6 101C18 141.8 0 196.7 0 256s18 114.2 48.6 155 75.3 69 127.4 69 96.8-28.2 127.4-69c6-8 11.6-16.6 16.6-25.7 5 9.1 10.5 17.6 16.6 25.7 30.6 40.8 75.3 69 127.4 69s96.8-28.2 127.4-69C622 370.2 640 315.3 640 256s-18-114.2-48.6-155S516.1 32 464 32s-96.8 28.2-127.4 69c-6 8-11.6 16.6-16.6 25.7zM352 256c0-46.8 14.3-87.9 35.8-116.6C409.3 110.8 436.6 96 464 96s54.7 14.8 76.2 43.4C561.7 168.1 576 209.2 576 256s-14.3 87.9-35.8 116.6S491.4 416 464 416s-54.7-14.8-76.2-43.4S352 302.8 352 256z"/>
            <path class="bob-eyes-move" d="M235 256c0 33.137-26.863 60-60 60s-60-26.863-60-60 26.863-60 60-60 60 26.863 60 60Zm285 0c0 33.137-26.863 60-60 60s-60-26.863-60-60 26.863-60 60-60 60 26.863 60 60Z" stroke="#000"/>
        </svg>
    </div>
    <div class="bob-body">
        <style>
            .bob-body {
                pointer-events: none;
                position: relative;
                width: 3rem;
                height: 5rem;
                background-color: var(--bob);
            }
        </style>
    </div>
    <style>
        .bob-particles {
            position: absolute;
            pointer-events: none;
            top: var(--y);
            left: var(--x);

        }
        .particle {
            position: absolute;
            width: var(--size);
            height: var(--size);
            background-color: var(--bob);
            border-radius: 50%;

        }
    </style>
<div class="bob-particles">
        
</div>
</div>`;
        this.observer.observe(this);

        if (this.id !== 'bob') {
            document.getElementById('bob')?.remove();
        }
        this.id = 'bob';

        this.style.setProperty('--bob', '#461652');

        this.addEventListener('click', (e) => {
            this.setAttribute('data-dead', 'true');
            this.querySelector('.bob').style.visibility = 'hidden';
            this.explode(e.offsetX, e.offsetY);
        });

        document.addEventListener('mousemove', (e) => {
            let x = e.clientX;
            let y = e.clientY;
            let rect = this.querySelector('.bob-eyes-move').getBoundingClientRect();
            // calculate the angle
            let angle = Math.atan2(y - (rect.top + rect.height / 2), x - (rect.left + rect.width / 2));
            // calculate the distance
            let distance = Math.min(Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2)), 40);
            // calculate the new position
            let newX = Math.cos(angle) * distance + 320;
            let newY = Math.sin(angle) * distance + 256;
            // set the new position
            this.querySelector('.bob-eyes-move').style.setProperty('--x', newX + 'px');
            this.querySelector('.bob-eyes-move').style.setProperty('--y', newY + 'px');
        });
    }
    explode(x, y) {
        const particlesContainer = this.querySelector('.bob-particles');
        particlesContainer.innerHTML = '';
        particlesContainer.style.setProperty('--x', x ? (x + 'px') : '50%');
        particlesContainer.style.setProperty('--y', y ? (y + 'px') : '50%');

        let particles = 50;
        for (let i = 0; i < particles; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            let x = Math.random() * 2 - 1 * 10 + 'px';
            let y = Math.random() * 2 - 1 * 40 + 'px';
            let direction = Math.random() * Math.PI * 2;
            let tx = Math.cos(direction) * 100 + 'px';
            let ty = Math.sin(direction) * 100 + 'px';

            particle.style.setProperty('--size', Math.random() * 10 + 5 + 'px');
            particle.style.setProperty('--x', x);
            particle.style.setProperty('--y', y);

            particle.animate([
                { transform: 'translate(-50%, -50%)', opacity: 1 },
                { transform: `translate(-50%, -50%) translate(${tx}, ${ty})`, opacity: 0 },
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'ease-in',
                fill: 'forwards'
            }).onfinish = () => {
                particle.remove();
            };

            particlesContainer.appendChild(particle);
        }
    }
}
customElements.define('bo-b', Bob);