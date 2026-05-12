const jwt = require('jsonwebtoken');

/**
 * Middleware: verifyToken
 * Verifies the JWT from cookies and attaches decoded user info to req.user.
 */
function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
}

/**
 * Middleware: isArtist
 * Ensures the authenticated user has the 'artist' role.
 * Must be used AFTER verifyToken.
 */
function isArtist(req, res, next) {
    if (!req.user || req.user.role !== 'artist') {
        return res.status(403).json({ message: "Forbidden: Artist access only" });
    }
    next();
}

module.exports = { verifyToken, isArtist };
