const pino = require('pino');
const pinoHttp = require('pino-http');

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    base: null, // Exclure les champs par défaut comme pid et hostname
    timestamp: pino.stdTimeFunctions.isoTime, // Utiliser le format ISO pour les timestamps
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie'], // Exclure les informations sensibles
        remove: true,
    },
});

const loggerMiddleware = pinoHttp({
    logger,
    customLogLevel: (res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
        if (res.statusCode >= 500 || err) return 'error';
        return 'info';
    },
    serializers: {
        req(req) {
            return {
                method: req.method,
                url: req.url,
                headers: {
                    'user-agent': req.headers['user-agent'],
                },
                remoteAddress: req.remoteAddress,
                remotePort: req.remotePort,
            };
        },
        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    },
});

module.exports = { logger, loggerMiddleware };