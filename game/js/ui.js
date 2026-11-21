
import { getTopScores } from "./api.js";

export function showScreen(screenId) {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("gameOver").classList.add("hidden");

    document.getElementById(screenId).classList.remove("hidden");
}

export function updateHUD(score, lives, level) {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    document.getElementById("level").textContent = level;
}

export function showGameOver(score) {
    document.getElementById("finalScore").textContent = score;
    showScreen("gameOver");
}

export function updateBestScore(score) {
    const best = Number(localStorage.getItem("bestScore")) || 0;

    if (score > best) {
        localStorage.setItem("bestScore", score);
    }

    document.getElementById("bestScore").textContent =
        localStorage.getItem("bestScore") || 0;
}

export async function displayLeaderboard(elementId = "leaderboard") {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Leaderboard element #${elementId} not found`);
        return;
    }

    const scores = await getTopScores();

    element.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Top 10 Players";
    element.appendChild(heading);

    if (scores === null) {
        const message = document.createElement("p");
        message.textContent = "Leaderboard temporarily unavailable";
        element.appendChild(message);
        return;
    }

    if (scores.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No scores yet. Be the first!";
        element.appendChild(message);
        return;
    }

    const list = document.createElement("ol");

    scores.slice(0, 10).forEach(entry => {
        const item = document.createElement("li");
        item.textContent = `${entry.name}: ${entry.score}`;
        list.appendChild(item);
    });

    element.appendChild(list);
}
