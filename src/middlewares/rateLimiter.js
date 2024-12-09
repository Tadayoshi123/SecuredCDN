const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 10, // Limite de 10 requêtes par IP
    message: 'Too many requests from this IP, please try again later', // Message d'erreur
    standardHeaders: true, // Utiliser les headers standard
    legacyHeaders: true,
    keyGenerator: (req) => { // Fonction pour générer la clé de l'IP
        return req.ip; // Utiliser l'IP de la requête
    },
    handler: (req, res, next, options) => { // Fonction appelée en cas de dépassement de la limite
        const ip = req.ip;
        console.log(`Rate limit exceeded for IP: ${ip}`);
        res.status(options.statusCode).send(options.message);
    },
});

module.exports = limiter;