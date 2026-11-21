
import { Player } from "./player.js";
import { Item } from "./items.js";

import {
    showScreen,
    updateHUD,
    showGameOver,
    updateBestScore
} from "./ui.js";

import {
    checkLeaderboardStatus,
    getTopScores,
    submitScore
} from "./api.js";

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

// Check leaderboard when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    await updateLeaderboardStatus();
    await displayLeaderboard();
});

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

// Check whether leaderboard is online
async function updateLeaderboardStatus() {
    const online = await checkLeaderboardStatus();

    const statusElement = document.getElementById("leaderboardStatus");

    if (!statusElement) return;

    statusElement.textContent = online
        ? "Leaderboard: Online"
        : "Leaderboard: Offline";

    statusElement.style.backgroundColor = online ? "#d4edda" : "#f8d7da";
    statusElement.style.color = online ? "#155724" : "#721c24";
}

// Display top 10 scores on menu and Game Over screens
async function displayLeaderboard() {
    const scores = await getTopScores();

    const leaderboardElements = [
        document.getElementById("leaderboard"),
        document.getElementById("gameOverLeaderboard")
    ];

    leaderboardElements.forEach(element => {
        if (!element) return;

        element.innerHTML = "<h3>Top 10 Players</h3>";

        if (scores === null) {
            element.innerHTML +=
                "<p>Leaderboard temporarily unavailable</p>";
            return;
        }

        if (scores.length === 0) {
            element.innerHTML +=
                "<p>No scores yet. Be the first!</p>";
            return;
        }

        const list = document.createElement("ol");

        scores.slice(0, 10).forEach(entry => {
            const item = document.createElement("li");
            item.textContent = `${entry.name}: ${entry.score}`;
            list.appendChild(item);
        });

        element.appendChild(list);
    });
}

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

// Finish game and submit score
async function endGame() {
    gameRunning = false;

    updateBestScore(score);
    showGameOver(score);

    const result = await submitScore(playerName, score);

    if (result === null) {
        console.log("Leaderboard temporarily unavailable");
    }

    await updateLeaderboardStatus();
    await displayLeaderboard();
}

// Load personal best
document.getElementById("bestScore").textContent =
    localStorage.getItem("bestScore") || "0";
