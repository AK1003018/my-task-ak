const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, saveUsers } = require('../utils/storage');
const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

router.post('/register', async (req, resp) => {
    const { username, password } = req.body;
    if (!username || !password) return resp.status(400).json({ error: 'Username and password required' });

    if (users.find(u => u.username === username)) return resp.status(409).json({ error: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    users.push({ id: users.length + 1, username, password: hashed });
    saveUsers();
    resp.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, resp) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return resp.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    resp.json({ token });
});

module.exports = router;