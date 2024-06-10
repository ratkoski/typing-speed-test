const displayTextElement = document.getElementById('display-text');
const typingArea = document.getElementById('typing-area');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const resultsElement = document.getElementById('results');

let timer;
let startTime;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
let textToType = '';

// Fetch text from public API or local JSON
async function fetchText() {
  const response = await fetch('https://api.quotable.io/random');
  const data = await response.json();
  textToType = data.content;
  displayText();
}

function displayText() {
  displayTextElement.innerText = textToType;
}

function startTyping() {
  if (!timer) {
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const remainingTime = 60 - elapsedTime;
  timerElement.textContent = remainingTime;

  if (remainingTime <= 0) {
    clearInterval(timer);
    endTest();
  }
}

function endTest() {
  typingArea.disabled = true;
  const wordsTyped = totalCharsTyped / 5;
  const minutes = 60 / 60;
  const wpm = (wordsTyped / minutes).toFixed(2);
  const accuracy = ((correctCharsTyped / totalCharsTyped) * 100).toFixed(2);

  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy;
  resultsElement.style.display = 'block';
}

typingArea.addEventListener('input', (e) => {
  startTyping();
  const typedText = typingArea.value;
  totalCharsTyped = typedText.length;

  let displayedText = '';
  for (let i = 0; i < textToType.length; i++) {
    if (i < typedText.length) {
      if (typedText[i] === textToType[i]) {
        displayedText += `<span class="correct">${textToType[i]}</span>`;
        correctCharsTyped++;
      } else {
        displayedText += `<span class="incorrect">${textToType[i]}</span>`;
      }
    } else {
      displayedText += textToType[i];
    }
  }
  displayTextElement.innerHTML = displayedText;
});

fetchText();
