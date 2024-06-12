import { fetchRandomText } from './text.js';

const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetButton = document.getElementById('resetButton');

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
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    hasStartedTyping = false;
    timerDisplay.textContent = 'Time: 60';
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 0%';
    clearInterval(timer);
    isRunning = false;
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

    calculateResults();
});

resetButton.addEventListener('click', startTypingTest);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startTypingTest();
    } else if (e.key === 'Escape') {
        startTypingTest();
    }
});

export { startTypingTest };
