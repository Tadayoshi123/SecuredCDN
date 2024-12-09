const jwt = require('jsonwebtoken');

// Middleware de vérification de token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({
            auth: false,
            message: "Missing token"
        });
    }

    const token = authHeader.split(' ')[1]; // Extraire le token de l'en-tête
    if (!token) {
        return res.status(403).json({
            auth: false,
            message: "Missing token"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                auth: false,
                message: "Unauthorized"
            });
        }
        req.user = decoded; // Ajouter les informations décodées à la requête
        next();
    });
};

// Fonction de génération de token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { verifyToken, generateToken };