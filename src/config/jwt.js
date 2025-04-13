const { sign, verify } = require("jsonwebtoken");
const { config } = require("dotenv");

config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId, role) => {
    return sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: "24h" });
};

const verifyToken = (token) => {
    try {
        const decoded = verify(token, JWT_SECRET);
        return { valid: true, expired: false, decoded };
    } catch (error) {
        return { valid: false, expired: error.name === "TokenExpiredError", decoded: null };
    }
};

// // test
// const userId = 123;
// const role = "attendee";
// const token = generateToken(userId, role);
// console.log(token);
// console.log(verifyToken(token));

module.exports = {
    generateToken,
    verifyToken
};