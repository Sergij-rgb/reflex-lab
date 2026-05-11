let testsCompleted = { aim: false, reaction: false, sleep: false };
let lastResults = { aim: 0, reaction: 0 };
let currentXP = 0; let level = 1;

function addXP(amount) {
    currentXP += amount;
    if (currentXP >= 100) {
        currentXP = 0; level++;
        document.getElementById('lvl-num').innerText = level;
        document.getElementById('rank-name').innerText = level >= 3 ? "ELITE" : "SCOUT";
        alert("LEVEL UP! Твій рівень: " + level);
    }
    const bar = document.getElementById('xp-bar');
    if(bar) bar.style.width = currentXP + "%";
}

const speedInput = document.getElementById('spawn-speed');
if(speedInput) {
    speedInput.oninput = () => document.getElementById('speed-val').innerText = speedInput.value;
}

const range = document.getElementById('shooting-range');
const startBtn = document.getElementById('start-game');

if (startBtn) {
    startBtn.onclick = () => {
        let score = 0; let timeLeft = 30;
        startBtn.disabled = true; range.innerHTML = '';
        let timer = setInterval(() => {
            timeLeft--; document.getElementById('timer').innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer); lastResults.aim = score;
                testsCompleted.aim = true; startBtn.disabled = false;
                addXP(40); checkAllTests();
            }
        }, 1000);
        function spawn() {
            if (timeLeft <= 0) return;
            const t = document.createElement('div');
            t.className = 'target';
            t.style.left = Math.random() * (range.offsetWidth - 30) + 'px';
            t.style.top = Math.random() * (range.offsetHeight - 30) + 'px';
            t.onclick = () => { score++; document.getElementById('score').innerText = score; t.remove(); addXP(2); };
            range.appendChild(t);
            setTimeout(() => { if(t.parentElement) t.remove(); spawn(); }, speedInput.value);
        }
        spawn();
    };
}

function startReaction() {
    const b = document.getElementById('reaction-area');
    b.style.background = "red"; b.innerText = "ЧЕКАЙ...";
    setTimeout(() => {
        b.style.background = "#00f2ff"; b.innerText = "ТИСНИ!";
        let s = Date.now();
        b.onclick = () => {
            let res = Date.now() - s;
            document.getElementById('react-result').innerText = res + " мс";
            lastResults.reaction = res; testsCompleted.reaction = true;
            b.style.background = ""; b.innerText = "OK"; b.onclick = null;
            addXP(30); checkAllTests();
        };
    }, Math.random() * 3000 + 2000);
}

// ОНОВЛЕНИЙ КАЛЬКУЛЯТОР СНУ
function calcSleep() {
    const wakeInput = document.getElementById('wake-time');
    const resultDisplay = document.getElementById('sleep-res');

    if (!wakeInput.value) {
        resultDisplay.innerText = "Виберіть час!";
        return;
    }

    // Логіка розрахунку (мінус 8 годин)
    let [hours, minutes] = wakeInput.value.split(':').map(Number);
    let date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setHours(date.getHours() - 8);

    let sleepH = date.getHours().toString().padStart(2, '0');
    let sleepM = date.getMinutes().toString().padStart(2, '0');

    // Вивід тексту
    resultDisplay.innerText = `Лягай о ${sleepH}:${sleepM} (8 год сну)`;
    
    // Нарахування XP
    if (!testsCompleted.sleep) {
        testsCompleted.sleep = true;
        addXP(15);
        checkAllTests();
    }
}

function checkAllTests() {
    if (testsCompleted.aim && testsCompleted.reaction && testsCompleted.sleep) {
        const report = document.getElementById('analysis-report');
        if (report) {
            report.classList.remove('hidden');
            document.getElementById('pro-react-text').innerHTML = `Реакція: <b>${lastResults.reaction}ms</b> (s1mple: 170ms)`;
            document.getElementById('pro-aim-text').innerHTML = `Точність: <b>${lastResults.aim}</b> (Shroud: 45)`;
        }
    }
}