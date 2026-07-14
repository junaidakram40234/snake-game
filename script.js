const board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;

const score = document.querySelector("#score");
let scoreValue = 0;

const highScore = document.querySelector("#high-score");
let highScoreValue = 0;

const time = document.querySelector("#time");
let timeValue = `00:00`;

const startBtu = document.querySelector(".btu-start");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const restartBtu = document.querySelector(".btu-restart");


let touchStartX = 0;
let touchStartY = 0;


const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalId = null; 

let food = {
  x: Math.floor(Math.random() * cols),
  y: Math.floor(Math.random() * rows),
};

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < 1100) {
    document.querySelector(".chan").innerText =
      `welcome to the Snake game, Swipe to move`;
  }
});
 


const blocks = [];
let snake = [{ x: 4, y: 5 }];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row},${col}`] = block;
  }
}
let direction = "right";

function render() {
  let head = null;
  blocks[`${food.y},${food.x}`].classList.add("food");

  if (direction === "right") {
    head = {
      x: snake[0].x + 1,
      y: snake[0].y,
    };
  } else if (direction === "left") {
    head = {
      x: snake[0].x - 1,
      y: snake[0].y,
    };
  } else if (direction === "up") {
    head = {
      x: snake[0].x,
      y: snake[0].y - 1,
    };
  } else if (direction === "down") {
    head = {
      x: snake[0].x,
      y: snake[0].y + 1,
    };
  }

  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    modal.style.display = "flex";
    startGame.style.display = "none";
    gameOver.style.display = "flex";

    clearInterval(intervalId);
    if (scoreValue > highScoreValue) {
      highScoreValue = scoreValue;
      localStorage.setItem("highScore", highScoreValue.toString());
      highScore.innerText = localStorage.getItem("highScore");
    }
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.y},${food.x}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
    blocks[`${food.y},${food.x}`].classList.add("food");

    snake.unshift(head);

    score.innerText = ++scoreValue;
  }

  snake.forEach((segment) => {
    blocks[`${segment.y},${segment.x}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.y},${segment.x}`].classList.add("fill");
  });
}

// window.onload = () => {
//     intervalId = setInterval(() => {
//       render();
//     }, 300);
// }

startBtu.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);

    timerIntervalId = setInterval(() => {
      let [min, sec] = timeValue.split(":").map(Number);

      sec++;

      if (sec === 60) {
        sec = 0;
        min++;
      }

      timeValue = `${min}:${sec }`

      time.innerText = timeValue;
    }, 1000);
});

restartBtu.addEventListener("click", restartGame);

function restartGame() {
        clearInterval(intervalId);

  blocks[`${food.y},${food.x}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.y},${segment.x}`].classList.remove("fill");
  });

  direction = "right";
  scoreValue = 0;
    score.innerText = 0;
    
    timeValue = `00:00`;

  modal.style.display = "none";
  snake = [{ x: 4, y: 5 }];
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
  intervalId = setInterval(() => {
    render();
  }, 300);
}



addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  }
});

addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal Swipe
    if (dx > 30 && direction !== "left") {
      direction = "right";
    } else if (dx < -30 && direction !== "right") {
      direction = "left";
    }
  } else {
    // Vertical Swipe
    if (dy > 30 && direction !== "up") {
      direction = "down";
    } else if (dy < -30 && direction !== "down") {
      direction = "up";
    }
  }
});

