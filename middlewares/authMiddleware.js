const jwt = require('jsonwebtoken');
const{stringToSlug} = require('../helpers/index');
const config = require('../config/config');
let User = require('../models/User');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided.",
        });
    }

    try {
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, config.jwt.secretKey);
        req.token = token;
        req.user = decoded;

        const { role } = decoded;

        // Find the user with the given role and token in the database
        const user = await User.findOne({ role, token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token or user not found." });
        }
        if(user?.block){
            return res.status(403).json({  message: 'User blocked' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({
                message: "Access denied. Token has expired.",
            });
        }
        return res.status(403).json({
            message: "Access denied. Invalid token.",
        });
    }
}

const authoriseRole = (req, res, next) => {
    let urlRole = req.originalUrl.split("/")[2];
    const role = req.user?.role;
    const token = req.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    if (urlRole===stringToSlug(role)) {
        next();
    } else {
        return res.status(403).json({
            message: "Insufficient permissions. Your role does not have access to this API.",
        });
    }
};

module.exports = { authenticateToken, authoriseRole };