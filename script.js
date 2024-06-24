import { fetchRandomText } from './text.js';

const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetButton = document.getElementById('resetButton');
const statsButton = document.getElementById('statsButton');
const statsDisplay = document.getElementById('statsDisplay');
const clearStatsButton = document.getElementById('clearStatsButton');

let timer;
let startTime;
let isRunning = false;
let textToType = '';
let typedCharacters = 0;
let correctCharacters = 0;
let hasStartedTyping = false;

async function startTypingTest() {
    textToType = await fetchRandomText();
    textDisplay.textContent = textToType;
    resetGameState();
}

function resetGameState() {
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    hasStartedTyping = false;
    timerDisplay.textContent = 'Time: 60';
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 0%';
    clearInterval(timer);
    isRunning = false;
    typedCharacters = 0;
    correctCharacters = 0;
}

function startTimer() {
    startTime = new Date().getTime();
    isRunning = true;
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    const timeLeft = 60 - timeElapsed;
    timerDisplay.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        endTypingTest();
    }
}

function endTypingTest() {
    isRunning = false;
    textInput.disabled = true;
    calculateResults();
}

function calculateResults() {
    const wordsTyped = typedCharacters / 5;
    const timeElapsed = (new Date().getTime() - startTime) / 60000;
    const wpm = Math.round(wordsTyped / timeElapsed);
    const accuracy = Math.round((correctCharacters / typedCharacters) * 100);

    wpmDisplay.textContent = `WPM: ${wpm}`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

    saveStatistics(wpm, accuracy);
}

function saveStatistics(wpm, accuracy) {
    const stats = getStatistics();
    stats.push({ wpm, accuracy, date: new Date().toLocaleString() });
    localStorage.setItem('typingTestStats', JSON.stringify(stats));
}

function getStatistics() {
    const stats = localStorage.getItem('typingTestStats');
    return stats ? JSON.parse(stats) : [];
}

function displayStatistics() {
    const stats = getStatistics();
    statsDisplay.innerHTML = stats.map(stat => {
        return `<div>Date: ${stat.date}, WPM: ${stat.wpm}, Accuracy: ${stat.accuracy}%</div>`;
    }).join('');

    statsDisplay.classList.toggle('hidden');
}

function clearStatistics() {
    localStorage.removeItem('typingTestStats');
    statsDisplay.innerHTML = '';
}

textInput.addEventListener('input', () => {
    if (!isRunning && !hasStartedTyping) {
        startTimer();
        hasStartedTyping = true;
    }

    const typedText = textInput.value;
    typedCharacters = typedText.length;
    correctCharacters = 0;

    const displayText = textToType.split('').map((char, index) => {
        if (typedText[index] === char) {
            correctCharacters++;
            return `<span class="correct">${char}</span>`;
        } else if (typedText[index] === undefined) {
            return `<span>${char}</span>`;
        } else {
            return `<span class="incorrect">${char}</span>`;
        }
    }).join('');

    textDisplay.innerHTML = displayText;
});

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        resetGameState();
    }
});

resetButton.addEventListener('click', startTypingTest);
statsButton.addEventListener('click', displayStatistics);
clearStatsButton.addEventListener('click', clearStatistics);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        resetGameState();
    } else if (e.key === 'Escape') {
        startTypingTest();
    }
});

export { startTypingTest };
