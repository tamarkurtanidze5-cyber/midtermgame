
import { Player } from "./player.js";
import { Item } from "./items.js";

import {
    showScreen,
    updateHUD,
    showGameOver,
    updateBestScore
} from "./ui.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player;
let items = [];

let score = 0;
let lives = 3;
let level = 1;

let gameRunning = false;
let keys = {};

let playerName = "Player";
let lastSpawn = 0;

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", startGame);

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (["arrowleft", "arrowright"].includes(key)) {
        event.preventDefault();
    }

    keys[key] = true;
});

document.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});

function startGame() {
    playerName =
        document.getElementById("playerName").value.trim() || "Player";

    score = 0;
    lives = 3;
    level = 1;
    items = [];

    player = new Player(canvas);

    gameRunning = true;
    lastSpawn = 0;

    showScreen("gameScreen");
    updateHUD(score, lives, level);

    requestAnimationFrame(gameLoop);
}

// Decorative game background
function drawBackground() {
    const gradient = ctx.createLinearGradient(
        0, 0, canvas.width, canvas.height
    );

    gradient.addColorStop(0, "#f4e6cd");
    gradient.addColorStop(1, "#ddc19a");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative tablecloth pattern
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#875c37";
    ctx.lineWidth = 1;

    for (let x = 20; x < canvas.width; x += 40) {
        for (let y = 20; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x + 5, y);
            ctx.lineTo(x, y + 5);
            ctx.lineTo(x - 5, y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    ctx.restore();

    // Decorative border
    ctx.strokeStyle = "rgba(130, 85, 45, 0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Small title
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "rgba(90, 54, 35, 0.55)";
    ctx.textAlign = "center";
    ctx.fillText("THE GEORGIAN KHINKALI TABLE", canvas.width / 2, 28);

    // Small decorative stars
    ctx.font = "17px Arial";
    ctx.fillStyle = "rgba(145, 92, 45, 0.4)";
    ctx.fillText("✦", 30, 35);
    ctx.fillText("✦", canvas.width - 30, 35);
}

function spawnItem(timestamp) {
    const spawnInterval = Math.max(300, 1000 - level * 70);

    if (timestamp - lastSpawn >= spawnInterval) {
        items.push(new Item(canvas, level));
        lastSpawn = timestamp;
    }
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    drawBackground();

    if (keys["arrowleft"] || keys["a"]) {
        player.move(-1);
    }

    if (keys["arrowright"] || keys["d"]) {
        player.move(1);
    }

    player.draw(ctx);

    spawnItem(timestamp);

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];

        item.update();
        item.draw(ctx);

        if (item.collides(player)) {
            if (item.type === "khinkali") {
                score += 10;
            } else if (item.type === "golden") {
                score += 50;
            } else if (item.type === "pepper") {
                lives--;
            }

            items.splice(i, 1);
            continue;
        }

        if (item.y > canvas.height + item.size) {
            items.splice(i, 1);
        }
    }

    level = Math.floor(score / 200) + 1;

    updateHUD(score, lives, level);

    if (lives <= 0) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;

    updateBestScore(score);
    showGameOver(score);
}

document.getElementById("bestScore").textContent =
    localStorage.getItem("bestScore") || "0";
