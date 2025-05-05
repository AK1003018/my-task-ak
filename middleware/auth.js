const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

module.exports = (req, resp, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return resp.status(401).json({ error: 'No token provided' });

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        resp.status(401).json({ error: 'Invalid token' });
    }
};