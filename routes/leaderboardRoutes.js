const express = require('express');
const GameResult = require('../models/GameResult');
const User = require('../models/User');

const router = express.Router();

router.get('/top10', async (req, res) => {
    const agg = await GameResult.aggregate([
        { $group: { _id: '$userId', bestScore: { $max: '$score' } } },
        { $sort: { bestScore: -1 } },
        { $limit: 10 }
    ]);

    const withNames = await Promise.all(
        agg.map(async entry => {
            const user = await User.findById(entry._id);
            return {
                username: user ? user.username : 'Unknown',
                bestScore: entry.bestScore
            };
        })
    );

    res.json(withNames);
});

module.exports = router;


