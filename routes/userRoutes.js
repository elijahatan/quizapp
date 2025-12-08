const express = require('express');
const GameResult = require('../models/GameResult');
const { authMiddleware } = require('./authRoutes');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    const history = await GameResult.find({ userId: req.user.id })
        .sort({ playedAt: -1 });
    res.json({ username: req.user.username, history });
});

module.exports = router;

