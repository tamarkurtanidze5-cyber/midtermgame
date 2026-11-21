
const API_URL = "/api";

export async function checkLeaderboardStatus() {
    try {
        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
            throw new Error("Leaderboard unavailable");
        }

        const data = await response.json();
        return data.status === "ok";
    } catch (error) {
        console.error("Leaderboard status check failed:", error);
        return false;
    }
}

export async function getTopScores() {
    try {
        const response = await fetch(`${API_URL}/scores`);

        if (!response.ok) {
            throw new Error("Could not load scores");
        }

        return await response.json();
    } catch (error) {
        console.error("Could not load leaderboard:", error);
        return null;
    }
}

export async function submitScore(name, score) {
    try {
        const response = await fetch(`${API_URL}/scores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, score })
        });

        if (!response.ok) {
            throw new Error("Could not save score");
        }

        return await response.json();
    } catch (error) {
        console.error("Could not submit score:", error);
        return null;
    }
}
