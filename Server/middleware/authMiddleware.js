const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied" });
    }

    try {
        // Remove "Bearer " if present
        const tokenString = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

        const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
