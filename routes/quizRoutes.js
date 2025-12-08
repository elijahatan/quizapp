const express = require('express');
const fs = require('fs');
const path = require('path');
const GameResult = require('../models/GameResult');
const { authMiddleware } = require('./authRoutes');

const router = express.Router();

const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');
const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

function prepareQuestions(questions) {
    return questions.map(q => ({
        id: q.id || q.question,
        question: q.question,
        A: q.A,
        B: q.B,
        C: q.C,
        D: q.D
    }));
}

router.get('/new', authMiddleware, (req, res) => {
    const count = parseInt(req.query.count || '10', 10);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    res.json(prepareQuestions(selected));
});

router.post('/submit', authMiddleware, async (req, res) => {
    const { answers } = req.body;
    let score = 0;
    const questionIds = [];

    for (const ans of answers) {
        const q = allQuestions.find(x => (x.id || x.question) === ans.id);
        if (!q) continue;
        questionIds.push(ans.id);
        if (ans.selectedOption === q.answer) score++;
    }

    const result = await GameResult.create({
        userId: req.user.id,
        score,
        totalQuestions: answers.length,
        questionIds
    });

    res.json({ score, total: answers.length, resultId: result._id });
});

module.exports = router;


