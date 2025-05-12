const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mainMenu = document.getElementById("main-menu");
const levelSelect = document.getElementById("level-select");
const startGameBtn = document.getElementById("start-game");
const mobileControls = document.getElementById("mobile-controls");

const levelButtons = document.querySelectorAll("#level-buttons button");

let currentLevel = 1;
let player;
let platforms = [];
let keys = { left: false, right: false, up: false };

class Player {
  constructor() {
    this.x = 50;
    this.y = 0;
    this.width = 20;
    this.height = 20;
    this.dy = 0;
    this.dx = 0;
    this.onGround = false;
  }
  draw() {
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.dy += 0.5;
    if (keys.left) this.dx = -3;
    else if (keys.right) this.dx = 3;
    else this.dx = 0;

    this.x += this.dx;
    this.y += this.dy;

    this.onGround = false;
    for (let platform of platforms) {
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height < platform.y + 10 &&
        this.y + this.height + this.dy >= platform.y
      ) {
        this.dy = 0;
        this.y = platform.y - this.height;
        this.onGround = true;
      }
    }
  }
}

class Platform {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 10;
  }
  draw() {
    ctx.fillStyle = "gray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function loadLevel(level) {
  platforms = [];
  player = new Player();
  if (level === 1) {
    platforms.push(new Platform(0, 380, 800));
    platforms.push(new Platform(150, 320, 100));
    platforms.push(new Platform(300, 260, 100));
    platforms.push(new Platform(450, 200, 100));
    platforms.push(new Platform(600, 140, 100));
  }
  // Add other levels here later
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();
  for (let platform of platforms) platform.draw();
  requestAnimationFrame(gameLoop);
}

startGameBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  levelSelect.style.display = "block";
});

levelButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentLevel = parseInt(button.dataset.level);
    levelSelect.style.display = "none";
    canvas.style.display = "block";
    mobileControls.style.display = "flex";
    loadLevel(currentLevel);
    gameLoop();
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = -10;
    player.onGround = false;
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
});

// Mobile controls
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const jumpBtn = document.getElementById("jump-btn");

leftBtn.addEventListener("touchstart", () => keys.left = true);
leftBtn.addEventListener("touchend", () => keys.left = false);

rightBtn.addEventListener("touchstart", () => keys.right = true);
rightBtn.addEventListener("touchend", () => keys.right = false);

jumpBtn.addEventListener("touchstart", () => {
  if (player.onGround) {
    player.dy = -10;
    player.onGround = false;
  }
});
