const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing.' });
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_SECRET_KEY');
        const userId = decodedValue.userId; // corrected typo

        req.auth = { userId };
        next();
    } catch (e) {
        console.error('Auth middleware error:', e.message || e);
        res.status(401).json({ error: 'Non autorisé.' });
    }
}
