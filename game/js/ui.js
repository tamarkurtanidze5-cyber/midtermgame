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