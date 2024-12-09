const cors = require('cors');

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Autoriser toutes les origines par défaut
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
    optionsSuccessStatus: 200, // Réponse pour les requêtes OPTIONS
};

const corsConfig = cors(corsOptions);

module.exports = corsConfig;