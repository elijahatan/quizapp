let questions = [];

async function loadQuiz() {
    const res = await fetch('/api/quiz/new?count=10', {
        credentials: 'include' // ✅ cookie auth
    });

    if (!res.ok) {
        alert('You must be logged in to play.');
        window.location.href = '/login.html';
        return;
    }

    questions = await res.json();
    console.log("SAMPLE QUESTION:", questions[0]);
    renderQuiz();
}

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question-card';
        div.innerHTML = `
      <div class="question-header">
        ${index + 1}. ${q.question}
      </div>
      <div class="answers">
        <label class="answer-option">
          <input type="radio" name="q${index}" value="A"> ${q.A}
        </label>
        <label class="answer-option">
          <input type="radio" name="q${index}" value="B"> ${q.B}
        </label>
        <label class="answer-option">
          <input type="radio" name="q${index}" value="C"> ${q.C}
        </label>
        <label class="answer-option">
          <input type="radio" name="q${index}" value="D"> ${q.D}
        </label>
      </div>
    `;
        container.appendChild(div);
    });
}

async function submitQuiz() {
    // Build payload expected by your backend: { answers: [{id, selectedOption}] }
    const answers = questions.map((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        return {
            id: q.id,
            selectedOption: selected ? selected.value : null
        };
    });

    try {
        const res = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // ✅ cookie auth
            body: JSON.stringify({ answers })
        });

        if (!res.ok) {
            alert('Failed to submit quiz. Please log in again.');
            window.location.href = '/login.html';
            return;
        }

        const data = await res.json(); // { score, total, resultId }

        localStorage.setItem('score', data.score);
        localStorage.setItem('total', data.total);

        window.location.href = '/results.html';
    } catch (err) {
        console.error(err);
        alert('Error submitting quiz.');
    }
}

document.getElementById('submit-btn').addEventListener('click', submitQuiz);

loadQuiz();

