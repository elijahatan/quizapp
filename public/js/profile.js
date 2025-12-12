// public/js/profile.js
(async function loadProfile() {
    const usernameEl = document.getElementById("username");
    const historyEl = document.getElementById("history");

    const token = localStorage.getItem("token");

    if (!token) {
        usernameEl.textContent = "Username: --";
        historyEl.innerHTML = "<li>Please log in to view your profile.</li>";
        return;
    }

    try {
        const res = await fetch("/api/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            usernameEl.textContent = "Username: --";
            historyEl.innerHTML = `<li>Failed to load profile (${res.status})</li>`;
            return;
        }

        const data = await res.json();

        usernameEl.textContent = `Username: ${data.username}`;

        historyEl.innerHTML = "";

        if (!data.history || data.history.length === 0) {
            historyEl.innerHTML = "<li>No games played yet.</li>";
            return;
        }

        data.history.forEach(game => {
            const li = document.createElement("li");
            li.textContent = `${game.score}/${game.totalQuestions} — ${new Date(game.datePlayed).toLocaleString()}`;
            historyEl.appendChild(li);
        });

    } catch (err) {
        usernameEl.textContent = "Username: --";
        historyEl.innerHTML = "<li>Error loading profile.</li>";
        console.error(err);
    }
})();
