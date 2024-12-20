import toast from "./toast.js";
import bob from "./bob.js";
const info = document.getElementById('info');
const game = document.getElementById('game');
const resetEl = document.getElementById('reset');
const startText = document.getElementById('start-text');
const timer = document.getElementById('timer');
const colors = ['magenta', 'red', 'yellow', 'green', 'blue', 'purple'];
let count = 0;
let highScore = Number.parseInt(localStorage.getItem('highScore') ?? '0');
document.getElementById('score').innerText = highScore;
console.log('highScore', highScore);
let started = false;
let startTime = Date.now();
const i = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.intersectionRatio > 0.4) {
            
            console.log('seen', entry.target);
            entry.target.classList.add('seen');
        }
    }
}, { threshold: [0.0, 0.4] });


function start() {
    if (!started) {
        started = true;
        startTime = Date.now();
        count = 0;
        info.style.display = 'none';
        startText.style.display = 'none';
        resetEl.style.display = 'block';
        timer.style.display = 'block';
    }
}
function reset() {
    i.disconnect();
    started = false;
    startTime = Date.now();
    info.style.display = 'flex';
    timer.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'instant' });
    game.innerHTML = '';
    resetEl.style.display = 'none';
    startText.style.display = 'block';
    document.getElementById('score').innerText = highScore;
    localStorage.setItem('highScore', highScore);
    document.getElementById('current').innerText = count;
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

setInterval(checkAchievements, 1000);
setInterval(() => {
    if (started) {
        let elapsed = Date.now() - startTime;
        let seconds = Math.floor(elapsed / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        timer.innerText = `${hours>0 ? hours : ''}${hours>0 ? ':': ''}${(minutes%60).toFixed().padStart(2,'0')}:${(seconds%60).toFixed().padStart(2,'0')}`; // (hh:)mm:ss
    }
}, 500);

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

function achievementToast(name,desc) {
    toast(`Achievement Unlocked: ${name}`,desc, { type: 'warning', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="icon"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M400 0L176 0c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8L24 64C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9L192 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-26.1 0C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24L446.4 64c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112l84.4 0c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6l84.4 0c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>'});
}

const achievements = [
    // count based
    {id: 1, name: 'New to Scrolling', desc: 'You have scrolled through 100 pages!', check: () => count >= 100},
    {id: 2, name: 'Getting Started', desc: 'You have scrolled through 500 pages!', check: () => count >= 500},
    {id: 3, name: 'Scrolling Pro', desc: 'You have scrolled through 1000 pages!', check: () => count >= 1000},
    {id: 4, name: 'Maybe you should stop?', desc: 'You have scrolled through 5000 pages!', check: () => count >= 5000},
    {id: 5, name: 'You have a problem', desc: 'You have scrolled through 10000 pages!', check: () => count >= 10000},
    {id: 14, name: 'Better grab a towel', desc: 'You have scrolled through 42 pages!', check: () => count >= 42},
    // high score based
    {id: 6, name: 'Better than Cookie Clicker', desc: 'Play the game', check: () => highScore > 0},
    // time based
    {id: 7, name: 'Time Flies', desc: 'You have been scrolling for 5 minutes!', check: () => Date.now() - startTime > 1000 * 60 * 5 && started},
    {id: 8, name: 'Time Flies Faster', desc: 'You have been scrolling for 10 minutes!', check: () => Date.now() - startTime > 1000 * 60 * 10 && started},
    {id: 9, name: 'Are you still here?', desc: 'You have been scrolling for 30 minutes!', check: () => Date.now() - startTime > 1000 * 60 * 30 && started},
    {id: 10, name: 'You need a break', desc: 'You have been scrolling for 1 hour!', check: () => Date.now() - startTime > 1000 * 60 * 60 && started},
    {id: 11, name: 'You can\'t have <i>this</i> much time.', desc: 'You have been scrolling for 2 hours!', check: () => Date.now() - startTime > 1000 * 60 * 60 * 2 && started},
    // other
    {id: 12, name: 'Achievement Hunter', desc: 'Unlock all achievements', check: () => achievementsSeen.length === achievements.length-1},
    {id: 13, hidden: true, name: 'Find Bob', desc: 'Find Bob', check: () => document.getElementById('bob')?.getAttribute('data-found') === 'true'},
    {id: 15, hidden: true, name: 'Kill Bob', desc: 'You are a horrible person.', check: () => document.getElementById('bob')?.getAttribute('data-dead') === 'true'},
]
let achievementsSeen = JSON.parse(localStorage.getItem('achievementsSeen') ?? '[]');
function checkAchievements() {
    for (const achievement of achievements) {
        if (achievement.check()) {
            if (!achievementsSeen.includes(achievement.id)) {
                achievementsSeen.push(achievement.id);
                achievementToast(achievement.name, achievement.desc);
            }
        }
    }
    updateAchievements();
    localStorage.setItem('achievementsSeen', JSON.stringify(achievementsSeen));
}

function updateAchievements() {
    // sort by completion
    let achievementsCopy = [...achievements];
    achievementsCopy.sort((a,b) => {
        if (achievementsSeen.includes(a.id) && !achievementsSeen.includes(b.id)) {
            return -1;
        }
        if (achievementsSeen.includes(b.id) && !achievementsSeen.includes(a.id)) {
            return 1;
        }
        return 0;
    });
    for (const achievement of achievementsCopy) {
        let el = document.getElementById(`achievement-${achievement.id}`);
        if (el) {
            el.remove();
        } 
        el = document.createElement('div');
        el.id = `achievement-${achievement.id}`;
        el.classList.add('achievement');
        if (achievement.hidden) {
            el.classList.add('secret');
            // unfinished
            el.style.setProperty('--text',"hidden") 
        }
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="icon achievement-icon"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#FFD43B" d="M400 0L176 0c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8L24 64C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9L192 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-26.1 0C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24L446.4 64c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112l84.4 0c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6l84.4 0c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon achievement-icon-unlocked"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
        <div class='achievement-title'>${achievement.name}</div>
        <div class='achievement-text'>${achievement.desc}</div>`;
        document.getElementById('achievements').appendChild(el);
        if (achievementsSeen.includes(achievement.id)) {
            el.classList.add('unlocked');
        } else {
            el.classList.remove('unlocked');
        }        
    }
}

document.getElementById("reset-achievements").addEventListener('click', () => {
    achievementsSeen = [];
    count = 0;
    highScore = 0;
    localStorage.setItem('highScore', '0');
    localStorage.setItem('achievementsSeen', '[]');
    updateAchievements();
});
resetEl.addEventListener('click', reset);
