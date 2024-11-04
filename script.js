const info = document.getElementById('info');
const game = document.getElementById('game');
const resetEl = document.getElementById('reset');
const startText = document.getElementById('start-text');
const colors = ['magenta', 'red', 'yellow', 'green', 'blue', 'purple'];
let count = 0;
let highScore = Number.parseInt(localStorage.getItem('highScore') ?? '0');
let started = false;
const i = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.intersectionRatio > 0.2) {
            
            console.log('seen', entry.target);
            entry.target.classList.add('seen');
        }
    }
}, { threshold: [0.0, 0.2] });


function start() {
    if (!started) {
        started = true;
        count = 0;
        info.style.display = 'none';
        startText.style.display = 'none';
        resetEl.style.display = 'block';
    }
}
function reset() {
    i.disconnect();
    started = false;
    info.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });
    game.innerHTML = '';
    resetEl.style.display = 'none';
    startText.style.display = 'block';
    document.getElementById('score').innerText = highScore;
    localStorage.setItem('highScore', highScore);
}
function addPage() {
    const page = document.createElement('div');
    page.classList.add('page');
    page.classList.add(colors[count % colors.length]);
    page.innerText = count;
    game.appendChild(page);
    console.log('added', page);
    console.log('observe', page,i);
    i.observe(page);
}
document.addEventListener('scroll', () => {
    // detect when the user scrolls to the bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (!started) {
            setTimeout(() => {   
                start();
                count++;
                addPage();
            }, 200);
            return;
        }
        count++;
        if (count > highScore) {
            highScore = count;
        }
        addPage();
    }
});

resetEl.addEventListener('click', reset);