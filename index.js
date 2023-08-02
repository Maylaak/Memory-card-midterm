const cards = document.querySelectorAll('.memory-card');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0; 

function flipCard() {//1
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {//2
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  score++;
  scoreDisplay.textContent = `Score: ${score}`;

  if (score === cards.length / 2) {
    // Game over
    clearInterval(timerInterval);
    setTimeout(() => {
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
      } else {
        bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
      }
      alert(`Game Over!\nYour Score: ${score}\nBest Score: ${bestScore}`);
      resetGame();
    }, 500);
  }

  resetBoard();
}

function unflipCards() {//3
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {//4
  hasFlippedCard, lockBoard = false;
  firstCard, secondCard = null;
}

function resetGame() {
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  cards.forEach(card => card.classList.remove('flip'));
  setTimeout(() => {
    shuffle();
    cards.forEach(card => card.addEventListener('click', flipCard));
    startTimer();
  }, 4000); // Show cards for 4 seconds before hiding
}

function shuffle() {//5
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

let timerInterval;
function startTimer() {
  let timeLeft = 90;
  timerDisplay.textContent = `Time left: ${timeLeft}`;

  timerInterval = setInterval(() => {
    timeLeft--;//subtracts 1 from the current value of timeLeft
    timerDisplay.textContent = `Time left: ${timeLeft}`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      setTimeout(() => {
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem('bestScore', bestScore);
          bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
        } else {
          bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
        }
        alert(`Time's Up!\nYour Score: ${score}\nBest Score: ${bestScore}`);
        resetGame();
      }, 500);
    }
  }, 1000);
}

// Shuffle the cards on page load
window.addEventListener('load', () => {//6
  shuffle();
  cards.forEach(card => card.addEventListener('click', flipCard));
  bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
  startTimer();
});
