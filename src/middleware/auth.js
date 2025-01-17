const jwt = require("jsonwebtoken");

const createAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res
            .status(401)
            .json({ error: true, message: "Authentication invalid" });
    }
    const token = authHeader.split(" ")[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(403).json({ error: true, message: "Expired or Invalid token" });
            } else {
                req.user = decodedToken;

                next();
            }
        });
    } else {
        res.status(401).json({ error: true, message: "You are not authenticated" });
    }
};

module.exports = {
    verifyAccessToken,
    createAccessToken,
};
