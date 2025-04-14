const {verifyToken} = require('../config/jwt');
// const {generateToken} = require('../config/jwt');
// const token = generateToken(123, "attendee");
// console.log(token);

const authnicateUser = (req, res, next) => {
    // Get token from authorization header in the req 
    const authHeader = req.header["authorization"];

    //check if it is formatted correctly and if the token exists
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "Authentication required. No token provided"
        });
    }

    //check if the token is valid and has not expired
    const token = authHeader.split(" ")[1];
    const {valid, expired, decoded} = verifyToken(token);
    if(!valid){
        return res.status(401).json({
            success: false,
            message: expired ? "Token expired! please log in again" : "Invalid Token."
        })
    }

    //if the token is valid and has not expired yet
    req.user = decoded;  //custom feild for user id and role
    next();
}

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access denied!. Insuffecient permissions"
            });
        }
        next();
    }
    
}

module.exports = {
    authnicateUser,
    authorizeRole
}