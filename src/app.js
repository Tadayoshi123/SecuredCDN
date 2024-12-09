const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const { logger, loggerMiddleware } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const cacheMiddleware = require('./middlewares/cache');
const metricsMiddleware = require('./middlewares/metrics');
const errorHandler = require('./middlewares/errorHandler');
const corsConfig = require('./config/corsConfig');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(corsConfig);
app.use(express.json());
app.use(loggerMiddleware);
app.use(limiter);
app.use(metricsMiddleware);
app.use(cacheMiddleware);

// Cache-Control headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=3600'); // Cache pendant 1 heure
    next();
});

// Routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});