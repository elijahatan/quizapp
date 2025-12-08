let questions = [];

async function loadQuiz() {
    const res = await fetch('/api/quiz/new?count=10');
    if (!res.ok) {
        alert('You must be logged in to play.');
        window.location.href = '/login.html';
        return;
    }
    questions = await res.json();
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

function submitQuiz() {
    let score = 0;
    const total = questions.length;

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const chosen = selected ? selected.value : null;  // "A", "B", "C", "D"

        if (chosen && q.correctOption && chosen === q.correctOption) {
            score++;
        }
    });

    localStorage.setItem('score', score);
    localStorage.setItem('total', total);

    window.location.href = '/results.html';
}

document.getElementById('submit-btn').addEventListener('click', submitQuiz);

loadQuiz();

