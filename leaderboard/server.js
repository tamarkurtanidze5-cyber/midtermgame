const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const DATA_DIR = "/data";
const DATA_FILE = path.join(DATA_DIR, "scores.json");

app.use(express.json());

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
}

function getScores() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveScores(scores) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2));
}

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.get("/api/scores", (req, res) => {
    const scores = getScores();

    scores.sort((a, b) => b.score - a.score);

    res.json(scores.slice(0, 10));
});

app.post("/api/scores", (req, res) => {
    const { name, score } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof score !== "number" ||
        !Number.isFinite(score)
    ) {
        return res.status(400).json({
            error: "Invalid name or score"
        });
    }

    const scores = getScores();

    scores.push({
        name: name.trim(),
        score
    });

    saveScores(scores);

    res.status(201).json({
        message: "Score saved successfully"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Leaderboard running on port ${PORT}`);
});