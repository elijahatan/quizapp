const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    playedAt: { type: Date, default: Date.now },
    questionIds: [String]
});

module.exports = mongoose.model('GameResult', gameResultSchema);
