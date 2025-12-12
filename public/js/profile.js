(async function loadProfile() {
    const usernameEl = document.getElementById("username");
    const historyEl = document.getElementById("history");

    try {
        const res = await fetch("/api/user/profile", {
            credentials: "include"
        });

        if (!res.ok) {
            usernameEl.textContent = "Username: --";
            historyEl.innerHTML = "<li>Please log in to view your profile.</li>";
            return;
        }

        const data = await res.json();

        usernameEl.textContent = `Username: ${data.username || "--"}`;

        const plays = data.history || [];
        historyEl.innerHTML = "";

        if (plays.length === 0) {
            historyEl.innerHTML = "<li>No games played yet.</li>";
            return;
        }

        plays.forEach((game) => {
            const li = document.createElement("li");
            const score = game.score ?? 0;
            const total = game.totalQuestions ?? 10;
            const date = game.datePlayed ? new Date(game.datePlayed).toLocaleString() : "";
            li.textContent = `${score}/${total}${date ? " — " + date : ""}`;
            historyEl.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        usernameEl.textContent = "Username: --";
        historyEl.innerHTML = "<li>Error loading profile.</li>";
    }
})();
