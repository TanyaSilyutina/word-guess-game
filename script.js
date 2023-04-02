let startButtonEl = document.querySelector("#start");
let timeLeftEl = document.querySelector("#time-left");
let gameTextEl = document.querySelector("#game-text");
let winsEl = document.querySelector("#wins");
let lossesEl = document.querySelector("#losses");
let resetScoreButtonEl = document.querySelector("#reset-score");

let winsCount = 0;
let lossesCount = 0;

let randomWord;
let intervalId;

startButtonEl.addEventListener("click", startGame);
resetScoreButtonEl.addEventListener("click", scoreReset);
document.addEventListener("keyup", keyupAction);

async function getWord() {
  const response = await fetch("https://random-word-api.herokuapp.com/word");
  const jsonData = await response.json();
  return jsonData[0];
}


async function startGame() {
  userSet.clear();
  randomWord = await getWord();
  displayGameText();
  timerStart();
  startButtonEl.disabled = true;
}

function userLost() {
  lossesCount++;
  lossesEl.textContent = "Losses: " + lossesCount;
  startButtonEl.disabled = false;
}

function userWon() {
  winsCount++;
  winsEl.textContent = "Wins: " + winsCount;
  startButtonEl.disabled = false;
}

function scoreReset() {
  winsCount = 0;
  lossesCount = 0;
  lossesEl.textContent = "Losses: " + lossesCount;
  winsEl.textContent = "Wins: " + winsCount;
}

let userSet = new Set();

function keyupAction(event) {
  userSet.add(event.key);
  displayGameText();

  if (hasUserWon()) {
    userWon();
    clearInterval(intervalId);
    alert("You have won");
  }
}

function timerStart() {
  let count = 15;
  intervalId = setInterval(function () {
    count--;
    timeLeftEl.textContent = count;

    if (count == 0) {
      userLost();
      gameTextEl.innerHTML = "GAME OVER. <br>The answer is " + randomWord;
      clearInterval(intervalId);
    }
  }, 1000)
}

function hasUserWon() {
  for (let i = 0; i < randomWord.length; i++) {
    let element = randomWord.charAt(i);
    if (element === " ") {
      continue;
    }
    if (!userSet.has(element)) {
      return false;
    }
  }
  return true;
}

function displayGameText() {
  let gameText = "";
  for (let i = 0; i < randomWord.length; i++) {
    let element = randomWord.charAt(i);
    if (userSet.has(element)) {
      gameText += element;
    } else if (element === " ") {
      gameText += element;
    } else {
      gameText += "_";
    }
    gameText += " ";
  }
  gameTextEl.textContent = gameText;
}