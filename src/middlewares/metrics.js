const promBundle = require('express-prom-bundle');

const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeUp: true,
    promClient: {
        collectDefaultMetrics: {
            timeout: 1000
        }
    },
});

module.exports = metricsMiddleware;