const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

const isProd = process.env.NODE_ENV === 'production';

function createToken(user) {
    return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
        expiresIn: '2h',
    });
}

function authMiddleware(req, res, next) {
    const token = req.cookies?.token; // requires cookie-parser middleware in server.js
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: 'Username taken' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, passwordHash: hash });

        const token = createToken(user);

        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: isProd,
            })
            .json({ message: 'Signup ok' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Signup error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = createToken(user);

        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: isProd,
            })
            .json({ message: 'Login ok' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Login error' });
    }
});

router.post('/logout', (req, res) => {
    return res.clearCookie('token').json({ message: 'Logged out' });
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
